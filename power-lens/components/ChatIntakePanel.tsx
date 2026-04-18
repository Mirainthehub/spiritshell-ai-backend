"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDemoChatBootstrap } from "@/lib/demo-analyze-fixtures";
import {
  applyUserReply,
  emptyIntakeState,
  getMissingFields,
  getNextQuestion,
  getReadinessScore,
  getQuickChips,
  type ChatTurn,
  type IntakeFieldKey,
  type IntakeState,
} from "@/lib/intake";

export type IntakeSessionMeta = {
  userReplies: number;
  conversation: ChatTurn[];
};

export type DemoBootstrap = ReturnType<typeof getDemoChatBootstrap>;

type Props = {
  onSessionUpdate: (state: IntakeState, meta: IntakeSessionMeta) => void;
  disabled?: boolean;
  /** When set on mount, hydrate from demo / reset payloads */
  initialBootstrap?: DemoBootstrap | null;
  onAnalyze?: () => void;
  canAnalyze?: boolean;
  /** readiness.stage is usable or strong */
  readinessUsable?: boolean;
};

function lastAssistantIndex(messages: ChatTurn[]): number {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") return i;
  }
  return -1;
}

export function ChatIntakePanel({
  onSessionUpdate,
  disabled,
  initialBootstrap,
  onAnalyze,
  canAnalyze,
  readinessUsable,
}: Props) {
  const [intake, setIntake] = useState<IntakeState>(() =>
    initialBootstrap?.intake ?? emptyIntakeState(),
  );
  const [userReplies, setUserReplies] = useState(
    () => initialBootstrap?.messages.filter((m) => m.role === "user").length ?? 0,
  );
  const [messages, setMessages] = useState<ChatTurn[]>(
    () => initialBootstrap?.messages ?? [],
  );
  const [pendingField, setPendingField] = useState<
    IntakeFieldKey | "general" | null
  >(() => initialBootstrap?.pendingField ?? null);
  const [intakeClosed, setIntakeClosed] = useState(
    () => initialBootstrap?.intakeClosed ?? false,
  );
  const [input, setInput] = useState("");
  const [transcriptOpen, setTranscriptOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const readiness = getReadinessScore(intake);

  useEffect(() => {
    onSessionUpdate(intake, { userReplies, conversation: messages });
  }, [intake, userReplies, messages, onSessionUpdate]);

  const seedOpening = useCallback(() => {
    const first = getNextQuestion(emptyIntakeState(), []);
    if (!first) return;
    setMessages([{ role: "assistant", content: first.question }]);
    setPendingField(first.fieldTarget);
    setIntakeClosed(false);
  }, []);

  useEffect(() => {
    if (initialBootstrap) return;
    if (messages.length > 0) return;
    seedOpening();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only when empty
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, transcriptOpen]);

  const lai = lastAssistantIndex(messages);
  const history = lai >= 0 ? messages.slice(0, lai) : [];
  const currentAssistant = lai >= 0 ? messages[lai] : null;
  const chips = getQuickChips(pendingField);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || disabled || intakeClosed) return;

      const userMsg: ChatTurn = { role: "user", content: text };
      const missingBefore = getMissingFields(intake);

      const newIntake = applyUserReply(intake, text, pendingField);
      setIntake(newIntake);
      setUserReplies((c) => c + 1);

      const conv: ChatTurn[] = [...messages, userMsg];
      const sweepJustAnswered =
        missingBefore.length === 0 && pendingField === "general";

      const next = getNextQuestion(newIntake, conv, {
        optionalSweepCompleted: sweepJustAnswered,
      });

      setMessages((prev) => [...prev, userMsg]);

      if (!next) {
        setIntakeClosed(true);
        setPendingField(null);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: next.question },
      ]);
      setPendingField(next.fieldTarget);
    },
    [disabled, intake, intakeClosed, messages, pendingField],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
    setInput("");
  };

  return (
    <div className="flex h-full min-h-[min(640px,calc(100vh-10rem))] flex-col rounded-lg border border-surface-border bg-[#0a0c10] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      {/* Console header */}
      <div className="flex shrink-0 items-center justify-between border-b border-surface-border px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/90">
            Intake
          </span>
          <span className="hidden text-ink-faint sm:inline">|</span>
          <span className="hidden font-mono text-[11px] text-ink-secondary sm:inline">
            single-query protocol
          </span>
        </div>
        <div className="flex items-baseline gap-2 text-right">
          <span className="font-mono text-xl tabular-nums text-ink-primary">
            {readiness.score}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-ink-faint">
            {readiness.stage}
          </span>
        </div>
      </div>

      {/* Readiness bar */}
      <div className="shrink-0 px-4 pb-2 pt-1">
        <div className="h-1 overflow-hidden rounded-sm bg-surface-overlay">
          <div
            className="h-full rounded-sm bg-gradient-to-r from-emerald-600/70 to-accent transition-all duration-500"
            style={{ width: `${readiness.score}%` }}
          />
        </div>
      </div>

      {readinessUsable ? (
        <div className="shrink-0 border-b border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-2">
          <p className="text-center font-mono text-[11px] text-emerald-100/95">
            I have enough to analyze this.
          </p>
        </div>
      ) : null}

      {/* Transcript (compact) */}
      <div className="shrink-0 border-b border-surface-border px-3 py-1">
        <button
          type="button"
          onClick={() => setTranscriptOpen((o) => !o)}
          className="flex w-full items-center justify-between py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint transition hover:text-ink-secondary"
        >
          <span>Transcript · {messages.length} lines</span>
          <span>{transcriptOpen ? "−" : "+"}</span>
        </button>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3"
      >
        {transcriptOpen ? (
          <div className="space-y-2 pb-2">
            {history.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[95%] rounded border px-3 py-2 text-[13px] leading-snug ${
                    m.role === "user"
                      ? "border-accent/20 bg-accent/[0.06] text-ink-primary"
                      : "border-surface-border bg-surface-overlay/50 text-ink-secondary"
                  }`}
                >
                  <span className="mb-1 block font-mono text-[9px] uppercase tracking-wider text-ink-faint">
                    {m.role === "user" ? "You" : "Query"}
                  </span>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!transcriptOpen && history.length > 0 ? (
          <p className="font-mono text-[10px] text-ink-faint">
            {history.length} prior turn{history.length === 1 ? "" : "s"} — open
            transcript for full thread
          </p>
        ) : null}
      </div>

      {/* Active query — one prominent block (latest strategist question) */}
      <div className="shrink-0 border-t border-accent/25 bg-surface-raised/80 px-4 py-4">
        {intakeClosed ? (
          <p className="text-center font-mono text-[11px] text-emerald-200/90">
            Intake closed for this pass. Reset or run analysis.
          </p>
        ) : currentAssistant ? (
          <>
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
              Current query
            </p>
            <p className="text-sm leading-relaxed text-ink-primary">
              {currentAssistant.content}
            </p>
          </>
        ) : (
          <p className="text-sm text-ink-faint">Awaiting opening query…</p>
        )}
      </div>

      {/* Fixed bottom: chips + input */}
      <div className="mt-auto shrink-0 border-t border-surface-border bg-[#08090d] p-4">
        {!intakeClosed && chips.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setInput(c);
                }}
                className="rounded border border-surface-border bg-surface-overlay/80 px-2.5 py-1 font-mono text-[10px] text-ink-secondary transition hover:border-accent/40 hover:text-ink-primary disabled:opacity-40"
              >
                {c}
              </button>
            ))}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled || intakeClosed}
            placeholder={
              intakeClosed
                ? "Session closed"
                : "Response — one message…"
            }
            className="min-w-0 flex-1 rounded border border-surface-border bg-surface-overlay px-3 py-2.5 font-mono text-[13px] text-ink-primary placeholder:text-ink-faint focus:border-accent/45 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled || intakeClosed || !input.trim()}
            className="shrink-0 rounded border border-accent/40 bg-accent/15 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-accent transition hover:bg-accent/25 disabled:opacity-40"
          >
            Send
          </button>
        </form>

        {canAnalyze && onAnalyze ? (
          <button
            type="button"
            disabled={disabled}
            onClick={onAnalyze}
            className="mt-3 w-full rounded border border-emerald-500/35 bg-emerald-500/10 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-emerald-100/95 transition hover:bg-emerald-500/20 disabled:opacity-50"
          >
            Start analysis now
          </button>
        ) : null}
      </div>
    </div>
  );
}
