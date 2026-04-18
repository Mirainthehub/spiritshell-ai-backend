import type { IntakeFieldKey, IntakeState } from "./types";

/**
 * Map the latest user reply onto structured state using the *previous* assistant
 * question’s `fieldTarget` (Conversation Intake Engine contract).
 */
export function applyUserReply(
  state: IntakeState,
  reply: string,
  pendingFieldTarget: IntakeFieldKey | "general" | null,
): IntakeState {
  const text = reply.trim();
  const next: IntakeState = { ...state };

  if (!pendingFieldTarget) {
    if (!next.situation.trim()) next.situation = text;
    else next.situation = `${next.situation.trim()}\n\n${text}`;
    return next;
  }

  if (pendingFieldTarget === "general") {
    next.situation = next.situation.trim()
      ? `${next.situation.trim()}\n\n${text}`
      : text;
    return next;
  }

  next[pendingFieldTarget] = text;
  return next;
}
