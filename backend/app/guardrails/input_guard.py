"""Input Guardrails — V2 safety layer for incoming user messages."""

import re
import logging

logger = logging.getLogger(__name__)

# ─── Config ─────────────────────────────────────────────────────────────────

MAX_INPUT_LENGTH = 500

# Prompt injection patterns
INJECTION_PATTERNS = [
    r"ignore\s+(your\s+)?(previous\s+|all\s+)?(instructions|prompt|rules)",
    r"forget\s+(everything|all|your|the)",
    r"you\s+are\s+now\s+(a\s+)?(?!rishi)",  # "you are now a [not rishi]"
    r"pretend\s+(you|to\s+be)",
    r"act\s+as\s+(if\s+you\s+are|a\s+different)",
    r"reveal\s+(your\s+)?(system\s+prompt|instructions|prompt)",
    r"what\s+(are|is)\s+your\s+(system\s+prompt|instructions|prompt)",
    r"show\s+me\s+(your\s+)?(system\s+prompt|prompt|instructions)",
    r"jailbreak",
    r"DAN\s+mode",
    r"override\s+(your\s+)?(safety|instructions|rules)",
    r"</?(system|instruction|prompt)>",
    r"\[INST\]",
    r"###\s*System",
]

# Off-topic patterns (questions clearly not about Rishi)
OFFTOPIC_PATTERNS = [
    r"\b(recipe|cook|food|restaurant)\b",
    r"\b(weather|forecast|temperature)\b",
    r"\b(news|politics|election|government)\b",
    r"\b(stock|crypto|bitcoin|invest)\b",
    r"\b(movie|film|song|music|celebrity)\b",
    r"\b(write\s+me\s+an?\s+(essay|story|poem|code\s+for|program\s+for))\b",
    r"\b(translate\s+this)\b",
    r"\b(what\s+is\s+[0-9]+\s*[\+\-\*/]\s*[0-9]+)\b",  # math questions
]

# Portfolio-relevant keywords — if these appear, definitely allow
PORTFOLIO_KEYWORDS = [
    "rishi", "project", "tutorai", "ringmaster", "autodriv", "skill",
    "experience", "achieve", "github", "leetcode", "education", "college",
    "backend", "frontend", "ai", "ml", "python", "fastapi", "langchain",
    "langraph", "rabbitmq", "postgres", "docker", "kubernetes", "contact",
    "hire", "resume", "work", "intern", "job", "tech", "stack", "build",
    "engineer", "developer", "portfolio", "certificate", "hackathon",
]


class GuardrailResult:
    def __init__(self, passed: bool, reason: str = ""):
        self.passed = passed
        self.reason = reason


def check_input(message: str) -> GuardrailResult:
    """
    Run all input guardrail checks on the user message.
    Returns GuardrailResult(passed=True) if safe to proceed.
    """
    msg_lower = message.lower().strip()

    # 1. Length check
    if len(message) > MAX_INPUT_LENGTH:
        logger.warning(f"Input rejected: too long ({len(message)} chars)")
        return GuardrailResult(
            False,
            f"Your message is too long. Please keep it under {MAX_INPUT_LENGTH} characters.",
        )

    # 2. Empty check
    if not msg_lower:
        return GuardrailResult(False, "Please enter a message.")

    # 3. Prompt injection check
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, msg_lower, re.IGNORECASE):
            logger.warning(f"Input rejected: prompt injection detected (pattern: {pattern})")
            return GuardrailResult(
                False,
                "I'm here to answer questions about Rishi's portfolio. I can't help with that request.",
            )

    # 4. Portfolio relevance check — if contains portfolio keywords, allow immediately
    for keyword in PORTFOLIO_KEYWORDS:
        if keyword in msg_lower:
            return GuardrailResult(True)

    # 5. Off-topic check — only after confirming no portfolio keywords found
    for pattern in OFFTOPIC_PATTERNS:
        if re.search(pattern, msg_lower, re.IGNORECASE):
            logger.info(f"Input rejected: off-topic detected")
            return GuardrailResult(
                False,
                "I'm specialized in answering questions about Rishi Raj Jaiswal's portfolio, projects, and skills. Try asking something like: 'What is TutorAI?' or 'What tech stack does Rishi use?'",
            )

    # Default: allow (generic questions like "hello", "who are you?" are fine)
    return GuardrailResult(True)
