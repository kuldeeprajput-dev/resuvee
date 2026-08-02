"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, SearchCheck, Sparkles, Target, X } from "lucide-react";
import type { ResumeData } from "../../types/resume";
import { analyzeJobMatch } from "@/modules/analyzer";
import { Button } from "@/shared/components/ui/button";

interface TailorPanelProps {
  data: ResumeData;
  onAddKeywords: (keywords: string[]) => void;
  onClose: () => void;
}

function keywordLabel(keyword: string) {
  return keyword.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function TailorPanel({ data, onAddKeywords, onClose }: TailorPanelProps) {
  const [description, setDescription] = useState("");
  const [added, setAdded] = useState<string[]>([]);
  const result = useMemo(() => analyzeJobMatch(data, description), [data, description]);
  const suggested = result.missing.filter((keyword) => !added.includes(keyword)).slice(0, 8);

  const addKeywords = (keywords: string[]) => {
    if (!keywords.length) return;
    onAddKeywords(keywords);
    setAdded((current) => [...new Set([...current, ...keywords])]);
  };

  const [panelWidth, setPanelWidth] = useState(520);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      const minW = Math.min(520, window.innerWidth);
      const maxW = Math.min(900, window.innerWidth - 80);
      const clampedWidth = Math.min(Math.max(newWidth, minW), maxW);
      setPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="no-print fixed inset-0 z-[110] flex justify-end bg-black/15">
      <button
        type="button"
        aria-label="Close role match"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <aside
        style={{ width: `${panelWidth}px` }}
        className="relative flex h-full w-full min-w-[320px] sm:min-w-[520px] max-w-[95vw] flex-col overflow-hidden bg-[#f7f6f1] shadow-2xl"
      >
        <div
          onMouseDown={handleMouseDown}
          className="group absolute left-0 top-0 bottom-0 z-50 flex w-3 cursor-col-resize items-center justify-center transition-colors hover:bg-emerald-500/20"
          title="Drag left/right to adjust panel width"
        >
          <div className="h-12 w-1 rounded-full bg-black/20 group-hover:bg-emerald-600 transition-colors" />
        </div>
        <header className="flex items-start justify-between border-b border-black/10 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-ink)] text-[var(--brand-lime)]">
              <Target className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#bd593a]">
                Role match
              </p>
              <h2 className="text-xl font-bold tracking-[-0.035em]">Compare your resume</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="builder-icon-button"
            aria-label="Close role match"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          <label htmlFor="job-description" className="text-sm font-bold text-[var(--brand-ink)]">
            Paste the job description
          </label>
          <p className="mt-1 text-xs leading-5 text-[var(--brand-muted)]">
            Resulyra checks role language locally in your browser. Nothing is uploaded.
          </p>
          <textarea
            id="job-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Paste responsibilities, requirements, and preferred skills here…"
            className="mt-3 min-h-44 w-full resize-y rounded-2xl border border-black/10 bg-white p-4 text-sm leading-6 outline-none transition placeholder:text-black/30 focus:border-[#4f7242] focus:ring-3 focus:ring-[#a8ca59]/20"
          />

          {!result.keywordCount ? (
            <div className="mt-5 rounded-2xl border border-dashed border-black/15 bg-white/60 p-5">
              <SearchCheck className="size-6 text-[#4f7242]" />
              <h3 className="mt-3 text-sm font-bold">Your match report appears here</h3>
              <p className="mt-1 text-xs leading-5 text-[var(--brand-muted)]">
                Add a complete description for a more useful comparison.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-3 sm:grid-cols-[130px_1fr]">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-[var(--brand-ink)] p-5 text-white">
                  <span className="text-4xl font-bold tracking-[-0.06em]">{result.score}</span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
                    Match score
                  </span>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs font-bold">What this means</p>
                  <p className="mt-2 text-xs leading-5 text-[var(--brand-muted)]">
                    {result.score >= 75
                      ? "Strong overlap. Keep the language truthful and add measurable proof."
                      : result.score >= 45
                        ? "A useful start. Several role terms are not yet visible."
                        : "The resume and role use different language. Review the missing terms carefully."}
                  </p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                    <div
                      className="h-full rounded-full bg-[var(--brand-lime)] transition-all"
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>
              </div>

              <section className="mt-6">
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#47743d]" />
                  <h3 className="text-sm font-bold">Already covered ({result.matched.length})</h3>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.matched.length ? (
                    result.matched.slice(0, 10).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-[#e1eddc] px-3 py-1.5 text-[11px] font-semibold text-[#315a35]"
                      >
                        {keywordLabel(keyword)}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--brand-muted)]">
                      No strong keyword overlap yet.
                    </p>
                  )}
                </div>
              </section>

              <section className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-[#bd593a]" />
                    <h3 className="text-sm font-bold">Consider adding</h3>
                  </div>
                  {suggested.length > 1 && (
                    <button
                      type="button"
                      onClick={() => addKeywords(suggested)}
                      className="text-[11px] font-bold text-[#47743d] hover:underline"
                    >
                      Add all to skills
                    </button>
                  )}
                </div>
                <p className="mt-1 text-[11px] leading-5 text-[var(--brand-muted)]">
                  Only add terms that accurately describe your experience.
                </p>
                <div className="mt-3 space-y-2">
                  {suggested.map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => addKeywords([keyword])}
                      className="flex w-full items-center justify-between rounded-xl border border-black/10 bg-white px-3.5 py-3 text-left text-xs font-semibold transition hover:border-[#8dab58] hover:bg-[#f5f9ef]"
                    >
                      {keywordLabel(keyword)}
                      <PlusMark />
                    </button>
                  ))}
                  {!suggested.length && (
                    <div className="rounded-xl bg-[#e1eddc] px-4 py-3 text-xs font-semibold text-[#315a35]">
                      All detected terms are covered or already added.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>

        <footer className="border-t border-black/10 bg-white px-5 py-4 sm:px-7">
          <Button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-xl bg-[var(--brand-ink)] font-bold text-white"
          >
            Return to builder
            <ArrowRight className="size-4" />
          </Button>
        </footer>
      </aside>
    </div>
  );
}

function PlusMark() {
  return (
    <span className="flex size-6 items-center justify-center rounded-full bg-[var(--brand-lime)] text-base font-bold text-[var(--brand-ink)]">
      +
    </span>
  );
}
