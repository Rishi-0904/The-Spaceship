"""Output Guardrails — V2 groundedness and hallucination detection."""

import re
import logging

logger = logging.getLogger(__name__)

# Known facts that must NEVER be claimed unless in context
KNOWN_FALSE_CLAIMS = [
    # Add specific facts here that should never be hallucinated
    # e.g., "kubernetes" if Rishi hasn't used it
]

# Projects Rishi has NOT worked on — if LLM mentions them, flag it
INVALID_PROJECTS = [
    "gpt-4", "chatgpt", "claude", "midjourney", "stable diffusion",
    # Add more as needed
]


class OutputGuardrailResult:
    def __init__(self, passed: bool, reason: str = "", cleaned_answer: str = ""):
        self.passed = passed
        self.reason = reason
        self.cleaned_answer = cleaned_answer


def _check_groundedness(answer: str, chunks: list[dict]) -> bool:
    """
    Simple groundedness check: verify key named entities in the answer
    appear in the retrieved context.

    For V2 this is a lightweight heuristic. V3 would use an LLM-as-judge.
    """
    if not chunks:
        # No context retrieved — be conservative, allow short factual answers
        return len(answer.split()) < 50

    # Combine all chunk texts
    context_text = " ".join(c["chunk_text"] for c in chunks).lower()
    answer_lower = answer.lower()

    # Extract capitalized phrases (likely proper nouns / project names) from answer
    # that are longer than 4 chars
    proper_nouns = re.findall(r'\b[A-Z][a-zA-Z]{3,}\b', answer)

    ungrounded = []
    for noun in proper_nouns:
        # Skip common words
        if noun.lower() in {
            "rishi", "this", "that", "with", "from", "have", "been",
            "using", "also", "more", "some", "such", "well", "most",
            "here", "there", "they", "their", "will", "would", "could",
            "these", "those", "about", "which", "where", "when",
            "langchain", "langgraph", "rabbitmq", "fastapi", "postgresql",
            "python", "javascript", "typescript", "react", "nextjs",
            "docker", "redis", "gemini", "google", "github", "leetcode",
        }:
            continue
        if noun.lower() not in context_text:
            ungrounded.append(noun)

    # If more than 3 ungrounded proper nouns, flag it
    if len(ungrounded) > 3:
        logger.warning(f"Output groundedness check: {len(ungrounded)} ungrounded nouns: {ungrounded}")
        return False

    return True


def _check_no_invalid_projects(answer: str) -> bool:
    """Check if answer mentions projects/tools Rishi never worked on."""
    answer_lower = answer.lower()
    for invalid in INVALID_PROJECTS:
        if invalid in answer_lower:
            logger.warning(f"Output rejected: mentions invalid project '{invalid}'")
            return False
    return True


def _check_no_system_prompt_leak(answer: str) -> bool:
    """Verify the LLM didn't accidentally reveal system prompt content."""
    leak_indicators = [
        "system prompt", "system instruction", "you are an AI", "as an AI",
        "i was instructed", "my instructions say", "ONLY answer based on",
        "strict rules:", "context from rishi",
    ]
    answer_lower = answer.lower()
    for indicator in leak_indicators:
        if indicator.lower() in answer_lower:
            logger.warning(f"Output rejected: system prompt leak detected")
            return False
    return True


def check_output(answer: str, chunks: list[dict]) -> OutputGuardrailResult:
    """
    Run all output guardrail checks.
    Returns OutputGuardrailResult indicating if the answer is safe to send.
    """
    # 1. System prompt leak check
    if not _check_no_system_prompt_leak(answer):
        return OutputGuardrailResult(
            False,
            "system_prompt_leak",
            "I can't share that information. Is there something specific about Rishi's portfolio I can help you with?",
        )

    # 2. Invalid projects check
    if not _check_no_invalid_projects(answer):
        return OutputGuardrailResult(
            False,
            "invalid_project_mention",
            "I'm not confident about that information. Please check Rishi's GitHub directly for the most accurate details.",
        )

    # 3. Groundedness check
    if not _check_groundedness(answer, chunks):
        logger.warning("Output failed groundedness check — returning fallback")
        return OutputGuardrailResult(
            False,
            "ungrounded_answer",
            "I want to make sure I give you accurate information. Based on what I have in my knowledge base, I'd recommend checking Rishi's GitHub or LinkedIn for the most up-to-date details.",
        )

    return OutputGuardrailResult(True, cleaned_answer=answer)
