"use client";

import {
  AlertCircle,
  Check,
  CheckCheck,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  SpellCheck2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  applyWritingIssue,
  applyWritingIssues,
  getResumeWritingTargets,
} from "../utils/resume-writing";
import { cn } from "@/shared/lib/utils";
import type { ResumeData } from "../types/resume";
import type {
  WritingCheckResponse,
  WritingIssue,
} from "../types/writing";

interface WritingCheckPanelProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onClose: () => void;
}

const issueTone: Record<WritingIssue["type"], string> = {
  spelling: "bg-[#f8e9e3] text-[#934830]",
  grammar: "bg-[#eee8f6] text-[#654d7a]",
  clarity: "bg-[#e6f0f5] text-[#35667b]",
};

export function WritingCheckPanel({
  data,
  onChange,
  onClose,
}: WritingCheckPanelProps) {
  const [issues, setIssues] = useState<WritingIssue[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runCheck = async () => {
    const targets = getResumeWritingTargets(data);
    if (!targets.length) {
      setError("Add some resume content before running the writing check.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/writing-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targets }),
      });
      const payload = (await response.json()) as
        | { success: true; data: WritingCheckResponse }
        | { success: false; error: string };

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.success ? "Writing check failed." : payload.error,
        );
      }

      setIssues(payload.data.issues);
      setHasChecked(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The writing check could not be completed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const acceptIssue = (issue: WritingIssue) => {
    onChange(applyWritingIssue(data, issue));
    setIssues((current) =>
      current.filter((item) => item.id !== issue.id),
    );
  };

  const dismissIssue = (issue: WritingIssue) => {
    setIssues((current) =>
      current.filter((item) => item.id !== issue.id),
    );
  };

  const acceptAll = () => {
    onChange(applyWritingIssues(data, issues));
    setIssues([]);
  };

  return (
    <div className="no-print fixed inset-0 z-[110] flex justify-end bg-black/35 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close writing check"
        className="absolute inset-0 cursor-default"
      />
      <aside className="relative flex h-full w-full max-w-[540px] flex-col overflow-hidden bg-[#f7f6f1] shadow-2xl">
        <header className="flex items-start justify-between border-b border-black/10 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-ink)] text-[var(--brand-lime)]">
              <SpellCheck2 className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#bd593a]">
                AI writing check
              </p>
              <h2 className="text-xl font-bold tracking-[-0.035em]">
                Catch mistakes before sending
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="builder-icon-button"
            aria-label="Close writing check"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          {!hasChecked && !loading && (
            <div>
              <div className="rounded-3xl bg-[var(--brand-ink)] p-6 text-white">
                <SpellCheck2 className="size-7 text-[var(--brand-lime)]" />
                <h3 className="mt-5 text-2xl font-bold tracking-[-0.04em]">
                  Review every important sentence.
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Check spelling, grammar, and clarity while preserving your
                  facts, voice, metrics, and experience.
                </p>
                <Button
                  type="button"
                  onClick={runCheck}
                  className="mt-6 h-11 rounded-xl bg-[var(--brand-lime)] px-5 font-bold text-[var(--brand-ink)] hover:bg-[#b6da68]"
                >
                  Run AI writing check
                  <SpellCheck2 className="size-4" />
                </Button>
              </div>

              <div className="mt-5 rounded-2xl border border-[#d8cba4] bg-[#faf5e7] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#80652f]" />
                  <div>
                    <p className="text-xs font-bold">You stay in control</p>
                    <p className="mt-1 text-[11px] leading-5 text-black/55">
                      Each suggestion requires your approval. Resulyra never
                      adds employers, achievements, skills, or numbers that
                      you did not write.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4">
                <LockKeyhole className="mt-0.5 size-4 shrink-0 text-[var(--brand-muted)]" />
                <p className="text-[11px] leading-5 text-[var(--brand-muted)]">
                  Resume writing fields are sent to the configured AI
                  provider for this check. Contact fields such as your name,
                  email, phone, location, and links are excluded.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex min-h-96 flex-col items-center justify-center text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <LoaderCircle className="size-6 animate-spin text-[#4f7946]" />
              </span>
              <h3 className="mt-5 text-base font-bold">
                Reviewing your writing
              </h3>
              <p className="mt-2 max-w-xs text-xs leading-5 text-[var(--brand-muted)]">
                Looking for spelling, grammar, and clarity improvements
                without changing your facts.
              </p>
            </div>
          )}

          {hasChecked && !loading && (
            <>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">
                    {issues.length
                      ? `${issues.length} suggestions`
                      : "Writing looks clean"}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--brand-muted)]">
                    Accept or dismiss every change individually.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={runCheck}
                  className="builder-icon-button"
                  aria-label="Run writing check again"
                >
                  <RefreshCw className="size-4" />
                </button>
              </div>

              {issues.length ? (
                <div className="mt-5 space-y-3">
                  {issues.map((issue) => (
                    <article
                      key={issue.id}
                      className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em]",
                            issueTone[issue.type],
                          )}
                        >
                          {issue.type}
                        </span>
                        <p className="text-[9px] font-semibold text-[var(--brand-muted)]">
                          {issue.label}
                        </p>
                      </div>
                      <div className="mt-4 grid gap-2">
                        <div className="rounded-xl bg-[#f8ece8] px-3 py-2.5">
                          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#a04c36]">
                            Original
                          </p>
                          <p className="mt-1 text-xs leading-5 line-through decoration-[#c36a51]/50">
                            {issue.original}
                          </p>
                        </div>
                        <div className="rounded-xl bg-[#eaf3e8] px-3 py-2.5">
                          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#477142]">
                            Suggestion
                          </p>
                          <p className="mt-1 text-xs font-semibold leading-5">
                            {issue.replacement}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] leading-5 text-[var(--brand-muted)]">
                        {issue.explanation}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          type="button"
                          onClick={() => acceptIssue(issue)}
                          className="h-9 rounded-lg bg-[var(--brand-ink)] px-3 text-[11px] font-bold text-white"
                        >
                          <Check className="size-3.5" />
                          Accept
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => dismissIssue(issue)}
                          className="h-9 rounded-lg px-3 text-[11px] font-bold"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-3xl border border-[#bfd1c4] bg-[#edf4ef] px-5 py-10 text-center">
                  <CheckCheck className="mx-auto size-8 text-[#4f7946]" />
                  <h3 className="mt-4 text-base font-bold">
                    No clear mistakes found
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--brand-muted)]">
                    Give the resume one final human read for names, dates, and
                    role-specific terminology.
                  </p>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#e5b7aa] bg-[#f9ebe7] p-4 text-[#8f3f2c]">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p className="text-xs leading-5">{error}</p>
            </div>
          )}
        </div>

        <footer className="border-t border-black/10 bg-white px-5 py-4 sm:px-7">
          {issues.length > 1 ? (
            <Button
              type="button"
              onClick={acceptAll}
              className="h-11 w-full rounded-xl bg-[var(--brand-ink)] font-bold text-white"
            >
              <CheckCheck className="size-4" />
              Accept all {issues.length} suggestions
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="h-11 w-full rounded-xl border-black/10 font-bold"
            >
              Return to builder
            </Button>
          )}
        </footer>
      </aside>
    </div>
  );
}
