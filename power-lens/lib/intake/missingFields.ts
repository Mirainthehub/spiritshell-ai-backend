import { FIELD_PRIORITY, MIN_SITUATION_CHARS } from "./constants";
import type { IntakeFieldKey, IntakeState } from "./types";

function isBlank(v: string): boolean {
  return v.trim().length === 0;
}

function situationIsThin(s: string): boolean {
  return isBlank(s) || s.trim().length < MIN_SITUATION_CHARS;
}

/**
 * Missing fields sorted by strategic importance (most critical first).
 */
export function getMissingFields(state: IntakeState): IntakeFieldKey[] {
  const missing: IntakeFieldKey[] = [];

  for (const key of FIELD_PRIORITY) {
    if (key === "situation") {
      if (situationIsThin(state.situation)) missing.push("situation");
      continue;
    }
    if (isBlank(state[key])) missing.push(key);
  }

  return missing;
}
