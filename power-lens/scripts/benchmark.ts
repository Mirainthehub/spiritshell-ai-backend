/**
 * Rule-based regression benchmark: POST /api/analyze for fixed cases, coarse scores.
 *
 *   npm run benchmark
 *   POWER_LENS_URL=http://127.0.0.1:3000 npm run benchmark
 *   POWER_LENS_USE_MOCK=1 npm run benchmark
 *
 * High scores while every row shows [mock] only prove routing + demo JSON + rules.
 * For LLM quality + field sensitivity, configure OPENAI_API_KEY on the server and run
 * `npm run benchmark:sensitivity` (useMock: false).
 */

import type { AnalysisResult } from "../lib/types";
import { benchmarkCases } from "./benchmark-cases";

type ApiPayload = {
  result?: AnalysisResult;
  mock?: boolean;
  message?: string;
  error?: string;
};

const BASE_URL = (
  process.env.POWER_LENS_URL ?? "https://power-lens-vercel.vercel.app"
).replace(/\/$/, "");
const USE_MOCK = process.env.POWER_LENS_USE_MOCK === "1";

function stringifyResponse(data: AnalysisResult): string {
  return JSON.stringify(data, null, 2).toLowerCase();
}

function getField(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>(
    (acc, key) =>
      acc !== null && typeof acc === "object" && key in acc
        ? (acc as Record<string, unknown>)[key]
        : undefined,
    obj,
  );
}

function isNonEmpty(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  if (value !== null && typeof value === "object")
    return Object.keys(value as object).length > 0;
  return Boolean(value);
}

function scoreCase(
  data: AnalysisResult,
  testCase: (typeof benchmarkCases)[number],
) {
  let score = 0;
  const notes: string[] = [];
  const blob = stringifyResponse(data);

  for (const field of testCase.expectations.shouldHaveNonEmptyFields ?? []) {
    const value = getField(data, field);
    if (isNonEmpty(value)) {
      score += 2;
    } else {
      notes.push(`Missing or empty field: ${field}`);
    }
  }

  const mentionHits = (
    testCase.expectations.shouldMentionAny ?? []
  ).filter((kw) => blob.includes(kw.toLowerCase())).length;

  if (mentionHits > 0) {
    score += Math.min(mentionHits, 4);
  } else {
    notes.push("Did not mention expected concepts");
  }

  const badHits = (testCase.expectations.shouldAvoidAny ?? []).filter((kw) =>
    blob.includes(kw.toLowerCase()),
  );

  if (badHits.length > 0) {
    score -= badHits.length * 2;
    notes.push(`Contained discouraged phrases: ${badHits.join(", ")}`);
  }

  if ((data.hiddenDynamics?.length ?? 0) >= 2) score += 2;
  else notes.push("Too few hidden dynamics");

  if ((data.relevantLaws?.length ?? 0) >= 2) score += 2;
  else notes.push("Too few relevant laws");

  if ((data.responseStyles?.length ?? 0) >= 2) score += 2;
  else notes.push("Too few response styles");

  if ((data.redFlags?.length ?? 0) >= 2) score += 2;
  else notes.push("Too few red flags");

  return {
    score: Math.max(score, 0),
    notes,
  };
}

async function run() {
  const results: Array<{
    id: string;
    label: string;
    score: number;
    notes: string[];
    mock?: boolean;
  }> = [];

  for (const testCase of benchmarkCases) {
    const res = await fetch(`${BASE_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intakeState: testCase.intakeState,
        conversation: testCase.conversation,
        useMock: USE_MOCK,
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      results.push({
        id: testCase.id,
        label: testCase.label,
        score: 0,
        notes: [`HTTP ${res.status}: ${t.slice(0, 200)}`],
      });
      continue;
    }

    const payload = (await res.json()) as ApiPayload;
    const data = payload.result;

    if (!data) {
      results.push({
        id: testCase.id,
        label: testCase.label,
        score: 0,
        notes: ["Missing `result` in JSON body"],
      });
      continue;
    }

    const scored = scoreCase(data, testCase);

    results.push({
      id: testCase.id,
      label: testCase.label,
      score: scored.score,
      notes: scored.notes,
      mock: payload.mock,
    });
  }

  const total = results.reduce((sum, r) => sum + r.score, 0);
  const avg = total / Math.max(results.length, 1);

  console.log(`\nBenchmark target: ${BASE_URL}`);
  console.log(`Mode: ${USE_MOCK ? "mock" : "live / server fallback"}\n`);

  for (const r of results) {
    const status = r.score >= 12 ? "PASS" : r.score >= 8 ? "WARN" : "FAIL";
    console.log(
      `[${status}] ${r.id} (${r.label}) -> score=${r.score}${r.mock ? " [mock]" : ""}`,
    );
    if (r.notes.length) {
      for (const n of r.notes) {
        console.log(`  - ${n}`);
      }
    }
  }

  console.log(`\nAverage score: ${avg.toFixed(2)}`);

  if (avg >= 12) {
    console.log("Overall: strong (rule score)");
  } else if (avg >= 9) {
    console.log("Overall: usable but uneven");
  } else {
    console.log("Overall: weak / likely regressed");
    process.exitCode = 1;
  }

  const successes = results.filter((r) => r.mock !== undefined);
  const allMock =
    successes.length > 0 && successes.every((r) => r.mock === true);

  console.log("\n--- How to read this ---");
  console.log(
    "Engineering: URL reachable, JSON has expected blocks, benchmark rubric passes.",
  );
  if (allMock) {
    console.log(
      "Intelligence: NOT VERIFIED — every successful response used mock/fallback.",
    );
    console.log(
      "  Next: set OPENAI_API_KEY on the server (Vercel or local .env.local),",
    );
    console.log(
      "  run without POWER_LENS_USE_MOCK=1, confirm rows show no [mock], then:",
    );
    console.log("    npm run benchmark:sensitivity");
  } else {
    console.log(
      "Intelligence: partially in play — at least one response was not mock.",
    );
    console.log(
      "  Compare scores to mock baseline; run `npm run benchmark:sensitivity` for horizon A/B.",
    );
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
