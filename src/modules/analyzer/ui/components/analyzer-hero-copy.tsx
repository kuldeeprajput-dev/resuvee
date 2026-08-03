"use client";

import { Check, LockKeyhole, ScanLine } from "lucide-react";

const reportItems = [
  {
    title: "ATS score",
    detail: "A clear overall health check",
  },
  {
    title: "Keyword gaps",
    detail: "Missing terms and weak coverage",
  },
  {
    title: "Practical fixes",
    detail: "Prioritized edits you can apply",
  },
];

export function AnalyzerHeroHeader() {
  return (
    <div className="analyzer-enter-copy flex flex-col">
      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4f6659] sm:gap-2 sm:text-[11px]">
        <ScanLine className="size-3.5 sm:size-4" />
        ATS resume analyzer
      </div>
      <h1 className="mt-2 text-2xl font-bold leading-[1.08] tracking-[-0.04em] text-[var(--brand-ink)] sm:mt-5 sm:text-4xl sm:leading-[1.02] sm:tracking-[-0.055em] lg:text-[58px]">
        See what your resume says before you send it.
      </h1>
      <p className="mt-2 max-w-lg text-xs leading-relaxed text-[var(--brand-muted)] sm:mt-5 sm:text-lg sm:leading-7">
        Get a focused ATS score, identify missing keywords, and leave with a practical edit
        plan.
      </p>
    </div>
  );
}

export function AnalyzerHeroFeatures() {
  return (
    <div className="flex flex-col">
      <div className="mt-4 border-y border-black/10 sm:mt-8">
        {reportItems.map((item) => (
          <div
            key={item.title}
            className="analyzer-enter-row grid grid-cols-[24px_1fr] gap-2.5 border-b border-black/10 py-2.5 last:border-b-0 sm:grid-cols-[28px_1fr] sm:gap-3 sm:py-3.5"
          >
            <span className="mt-0.5 flex size-4.5 items-center justify-center rounded-full bg-[#dce9d1] text-[#35533f] sm:size-5">
              <Check className="size-2.5 sm:size-3" strokeWidth={2.5} />
            </span>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-xs font-bold text-[var(--brand-ink)] sm:text-sm">{item.title}</p>
              <p className="text-[11px] text-[var(--brand-muted)] sm:text-xs">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 flex items-center gap-2 text-[11px] text-[var(--brand-muted)] sm:mt-5 sm:text-xs lg:mt-auto lg:pt-5">
        <LockKeyhole className="size-3 sm:size-3.5" />
        Your resume is used only to create this report.
      </p>
    </div>
  );
}

export function AnalyzerHeroCopy() {
  return (
    <div className="analyzer-enter-copy flex h-full max-w-xl flex-col">
      <AnalyzerHeroHeader />
      <AnalyzerHeroFeatures />
    </div>
  );
}

