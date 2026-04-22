import type { ChatTurn, IntakeState } from "@/lib/intake/types";

export type ResponseLocale = "zh" | "en";

/**
 * Mirror user language: compare CJK vs Latin letters in intake + conversation.
 */
export function detectResponseLocale(
  intake: IntakeState,
  conversation: ChatTurn[],
): ResponseLocale {
  const parts = [
    intake.situation,
    intake.userGoal,
    intake.userRole,
    intake.keyActors,
    intake.powerHolder,
    intake.constraints,
    intake.risks,
    intake.priorActions,
    intake.relationshipHorizon,
    intake.tonePreference,
    intake.lensMode,
    ...conversation.map((c) => c.content),
  ].join("\n");

  const cjk = (parts.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const latin = (parts.match(/[a-zA-Z]/g) ?? []).length;

  if (cjk === 0 && latin === 0) return "en";
  if (latin === 0) return "zh";
  if (cjk === 0) return "en";
  return cjk >= latin ? "zh" : "en";
}
