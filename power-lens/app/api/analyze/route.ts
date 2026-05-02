import { NextResponse } from "next/server";
import {
  buildAnalysisPrompt,
  buildAnalysisSystemPrompt,
} from "@/lib/analysisPrompt";
import { parseModelJson } from "@/lib/parseJson";
import {
  detectResponseLocale,
  type ResponseLocale,
} from "@/lib/detectResponseLocale";
import { MOCK_ANALYSIS } from "@/lib/mock-data";
import { MOCK_ANALYSIS_EN } from "@/lib/mock-data-en";
import { normalizeAnalysisResult } from "@/lib/normalize";
import type { AnalysisResult, AnalyzeApiRequestBody } from "@/lib/types";
function mockForLocale(locale: ResponseLocale): AnalysisResult {
  return locale === "zh" ? MOCK_ANALYSIS : MOCK_ANALYSIS_EN;
}

function resolveResponseLocale(body: AnalyzeApiRequestBody): ResponseLocale {
  const mode = body.responseLocale;
  if (mode === "zh" || mode === "en") return mode;
  return detectResponseLocale(body.intakeState, body.conversation);
}

export const runtime = "nodejs";

function getEnv() {
  return {
    apiKey: process.env.OPENAI_API_KEY ?? "",
    baseUrl: (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(
      /\/$/,
      "",
    ),
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  };
}

async function callOpenAICompatible(
  messages: { role: "system" | "user"; content: string }[],
): Promise<string> {
  const { apiKey, baseUrl, model } = getEnv();
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      messages,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM_HTTP_${res.status}: ${text.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("EMPTY_LLM_RESPONSE");
  return content;
}

export async function POST(req: Request) {
  let body: AnalyzeApiRequestBody;
  try {
    body = (await req.json()) as AnalyzeApiRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.intakeState || typeof body.intakeState !== "object") {
    return NextResponse.json(
      { error: "Field intakeState is required" },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.conversation)) {
    return NextResponse.json(
      { error: "Field conversation must be an array" },
      { status: 400 },
    );
  }

  if (!body.intakeState.situation?.trim()) {
    return NextResponse.json(
      { error: "intakeState.situation is required" },
      { status: 400 },
    );
  }

  const locale = resolveResponseLocale(body);

  if (body.useMock) {
    return NextResponse.json({ result: mockForLocale(locale), mock: true });
  }

  const { apiKey } = getEnv();
  if (!apiKey) {
    return NextResponse.json({
      result: mockForLocale(locale),
      mock: true,
      message: "No OPENAI_API_KEY configured; returned demo analysis.",
    });
  }

  const messages = [
    { role: "system" as const, content: buildAnalysisSystemPrompt(locale) },
    {
      role: "user" as const,
      content: buildAnalysisPrompt(body.intakeState, body.conversation, locale),
    },
  ];

  try {
    const raw = await callOpenAICompatible(messages);
    const parsed = parseModelJson<unknown>(raw);
    const result: AnalysisResult = normalizeAnalysisResult(parsed);
    return NextResponse.json({ result, mock: false });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        result: mockForLocale(locale),
        mock: true,
        error: msg,
        message:
          "Analysis failed; returned demo analysis. Check API key, base URL, and model name.",
      },
      { status: 200 },
    );
  }
}
