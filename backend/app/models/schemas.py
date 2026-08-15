"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class MessageRole(str, Enum):
    user = "user"
    assistant = "assistant"


class ChatMessage(BaseModel):
    role: MessageRole
    content: str


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="User message to the AI assistant",
    )
    history: list[ChatMessage] = Field(
        default_factory=list,
        max_length=10,
        description="Conversation history (last N turns)",
    )


class Source(BaseModel):
    title: str
    chunk_preview: str


class GuardrailStatus(str, Enum):
    pass_ = "PASS"
    rejected_input = "REJECTED_INPUT"
    rejected_output = "REJECTED_OUTPUT"
    error = "ERROR"


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source] = []
    guardrail_status: GuardrailStatus
    rejection_reason: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
