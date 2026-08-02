"use client";

import { Download, FileText, RotateCcw, Sparkles } from "lucide-react";
import { Brand } from "@/shared/components/layout/SiteHeader";
import type { CoverLetterData } from "../../types/cover-letter";

interface CoverLetterHeaderProps {
  data: CoverLetterData;
  onOpenAiDrawer: () => void;
  onOpenStartFresh: () => void;
  onExportPdf: () => void;
}

export function CoverLetterHeader({
  data,
  onOpenAiDrawer,
  onOpenStartFresh,
  onExportPdf,
}: CoverLetterHeaderProps) {
  return (
    <header className="no-print sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/10 bg-[#f8f7f2]/90 px-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <div className="hidden lg:block">
          <Brand />
        </div>
        <span className="hidden h-6 w-px bg-black/10 lg:block" />
        <div className="min-w-0 max-w-[180px] sm:max-w-[300px] md:max-w-[420px]">
          <p className="flex items-center gap-2 text-sm font-bold truncate">
            <FileText className="size-4 shrink-0 text-[var(--brand-muted)]" />
            <span className="truncate">
              {data.fullName
                ? `${data.fullName}'s Cover Letter`
                : data.company
                  ? `${data.company} — Cover Letter`
                  : "Cover Letter"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenAiDrawer}
          className="h-9 rounded-xl border border-black/15 bg-white px-3 sm:px-3.5 text-xs font-bold text-[var(--brand-ink)] shadow-xs transition hover:bg-black/5 hover:border-black/25 flex items-center gap-1.5 cursor-pointer"
          title="Open AI Cover Letter Assistant"
        >
          <Sparkles className="size-3.5 text-emerald-600 animate-pulse" />
          <span className="hidden sm:inline">Writing with AI</span>
          <span className="sm:hidden">AI Write</span>
        </button>

        <button
          type="button"
          onClick={onOpenStartFresh}
          className="h-9 rounded-xl border border-black/15 bg-white px-3 sm:px-3.5 text-xs font-bold text-[var(--brand-ink)] shadow-xs transition hover:bg-black/5 hover:border-black/25 flex items-center gap-1.5 cursor-pointer"
          title="Start fresh with a clean cover letter"
        >
          <RotateCcw className="size-3.5 text-[var(--brand-muted)]" />
          <span className="hidden sm:inline">Start fresh</span>
          <span className="sm:hidden">Fresh</span>
        </button>

        <button
          type="button"
          onClick={onExportPdf}
          className="h-9 rounded-xl border border-black/15 bg-white px-3 sm:px-3.5 text-xs font-bold text-[var(--brand-ink)] shadow-xs transition hover:bg-black/5 hover:border-black/25 flex items-center gap-1.5 cursor-pointer"
          title="Export PDF Document"
        >
          <Download className="size-3.5 text-emerald-600" />
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
}
