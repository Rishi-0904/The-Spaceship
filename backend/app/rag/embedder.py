"""RAG Embedder — Google Gemini text-embedding-004."""

import os
import logging
import google.generativeai as genai

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
EMBEDDING_MODEL = "models/text-embedding-004"
EMBEDDING_DIMENSION = 768

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY not set — embeddings will fail.")


async def embed_text(text: str) -> list[float]:
    """
    Generate an embedding for a single text using Gemini text-embedding-004.
    Returns a list of 768 floats.
    """
    try:
        result = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_query",
        )
        return result["embedding"]
    except Exception as e:
        logger.error(f"Embedding error: {e}")
        raise


async def embed_document(text: str) -> list[float]:
    """
    Embed a document chunk (uses retrieval_document task type for better recall).
    """
    try:
        result = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_document",
        )
        return result["embedding"]
    except Exception as e:
        logger.error(f"Document embedding error: {e}")
        raise
