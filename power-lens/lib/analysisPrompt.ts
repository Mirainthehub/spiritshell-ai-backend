import type { ChatTurn, IntakeState } from "@/lib/intake/types";
import { parseLensMode, parseTonePreference } from "@/lib/intake/parsePreferences";

/**
 * System prompt: power-dynamics framework (not a 48-law recitation).
 * Emphasizes perception, dependency, threat, narrative, leverage.
 */
export function buildAnalysisSystemPrompt(): string {
  return `You are Power Lens — a senior strategic analyst.

You analyze interpersonal and organizational situations using a **power dynamics framework** informed by themes from *The 48 Laws of Power*. You must NOT mechanically list or quote all 48 laws. Select only the few laws that truly illuminate this case.

## Analytical axes (weave these through the analysis)
1. **Perception** — What story are people believing? What is visible vs invisible? Who interprets events for whom?
2. **Dependency** — Who needs whom, for what, on what timeline? What creates lock-in or replaceability?
3. **Threat** — What feels existentially at risk (ego, status, safety, belonging)? What triggers defensiveness or escalation?
4. **Narrative** — Who controls framing, timing, and channels of communication? What counter-narratives are available?
5. **Leverage** — Where is the smallest move that changes incentives, visibility, or options? Distinguish short-term leverage from long-term reputation.

## Output discipline
- Return **only** valid JSON matching the schema the user provides. No markdown fences, no preamble.
- Be calm, precise, unsentimental. No pep talk. No empty moralizing.
- Prefer **socially intelligent, ethically bounded** recommendations: clarity, boundaries, documentation, coalition-building — not deception or coercion.
- Flag where manipulation tactics would backfire.
- uncertaintyNote: state what is uncertain if intake or dialogue is thin.
- missingInformation: 3–6 concrete questions that would sharpen the map.

## JSON keys (exact names)
situationSummary, powerMap (actors, alliances, threats), hiddenDynamics, relevantLaws, strategicDiagnosis, recommendedMoves, responseStyles (exactly three: Soft, Balanced, Hard in that order), redFlags, finalRecommendation, uncertaintyNote, missingInformation, ethicalGuardrailNote

Enums for actors: formalPower, informalInfluence: "Low"|"Medium"|"High"; stanceTowardUser: "Supportive"|"Neutral"|"Competitive"|"Threatening"; responseStyles[].style: "Soft"|"Balanced"|"Hard".

relevantLaws: 3–6 items with lawNumber, title, whyRelevant, misuseRisk.`;
}

function formatIntakeBlock(state: IntakeState): string {
  const tone = state.tonePreference.trim()
    ? parseTonePreference(state.tonePreference)
    : "(not specified)";
  const lens = state.lensMode.trim()
    ? parseLensMode(state.lensMode)
    : "(not specified)";
  return [
    `situation: ${state.situation.trim() || "(empty)"}`,
    `userGoal: ${state.userGoal.trim() || "(empty)"}`,
    `userRole: ${state.userRole.trim() || "(empty)"}`,
    `keyActors: ${state.keyActors.trim() || "(empty)"}`,
    `powerHolder: ${state.powerHolder.trim() || "(empty)"}`,
    `constraints: ${state.constraints.trim() || "(empty)"}`,
    `risks: ${state.risks.trim() || "(empty)"}`,
    `priorActions: ${state.priorActions.trim() || "(empty)"}`,
    `relationshipHorizon: ${state.relationshipHorizon.trim() || "(empty)"}`,
    `tonePreference (parsed default if needed): ${tone}`,
    `lensMode (parsed default if needed): ${lens}`,
    `tonePreference_raw: ${state.tonePreference || "(empty)"}`,
    `lensMode_raw: ${state.lensMode || "(empty)"}`,
  ].join("\n");
}

function formatConversationTranscript(turns: ChatTurn[]): string {
  if (!turns.length) return "(no conversation transcript)";
  return turns
    .map((t) => {
      const label = t.role === "user" ? "User" : "Intake (question)";
      return `${label}: ${t.content}`;
    })
    .join("\n\n");
}

/**
 * User message for the analysis call: structured intake + dialogue context.
 */
export function buildAnalysisPrompt(
  intakeState: IntakeState,
  conversation: ChatTurn[],
): string {
  return `## Structured intake (authoritative fields)
${formatIntakeBlock(intakeState)}

## Intake dialogue (sequence and emphasis)
The user answered a guided intake. Use this to catch nuance, hesitation, and what they repeated or avoided.

${formatConversationTranscript(conversation)}

---

Produce the analysis JSON. Ground hiddenDynamics and powerMap in the five axes (perception, dependency, threat, narrative, leverage). Laws: few, sharp, case-specific.`;
}
