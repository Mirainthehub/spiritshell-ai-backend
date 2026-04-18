import type { IntakeFieldKey } from "./types";

/**
 * Short reply suggestions for the active intake target — console-style, not chatbot filler.
 */
export function getQuickChips(
  pending: IntakeFieldKey | "general" | null,
): string[] {
  const g = [
    "Summarize in one line",
    "I need a moment",
    "The constraint is time",
  ];
  const byField: Record<IntakeFieldKey | "general", string[]> = {
    situation: [
      "Sequence: A, then B, then C",
      "Stakes: reputation + scope",
      "Still developing",
    ],
    userGoal: [
      "Visibility without conflict",
      "Protect relationship",
      "Fair credit",
      "Buy time",
    ],
    powerHolder: [
      "My manager decides",
      "Finance / legal sign-off",
      "Informal gatekeeper",
    ],
    userRole: [
      "IC, no reports",
      "Lead, matrixed",
      "Peer competitor",
    ],
    keyActors: [
      "Skip-level + peer",
      "HR / partner involved",
      "Only my boss so far",
    ],
    constraints: [
      "Can't burn bridges",
      "Can't escalate publicly",
      "Legal / policy bound",
    ],
    risks: [
      "Labeled political",
      "Credit keeps drifting",
      "Relationship snaps",
    ],
    priorActions: [
      "Asked in writing",
      "Stayed quiet",
      "Aligned 1:1",
    ],
    relationshipHorizon: [
      "Months, same team",
      "Years if I stay",
      "One-off transaction",
    ],
    tonePreference: [
      "Cautious",
      "Balanced",
      "Assertive",
    ],
    lensMode: [
      "Survival first",
      "Influence",
      "Diplomacy",
      "Long-term trust",
    ],
    general: [
      "Nothing else critical",
      "One more stakeholder",
      "Risk is asymmetric info",
    ],
  };
  return byField[pending ?? "general"] ?? g;
}
