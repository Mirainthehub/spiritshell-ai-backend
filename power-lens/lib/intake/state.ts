import type { IntakeState } from "./types";

export function emptyIntakeState(): IntakeState {
  return {
    situation: "",
    userGoal: "",
    userRole: "",
    keyActors: "",
    powerHolder: "",
    constraints: "",
    risks: "",
    priorActions: "",
    relationshipHorizon: "",
    tonePreference: "",
    lensMode: "",
  };
}
