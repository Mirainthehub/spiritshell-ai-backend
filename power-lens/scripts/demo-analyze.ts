/**
 * Demo: POST /api/analyze with fixed intakeState + conversation, print JSON.
 *
 * Usage (with dev server running):
 *   npm run dev
 *   # other terminal:
 *   npm run demo-analyze
 *
 * Optional:
 *   POWER_LENS_URL=http://127.0.0.1:3000 npm run demo-analyze
 *   POWER_LENS_USE_MOCK=1 npm run demo-analyze   # force useMock: true
 */

import {
  DEMO_CONVERSATION,
  DEMO_INTAKE_STATE,
} from "../lib/demo-analyze-fixtures";

async function main() {
  const base = (process.env.POWER_LENS_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
  const useMock = process.env.POWER_LENS_USE_MOCK === "1";

  const res = await fetch(`${base}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      intakeState: DEMO_INTAKE_STATE,
      conversation: DEMO_CONVERSATION,
      useMock,
    }),
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    console.error("Non-JSON response:", text.slice(0, 500));
    process.exit(1);
  }

  console.log(JSON.stringify(json, null, 2));
  if (!res.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
