"""
Ingestion script — chunks, embeds, and stores portfolio docs in pgvector.
Run once to populate the vector database.

Usage:
    python -m scripts.ingest
    # or
    python scripts/ingest.py
"""

import asyncio
import os
import re
import logging
from pathlib import Path
import asyncpg
import google.generativeai as genai

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

# ─── Config ─────────────────────────────────────────────────────────────────

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/portfolio")
DOCS_DIR = Path(__file__).parent.parent / "app" / "data" / "portfolio_docs"

CHUNK_SIZE = 400       # words per chunk
CHUNK_OVERLAP = 50     # words overlap between chunks
EMBEDDING_MODEL = "models/text-embedding-004"

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.error("GEMINI_API_KEY not set! Set it in your .env file.")
    exit(1)

# ─── Chunking ────────────────────────────────────────────────────────────────

def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into overlapping word-based chunks."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        if end == len(words):
            break
        start += chunk_size - overlap
    return chunks


def extract_doc_title(file_path: Path, content: str) -> str:
    """Extract title from markdown H1 or use filename."""
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return file_path.stem.replace("_", " ").title()


def load_all_docs() -> list[dict]:
    """Walk DOCS_DIR and load all .md files."""
    docs = []
    for path in DOCS_DIR.rglob("*.md"):
        content = path.read_text(encoding="utf-8")
        title = extract_doc_title(path, content)
        relative = path.relative_to(DOCS_DIR)
        docs.append({
            "path": str(path),
            "relative_path": str(relative),
            "title": title,
            "content": content,
        })
        logger.info(f"  Loaded: {relative} → '{title}'")
    return docs


# ─── Embedding ───────────────────────────────────────────────────────────────

async def embed_chunk(text: str) -> list[float]:
    """Embed a single chunk using Gemini text-embedding-004."""
    try:
        result = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_document",
        )
        return result["embedding"]
    except Exception as e:
        logger.error(f"Embedding failed: {e}")
        raise


# ─── Database ─────────────────────────────────────────────────────────────────

async def setup_db(conn: asyncpg.Connection):
    """Ensure pgvector extension and table exist."""
    await conn.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS document_chunks (
            id SERIAL PRIMARY KEY,
            doc_title TEXT NOT NULL,
            chunk_text TEXT NOT NULL,
            embedding vector(768),
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    """)
    await conn.execute("""
        CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
        ON document_chunks
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
    """)
    logger.info("Database tables ready.")


async def clear_existing(conn: asyncpg.Connection):
    """Clear all existing chunks (for re-ingestion)."""
    count = await conn.fetchval("SELECT COUNT(*) FROM document_chunks")
    if count > 0:
        logger.info(f"Clearing {count} existing chunks...")
        await conn.execute("DELETE FROM document_chunks")


async def insert_chunk(conn: asyncpg.Connection, title: str, chunk: str, embedding: list[float], metadata: dict):
    """Insert a single chunk with its embedding."""
    embedding_str = f"[{','.join(str(x) for x in embedding)}]"
    await conn.execute(
        """
        INSERT INTO document_chunks (doc_title, chunk_text, embedding, metadata)
        VALUES ($1, $2, $3::vector, $4::jsonb)
        """,
        title,
        chunk,
        embedding_str,
        str(metadata).replace("'", '"'),
    )


# ─── Main ────────────────────────────────────────────────────────────────────

async def main():
    logger.info("=== Portfolio RAG Ingestion Script ===")
    logger.info(f"Docs directory: {DOCS_DIR}")

    # Load documents
    logger.info("\n📂 Loading portfolio documents...")
    docs = load_all_docs()
    logger.info(f"Loaded {len(docs)} documents.")

    # Connect to DB
    logger.info("\n🔗 Connecting to PostgreSQL...")
    conn = await asyncpg.connect(DATABASE_URL)

    try:
        await setup_db(conn)
        await clear_existing(conn)

        total_chunks = 0
        for doc in docs:
            logger.info(f"\n📄 Processing: {doc['title']}")
            chunks = chunk_text(doc["content"])
            logger.info(f"   → {len(chunks)} chunks")

            for i, chunk in enumerate(chunks):
                embedding = await embed_chunk(chunk)
                metadata = {
                    "source_file": doc["relative_path"],
                    "chunk_index": i,
                    "total_chunks": len(chunks),
                }
                await insert_chunk(conn, doc["title"], chunk, embedding, metadata)
                total_chunks += 1
                print(f"   [{i+1}/{len(chunks)}] ✓ Embedded chunk", end="\r")

            print(f"   ✅ Done: {len(chunks)} chunks stored")

        logger.info(f"\n🎉 Ingestion complete! {total_chunks} total chunks stored in pgvector.")

    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
