import { QUESTION_TEMPLATES } from "./templates";
import { getMissingFields } from "./missingFields";
import type { ChatTurn, IntakeFieldKey, IntakeState, NextQuestion } from "./types";

function variantIndex(conversationLength: number, field: string): number {
  let h = conversationLength * 31 + 17;
  for (let i = 0; i < field.length; i++) h = (h + field.charCodeAt(i) * (i + 3)) | 0;
  return Math.abs(h);
}

export type NextQuestionOptions = {
  /**
   * When all structured fields are satisfied, we ask one optional "general" sweep.
   * Set this to true after the user has answered that sweep so the engine can stop.
   */
  optionalSweepCompleted?: boolean;
};

/**
 * Single next question: highest-priority missing field, one short strategist prompt.
 * Returns null when intake is complete and the optional sweep has already been answered.
 */
export function getNextQuestion(
  intakeState: IntakeState,
  conversation: ChatTurn[],
  opts?: NextQuestionOptions,
): NextQuestion | null {
  const missing = getMissingFields(intakeState);

  if (missing.length === 0) {
    if (opts?.optionalSweepCompleted) return null;
    const variants = QUESTION_TEMPLATES.general;
    const idx = variantIndex(conversation.length, "general") % variants.length;
    return {
      question: variants[idx],
      fieldTarget: "general",
      reason:
        "Core fields are present; optional sweep for material facts before analysis.",
    };
  }

  const fieldTarget = missing[0] as IntakeFieldKey;
  const variants = QUESTION_TEMPLATES[fieldTarget];
  const idx = variantIndex(conversation.length, fieldTarget) % variants.length;

  const reasons: Record<IntakeFieldKey, string> = {
    situation: "Need a concrete fact base before mapping power.",
    userGoal: "Outcomes define what ‘good’ means and what to optimize.",
    powerHolder: "Decisions flow from whoever holds real veto/approval power.",
    userRole: "Leverage depends on role, scope, and formal authority.",
    keyActors: "Third parties change alliances, witnesses, and constraints.",
    constraints: "Non-negotiables bound the strategy space.",
    risks: "Downside scenarios calibrate aggression and exposure.",
    priorActions: "History constrains credibility and available narratives.",
    relationshipHorizon: "Horizon changes discounting of relationship capital.",
    tonePreference: "Advice calibration must match your risk appetite.",
    lensMode: "Dominant lens shifts emphasis (survival vs trust-building).",
  };

  return {
    question: variants[idx],
    fieldTarget,
    reason: reasons[fieldTarget],
  };
}
