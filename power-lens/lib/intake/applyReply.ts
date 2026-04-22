import { situationIsThin } from "./missingFields";
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

  /**
   * Situation has a minimum length threshold. If the user sends several short
   * replies in a row, **merge** them instead of replacing—otherwise the total
   * never grows and the engine looks like it’s “failing” the same question.
   */
  if (pendingFieldTarget === "situation") {
    const prev = state.situation.trim();
    if (prev && situationIsThin(prev)) {
      next.situation = `${prev}\n\n${text}`;
    } else {
      next.situation = text;
    }
    return next;
  }

  next[pendingFieldTarget] = text;
  return next;
}
