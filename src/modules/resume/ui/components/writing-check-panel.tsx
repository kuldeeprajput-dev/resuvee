"use client";

import {
  AlertCircle,
  Check,
  CheckCheck,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  SpellCheck2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  applyWritingIssue,
  applyWritingIssues,
  getResumeWritingTargets,
} from "../../utils/resume-writing";
import { cn } from "@/shared/lib/utils";
import type { ResumeData } from "../../types/resume";
import type { WritingCheckResponse, WritingIssue } from "../../types/writing";

interface WritingCheckPanelProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onClose: () => void;
}

const issueTone: Record<WritingIssue["type"], string> = {
  spelling: "border border-amber-200/60 bg-amber-50 text-amber-800",
  grammar: "border border-purple-200/60 bg-purple-50 text-purple-800",
  clarity: "border border-emerald-200/60 bg-emerald-50 text-emerald-800",
};

export function WritingCheckPanel({ data, onChange, onClose }: WritingCheckPanelProps) {
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
        { success: true; data: WritingCheckResponse } | { success: false; error: string };

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? "Writing check failed." : payload.error);
      }

      setIssues(payload.data.issues);
      setHasChecked(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The writing check could not be completed."
      );
    } finally {
      setLoading(false);
    }
  };

  const acceptIssue = (issue: WritingIssue) => {
    onChange(applyWritingIssue(data, issue));
    setIssues((current) => current.filter((item) => item.id !== issue.id));
  };

  const dismissIssue = (issue: WritingIssue) => {
    setIssues((current) => current.filter((item) => item.id !== issue.id));
  };

  const acceptAll = () => {
    onChange(applyWritingIssues(data, issues));
    setIssues([]);
  };

  return (
    <div className="no-print fixed inset-0 z-[110] flex justify-end bg-black/40 backdrop-blur-xs">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close writing check"
        className="absolute inset-0 cursor-default"
      />
      <aside className="relative flex h-full w-full max-w-[540px] flex-col overflow-hidden bg-[var(--brand-canvas)] shadow-2xl">
        <header className="flex items-start justify-between border-b border-black/10 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-50 text-emerald-600 shadow-2xs">
              <Sparkles className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-700">
                AI writing check
              </p>
              <h2 className="text-xl font-bold tracking-[-0.035em] text-[var(--brand-ink)]">
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
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 p-6 text-[var(--brand-ink)] shadow-xs">
                <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-emerald-400/15 blur-2xl" />
                <span className="flex size-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-white text-emerald-600 shadow-2xs">
                  <SpellCheck2 className="size-5.5" />
                </span>
                <h3 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-[var(--brand-ink)]">
                  Review every important sentence.
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-[var(--brand-muted)]">
                  Check spelling, grammar, and clarity while preserving your facts, voice, metrics,
                  and experience.
                </p>
                <Button
                  type="button"
                  onClick={runCheck}
                  className="mt-6 h-11 rounded-xl bg-emerald-600 px-5 font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-emerald-600/30"
                >
                  Run AI writing check
                  <Sparkles className="size-4 text-emerald-200" />
                </Button>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/60 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                  <div>
                    <p className="text-xs font-extrabold text-emerald-950">You stay in control</p>
                    <p className="mt-1 text-[11px] leading-5 text-emerald-900/70">
                      Each suggestion requires your approval. Resulyra never adds employers,
                      achievements, skills, or numbers that you did not write.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4">
                <LockKeyhole className="mt-0.5 size-4 shrink-0 text-[var(--brand-muted)]" />
                <p className="text-[11px] leading-5 text-[var(--brand-muted)]">
                  Resume writing fields are sent to the configured AI provider for this check.
                  Contact fields such as your name, email, phone, location, and links are excluded.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex min-h-96 flex-col items-center justify-center text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-black/10">
                <LoaderCircle className="size-6 animate-spin text-emerald-600" />
              </span>
              <h3 className="mt-5 text-base font-bold text-[var(--brand-ink)]">Reviewing your writing</h3>
              <p className="mt-2 max-w-xs text-xs leading-5 text-[var(--brand-muted)]">
                Looking for spelling, grammar, and clarity improvements without changing your facts.
              </p>
            </div>
          )}

          {hasChecked && !loading && (
            <>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[var(--brand-ink)]">
                    {issues.length ? `${issues.length} suggestions` : "Writing looks clean"}
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
                      className="rounded-2xl border border-black/10 bg-white p-4 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em]",
                            issueTone[issue.type]
                          )}
                        >
                          {issue.type}
                        </span>
                        <p className="text-[9px] font-bold text-[var(--brand-muted)]">
                          {issue.label}
                        </p>
                      </div>
                      <div className="mt-4 grid gap-2">
                        <div className="rounded-xl border border-rose-100 bg-rose-50/60 px-3 py-2.5">
                          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-rose-800">
                            Original
                          </p>
                          <p className="mt-1 text-xs leading-5 text-rose-900 line-through decoration-rose-400">
                            {issue.original}
                          </p>
                        </div>
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2.5">
                          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-800">
                            Suggestion
                          </p>
                          <p className="mt-1 text-xs font-bold leading-5 text-emerald-950">
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
                          className="h-9 rounded-lg bg-[var(--brand-ink)] px-3.5 text-[11px] font-bold text-white transition hover:bg-[#27332f]"
                        >
                          <Check className="size-3.5" />
                          Accept
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => dismissIssue(issue)}
                          className="h-9 rounded-lg px-3 text-[11px] font-bold text-[var(--brand-muted)] hover:text-[var(--brand-ink)]"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-3xl border border-emerald-500/20 bg-emerald-50/50 px-5 py-10 text-center">
                  <CheckCheck className="mx-auto size-8 text-emerald-600" />
                  <h3 className="mt-4 text-base font-bold text-emerald-950">No clear mistakes found</h3>
                  <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-emerald-900/70">
                    Give the resume one final human read for names, dates, and role-specific
                    terminology.
                  </p>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" />
              <p className="text-xs leading-5">{error}</p>
            </div>
          )}
        </div>

        <footer className="border-t border-black/10 bg-white px-5 py-4 sm:px-7">
          {issues.length > 1 ? (
            <Button
              type="button"
              onClick={acceptAll}
              className="h-11 w-full rounded-xl bg-[var(--brand-ink)] font-bold text-white transition hover:bg-[#27332f]"
            >
              <CheckCheck className="size-4" />
              Accept all {issues.length} suggestions
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="h-11 w-full rounded-xl border-black/10 font-bold text-[var(--brand-ink)] hover:bg-black/5"
            >
              Return to builder
            </Button>
          )}
        </footer>
      </aside>
    </div>
  );
}
