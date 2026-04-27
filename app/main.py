import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated, Any

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from app.config import Settings, get_settings
from app.llm import LLMError, chat_completions
from app.memory import format_memory_for_prompt, search_memory
from app.safety import SafetyResult, check_user_text, last_user_message

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

DEFAULT_SYSTEM = (
    "你是灵壳 SpiritShell 的 AI 陪伴助手。语气温暖、简洁；"
    "你是辅助与接力角色，不宣称自己是真人；"
    "涉及医疗诊断、法律意见或紧急情况时，请引导用户联系专业人士或真人。"
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(..., min_length=1)
    """OpenAI-style messages; typically system + user + assistant turns."""

    wing: str | None = Field(
        default=None,
        description="Optional MemPalace wing filter (overrides MEMPALACE_DEFAULT_WING).",
    )
    room: str | None = Field(default=None, description="Optional MemPalace room filter.")
    use_memory: bool = Field(default=True, description="If false, skip MemPalace RAG.")


class ChatResponse(BaseModel):
    reply: str
    memory_status: str
    memory_injected: bool


class MemorySearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    wing: str | None = None
    room: str | None = None


def _apply_settings_env(settings: Settings) -> None:
    if settings.mempalace_palace_path.strip():
        os.environ["MEMPALACE_PALACE_PATH"] = settings.mempalace_palace_path.strip()


@asynccontextmanager
async def lifespan(app: FastAPI):
    _apply_settings_env(get_settings())
    yield


app = FastAPI(title="SpiritShell AI Backend", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static assets (relationship UI, skill markdown, etc.)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


def settings_dep() -> Settings:
    s = get_settings()
    _apply_settings_env(s)
    return s


@app.get("/")
async def chat_ui_root() -> FileResponse:
    """浏览器入口页（与 API 同源，避免 file:// 跨域）。"""
    index = STATIC_DIR / "relationship.html"
    if not index.is_file():
        raise HTTPException(status_code=404, detail="static/relationship.html missing")
    return FileResponse(index)


@app.get("/chat")
async def chat_ui_alias() -> FileResponse:
    return await chat_ui_root()


@app.get("/chat-legacy")
async def chat_ui_legacy() -> FileResponse:
    """旧版单框对话页（保留用于对照/回归）。"""
    index = STATIC_DIR / "index.html"
    if not index.is_file():
        raise HTTPException(status_code=404, detail="static/index.html missing")
    return FileResponse(index)


@app.get("/health")
async def health(settings: Annotated[Settings, Depends(settings_dep)]) -> dict[str, Any]:
    return {
        "ok": True,
        "model": settings.openai_model,
        "palace_configured": bool(settings.mempalace_palace_path.strip()),
    }


@app.get("/v1/memory/status")
async def memory_status(settings: Annotated[Settings, Depends(settings_dep)]) -> dict[str, Any]:
    palace = settings.mempalace_palace_path.strip()
    if not palace:
        return {"ready": False, "reason": "MEMPALACE_PALACE_PATH not set"}
    exists = os.path.isdir(palace)
    return {
        "ready": exists,
        "palace_path": palace,
        "reason": None if exists else "palace directory missing — run scripts/bootstrap_memory.sh",
    }


@app.post("/v1/memory/search")
async def memory_search(
    body: MemorySearchRequest,
    settings: Annotated[Settings, Depends(settings_dep)],
) -> dict[str, Any]:
    return search_memory(body.query, settings, wing=body.wing, room=body.room)


@app.post("/v1/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    settings: Annotated[Settings, Depends(settings_dep)],
) -> ChatResponse:
    raw_messages = [m.model_dump() for m in body.messages]
    text_for_safety = last_user_message(raw_messages)
    safety: SafetyResult = check_user_text(text_for_safety, settings)
    if not safety.ok:
        raise HTTPException(status_code=400, detail={"error": safety.reason})

    system_content = DEFAULT_SYSTEM
    if settings.spiritshell_identity.strip():
        system_content = settings.spiritshell_identity.strip() + "\n\n" + DEFAULT_SYSTEM

    memory_status = "skipped"
    memory_block = ""
    memory_injected = False

    if body.use_memory and text_for_safety:
        mem = search_memory(text_for_safety, settings, wing=body.wing, room=body.room)
        if mem.get("error"):
            memory_status = f"error:{mem.get('error')}"
            if not settings.memory_optional:
                raise HTTPException(
                    status_code=503,
                    detail={"error": "memory_unavailable", "mem": mem},
                )
        else:
            memory_status = "ok"
            memory_block = format_memory_for_prompt(mem)
            memory_injected = bool(memory_block)

    if memory_block:
        system_content = system_content + "\n\n" + memory_block

    out_messages: list[dict[str, str]] = [{"role": "system", "content": system_content}]
    for m in raw_messages:
        if m.get("role") != "system":
            out_messages.append({"role": m["role"], "content": m["content"]})

    try:
        reply, _ = await chat_completions(settings, out_messages)
    except LLMError as e:
        raise HTTPException(
            status_code=e.status_code or 502,
            detail={"error": str(e)},
        ) from e

    return ChatResponse(
        reply=reply,
        memory_status=memory_status,
        memory_injected=memory_injected,
    )
