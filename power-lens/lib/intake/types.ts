import type { LensMode, TonePreference } from "@/lib/types";

/**
 * Structured intake — filled incrementally via conversation (not a form).
 */
export interface IntakeState {
  situation: string;
  userGoal: string;
  userRole: string;
  keyActors: string;
  powerHolder: string;
  constraints: string;
  risks: string;
  priorActions: string;
  relationshipHorizon: string;
  /** Free-text until parsed; may hold "Balanced" etc. */
  tonePreference: string;
  /** Free-text until parsed; may hold "Influence" etc. */
  lensMode: string;
}

export type IntakeFieldKey = keyof IntakeState;

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type NextQuestion = {
  question: string;
  fieldTarget: IntakeFieldKey | "general";
  reason: string;
};

export type ReadinessScore = {
  score: number;
  stage: "early" | "partial" | "usable" | "strong";
};
