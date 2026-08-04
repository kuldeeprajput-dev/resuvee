"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Plus, SearchCheck, Sparkles, Target, X } from "lucide-react";
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
        className="relative flex h-full w-full min-w-[320px] sm:min-w-[520px] max-w-[95vw] flex-col overflow-hidden bg-[var(--brand-canvas)] shadow-2xl"
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
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-50 text-emerald-600 shadow-2xs">
              <Target className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-700">
                Role match
              </p>
              <h2 className="text-xl font-bold tracking-[-0.035em] text-[var(--brand-ink)]">
                Compare with target role
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="builder-icon-button cursor-pointer"
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
            Resuvee checks role language locally in your browser. Nothing is uploaded.
          </p>
          <textarea
            id="job-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Paste responsibilities, requirements, and preferred skills here…"
            className="mt-3 min-h-44 w-full resize-y rounded-2xl border border-black/10 bg-white p-4 text-sm leading-6 outline-none transition placeholder:text-black/30 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-500/20 shadow-2xs"
          />

          {!result.keywordCount ? (
            <div className="mt-5 rounded-2xl border border-dashed border-emerald-500/25 bg-emerald-50/40 p-5 text-center">
              <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-2xs border border-emerald-500/20">
                <SearchCheck className="size-5" />
              </span>
              <h3 className="mt-3 text-sm font-bold text-emerald-950">Your match report appears here</h3>
              <p className="mt-1 text-xs leading-5 text-emerald-900/70">
                Add a complete job description above for keyword comparison.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-3 sm:grid-cols-[130px_1fr]">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 p-5 shadow-2xs">
                  <span className="text-4xl font-extrabold tracking-[-0.06em] text-emerald-600">
                    {result.score}%
                  </span>
                  <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-800">
                    Match score
                  </span>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-2xs">
                  <p className="text-xs font-bold text-[var(--brand-ink)]">What this means</p>
                  <p className="mt-2 text-xs leading-5 text-[var(--brand-muted)]">
                    {result.score >= 75
                      ? "Strong overlap. Keep the language truthful and add measurable proof."
                      : result.score >= 45
                        ? "A useful start. Several role terms are not yet visible."
                        : "The resume and role use different language. Review the missing terms carefully."}
                  </p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>
              </div>

              <section className="mt-6">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300/80">
                    <Check className="size-3 stroke-[2.5]" />
                  </span>
                  <h3 className="text-sm font-bold text-[var(--brand-ink)]">
                    Already covered ({result.matched.length})
                  </h3>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.matched.length ? (
                    result.matched.slice(0, 10).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-emerald-500/30 bg-white px-3.5 py-1.5 text-[11px] font-bold text-emerald-800 shadow-2xs flex items-center gap-1.5"
                      >
                        <span className="size-1.5 rounded-full bg-emerald-500" />
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
                    <Sparkles className="size-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-[var(--brand-ink)]">Consider adding</h3>
                  </div>
                  {suggested.length > 1 && (
                    <button
                      type="button"
                      onClick={() => addKeywords(suggested)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition hover:underline cursor-pointer"
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
                      className="flex w-full items-center justify-between rounded-xl border border-black/10 bg-white px-3.5 py-3 text-left text-xs font-bold text-[var(--brand-ink)] transition hover:border-emerald-500 hover:bg-emerald-50/50 shadow-2xs cursor-pointer"
                    >
                      <span>{keywordLabel(keyword)}</span>
                      <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold transition group-hover:bg-emerald-600 group-hover:text-white">
                        <Plus className="size-3.5" />
                      </span>
                    </button>
                  ))}
                  {!suggested.length && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-xs font-bold text-emerald-900">
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
            className="h-11 w-full rounded-xl bg-[var(--brand-ink)] font-bold text-white transition hover:bg-[#27332f] cursor-pointer"
          >
            Return to builder
            <ArrowRight className="size-4" />
          </Button>
        </footer>
      </aside>
    </div>
  );
}
