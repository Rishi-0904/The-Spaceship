"""Chat router — POST /api/chat with full RAG + guardrail pipeline."""

import logging
from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.schemas import ChatRequest, ChatResponse, GuardrailStatus, Source
from app.guardrails.input_guard import check_input
from app.guardrails.output_guard import check_output
from app.rag.pipeline import run_rag_pipeline

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat(request: Request, body: ChatRequest) -> ChatResponse:
    """
    AI chat endpoint with full pipeline:
    Input → InputGuardrail → RAG (Embed → Retrieve → LLM) → OutputGuardrail → Response
    """
    user_message = body.message.strip()
    history = body.history

    logger.info(f"Chat request: '{user_message[:60]}...' | history_len={len(history)}")

    # ── Step 1: Input Guardrail ────────────────────────────────────────────
    input_result = check_input(user_message)
    if not input_result.passed:
        logger.info(f"Input guardrail rejected: {input_result.reason[:60]}")
        return ChatResponse(
            answer=input_result.reason,
            sources=[],
            guardrail_status=GuardrailStatus.rejected_input,
            rejection_reason="input_rejected",
        )

    # ── Step 2: RAG Pipeline ───────────────────────────────────────────────
    try:
        answer, chunks = await run_rag_pipeline(user_message, history)
    except Exception as e:
        logger.error(f"RAG pipeline error: {e}")
        return ChatResponse(
            answer="I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
            sources=[],
            guardrail_status=GuardrailStatus.error,
        )

    # ── Step 3: Output Guardrail ───────────────────────────────────────────
    output_result = check_output(answer, chunks)
    if not output_result.passed:
        logger.info(f"Output guardrail rejected: {output_result.reason}")
        return ChatResponse(
            answer=output_result.cleaned_answer,
            sources=[],
            guardrail_status=GuardrailStatus.rejected_output,
            rejection_reason=output_result.reason,
        )

    # ── Step 4: Format sources ─────────────────────────────────────────────
    sources = [
        Source(
            title=chunk["doc_title"],
            chunk_preview=chunk["chunk_text"][:120] + "...",
        )
        for chunk in chunks[:3]  # Return top 3 sources
    ]

    return ChatResponse(
        answer=output_result.cleaned_answer,
        sources=sources,
        guardrail_status=GuardrailStatus.pass_,
    )
