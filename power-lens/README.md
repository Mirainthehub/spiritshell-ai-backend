# 🧠 Power Lens

Describe a situation.  
Power Lens maps the hidden dynamics — and tells you what actually matters.

---

### ⚡ What it does

Most people ask:

> “What should I do?”

Power Lens answers:

> “What’s really going on here — and what moves actually change the outcome.”

It analyzes your situation through:

- power dynamics
- perception vs reality
- dependency structures
- hidden incentives

---

### 🎯 Try it in 30 seconds

Example input:

> "I do most of the work in my team, but another colleague gets more recognition. I don’t want conflict, but I don’t want to stay invisible."

→ Power Lens reveals:

- why this is happening
- what you’re missing
- what NOT to do
- concrete strategic moves

---

### 🧩 Why this is different

Most AI tools give advice.

Power Lens:

- reconstructs the situation
- maps hidden structures
- surfaces non-obvious leverage points

---

### 🚀 Demo

**Live (Vercel):** [👉 Open Power Lens](https://power-lens-vercel.vercel.app)

_No API key required — analysis can run on built-in demo data._

**Run locally:**

```bash
git clone https://github.com/Mirainthehub/power-lens.git
cd power-lens
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Optional: `cp .env.example .env.local` and set `OPENAI_API_KEY` for live LLM analysis (OpenAI-compatible API).

**Deploy your own copy:** [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMirainthehub%2Fpower-lens&project-name=power-lens&repository-name=power-lens)

---

### 🛠 Built with

- Next.js
- LLM-powered structured analysis
- Conversation-driven intake engine

---

## Developer reference

### Requirements

- Node.js 20+ (see `engines` in `package.json`)

### Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run intake-cli` | Terminal intake session |
| `npm run demo-analyze` | Call `/api/analyze` with fixed fixture (needs `npm run dev`) |

### API: `POST /api/analyze`

Request body:

```json
{
  "intakeState": { "...": "IntakeState fields" },
  "conversation": [{ "role": "user"|"assistant", "content": "..." }],
  "useMock": false
}
```

Response: `{ result: AnalysisResult, mock?: boolean, message?: string, error?: string }`.

Analysis prompt: `lib/analysisPrompt.ts` (power dynamics: perception, dependency, threat, narrative, leverage — not a mechanical list of all 48 laws).

### Environment variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Optional. If empty, responses use mock data. |
| `OPENAI_BASE_URL` | Default `https://api.openai.com/v1`. |
| `OPENAI_MODEL` | e.g. `gpt-4o-mini`. |

### Features (implementation)

- **Conversation Intake Engine** (`lib/intake/`): multi-turn, single-question dialogue → structured `IntakeState`.
- **Lens modes** (Survival, Influence, Diplomacy, Long-term Trust): prompt emphasis server-side.
- Export analysis JSON; ethical guardrail + uncertainty + missing-information fields in output.

---

## Legal / ethical note

This tool is for **situational analysis and reflection**. It is not encouragement to manipulate, deceive, or harm others. The system prompt and UI ask the model for ethically bounded, socially intelligent guidance.
