import type { IntakeFieldKey } from "./types";

/**
 * Curated, short, strategist-style prompts. One question per turn.
 * Multiple variants reduce repetition across sessions.
 */
export const QUESTION_TEMPLATES: Record<
  IntakeFieldKey | "general",
  readonly string[]
> = {
  situation: [
    "In two or three sentences: what happened, in what order, and what’s at stake right now?",
    "Give me the concrete facts—who did what, and what changed last?",
    "What’s the situation in plain terms, without the moral verdict yet?",
  ],
  userGoal: [
    "What outcome do you want most here?",
    "If this goes well in 30 days, what specifically looks different?",
    "What are you optimizing for—speed, safety, status, or repair?",
  ],
  powerHolder: [
    "Who actually has the power to decide what happens next?",
    "Whose yes/no matters most for the outcome you care about?",
    "If one person could unblock you today, who is it?",
  ],
  userRole: [
    "What’s your role in this system—title matters less than who you report to and what you control.",
    "In one line: who are you in this story (IC, lead, peer, partner, founder)?",
    "What authority do you actually have here—budget, headcount, narrative, or none?",
  ],
  keyActors: [
    "Who else matters that you haven’t mentioned yet?",
    "Name the other players who can help, hurt, or witness this.",
    "Who is competing for the same scarce resource (attention, budget, legitimacy)?",
  ],
  constraints: [
    "What can’t you afford to do in this situation?",
    "What lines won’t you cross—relationship, legal, reputational?",
    "What would count as ‘winning’ but still unacceptable to you?",
  ],
  risks: [
    "What’s the worst realistic downside if you misread this?",
    "What would blow up your credibility or safety fastest?",
    "What are you afraid might already be true?",
  ],
  priorActions: [
    "What have you already tried—what landed, what backfired?",
    "What move did you make that changed how others see you here?",
    "Any message sent or meeting held that now constrains you?",
  ],
  relationshipHorizon: [
    "Is this a one-off transaction or a relationship you’ll live inside for months?",
    "How long will you have to coexist with these people after this?",
    "Are you optimizing for the next week—or the next year?",
  ],
  tonePreference: [
    "How blunt should I be—cautious, balanced, or assertive in the advice?",
    "Do you want the soft framing, the direct framing, or the diplomatic middle?",
    "Should I prioritize protecting face, or maximizing clarity?",
  ],
  lensMode: [
    "Which lens should dominate: survival, influence, diplomacy, or long-term trust?",
    "Are you in damage control mode, or building leverage for later?",
    "What’s the primary constraint: fear, face, power, or time?",
  ],
  general: [
    "Anything else material I should factor in before we analyze?",
    "One last detail: what would make this analysis wrong if I assumed it?",
  ],
};
