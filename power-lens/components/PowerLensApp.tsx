"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  emptyIntakeState,
  getReadinessScore,
  type ChatTurn,
  type IntakeState,
} from "@/lib/intake";
import type { AnalysisResult, AnalyzeApiRequestBody } from "@/lib/types";
import { getDemoChatBootstrap } from "@/lib/demo-analyze-fixtures";
import { ChatIntakePanel, type IntakeSessionMeta } from "./ChatIntakePanel";
import { ResultsDisplay } from "./ResultsDisplay";

export function PowerLensApp() {
  const resultsRef = useRef<HTMLDivElement>(null);

  const [intake, setIntake] = useState<IntakeState>(() => emptyIntakeState());
  const [conversation, setConversation] = useState<ChatTurn[]>([]);
  const [userReplies, setUserReplies] = useState(0);

  const [panelKey, setPanelKey] = useState(0);
  const [panelBootstrap, setPanelBootstrap] = useState<
    ReturnType<typeof getDemoChatBootstrap> | null
  >(null);

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoBanner, setInfoBanner] = useState<string | null>(null);
  const [usedMock, setUsedMock] = useState(false);
  const [outputLocale, setOutputLocale] = useState<"auto" | "zh" | "en">(
    "auto",
  );

  const readiness = useMemo(() => getReadinessScore(intake), [intake]);

  const readinessUsable =
    readiness.stage === "usable" || readiness.stage === "strong";

  const canAnalyze = useMemo(() => {
    if (!intake.situation.trim()) return false;
    return readiness.score >= 56 || userReplies >= 5;
  }, [intake.situation, readiness.score, userReplies]);

  useEffect(() => {
    if (canAnalyze) setError(null);
  }, [canAnalyze]);

  const onSessionUpdate = useCallback(
    (state: IntakeState, meta: IntakeSessionMeta) => {
      setIntake(state);
      setUserReplies(meta.userReplies);
      setConversation(meta.conversation);
    },
    [],
  );

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const runAnalyze = useCallback(
    async (opts: {
      useMock: boolean;
      intakeOverride?: IntakeState;
      conversationOverride?: ChatTurn[];
      responseLocale?: AnalyzeApiRequestBody["responseLocale"];
    }) => {
      setLoading(true);
      setError(null);
      setInfoBanner(null);
      const i = opts.intakeOverride ?? intake;
      const c = opts.conversationOverride ?? conversation;
      const rl = opts.responseLocale ?? outputLocale;
      try {
        const payload: AnalyzeApiRequestBody = {
          intakeState: i,
          conversation: c,
          useMock: opts.useMock,
        };
        if (rl !== "auto") payload.responseLocale = rl;
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as {
          result?: AnalysisResult;
          mock?: boolean;
          message?: string;
          error?: string;
        };
        if (!res.ok && !json.result) {
          setError(
            (json as { error?: string }).error ||
              `Request failed (${res.status})`,
          );
          setResult(null);
          return;
        }
        if (!json.result) {
          setError(json.error || "No result returned");
          setResult(null);
          return;
        }
        setResult(json.result);
        setUsedMock(!!json.mock);
        if (json.message) setInfoBanner(json.message);
        else if (json.mock && json.error)
          setInfoBanner(`Demo mode: ${json.error}`);
        else if (json.mock)
          setInfoBanner("Demo analysis (no API key or mock requested).");
        else setInfoBanner(null);
        setTimeout(scrollToResults, 100);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Request failed");
        setResult(null);
      } finally {
        setLoading(false);
      }
    },
    [intake, conversation, outputLocale],
  );

  const handleAnalyze = () => {
    if (!canAnalyze) {
      setError(
        "Need readiness ≥ 56 or at least 5 reply turns before analysis.",
      );
      return;
    }
    void runAnalyze({ useMock: false });
  };

  const handleLoadDemo = () => {
    setError(null);
    setOutputLocale("zh");
    const boot = getDemoChatBootstrap("zh");
    setPanelBootstrap(boot);
    setPanelKey((k) => k + 1);
    void runAnalyze({
      useMock: true,
      intakeOverride: boot.intake,
      conversationOverride: boot.messages,
      responseLocale: "zh",
    });
  };

  const handleLoadDemoEn = () => {
    setError(null);
    setOutputLocale("en");
    const boot = getDemoChatBootstrap("en");
    setPanelBootstrap(boot);
    setPanelKey((k) => k + 1);
    void runAnalyze({
      useMock: true,
      intakeOverride: boot.intake,
      conversationOverride: boot.messages,
      responseLocale: "en",
    });
  };

  const handleResetAll = () => {
    setPanelBootstrap(null);
    setPanelKey((k) => k + 1);
    setResult(null);
    setError(null);
    setInfoBanner(null);
    setUsedMock(false);
    setOutputLocale("auto");
  };

  const copyJson = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setInfoBanner("JSON copied to clipboard.");
    setTimeout(() => setInfoBanner(null), 2500);
  };

  const exportJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "power-lens-analysis.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const analyzeAnother = () => {
    setResult(null);
    setError(null);
    setInfoBanner(null);
    setUsedMock(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] px-3 pb-16 pt-8 sm:px-5 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-surface-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
            Power Lens
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-primary sm:text-3xl">
            Strategy console
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-secondary">
            Intake dialogue → structured power analysis. Not a chatbot — a
            briefing instrument.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded border border-surface-border bg-surface-overlay px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            <span className="text-ink-secondary">Output</span>
            <select
              value={outputLocale}
              onChange={(e) =>
                setOutputLocale(e.target.value as "auto" | "zh" | "en")
              }
              disabled={loading}
              className="max-w-[140px] cursor-pointer rounded border border-white/10 bg-black/40 px-2 py-1 text-[11px] font-normal normal-case tracking-normal text-ink-primary focus:border-accent/40 focus:outline-none disabled:opacity-50"
            >
              <option value="auto">Auto (infer)</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </label>
          <button
            type="button"
            onClick={handleResetAll}
            disabled={loading}
            className="rounded border border-surface-border bg-surface-overlay px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ink-secondary transition hover:border-white/15 hover:text-ink-primary disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleLoadDemo}
            disabled={loading}
            className="rounded border border-accent/30 bg-accent-glow px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-accent transition hover:border-accent/50 disabled:opacity-50"
          >
            Load demo (ZH)
          </button>
          <button
            type="button"
            onClick={handleLoadDemoEn}
            disabled={loading}
            className="rounded border border-accent/30 bg-surface-overlay px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ink-secondary transition hover:border-accent/35 hover:text-ink-primary disabled:opacity-50"
          >
            Load demo (EN)
          </button>
          {result ? (
            <button
              type="button"
              onClick={copyJson}
              className="rounded border border-surface-border bg-surface-overlay px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ink-secondary transition hover:border-accent/35 hover:text-ink-primary"
            >
              Copy JSON
            </button>
          ) : null}
        </div>
      </div>

      <div className="mb-4 rounded border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[11px] text-ink-faint">
        <span className="font-mono text-ink-secondary">Ethics: </span>
        Maps dynamics for sturdier choices — not a license to manipulate or
        harm.
      </div>

      <div className="grid min-h-[min(720px,calc(100vh-9rem))] gap-0 overflow-hidden rounded-lg border border-surface-border bg-surface-raised/20 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col border-b border-surface-border lg:border-b-0 lg:border-r">
          <ChatIntakePanel
            key={panelKey}
            initialBootstrap={panelBootstrap}
            onSessionUpdate={onSessionUpdate}
            disabled={loading}
            onAnalyze={handleAnalyze}
            canAnalyze={canAnalyze}
            readinessUsable={readinessUsable}
          />
        </div>

        <div
          ref={resultsRef}
          className="flex min-h-0 flex-col overflow-y-auto bg-[#07080c]"
        >
          <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-surface-border bg-[#07080c]/95 px-4 py-3 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              Analysis output
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || !canAnalyze}
                className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-100/90 transition hover:bg-emerald-500/20 disabled:opacity-40"
              >
                {loading ? "Running…" : "Analyze"}
              </button>
              {result ? (
                <button
                  type="button"
                  onClick={exportJson}
                  className="rounded border border-surface-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-secondary hover:border-accent/35"
                >
                  Export JSON
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex-1 space-y-4 p-4">
            {infoBanner ? (
              <div className="rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2 font-mono text-[10px] text-amber-100/90">
                {infoBanner}
                {usedMock ? (
                  <span className="ml-2 rounded bg-black/40 px-1 py-0.5 text-[9px] uppercase text-amber-200/80">
                    mock
                  </span>
                ) : null}
              </div>
            ) : null}

            {error ? (
              <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            ) : null}

            {loading && !result ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded border border-dashed border-surface-border p-8">
                <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                <p className="font-mono text-[11px] text-ink-secondary">
                  Compiling analysis…
                </p>
              </div>
            ) : null}

            {loading && result ? (
              <p className="text-center font-mono text-[10px] text-amber-200/80">
                Regenerating…
              </p>
            ) : null}

            {!loading && !result ? (
              <div className="flex min-h-[280px] flex-col justify-center rounded border border-dashed border-white/[0.06] p-8 text-center">
                <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                  Awaiting run
                </p>
                <p className="mt-2 text-sm text-ink-secondary">
                  Complete intake or load demo. Use{" "}
                  <span className="text-ink-primary">Analyze</span> when ready.
                </p>
                {!canAnalyze ? (
                  <p className="mt-2 font-mono text-[10px] text-ink-faint">
                    Readiness {readiness.score} · {readiness.stage} · replies{" "}
                    {userReplies}
                  </p>
                ) : null}
              </div>
            ) : null}

            {result ? (
              <div className="animate-fade-in space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={analyzeAnother}
                    className="font-mono text-[10px] uppercase tracking-wider text-accent hover:underline"
                  >
                    Clear output
                  </button>
                </div>
                <ResultsDisplay data={result} layout="console" />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <footer className="mt-10 border-t border-surface-border pt-6 text-center font-mono text-[10px] text-ink-faint">
        Power Lens — analytical tool only. Not legal, medical, or HR advice.
      </footer>
    </div>
  );
}
