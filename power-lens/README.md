# Power Lens

**Most problems are not about what you did.**  
**They’re about how it was perceived.**

Describe a real situation. Power Lens maps who actually has power, what’s really happening, and **what not to do** — so you can move without generic pep talk.

---

## Why people open this

The hook is not “another AI app.” It’s **a relatable scene + a counter-intuitive read**:

- People think they’re undervalued because they do less work. Often they’re undervalued because **their work never enters the decision-maker’s perception layer**.
- If someone reacts badly to your idea, it’s often **not about the idea** — it’s about **what they think it says about them** (status, ego, threat).
- Sometimes **doing more makes things worse** (especially when effort reads as pressure). The lens is **what’s actually happening**, not “try harder.”

Power Lens doesn’t optimize for “sound wise.” It maps **power dynamics** — perception, dependency, incentives, narrative — so the output is closer to **strategy** than soup.

---

## Try this (copy & paste)

Use this in the app as your first situation:

```text
I do most of the work, but someone else gets the credit. I don’t want conflict. What should I do?
```

Power Lens will **not** stop at “communicate more.” It pushes toward **attribution, perception, and moves that change the outcome** — including what to avoid.

---

## Demo

**Live:** [Open Power Lens on Vercel](https://power-lens-vercel.vercel.app)

Without `OPENAI_API_KEY`, the API still returns structured **demo** analysis so you can click through the flow.

---

### Demo GIF (highly recommended for GitHub)

A short screen recording **~20s** converts visitors who only skim the README:

1. Paste a problem → answer a few intake questions → show the analysis panel.
2. Export as GIF (e.g. `docs/demo.gif`).
3. Uncomment or add at the top of this README:

```markdown
![Power Lens demo](docs/demo.gif)
```

*No GIF → conversion on GitHub often drops sharply; the product is easier to “get” in motion.*

---

## Same question, different answer

| | |
|---|------|
| **Typical AI** | “Communicate more,” “be confident,” “talk to your manager.” |
| **Power Lens** | Your constraint is often **not effort** but **lack of attribution in the perception layer** — who sees what, who narrates wins, where leverage actually sits. |

That gap is the point.

---

## Build your own strategist

This repo is a **reusable analysis shell**, not a one-off demo:

- Career / visibility strategist  
- Negotiation or conflict assistant  
- Relationship dynamics analysis (interpersonal framing — use with care)

Fork or use **Use this template** on GitHub, swap copy, tighten prompts in `lib/analysisPrompt.ts`, ship your own product.

---

## Share snippets (LinkedIn / X / Reddit)

You can paste these as-is or shorten. *For 小红书, translate the hook into Chinese.*

**1 — Workplace (broad reach)**  
Most people think they’re undervalued because they do less. They’re not. They’re undervalued because their work never enters the decision-maker’s perception. I built a tool that maps who has power, what’s really happening, and what **not** to do — [Power Lens](https://power-lens-vercel.vercel.app) · [GitHub](https://github.com/Mirainthehub/power-lens)

**2 — Ego / status (sharper)**  
If someone reacts negatively to your idea, it’s often not about the idea — it’s about what they think it says about them. I built a small tool to map threat, leverage, and what actually changes the outcome: [Power Lens](https://power-lens-vercel.vercel.app)

**3 — Relationships (high share)**  
Sometimes doing more makes things worse — effort can read as pressure. This tool unpacks what’s going on, not “five tips.” [Power Lens](https://power-lens-vercel.vercel.app)

**Reddit title idea:**  
`I built a tool that analyzes real-life situations using power dynamics instead of generic advice` — good fits: r/Entrepreneur, r/startups, r/careerguidance (follow each sub’s rules).

---

## Run locally

```bash
git clone https://github.com/Mirainthehub/power-lens.git
cd power-lens
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Optional: `cp .env.example .env.local` and set `OPENAI_API_KEY` for live LLM output (OpenAI-compatible API).

**Deploy:** [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMirainthehub%2Fpower-lens&project-name=power-lens&repository-name=power-lens)

---

## What “success” might look like

Rough anchors for an open-source tool: **~50 stars** = real pull; **~100** = product–message fit; **~300** = distribution working. Stars follow **“I might use this later”** more than **“nice readme”** — so shipping a **GIF demo** and **one real try** matters more than feature count.

---

## Built with

- Next.js  
- LLM → structured JSON (`AnalysisResult`)  
- Conversation-driven intake (`lib/intake/`)

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
| `npm run demo-analyze` | Call `/api/analyze` with a fixture (needs dev server) |
| `npm run benchmark` | Rule-based regression check against `/api/analyze` |
| `npm run benchmark:sensitivity` | Same scenario, different `relationshipHorizon` — needs live API key |

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

Analysis prompt: `lib/analysisPrompt.ts` (axes: perception, dependency, threat, narrative, leverage — not a mechanical list of all 48 laws).

### Environment variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Optional. If empty, responses use mock data. |
| `OPENAI_BASE_URL` | Default `https://api.openai.com/v1`. |
| `OPENAI_MODEL` | e.g. `gpt-4o-mini`. |

### Features (implementation)

- **Conversation Intake Engine** (`lib/intake/`): multi-turn dialogue → structured `IntakeState`.
- **Lens modes** (Survival, Influence, Diplomacy, Long-term Trust): prompt emphasis server-side.
- Export analysis JSON; ethical guardrail + uncertainty + missing-information fields in output.

---

## Legal / ethical note

This tool is for **situational analysis and reflection**. It is not encouragement to manipulate, deceive, or harm others. The system prompt and UI ask the model for ethically bounded, socially intelligent guidance.
