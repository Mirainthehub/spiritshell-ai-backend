"use client";

import { useMemo, useState } from "react";
import type { AnalysisResult, ResponseStyleKind } from "@/lib/types";
import { SectionCard } from "./SectionCard";

const STYLE_ORDER: ResponseStyleKind[] = ["Soft", "Balanced", "Hard"];

function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "amber" | "slate";
}) {
  const tones = {
    default: "border-surface-border bg-surface-overlay text-ink-secondary",
    amber: "border-accent/30 bg-accent-glow text-accent",
    slate: "border-white/10 bg-white/[0.04] text-ink-secondary",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function PowerLevel({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] uppercase tracking-wider text-ink-faint">
        {label}
      </span>
      <span className="font-mono text-xs text-ink-primary">{value}</span>
    </div>
  );
}

export function ResultsDisplay({
  data,
  layout = "default",
}: {
  data: AnalysisResult;
  layout?: "default" | "console";
}) {
  const [openLaw, setOpenLaw] = useState<number | null>(0);
  const [styleTab, setStyleTab] = useState<ResponseStyleKind>("Balanced");
  const cv = layout === "console" ? "console" : "default";

  const stylesByKey = useMemo(() => {
    const m = new Map<ResponseStyleKind, AnalysisResult["responseStyles"][0]>();
    for (const s of data.responseStyles) {
      m.set(s.style, s);
    }
    return m;
  }, [data.responseStyles]);

  const activeStyle = stylesByKey.get(styleTab);
  const bodyCls = layout === "console" ? "text-[13px] leading-relaxed" : "text-sm leading-relaxed";

  return (
    <div className="flex flex-col gap-3">
      <SectionCard
        variant={cv}
        title="Situation Summary"
        subtitle="Condensed terrain."
        delay={0}
      >
        <p className={`${bodyCls} text-ink-secondary`}>
          {data.situationSummary}
        </p>
      </SectionCard>

      <div className="grid gap-3 lg:grid-cols-2">
        <SectionCard
          variant={cv}
          title="Uncertainty"
          subtitle="Confidence bounds."
          delay={50}
        >
          <p className={`${bodyCls} text-ink-secondary`}>
            {data.uncertaintyNote}
          </p>
        </SectionCard>
        <SectionCard
          variant={cv}
          title="Missing Information"
          subtitle="What would sharpen the map."
          delay={80}
        >
          <ul className="space-y-2">
            {data.missingInformation.map((m, i) => (
              <li
                key={i}
                className={`flex gap-2 ${bodyCls} text-ink-secondary`}
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/80" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        variant={cv}
        title="Power Map"
        subtitle="Actors · leverage · alliances."
        delay={100}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.powerMap.actors.map((a, i) => (
            <div
              key={i}
              className="rounded border border-white/[0.06] bg-black/25 p-3"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-ink-primary">
                    {a.name}
                  </p>
                  <p className="text-[11px] text-ink-faint">{a.role}</p>
                </div>
                <Badge tone="amber">{a.stanceTowardUser}</Badge>
              </div>
              <div className="mb-2 grid grid-cols-2 gap-2">
                <PowerLevel label="Formal" value={a.formalPower} />
                <PowerLevel label="Informal" value={a.informalInfluence} />
              </div>
              <p className="text-[12px] leading-relaxed text-ink-secondary">
                {a.notes}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-ink-faint">
              Alliances
            </p>
            <ul className="space-y-1">
              {data.powerMap.alliances.map((x, i) => (
                <li key={i} className={`${bodyCls} text-ink-secondary`}>
                  — {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-ink-faint">
              Threats
            </p>
            <ul className="space-y-1">
              {data.powerMap.threats.map((x, i) => (
                <li key={i} className={`${bodyCls} text-ink-secondary`}>
                  — {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        variant={cv}
        title="Hidden Dynamics"
        subtitle="Perception & incentives."
        delay={120}
      >
        <div className="flex flex-wrap gap-2">
          {data.hiddenDynamics.map((h, i) => (
            <div
              key={i}
              className="max-w-full rounded border border-white/[0.06] bg-white/[0.02] px-3 py-2"
            >
              <Badge tone="slate">{h.label}</Badge>
              <p className={`mt-2 ${bodyCls} text-ink-secondary`}>
                {h.explanation}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        variant={cv}
        title="Relevant Laws"
        subtitle="3–6 laws, case-selected."
        delay={140}
      >
        <div className="space-y-2">
          {data.relevantLaws.map((law, i) => {
            const open = openLaw === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded border border-white/[0.06] bg-black/20"
              >
                <button
                  type="button"
                  onClick={() => setOpenLaw(open ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.03]"
                >
                  <span className="text-sm font-medium text-ink-primary">
                    Law {law.lawNumber} — {law.title}
                  </span>
                  <span className="text-ink-faint">{open ? "−" : "+"}</span>
                </button>
                {open ? (
                  <div className="space-y-2 border-t border-white/[0.06] px-3 py-3">
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-faint">
                        Why it matters here
                      </p>
                      <p className={`${bodyCls} text-ink-secondary`}>
                        {law.whyRelevant}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-faint">
                        Risk of misuse
                      </p>
                      <p className={`${bodyCls} text-ink-secondary`}>
                        {law.misuseRisk}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        variant={cv}
        title="Strategy"
        subtitle="Diagnosis · moves · risks · verdict."
        delay={160}
        className={layout === "console" ? "border-accent/15" : ""}
      >
        <div className="space-y-5">
          <div>
            <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/90">
              Diagnosis
            </h4>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-white/[0.05] bg-black/20 p-3">
                <dt className="text-[10px] uppercase tracking-wider text-ink-faint">
                  Dangerous misconception
                </dt>
                <dd className={`mt-1 ${bodyCls} text-ink-secondary`}>
                  {data.strategicDiagnosis.mainMistakeToAvoid}
                </dd>
              </div>
              <div className="rounded border border-white/[0.05] bg-black/20 p-3">
                <dt className="text-[10px] uppercase tracking-wider text-ink-faint">
                  Others optimize for
                </dt>
                <dd className={`mt-1 ${bodyCls} text-ink-secondary`}>
                  {data.strategicDiagnosis.whatOthersCareAbout}
                </dd>
              </div>
              <div className="rounded border border-white/[0.05] bg-black/20 p-3">
                <dt className="text-[10px] uppercase tracking-wider text-ink-faint">
                  Leverage point
                </dt>
                <dd className={`mt-1 ${bodyCls} text-ink-secondary`}>
                  {data.strategicDiagnosis.trueLeveragePoint}
                </dd>
              </div>
              <div className="rounded border border-white/[0.05] bg-black/20 p-3">
                <dt className="text-[10px] uppercase tracking-wider text-ink-faint">
                  Worst move now
                </dt>
                <dd className={`mt-1 ${bodyCls} text-ink-secondary`}>
                  {data.strategicDiagnosis.worstMoveRightNow}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/90">
              Moves
            </h4>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-ink-faint">
                  Immediate
                </p>
                <p className={`${bodyCls} text-ink-secondary`}>
                  {data.recommendedMoves.immediateNextStep}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-ink-faint">
                  Short-term
                </p>
                <p className={`${bodyCls} text-ink-secondary`}>
                  {data.recommendedMoves.shortTermStrategy}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-ink-faint">
                  Long-term positioning
                </p>
                <p className={`${bodyCls} text-ink-secondary`}>
                  {data.recommendedMoves.longTermPositioning}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-red-400/80">
              What to avoid
            </h4>
            <p className="mb-2 text-[10px] leading-snug text-ink-faint">
              Anti-patterns and moves that tend to backfire here—not vague “danger”
              labels.
            </p>
            <ul className="space-y-1.5">
              {data.redFlags.map((r, i) => (
                <li
                  key={i}
                  className={`flex gap-2 ${bodyCls} text-ink-secondary`}
                >
                  <span className="text-red-400/90">▸</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded border border-accent/30 bg-accent/[0.06] p-3">
            <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              Verdict
            </h4>
            <p className={`${bodyCls} text-ink-primary`}>
              {data.finalRecommendation}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        variant={cv}
        title="Response Styles"
        subtitle="Soft · Balanced · Hard"
        delay={200}
      >
        <div className="mb-3 flex flex-wrap gap-1 rounded border border-white/[0.06] bg-black/20 p-1">
          {STYLE_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStyleTab(s)}
              className={`flex-1 min-w-[88px] rounded px-2 py-2 font-mono text-[10px] font-medium uppercase tracking-wider transition ${
                styleTab === s
                  ? "bg-accent/20 text-accent"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {activeStyle ? (
          <div className="space-y-3 rounded border border-white/[0.06] bg-black/25 p-3">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-faint">
                Approach
              </p>
              <p className={`${bodyCls} text-ink-secondary`}>
                {activeStyle.approach}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-faint">
                Sample wording
              </p>
              <blockquote className="border-l-2 border-accent/50 pl-3 font-mono text-[11px] leading-relaxed text-ink-primary">
                {activeStyle.sampleWording}
              </blockquote>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-faint">
                  Upside
                </p>
                <p className={`${bodyCls} text-ink-secondary`}>
                  {activeStyle.upside}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-faint">
                  Downside
                </p>
                <p className={`${bodyCls} text-ink-secondary`}>
                  {activeStyle.downside}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard
        variant={cv}
        title="Ethical Guardrail"
        subtitle="Bounded intelligence."
        delay={220}
      >
        <p className={`${bodyCls} text-ink-secondary`}>
          {data.ethicalGuardrailNote}
        </p>
      </SectionCard>
    </div>
  );
}
