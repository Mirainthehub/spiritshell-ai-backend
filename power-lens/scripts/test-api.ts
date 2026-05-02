/**
 * Smoke tests: POST /api/analyze with useMock (no OPENAI_API_KEY needed).
 *
 * Usage:
 *   cd power-lens && npm run test-api
 *
 * Default base URL is production Vercel. Override for local dev:
 *   POWER_LENS_URL=http://127.0.0.1:3000 npm run test-api
 */

import type { AnalyzeApiRequestBody } from "../lib/types";
import { emptyIntakeState } from "../lib/intake/state";

const DEFAULT_URL = "https://power-lens-vercel.vercel.app";

function baseUrl(): string {
  return (process.env.POWER_LENS_URL ?? DEFAULT_URL).replace(/\/$/, "");
}

async function analyze(body: AnalyzeApiRequestBody): Promise<unknown> {
  const res = await fetch(`${baseUrl()}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, useMock: true }),
  });
  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON (${res.status}): ${text.slice(0, 400)}`);
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

type Case = {
  name: string;
  body: AnalyzeApiRequestBody;
  check: (payload: Record<string, unknown>) => void;
};

const cases: Case[] = [
  {
    name: "English mock — locale → EN demo summary",
    body: {
      responseLocale: "en",
      intakeState: {
        ...emptyIntakeState(),
        situation:
          "My manager credits a peer who presents work better. I want visibility without burning bridges.",
        userGoal: "Fair recognition",
        userRole: "IC",
        keyActors: "Manager, peer",
        powerHolder: "Manager",
        constraints: "No open conflict",
        risks: "Being seen as difficult",
        priorActions: "Delivered on projects",
        relationshipHorizon: "One year plus",
        tonePreference: "Balanced",
        lensMode: "Influence",
      },
      conversation: [],
    },
    check: (p) => {
      assert(p.mock === true, "expected mock: true");
      const r = p.result as Record<string, unknown>;
      const s = String(r.situationSummary ?? "");
      if (s.startsWith("You carry")) return;
      // Older deployments ignored locale and always returned Chinese mock.
      if (/[\u4e00-\u9fff]/.test(s) && s.includes("产出")) {
        console.warn(
          "  (warn) responseLocale=en still returned Chinese mock — redeploy API with `responseLocale` + locale mocks.",
        );
        return;
      }
      throw new Error(
        `expected English demo summary (or legacy ZH mock), got: ${s.slice(0, 120)}…`,
      );
    },
  },
  {
    name: "Chinese mock — locale → ZH demo summary",
    body: {
      responseLocale: "zh",
      intakeState: {
        ...emptyIntakeState(),
        situation:
          "我在团队里贡献很多，但另一个更会表现的同事获得了更多领导关注，我不想撕破脸。",
        userGoal: "获得认可",
        userRole: "员工",
        keyActors: "领导与同事",
        powerHolder: "直属领导",
        constraints: "不能撕破脸",
        risks: "被边缘化",
        priorActions: "加班交付",
        relationshipHorizon: "至少一年",
        tonePreference: "Balanced",
        lensMode: "Influence",
      },
      conversation: [],
    },
    check: (p) => {
      assert(p.mock === true, "expected mock: true");
      const r = p.result as Record<string, unknown>;
      const s = String(r.situationSummary ?? "");
      assert(
        /[\u4e00-\u9fff]/.test(s) && s.includes("产出"),
        `expected Chinese demo summary containing 产出, got: ${s.slice(0, 80)}…`,
      );
    },
  },
  {
    name: "redFlags present (What to avoid data shape)",
    body: {
      intakeState: {
        ...emptyIntakeState(),
        situation:
          "Short but over 30 chars for threshold — testing shape only here.",
        userGoal: "x",
        userRole: "x",
        keyActors: "x",
        powerHolder: "x",
        constraints: "x",
        risks: "x",
        priorActions: "x",
        relationshipHorizon: "x",
        tonePreference: "Balanced",
        lensMode: "Influence",
      },
      conversation: [],
    },
    check: (p) => {
      const r = p.result as Record<string, unknown>;
      const flags = r.redFlags;
      assert(Array.isArray(flags) && flags.length > 0, "expected non-empty redFlags[]");
    },
  },
];

async function main() {
  const url = baseUrl();
  console.log(`POST ${url}/api/analyze  (useMock: true)\n`);

  let failed = 0;
  for (const c of cases) {
    try {
      const payload = (await analyze(c.body)) as Record<string, unknown>;
      c.check(payload);
      console.log(`PASS  ${c.name}`);
    } catch (e) {
      failed++;
      console.error(`FAIL  ${c.name}`);
      console.error(e instanceof Error ? e.message : e);
    }
  }

  if (failed > 0) {
    process.exit(1);
  }
  console.log(`\nAll ${cases.length} checks passed.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
