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

export function AnalyzerHeroCopy() {
  return (
    <div className="analyzer-enter-copy flex h-full max-w-xl flex-col">
      <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#4f6659]">
        <ScanLine className="size-4" />
        ATS resume analyzer
      </div>
      <h1 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.055em] text-[var(--brand-ink)] sm:text-5xl lg:text-[58px]">
        See what your resume says before you send it.
      </h1>
      <p className="mt-5 max-w-lg text-base leading-7 text-[var(--brand-muted)] sm:text-lg">
        Get a focused ATS score, identify missing keywords, and leave with a practical edit
        plan.
      </p>

      <div className="mt-8 border-y border-black/10">
        {reportItems.map((item) => (
          <div
            key={item.title}
            className="analyzer-enter-row grid grid-cols-[28px_1fr] gap-3 border-b border-black/10 py-3.5 last:border-b-0"
          >
            <span className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-[#dce9d1] text-[#35533f]">
              <Check className="size-3" strokeWidth={2.5} />
            </span>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-sm font-bold text-[var(--brand-ink)]">{item.title}</p>
              <p className="text-xs text-[var(--brand-muted)]">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 flex items-center gap-2 text-xs text-[var(--brand-muted)] lg:mt-auto lg:pt-5">
        <LockKeyhole className="size-3.5" />
        Your resume is used only to create this report.
      </p>
    </div>
  );
}
