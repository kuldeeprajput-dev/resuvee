"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import type { LetterData, LetterTheme, TypographyFont, PageSpacing } from "../types/letter";

interface LetterPreviewProps {
  data: LetterData;
  theme: LetterTheme;
  accent: string;
  font?: TypographyFont;
  pageSpacing?: PageSpacing;
  onSelectField?: (e: React.MouseEvent<HTMLElement>, field: keyof LetterData) => void;
  selectedField?: keyof LetterData | null;
  isHandTool?: boolean;
}

export function LetterPreview({
  data,
  theme,
  accent,
  font = "template",
  pageSpacing = "normal",
  onSelectField,
  selectedField,
  isHandTool = false,
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

  const getFieldClass = (field: keyof LetterData) =>
    cn(
      isHandTool
        ? "cursor-inherit"
        : "cursor-pointer rounded-xs transition hover:outline-dashed hover:outline-1 hover:outline-emerald-500",
      selectedField === field && !isHandTool && "ring-1 ring-emerald-500 rounded-xs"
    );

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
          className={cn("text-[29px] font-bold leading-none tracking-[-0.045em]", getFieldClass("fullName"))}
        >
          {data.fullName || "Your Name"}
        </h1>
        <p
          onClick={(e) => onSelectField?.(e, "headline")}
          className={cn("mt-2 text-[9px] font-bold uppercase tracking-[0.16em]", getFieldClass("headline"))}
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
              className={cn("font-bold text-[#1e2320]", getFieldClass("recipient"))}
            >
              {data.recipient || "Hiring team"}
            </p>
            <p
              onClick={(e) => onSelectField?.(e, "company")}
              className={getFieldClass("company")}
            >
              {data.company || "Company name"}
            </p>
            <p
              onClick={(e) => onSelectField?.(e, "role")}
              className={getFieldClass("role")}
            >
              {data.role || "Job title"}
            </p>
          </div>
          <p
            onClick={(e) => onSelectField?.(e, "date")}
            className={getFieldClass("date")}
          >
            {data.date || "Date"}
          </p>
        </div>

        <div className="pt-2">
          <p
            onClick={(e) => onSelectField?.(e, "greeting")}
            className={cn("font-bold", getFieldClass("greeting"))}
          >
            {data.greeting || "Dear hiring team,"}
          </p>
        </div>

        <p
          onClick={(e) => onSelectField?.(e, "opening")}
          className={cn("whitespace-pre-line", getFieldClass("opening"))}
        >
          {data.opening ||
            "Explain why you are applying for this role and what makes this team compelling to you."}
        </p>

        <p
          onClick={(e) => onSelectField?.(e, "evidence")}
          className={cn("whitespace-pre-line", getFieldClass("evidence"))}
        >
          {data.evidence ||
            "Highlight your most relevant work, practical experience, or specific outcomes that match the role requirements."}
        </p>

        <p
          onClick={(e) => onSelectField?.(e, "closing")}
          className={cn("whitespace-pre-line", getFieldClass("closing"))}
        >
          {data.closing || "Close with a warm, confident next step."}
        </p>

        <div className="pt-4">
          <p
            onClick={(e) => onSelectField?.(e, "signoff")}
            className={cn("font-semibold", getFieldClass("signoff"))}
          >
            {data.signoff || "Sincerely,"}
          </p>
          <p
            onClick={(e) => onSelectField?.(e, "fullName")}
            className={cn("mt-2 font-bold", getFieldClass("fullName"))}
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
