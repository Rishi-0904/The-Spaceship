"""RAG Embedder — Google Gemini text-embedding-004."""

import os
import logging
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from backend/.env
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
EMBEDDING_MODEL = "models/gemini-embedding-001"
EMBEDDING_DIMENSION = 768

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY not set — embeddings will fail.")


async def embed_text(text: str) -> list[float]:
    """
    Generate an embedding for a single text using Gemini gemini-embedding-001.
    Returns a list of 768 floats.
    """
    try:
        result = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_query",
            output_dimensionality=EMBEDDING_DIMENSION,
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
            output_dimensionality=EMBEDDING_DIMENSION,
        )
        return result["embedding"]
    except Exception as e:
        logger.error(f"Document embedding error: {e}")
        raise
