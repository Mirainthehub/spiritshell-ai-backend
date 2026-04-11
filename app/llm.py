import httpx

from app.config import Settings


class LLMError(Exception):
    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.status_code = status_code


async def chat_completions(
    settings: Settings,
    messages: list[dict],
) -> tuple[str, str | None]:
    """Call OpenAI-compatible POST /chat/completions. Returns (assistant_text, finish_reason)."""
    key = settings.openai_api_key.strip()
    if not key:
        raise LLMError("OPENAI_API_KEY is not set")

    base = settings.openai_base_url.rstrip("/")
    url = f"{base}/chat/completions"
    payload = {
        "model": settings.openai_model,
        "messages": messages,
        "temperature": 0.7,
    }
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        r = await client.post(url, json=payload, headers=headers)

    if r.status_code >= 400:
        try:
            detail = r.json()
        except Exception:
            detail = r.text
        raise LLMError(f"LLM HTTP {r.status_code}: {detail}", status_code=r.status_code)

    data = r.json()
    choice = (data.get("choices") or [{}])[0]
    msg = choice.get("message") or {}
    content = msg.get("content") or ""
    finish = choice.get("finish_reason")
    return content, finish
