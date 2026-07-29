"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { CoverLetterData, CoverLetterTheme, ThemeOption } from "../types/cover-letter";

interface LetterFormPanelProps {
  data: CoverLetterData;
  theme: CoverLetterTheme;
  themes: ThemeOption[];
  update: (field: keyof CoverLetterData, value: string) => void;
  setData: React.Dispatch<React.SetStateAction<CoverLetterData>>;
  setTheme: (theme: CoverLetterTheme) => void;
  getStarterCopy: (data: CoverLetterData) => { opening: string; evidence: string; closing: string };
  splitPercent: number;
  isResizing: boolean;
}

export function LetterFormPanel({
  data,
  theme,
  themes,
  update,
  setData,
  setTheme,
  getStarterCopy,
  splitPercent,
  isResizing,
}: LetterFormPanelProps) {
  return (
    <section
      style={{ width: `${splitPercent}%` }}
      className={cn(
        "no-print h-full overflow-y-auto border-r border-black/10 bg-[#f8f7f2] scrollbar-thin shrink-0 min-w-[440px]",
        isResizing ? "transition-none" : "transition-[width] duration-150 ease-out"
      )}
    >
      <div className="mx-auto max-w-2xl p-5 sm:p-8 pb-20">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#bd593a]">
            Letter studio
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-[-0.04em]">
            Write for one specific role
          </h1>
          <p className="mt-2 text-xs leading-5 text-[var(--brand-muted)]">
            Start from your resume details, then make every sentence truthful and personal.
          </p>
        </div>

        <FormSection title="Application details">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Role"
              value={data.role}
              onChange={(value) => update("role", value)}
              placeholder="Product manager"
            />
            <Field
              label="Company"
              value={data.company}
              onChange={(value) => update("company", value)}
              placeholder="Northstar Labs"
            />
            <Field
              label="Recipient"
              value={data.recipient}
              onChange={(value) => update("recipient", value)}
              placeholder="Hiring team"
            />
            <Field
              label="Date"
              value={data.date}
              onChange={(value) => update("date", value)}
              placeholder="July 27, 2026"
            />
          </div>
        </FormSection>

        <FormSection title="Your details">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Full name"
              value={data.fullName}
              onChange={(value) => update("fullName", value)}
              placeholder="Your name"
            />
            <Field
              label="Professional title"
              value={data.headline}
              onChange={(value) => update("headline", value)}
              placeholder="Your specialty"
            />
            <Field
              label="Email"
              value={data.email}
              onChange={(value) => update("email", value)}
              placeholder="you@example.com"
            />
            <Field
              label="Phone"
              value={data.phone}
              onChange={(value) => update("phone", value)}
              placeholder="+1 555 0100"
            />
          </div>
        </FormSection>

        <FormSection title="Letter">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setData((current) => ({
                ...current,
                ...getStarterCopy(current),
              }))
            }
            className="mb-3 h-10 rounded-xl border-black/10 bg-white text-xs font-bold shadow-xs hover:bg-black/5"
          >
            <Sparkles className="size-4 text-[#537c45]" />
            Create editable starter
          </Button>
          <div className="space-y-3">
            <Field
              label="Greeting"
              value={data.greeting}
              onChange={(value) => update("greeting", value)}
            />
            <TextArea
              label="Opening"
              value={data.opening}
              onChange={(value) => update("opening", value)}
              placeholder="Why this role and company?"
            />
            <TextArea
              label="Evidence"
              value={data.evidence}
              onChange={(value) => update("evidence", value)}
              placeholder="What relevant work proves your fit?"
            />
            <TextArea
              label="Closing"
              value={data.closing}
              onChange={(value) => update("closing", value)}
              placeholder="Close with a clear, warm next step."
            />
          </div>
        </FormSection>

        <FormSection title="Design">
          <div className="grid grid-cols-3 gap-2">
            {themes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id)}
                className={cn(
                  "rounded-2xl border bg-white p-3 text-left transition shadow-xs hover:border-black/20",
                  theme === item.id
                    ? "border-[#537c45] ring-2 ring-[#8baa54]/20 bg-emerald-50/50"
                    : "border-black/10"
                )}
              >
                <span
                  className="mb-3 block h-2 w-8 rounded-full"
                  style={{ backgroundColor: item.accent }}
                />
                <span className="block text-xs font-bold">{item.name}</span>
                <span className="mt-1 hidden text-[9px] text-[var(--brand-muted)] sm:block">
                  {item.description}
                </span>
              </button>
            ))}
          </div>
        </FormSection>
      </div>
    </section>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7 border-t border-black/10 pt-6">
      <h2 className="mb-4 text-sm font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--brand-muted)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-sm outline-none transition focus:border-[#537c45] focus:ring-3 focus:ring-[#a8ca59]/20"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--brand-muted)]">
        {label}
      </span>
      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/10 bg-white p-3.5 text-sm outline-none transition focus:border-[#537c45] focus:ring-3 focus:ring-[#a8ca59]/20"
      />
    </label>
  );
}
