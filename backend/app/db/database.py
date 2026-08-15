"""Database connection and table creation using asyncpg + pgvector."""

import os
import logging
from pathlib import Path
import asyncpg
from dotenv import load_dotenv

# Load environment variables from backend/.env
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/portfolio")

_pool: asyncpg.Pool | None = None


async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    return _pool


async def create_tables():
    """Initialize pgvector extension and document chunks table."""
    pool = await get_pool()
    async with pool.acquire() as conn:
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
            USING hnsw (embedding vector_cosine_ops);
        """)
    logger.info("Database tables created/verified.")


async def close_pool():
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
