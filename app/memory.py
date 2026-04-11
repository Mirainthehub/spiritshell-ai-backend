"""MemPalace integration — semantic retrieval via packaged `search_memories`."""

import os
from typing import Any

from app.config import Settings


def search_memory(
    query: str,
    settings: Settings,
    wing: str | None = None,
    room: str | None = None,
) -> dict[str, Any]:
    """Return MemPalace `search_memories` result dict (includes `error` when unavailable)."""
    palace = settings.mempalace_palace_path.strip()
    if palace:
        os.environ["MEMPALACE_PALACE_PATH"] = palace

    from mempalace.searcher import search_memories

    effective_wing = wing if wing is not None else settings.mempalace_default_wing
    return search_memories(
        query=query,
        palace_path=palace or os.environ.get("MEMPALACE_PALACE_PATH", ""),
        wing=effective_wing,
        room=room,
        n_results=settings.memory_top_k,
    )


def format_memory_for_prompt(mem_result: dict[str, Any]) -> str:
    if mem_result.get("error"):
        return ""
    hits = mem_result.get("results") or []
    if not hits:
        return ""
    lines: list[str] = ["【与当前问题相关的已索引记忆（MemPalace 检索）】"]
    for i, h in enumerate(hits, 1):
        text = (h.get("text") or "").strip()
        if not text:
            continue
        w = h.get("wing", "?")
        r = h.get("room", "?")
        sim = h.get("similarity", "")
        lines.append(f"{i}. [wing={w} room={r} sim≈{sim}]\n{text}")
    return "\n\n".join(lines) if len(lines) > 1 else ""
