from dataclasses import dataclass

from app.config import Settings


@dataclass
class SafetyResult:
    ok: bool
    reason: str | None = None


def check_user_text(text: str, settings: Settings) -> SafetyResult:
    if not text or not text.strip():
        return SafetyResult(False, "empty_message")

    if len(text) > settings.max_user_message_chars:
        return SafetyResult(False, "message_too_long")

    raw = settings.safety_blocklist.strip()
    if not raw:
        return SafetyResult(True)

    blocked = [w.strip().lower() for w in raw.split(",") if w.strip()]
    lower = text.lower()
    for word in blocked:
        if word in lower:
            return SafetyResult(False, f"blocked_term:{word}")

    return SafetyResult(True)


def last_user_message(messages: list[dict]) -> str:
    for m in reversed(messages):
        if m.get("role") == "user":
            c = m.get("content")
            if isinstance(c, str):
                return c
    return ""
