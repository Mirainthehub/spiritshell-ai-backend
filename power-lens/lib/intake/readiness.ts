import { MIN_SITUATION_CHARS } from "./constants";
import type { IntakeState, ReadinessScore } from "./types";

const WEIGHTS: Record<keyof IntakeState, number> = {
  situation: 22,
  userGoal: 14,
  powerHolder: 14,
  userRole: 9,
  keyActors: 9,
  constraints: 9,
  risks: 6,
  priorActions: 5,
  relationshipHorizon: 5,
  tonePreference: 4,
  lensMode: 3,
};

function situationPartialCredit(s: string): number {
  const t = s.trim();
  if (t.length === 0) return 0;
  if (t.length >= MIN_SITUATION_CHARS) return 1;
  return 0.45;
}

function fieldCredit(key: keyof IntakeState, state: IntakeState): number {
  const v = state[key].trim();
  if (v.length === 0) return 0;
  if (key === "situation") return situationPartialCredit(state.situation);
  return 1;
}

/**
 * 0–100 coverage score + coarse stage for UX pacing.
 */
export function getReadinessScore(state: IntakeState): ReadinessScore {
  let score = 0;
  (Object.keys(WEIGHTS) as (keyof IntakeState)[]).forEach((k) => {
    score += WEIGHTS[k] * fieldCredit(k, state);
  });
  score = Math.round(Math.min(100, Math.max(0, score)));

  let stage: ReadinessScore["stage"];
  if (score <= 25) stage = "early";
  else if (score <= 55) stage = "partial";
  else if (score <= 80) stage = "usable";
  else stage = "strong";

  return { score, stage };
}
