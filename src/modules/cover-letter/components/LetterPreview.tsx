"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import type { CoverLetterData, CoverLetterTheme, TypographyFont, PageSpacing } from "../types/cover-letter";

interface LetterPreviewProps {
  data: CoverLetterData;
  theme: CoverLetterTheme;
  accent: string;
  font?: TypographyFont;
  pageSpacing?: PageSpacing;
  onSelectField?: (e: React.MouseEvent<HTMLElement>, field: keyof CoverLetterData) => void;
  selectedField?: keyof CoverLetterData | null;
}

export function LetterPreview({
  data,
  theme,
  accent,
  font = "template",
  pageSpacing = "normal",
  onSelectField,
  selectedField,
}: LetterPreviewProps) {
  const fontClass =
    font === "template"
      ? theme === "ledger"
        ? "font-serif"
        : "font-sans"
      : font === "sans"
      ? "font-sans"
      : font === "serif"
      ? "font-serif"
      : "font-mono";

  const spacingClass =
    pageSpacing === "compact"
      ? "px-10 py-9 min-h-[780px]"
      : pageSpacing === "spacious"
      ? "px-16 py-14 min-h-[890px]"
      : "px-14 py-12 min-h-[842px]";

  const contact = [data.email, data.phone, data.location, data.website]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <article
      className={cn(
        "resume-print-area relative w-[595px] shrink-0 overflow-hidden bg-white text-[#232824] shadow-[0_24px_65px_rgba(22,32,28,0.18)]",
        spacingClass,
        fontClass
      )}
    >
      {theme === "signal" && (
        <div className="absolute inset-y-0 left-0 w-3" style={{ backgroundColor: accent }} />
      )}
      {theme === "linen" && (
        <div className="absolute -right-20 -top-24 size-64 rounded-full bg-[#e7f1e8]" />
      )}
      <header className="relative border-b pb-6" style={{ borderColor: accent }}>
        <h1
          onClick={(e) => onSelectField?.(e, "fullName")}
          className={cn(
            "text-[29px] font-bold leading-none tracking-[-0.045em] cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
            selectedField === "fullName" && "ring-1 ring-emerald-500 rounded-xs"
          )}
        >
          {data.fullName || "Your Name"}
        </h1>
        <p
          onClick={(e) => onSelectField?.(e, "headline")}
          className={cn(
            "mt-2 text-[9px] font-bold uppercase tracking-[0.16em] cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
            selectedField === "headline" && "ring-1 ring-emerald-500 rounded-xs"
          )}
          style={{ color: accent }}
        >
          {data.headline || "Professional title"}
        </p>
      </header>

      <section className="relative mt-6 space-y-4 text-xs leading-relaxed text-[#2d342f]">
        <div className="flex items-baseline justify-between text-[11px] font-semibold text-[var(--brand-muted)]">
          <div>
            <p
              onClick={(e) => onSelectField?.(e, "recipient")}
              className={cn(
                "font-bold text-[#1e2320] cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
                selectedField === "recipient" && "ring-1 ring-emerald-500 rounded-xs"
              )}
            >
              {data.recipient || "Hiring team"}
            </p>
            <p
              onClick={(e) => onSelectField?.(e, "company")}
              className={cn(
                "cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
                selectedField === "company" && "ring-1 ring-emerald-500 rounded-xs"
              )}
            >
              {data.company || "Company name"}
            </p>
            <p
              onClick={(e) => onSelectField?.(e, "role")}
              className={cn(
                "cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
                selectedField === "role" && "ring-1 ring-emerald-500 rounded-xs"
              )}
            >
              {data.role || "Job title"}
            </p>
          </div>
          <p
            onClick={(e) => onSelectField?.(e, "date")}
            className={cn(
              "cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
              selectedField === "date" && "ring-1 ring-emerald-500 rounded-xs"
            )}
          >
            {data.date || "Date"}
          </p>
        </div>

        <div className="pt-2">
          <p
            onClick={(e) => onSelectField?.(e, "greeting")}
            className={cn(
              "font-bold cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
              selectedField === "greeting" && "ring-1 ring-emerald-500 rounded-xs"
            )}
          >
            {data.greeting || "Dear hiring team,"}
          </p>
        </div>

        <p
          onClick={(e) => onSelectField?.(e, "opening")}
          className={cn(
            "whitespace-pre-line cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
            selectedField === "opening" && "ring-1 ring-emerald-500 rounded-xs"
          )}
        >
          {data.opening ||
            "Explain why you are applying for this role and what makes this team compelling to you."}
        </p>

        <p
          onClick={(e) => onSelectField?.(e, "evidence")}
          className={cn(
            "whitespace-pre-line cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
            selectedField === "evidence" && "ring-1 ring-emerald-500 rounded-xs"
          )}
        >
          {data.evidence ||
            "Highlight your most relevant work, practical experience, or specific outcomes that match the role requirements."}
        </p>

        <p
          onClick={(e) => onSelectField?.(e, "closing")}
          className={cn(
            "whitespace-pre-line cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
            selectedField === "closing" && "ring-1 ring-emerald-500 rounded-xs"
          )}
        >
          {data.closing || "Close with a warm, confident next step."}
        </p>

        <div className="pt-4">
          <p
            onClick={(e) => onSelectField?.(e, "signoff")}
            className={cn(
              "font-semibold cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
              selectedField === "signoff" && "ring-1 ring-emerald-500 rounded-xs"
            )}
          >
            {data.signoff || "Sincerely,"}
          </p>
          <p
            onClick={(e) => onSelectField?.(e, "fullName")}
            className={cn(
              "mt-2 font-bold cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
              selectedField === "fullName" && "ring-1 ring-emerald-500 rounded-xs"
            )}
          >
            {data.fullName || "Your Name"}
          </p>
        </div>
      </section>

      <footer className="absolute inset-x-14 bottom-10 flex items-center justify-between border-t border-black/10 pt-4 text-[9px] text-[var(--brand-muted)]">
        <span>{contact || "Contact info will display here"}</span>
        <span className="uppercase tracking-[0.15em]">ResuLyra · Letter Studio</span>
      </footer>
    </article>
  );
}

export const CoverLetterPreview = LetterPreview;
