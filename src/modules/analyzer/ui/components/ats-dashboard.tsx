"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  ChevronRight,
  Gauge,
  Layers3,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { CircularProgress } from "@/shared/components/ui/circular-progress";
import type { ResumeAnalysis } from "../../types";

interface ATSDashboardProps {
  analysis: ResumeAnalysis;
}

const toneFor = (score: number) =>
  score >= 80
    ? {
        label: "Strong",
        ring: "text-[#167b70]",
        bg: "bg-[#dff1e9]",
        text: "text-[#0d655b]",
        fill: "bg-[#167b70]",
      }
    : score >= 60
      ? {
          label: "On track",
          ring: "text-[#aa7d2e]",
          bg: "bg-[#f7edcf]",
          text: "text-[#76551f]",
          fill: "bg-[#c39a4c]",
        }
      : {
          label: "Needs work",
          ring: "text-[#b14d4d]",
          bg: "bg-[#fae4df]",
          text: "text-[#8a3030]",
          fill: "bg-[#c45b5b]",
        };

const list = (items: string[] | undefined, fallback: string, limit = 5) => {
  const values = items?.filter(Boolean).slice(0, limit) ?? [];
  return values.length ? values : [fallback];
};

const safeScore = (value: unknown, fallback = 0) => {
  const score = typeof value === "number" ? value : Number(value);
  return Number.isFinite(score) ? Math.min(100, Math.max(0, Math.round(score))) : fallback;
};

function Metric({ label, value, detail }: { label: string; value: number; detail: string }) {
  const normalizedValue = safeScore(value);
  const tone = toneFor(normalizedValue);
  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white/75 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brand-muted)]">
          {label}
        </p>
        <span className={`text-sm font-bold ${tone.text}`}>{normalizedValue}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
        <div
          className={`h-full rounded-full ${tone.fill}`}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
      <p className="mt-2 truncate text-[10px] text-[var(--brand-muted)]">{detail}</p>
    </div>
  );
}

function Insight({
  title,
  items,
  positive = false,
}: {
  title: string;
  items: string[];
  positive?: boolean;
}) {
  const values = list(
    items,
    positive ? "No strengths detected yet." : "No priority gaps detected."
  );
  return (
    <section className="rounded-3xl border border-black/[0.08] bg-white/80 p-5 shadow-[0_12px_35px_rgba(22,32,28,0.04)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex size-8 items-center justify-center rounded-xl ${positive ? "bg-[#dff1e9] text-[#0d655b]" : "bg-[#fae4df] text-[#8a3030]"}`}
          >
            {positive ? <Check className="size-4" /> : <XCircle className="size-4" />}
          </span>
          <h3 className="text-sm font-bold text-[var(--brand-ink)]">{title}</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brand-muted)]">
          {values.length} items
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {values.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="flex items-start gap-3 border-t border-black/[0.07] pt-3 text-sm leading-6 text-[var(--brand-muted)]"
          >
            <span
              className={`mt-2 size-1.5 shrink-0 rounded-full ${positive ? "bg-[#167b70]" : "bg-[#c45b5b]"}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Keywords({
  title,
  items,
  missing = false,
}: {
  title: string;
  items: string[];
  missing?: boolean;
}) {
  const values = items.filter(Boolean).slice(0, 18);
  return (
    <section className="rounded-3xl border border-black/[0.08] bg-white/80 p-5 shadow-[0_12px_35px_rgba(22,32,28,0.04)] sm:p-6">
      <div className="flex items-center gap-2.5">
        <span
          className={`flex size-8 items-center justify-center rounded-xl ${missing ? "bg-[#f7edcf] text-[#76551f]" : "bg-[#dff1e9] text-[#0d655b]"}`}
        >
          {missing ? <Target className="size-4" /> : <Layers3 className="size-4" />}
        </span>
        <div>
          <h3 className="text-sm font-bold text-[var(--brand-ink)]">{title}</h3>
          <p className="text-[11px] text-[var(--brand-muted)]">
            {values.length ? "Detected from the report" : "Nothing returned"}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {values.length ? (
          values.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${missing ? "border-[#e4ce93] bg-[#fff9e9] text-[#76551f]" : "border-[#b9d9cb] bg-[#f0f9f4] text-[#0d655b]"}`}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-[var(--brand-muted)]">No keywords to show.</span>
        )}
      </div>
    </section>
  );
}

export function ATSDashboard({ analysis }: ATSDashboardProps) {
  const score = safeScore(analysis.score);
  const tone = toneFor(score);
  const parser = analysis.atsCompatibility;
  const found = analysis.skillsFound?.length ? analysis.skillsFound : analysis.techStack;
  const missing = analysis.skillsMissing?.length
    ? analysis.skillsMissing
    : analysis.missingKeywords;
  const metrics = [
    {
      label: "Formatting",
      value: safeScore(parser?.formattingScore, score),
      detail: "Layout and file hygiene",
    },
    {
      label: "Parseability",
      value: safeScore(parser?.parseabilityScore, score),
      detail: "Readable by ATS",
    },
    {
      label: "Keywords",
      value: safeScore(parser?.keywordMatchScore, Math.max(0, score - 4)),
      detail: "Role language coverage",
    },
    {
      label: "Evidence",
      value: safeScore(((analysis.strengths?.length ?? 0) / 3) * 100),
      detail: "Impact and structure",
    },
  ];
  const notes = [...(analysis.scoreBreakdown?.capsApplied ?? []), ...(parser?.issues ?? [])]
    .filter(Boolean)
    .slice(0, 8);

  return (
    <div className="w-full space-y-4">
      <section className="rounded-3xl border border-black/[0.08] bg-white/85 p-5 shadow-[0_18px_55px_rgba(22,32,28,0.07)] sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span
              className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${tone.bg} ${tone.text}`}
            >
              <Gauge className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#557264]">
                Resume health report
              </p>
              <h2 className="mt-1 truncate text-2xl font-bold tracking-[-0.04em] text-[var(--brand-ink)] sm:text-3xl">
                {analysis.role || "Resume review"}
              </h2>
              <p className="mt-1 text-sm text-[var(--brand-muted)]">
                {analysis.level || "General applicant"} - {tone.label} foundation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-black/[0.08] bg-[var(--brand-canvas)]/70 px-4 py-3">
            <CircularProgress
              value={score}
              size={82}
              strokeWidth={8}
              progressColor={tone.ring}
              label={tone.label}
            />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brand-muted)]">
                Overall score
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--brand-ink)]">
                {score}
                <span className="text-sm text-[var(--brand-muted)]">/100</span>
              </p>
              <p className={`text-xs font-semibold ${tone.text}`}>
                {score >= 75 ? "Ready to refine" : "Fix the next items first"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Metric key={metric.label} {...metric} />
          ))}
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="rounded-2xl border border-[#bed8ca] bg-[#f0f8f3] px-4 py-3">
            <p className="text-xs font-bold text-[#0d655b]">What to do next</p>
            <p className="mt-1 text-sm leading-6 text-[#285348]">
              {analysis.summary ||
                analysis.advice ||
                "Use the prioritized fixes below, then run the report again."}
            </p>
          </div>
          <Link
            href="/builder"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--brand-ink)] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#27332f]"
          >
            Build improved resume <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
        <Insight title="Strengths" items={analysis.strengths} positive />
        <section className="rounded-3xl border border-black/[0.08] bg-[#f8f4e8]/85 p-5 shadow-[0_12px_35px_rgba(22,32,28,0.04)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-xl bg-[#f7edcf] text-[#76551f]">
                <Sparkles className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[var(--brand-ink)]">Role snapshot</h3>
                <p className="text-[11px] text-[var(--brand-muted)]">Detected profile and tools</p>
              </div>
            </div>
            <Gauge className="size-4 text-[#aa7d2e]" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-black/[0.07] bg-white/75 p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--brand-muted)]">
                Level
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--brand-ink)]">
                {analysis.level || "Not clear"}
              </p>
            </div>
            <div className="rounded-2xl border border-black/[0.07] bg-white/75 p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--brand-muted)]">
                Tools
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--brand-ink)]">{found.length}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {found.slice(0, 12).map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-full bg-white px-2.5 py-1.5 text-xs font-semibold text-[#315b46] ring-1 ring-[#b9d9cb]"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Insight title="Priority gaps" items={analysis.weaknesses} />
        <section className="rounded-3xl border border-black/[0.08] bg-white/80 p-5 shadow-[0_12px_35px_rgba(22,32,28,0.04)] sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-[#e8eff8] text-[#3c6287]">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[var(--brand-ink)]">Edit plan</h3>
              <p className="text-[11px] text-[var(--brand-muted)]">
                Start with the highest-impact changes
              </p>
            </div>
          </div>
          <ol className="mt-5 space-y-3">
            {list(
              analysis.suggestions,
              "Add measurable outcomes to the strongest experience bullets."
            ).map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex items-start gap-3 border-t border-black/[0.07] pt-3"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-ink)] text-[10px] font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-sm leading-6 text-[var(--brand-muted)]">{item}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Keywords title="Keywords to add" items={missing} missing />
        <Keywords title="Skills detected" items={found} />
      </div>

      {notes.length > 0 && (
        <details className="rounded-3xl border border-black/[0.08] bg-white/75 p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-[var(--brand-ink)] [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              <AlertCircle className="size-4 text-[#aa7d2e]" /> Score notes and parser checks
            </span>
            <ChevronRight className="size-4" />
          </summary>
          <div className="mt-4 grid gap-2 text-sm text-[var(--brand-muted)] sm:grid-cols-2">
            {notes.map((note, index) => (
              <p key={`${note}-${index}`} className="rounded-xl bg-[var(--brand-canvas)] px-3 py-2">
                {note}
              </p>
            ))}
          </div>
        </details>
      )}

      <section className="rounded-3xl border border-[#bed8ca] bg-[#eaf5ef] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-ink)] text-[var(--brand-lime)]">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-[var(--brand-ink)]">Career guidance</p>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[#285348]">
              {analysis.advice ||
                "Keep the role title, evidence, and keywords aligned to the work you want next."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
