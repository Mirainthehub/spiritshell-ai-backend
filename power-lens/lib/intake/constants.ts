/** Minimum length before we stop treating `situation` as critically thin. */
export const MIN_SITUATION_CHARS = 30;

import type { IntakeFieldKey } from "./types";

/** Importance order for missing-field resolution (first = ask next). */
export const FIELD_PRIORITY: IntakeFieldKey[] = [
  "situation",
  "userGoal",
  "powerHolder",
  "userRole",
  "keyActors",
  "constraints",
  "risks",
  "priorActions",
  "relationshipHorizon",
  "tonePreference",
  "lensMode",
];
