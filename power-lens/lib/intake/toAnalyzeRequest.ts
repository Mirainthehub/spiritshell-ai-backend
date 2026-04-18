import type { AnalyzeRequestBody } from "@/lib/types";
import { parseLensMode, parseTonePreference } from "./parsePreferences";
import type { IntakeState } from "./types";

/**
 * Collapse intake fields into the existing /api/analyze contract + extended context.
 */
export function intakeStateToAnalyzeRequest(
  state: IntakeState,
  opts?: { useMock?: boolean },
): AnalyzeRequestBody {
  const tone = state.tonePreference.trim()
    ? parseTonePreference(state.tonePreference)
    : "Balanced";
  const lens = state.lensMode.trim()
    ? parseLensMode(state.lensMode)
    : "Influence";

  const otherActors = [
    state.keyActors.trim() && `Key actors: ${state.keyActors.trim()}`,
    state.powerHolder.trim() && `Power holder: ${state.powerHolder.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const constraints = [
    state.constraints.trim(),
    state.risks.trim() && `Risks: ${state.risks.trim()}`,
    state.priorActions.trim() && `Prior actions: ${state.priorActions.trim()}`,
    state.relationshipHorizon.trim() &&
      `Relationship horizon: ${state.relationshipHorizon.trim()}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    situation: state.situation.trim(),
    goal: state.userGoal.trim(),
    userRole: state.userRole.trim(),
    otherActors,
    constraints,
    tonePreference: tone,
    lensMode: lens,
    powerHolder: state.powerHolder.trim(),
    risks: state.risks.trim(),
    priorActions: state.priorActions.trim(),
    relationshipHorizon: state.relationshipHorizon.trim(),
    useMock: opts?.useMock,
  };
}
