"""
Rishi Raj Jaiswal — Portfolio AI Backend
FastAPI application with RAG-powered AI assistant
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.routers import chat
from app.db.database import create_tables

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    logger.info("🚀 Portfolio AI Backend starting up...")
    try:
        await create_tables()
        logger.info("✅ Database tables ready")
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        logger.warning("⚠️ Running in database-offline mode. RAG search will not be available.")
    yield
    logger.info("🛑 Portfolio AI Backend shutting down...")


app = FastAPI(
    title="Rishi Portfolio AI API",
    description="RAG-powered AI assistant for Rishi Raj Jaiswal's portfolio",
    version="1.0.0",
    lifespan=lifespan,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — allow Vercel frontend + localhost dev
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    os.getenv("FRONTEND_URL", "https://your-portfolio.vercel.app"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])


@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint for Railway deployment."""
    return {
        "status": "healthy",
        "service": "portfolio-ai-backend",
        "version": "1.0.0",
    }


@app.get("/", tags=["root"])
async def root():
    return {
        "message": "Rishi Portfolio AI Backend",
        "docs": "/docs",
        "health": "/health",
    }
