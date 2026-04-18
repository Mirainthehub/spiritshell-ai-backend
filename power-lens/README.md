# Power Lens

Single-page Next.js app that analyzes real-world situations through a **power-dynamics framework** inspired by *The 48 Laws of Power*. It returns structured JSON (power map, hidden dynamics, selected laws, moves, response styles) and renders it as a dark, strategy-tool UI.

## Requirements

- Node.js 18+

## Setup

```bash
cd power-lens
npm install
```

Copy environment variables (optional for live LLM):

```bash
cp .env.example .env.local
# Edit .env.local and add OPENAI_API_KEY if you want live analysis
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Without** `OPENAI_API_KEY`, the `/api/analyze` route returns the built-in **demo JSON** (mock), so the UI is fully demonstrable.
- **With** a key, the app calls your provider’s **OpenAI-compatible** `POST /v1/chat/completions` endpoint.

## Deploy — public link (share with anyone)

Use [Vercel](https://vercel.com) (free tier is enough for demos).

### One-click (recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMirainthehub%2Fpower-lens&project-name=power-lens&repository-name=power-lens)

1. Sign in with GitHub and confirm import of **Mirainthehub/power-lens**.
2. Leave defaults (Next.js is auto-detected). Click **Deploy**.
3. When the build finishes, use the **`.vercel.app`** URL — that is the link you send to friends.

**Optional environment variables** (Project → Settings → Environment Variables):

| Name | Value |
|------|--------|
| `OPENAI_API_KEY` | Omit for **mock-only** analysis (enough for casual testing). |
| `OPENAI_BASE_URL` | Only if not using default OpenAI (`https://api.openai.com/v1`). |
| `OPENAI_MODEL` | e.g. `gpt-4o-mini` |

Redeploy after changing env vars.

### Manual import

1. [Vercel Dashboard](https://vercel.com/dashboard) → **Add New…** → **Project** → Import **Mirainthehub/power-lens**.
2. **Root Directory**: leave empty (repo root is the Next app).
3. Deploy.

### POST `/api/analyze`

Request JSON:

```json
{
  "intakeState": { "...": "IntakeState fields" },
  "conversation": [{ "role": "user"|"assistant", "content": "..." }],
  "useMock": false
}
```

Response: `{ result: AnalysisResult, mock?: boolean, message?: string, error?: string }`.

Analysis uses `lib/analysisPrompt.ts`: `buildAnalysisSystemPrompt()` + `buildAnalysisPrompt(intakeState, conversation)` (power dynamics: perception, dependency, threat, narrative, leverage — not a mechanical list of all 48 laws).

**Demo script** (start `npm run dev` first):

```bash
npm run demo-analyze
# optional: POWER_LENS_URL=http://127.0.0.1:3000 POWER_LENS_USE_MOCK=1 npm run demo-analyze
```

## Configuration

| Variable           | Description |
|--------------------|-------------|
| `OPENAI_API_KEY`   | Bearer token for the API. If empty, responses use mock data. |
| `OPENAI_BASE_URL`  | Base URL for the API (default `https://api.openai.com/v1`). |
| `OPENAI_MODEL`     | Model name (e.g. `gpt-4o-mini`). |

Compatible with any provider that mirrors OpenAI’s chat completions schema (including many local gateways).

## Features

- **Conversation Intake Engine** (`lib/intake/`): multi-turn, **single-question** dialogue that fills a structured `IntakeState` (not a field-by-field form). The UI is chat-only; analysis unlocks when readiness is high enough or after five reply turns.
- **Lens modes**: Parsed from intake (or defaults) — Survival, Influence, Diplomacy, Long-term Trust — they change prompt emphasis server-side.
- **Mock / demo**: “Load demo analysis”, or run without an API key.
- **Export**: Copy or download analysis JSON.
- **Ethical guardrail** + **uncertainty** + **missing information** sections in the model output.

### Intake engine API (for extension)

- `getNextQuestion(intakeState, conversation, opts?)` → next question or `null` after the optional final sweep.
- `applyUserReply(state, reply, pendingFieldTarget)` → updated state.
- `getMissingFields(state)` → priority-ordered gaps.
- `getReadinessScore(state)` → `{ score, stage }`.
- `intakeStateToAnalyzeRequest(state)` → legacy flat `AnalyzeRequestBody` (optional helpers only; the app uses `intakeState` + `conversation` for `/api/analyze`).

### CLI demo

Runs a stdin/stdout dialogue (same engine as the web UI):

```bash
npm run intake-cli
```

## Scripts

- `npm run dev` — development server  
- `npm run build` — production build  
- `npm run start` — run production build  
- `npm run lint` — ESLint  
- `npm run intake-cli` — terminal intake session (Ctrl+C or `/quit` to exit)  
- `npm run demo-analyze` — call `/api/analyze` with fixed intake + transcript (requires `npm run dev`)  

## Legal / ethical note

This tool is for **situational analysis and reflection**. It is not encouragement to manipulate, deceive, or harm others. The system prompt and UI ask the model for ethically bounded, socially intelligent guidance.
