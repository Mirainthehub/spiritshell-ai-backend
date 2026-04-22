/**
 * Sensitivity: same scenario, change ONE structured field (e.g. relationshipHorizon),
 * compare whether `finalRecommendation` / summary actually move.
 *
 * Requires server-side OPENAI_API_KEY and useMock: false. If the server falls back
 * to mock, both runs return identical demo JSON → similarity ~1 (not a real test).
 *
 *   POWER_LENS_URL=http://127.0.0.1:3000 npm run benchmark:sensitivity
 */

import type { AnalysisResult } from "../lib/types";
import type { ChatTurn, IntakeState } from "../lib/intake/types";

const BASE_URL = (
  process.env.POWER_LENS_URL ?? "https://power-lens-vercel.vercel.app"
).replace(/\/$/, "");

type ApiPayload = { result?: AnalysisResult; mock?: boolean; message?: string };

/** Shared facts; only `relationshipHorizon` differs between A and B. */
const baseIntake = (): IntakeState => ({
  situation:
    "我在团队里承担了很多推进和执行的工作，但另一个更会表达的同事在会议中更容易被领导关注。我不想撕破脸，但也不想一直被忽视。",
  userGoal: "提升影响力并获得更公平的认可",
  powerHolder: "直属领导",
  userRole: "资深执行者",
  keyActors: "表达能力强的同事",
  constraints: "不能公开冲突，需要长期合作",
  risks: "被认为在争功或者难合作",
  priorActions: "偶尔在会议中补充，但没有主动展示",
  relationshipHorizon: "",
  tonePreference: "Balanced",
  lensMode: "Influence",
});

const conversation: ChatTurn[] = [
  {
    role: "user",
    content: "我在团队里做了很多实际推进，但另一个同事更会表现。",
  },
  { role: "assistant", content: "What outcome do you want most here?" },
  { role: "user", content: "我希望得到更公平的认可，也提升影响力。" },
];

function wordOverlapSimilarity(a: string, b: string): number {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter(Boolean);
  const wa = new Set(norm(a));
  const wb = new Set(norm(b));
  if (wa.size === 0 && wb.size === 0) return 1;
  let inter = 0;
  for (const w of wa) {
    if (wb.has(w)) inter++;
  }
  return inter / Math.max(wa.size, wb.size, 1);
}

/** For CJK-heavy text, also compare character bigram overlap. */
function roughTextSimilarity(a: string, b: string): number {
  const la = a.replace(/\s/g, "");
  const lb = b.replace(/\s/g, "");
  if (la.length < 8 || lb.length < 8) return wordOverlapSimilarity(a, b);
  const grams = (s: string) => {
    const g: string[] = [];
    for (let i = 0; i < s.length - 1; i++) g.push(s.slice(i, i + 2));
    return new Set(g);
  };
  const ga = grams(la);
  const gb = grams(lb);
  let inter = 0;
  for (const x of ga) if (gb.has(x)) inter++;
  const jacc = inter / (ga.size + gb.size - inter || 1);
  return (jacc + wordOverlapSimilarity(a, b)) / 2;
}

async function postAnalyze(intake: IntakeState): Promise<ApiPayload> {
  const res = await fetch(`${BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      intakeState: intake,
      conversation,
      useMock: false,
    }),
  });
  const text = await res.text();
  let json: ApiPayload;
  try {
    json = JSON.parse(text) as ApiPayload;
  } catch {
    throw new Error(`Non-JSON (${res.status}): ${text.slice(0, 300)}`);
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 400)}`);
  }
  return json;
}

async function main() {
  console.log(`\nSensitivity benchmark → ${BASE_URL}`);
  console.log("Field under test: relationshipHorizon (short vs long)\n");

  const a: IntakeState = {
    ...baseIntake(),
    relationshipHorizon: "一次性合作，项目结束就可能不再共事",
  };
  const b: IntakeState = {
    ...baseIntake(),
    relationshipHorizon: "至少还要共事五年，关系会长期绑定，必须保全互信",
  };

  console.log("Request A (short horizon)…");
  const pa = await postAnalyze(a);
  console.log("Request B (long horizon)…");
  const pb = await postAnalyze(b);

  if (pa.mock && pb.mock) {
    console.log("\n[SKIP] Both responses are mock/fallback.");
    console.log(
      "  Intelligence layer not testable. Configure OPENAI_API_KEY on the server and retry.",
    );
    process.exitCode = 0;
    return;
  }

  if (pa.mock !== pb.mock) {
    console.warn("\n[WARN] One response mock, one live — compare unfair.");
  }

  const ra = pa.result;
  const rb = pb.result;
  if (!ra || !rb) {
    console.error("Missing result in response");
    process.exitCode = 1;
    return;
  }

  const f1 = ra.finalRecommendation ?? "";
  const f2 = rb.finalRecommendation ?? "";
  const s1 = ra.situationSummary ?? "";
  const s2 = rb.situationSummary ?? "";

  const simF = roughTextSimilarity(f1, f2);
  const simS = roughTextSimilarity(s1, s2);

  console.log("\n--- Similarity (0 = completely different, 1 = identical) ---");
  console.log(`  finalRecommendation: ${simF.toFixed(3)}`);
  console.log(`  situationSummary:    ${simS.toFixed(3)}`);

  if (simF > 0.92) {
    console.log(
      "\n[WARN] Recommendations are almost the same despite different horizons.",
    );
    console.log(
      "  If live LLM: model may not be using relationshipHorizon structurally.",
    );
  } else if (simF < 0.75) {
    console.log("\n[OK] Final recommendations diverge — field may be in play.");
  } else {
    console.log("\n[?] Moderate divergence — review excerpts manually.");
  }

  console.log("\n--- Excerpt A (finalRecommendation) ---\n");
  console.log(f1.slice(0, 500) + (f1.length > 500 ? "…" : ""));
  console.log("\n--- Excerpt B (finalRecommendation) ---\n");
  console.log(f2.slice(0, 500) + (f2.length > 500 ? "…" : ""));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
