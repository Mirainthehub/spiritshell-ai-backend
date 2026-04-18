import { createInterface } from "node:readline";
import {
  applyUserReply,
  emptyIntakeState,
  getMissingFields,
  getNextQuestion,
  getReadinessScore,
  type ChatTurn,
  type IntakeFieldKey,
} from "../lib/intake";

async function main() {
  let intake = emptyIntakeState();
  const messages: ChatTurn[] = [];
  let pending: IntakeFieldKey | "general" | null = null;

  const first = getNextQuestion(intake, []);
  if (!first) {
    console.error("Engine failed to open.");
    process.exit(1);
  }
  console.log(`\nAssistant:\n${first.question}\n`);
  pending = first.fieldTarget;
  messages.push({ role: "assistant", content: first.question });

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  const prompt = (p: string) =>
    new Promise<string>((resolve) => rl.question(p, resolve));

  for (let turn = 0; turn < 24; turn++) {
    const line = await prompt("You: ");
    if (line.trim() === "/quit") break;

    const missingBefore = getMissingFields(intake);
    intake = applyUserReply(intake, line, pending);
    messages.push({ role: "user", content: line });

    const sweepDone = missingBefore.length === 0 && pending === "general";
    const next = getNextQuestion(intake, messages, {
      optionalSweepCompleted: sweepDone,
    });

    const r = getReadinessScore(intake);
    console.log(`\n[readiness ${r.score} · ${r.stage}]\n`);

    if (!next) {
      console.log(
        "Intake complete. In the web app, click “Run analysis”, or type /quit.\n",
      );
      break;
    }

    console.log(`Assistant:\n${next.question}\n`);
    messages.push({ role: "assistant", content: next.question });
    pending = next.fieldTarget;
  }

  rl.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
