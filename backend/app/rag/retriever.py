"""RAG Retriever — pgvector cosine similarity search."""

import logging
from app.db.database import get_pool
from app.rag.embedder import embed_text

logger = logging.getLogger(__name__)

TOP_K = 5
SIMILARITY_THRESHOLD = 0.3


async def retrieve_relevant_chunks(query: str, top_k: int = TOP_K) -> list[dict]:
    """
    Given a user query:
    1. Embed the query using Gemini
    2. Find the most similar document chunks in pgvector
    3. Return top_k chunks with metadata

    Returns list of dicts: { doc_title, chunk_text, similarity }
    """
    query_embedding = await embed_text(query)
    embedding_str = f"[{','.join(str(x) for x in query_embedding)}]"

    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT
                doc_title,
                chunk_text,
                metadata,
                1 - (embedding <=> $1::vector) AS similarity
            FROM document_chunks
            ORDER BY embedding <=> $1::vector
            LIMIT $2
            """,
            embedding_str,
            top_k,
        )

    results = []
    for row in rows:
        similarity = row["similarity"]
        if similarity >= SIMILARITY_THRESHOLD:
            results.append(
                {
                    "doc_title": row["doc_title"],
                    "chunk_text": row["chunk_text"],
                    "metadata": dict(row["metadata"]) if row["metadata"] else {},
                    "similarity": round(float(similarity), 4),
                }
            )

    logger.info(
        f"Retrieved {len(results)} chunks for query (threshold={SIMILARITY_THRESHOLD})"
    )
    return results
