import { getNextQuestion } from "@/lib/intake/nextQuestion";
import type { ChatTurn, IntakeFieldKey, IntakeState } from "@/lib/intake/types";
import { DEMO_FORM } from "@/lib/mock-data";

/** Fixed intake for API demos and scripts. */
export const DEMO_INTAKE_STATE: IntakeState = {
  situation: DEMO_FORM.situation,
  userGoal: DEMO_FORM.goal,
  userRole: DEMO_FORM.userRole,
  keyActors: "更会表现的同事；直属领导",
  powerHolder: "直属领导分配注意力与评价；同事争夺可见度",
  constraints: DEMO_FORM.constraints,
  risks: "被贴上情绪化或难搞；功劳被继续稀释",
  priorActions: "加班交付；私下抱怨过但未当面澄清",
  relationshipHorizon: "至少一年内仍要共事",
  tonePreference: DEMO_FORM.tonePreference,
  lensMode: DEMO_FORM.lensMode,
};

/** Short scripted dialogue matching the same case. */
export const DEMO_CONVERSATION: ChatTurn[] = [
  {
    role: "assistant",
    content:
      "In two or three sentences: what happened, in what order, and what’s at stake right now?",
  },
  {
    role: "user",
    content: DEMO_FORM.situation,
  },
  {
    role: "assistant",
    content: "What outcome do you want most here?",
  },
  {
    role: "user",
    content: DEMO_FORM.goal,
  },
  {
    role: "assistant",
    content: "Who actually has the power to decide what happens?",
  },
  {
    role: "user",
    content: DEMO_INTAKE_STATE.powerHolder,
  },
  {
    role: "assistant",
    content: "What can’t you afford to do in this situation?",
  },
  {
    role: "user",
    content: DEMO_FORM.constraints,
  },
];

/** Hydrate a session for UI demo: full intake + transcript + next assistant line if any. */
export function getDemoChatBootstrap(): {
  intake: IntakeState;
  messages: ChatTurn[];
  pendingField: IntakeFieldKey | "general" | null;
  intakeClosed: boolean;
} {
  const intake = DEMO_INTAKE_STATE;
  const base = [...DEMO_CONVERSATION];
  const next = getNextQuestion(intake, base, { optionalSweepCompleted: false });
  if (!next) {
    return {
      intake,
      messages: base,
      pendingField: null,
      intakeClosed: true,
    };
  }
  return {
    intake,
    messages: [...base, { role: "assistant", content: next.question }],
    pendingField: next.fieldTarget,
    intakeClosed: false,
  };
}
