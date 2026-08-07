"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  ChevronRight,
  FileCheck2,
  Gauge,
  Layers3,
  PenLine,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { CircularProgress } from "@/shared/components/ui/circular-progress";
import type { AnalysisCategoryScore, ResumeAnalysis } from "../../types";

interface ATSDashboardProps {
  analysis: ResumeAnalysis;
  fileName?: string;
  onReset: () => void;
}

type ScoreTone = {
  label: string;
  text: string;
  soft: string;
  bar: string;
  ring: string;
};

function scoreValue(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(100, Math.max(0, Math.round(number))) : fallback;
}

function scoreTone(score: number): ScoreTone {
  if (score >= 90) {
    return {
      label: "Excellent",
      text: "text-[#0b6d61]",
      soft: "bg-[#dff2e9]",
      bar: "bg-[#128274]",
      ring: "text-[#128274]",
    };
  }
  if (score >= 75) {
    return {
      label: "Strong",
      text: "text-[#346348]",
      soft: "bg-[#e9f1e5]",
      bar: "bg-[#5e8a67]",
      ring: "text-[#5e8a67]",
    };
  }
  if (score >= 60) {
    return {
      label: "Developing",
      text: "text-[#875f16]",
      soft: "bg-[#faedc8]",
      bar: "bg-[#c28a2c]",
      ring: "text-[#c28a2c]",
    };
  }
  return {
    label: "Needs work",
    text: "text-[#9b403e]",
    soft: "bg-[#fae3df]",
    bar: "bg-[#c85f5b]",
    ring: "text-[#c85f5b]",
  };
}

function stringList(value: unknown, limit: number, fallback: string[] = []) {
  const values = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
  return (values.length ? values : fallback).slice(0, limit);
}

function categoryId(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function CategoryRow({ category }: { category: AnalysisCategoryScore }) {
  const score = scoreValue(category.score);
  const tone = scoreTone(score);
  return (
    <a
      href={`#${categoryId(category.name)}`}
      className="group block rounded-xl border border-[#c6d8cd] bg-white/60 p-2.5 transition hover:border-[#9fbead] hover:bg-white sm:rounded-2xl sm:p-3"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold text-[#28483d] sm:text-xs">{category.name}</span>
        <span className="text-xs font-bold text-[#173229] sm:text-sm">{score}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#ccd9d1]">
        <div className="h-full rounded-full bg-[#75aa82]" style={{ width: `${score}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#60766b] sm:text-[10px]">
        <span>{tone.label}</span>
        <ChevronRight className="size-3.5 transition group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}

function CategoryCard({ category }: { category: AnalysisCategoryScore }) {
  const score = scoreValue(category.score);
  const tone = scoreTone(score);
  const descriptions: Record<string, string> = {
    "Content & impact": "Evidence, quantified outcomes, action-led bullets, and experience depth.",
    "Section structure": "Contact details and standard sections an ATS can classify reliably.",
    "ATS essentials":
      "Readable text, dates, headings, links, and recruiter-ready document signals.",
    "Writing quality": "Brevity, bullet length, action language, filler, and repetition.",
  };

  return (
    <article
      id={categoryId(category.name)}
      className="scroll-mt-24 rounded-[18px] border border-black/8 bg-white p-3.5 sm:rounded-[22px] sm:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-(--brand-muted)">
            {category.name}
          </p>
          <p className="mt-1.5 text-[11px] leading-4 text-(--brand-muted) sm:mt-2 sm:text-xs sm:leading-5">
            {descriptions[category.name] ?? "Resume quality signals detected in this document."}
          </p>
        </div>
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold sm:size-11 sm:rounded-2xl sm:text-sm ${tone.soft} ${tone.text}`}
        >
          {score}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/6.5 sm:mt-4 sm:h-2">
        <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${score}%` }} />
      </div>
      <p className={`mt-2 text-[11px] font-bold ${tone.text}`}>{tone.label}</p>
    </article>
  );
}

function FindingList({
  title,
  subtitle,
  items,
  positive,
}: {
  title: string;
  subtitle: string;
  items: string[];
  positive?: boolean;
}) {
  const values = stringList(items, positive ? 4 : 5, [
    positive ? "No confirmed strength was returned." : "No critical issue was detected.",
  ]);

  return (
    <section className="rounded-[20px] border border-black/8 bg-white p-4 sm:rounded-[24px] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
              positive ? "bg-[#dff2e9] text-[#0b6d61]" : "bg-[#fae3df] text-[#9b403e]"
            }`}
          >
            {positive ? <Check className="size-4" /> : <XCircle className="size-4" />}
          </span>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-(--brand-ink) sm:text-base">
              {title}
            </h3>
            <p className="mt-0.5 text-[11px] text-(--brand-muted) sm:text-xs">{subtitle}</p>
          </div>
        </div>
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-(--brand-muted) sm:text-[10px]">
          {values.length} checks
        </span>
      </div>
      <ul className="mt-4 divide-y divide-black/[0.07] sm:mt-5">
        {values.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span
              className={`mt-2 size-1.5 shrink-0 rounded-full ${positive ? "bg-[#128274]" : "bg-[#c85f5b]"}`}
            />
            <p className="text-xs leading-5 text-(--brand-muted) sm:text-sm sm:leading-6">{item}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TagPanel({
  title,
  subtitle,
  items,
  warning,
}: {
  title: string;
  subtitle: string;
  items: string[];
  warning?: boolean;
}) {
  const values = stringList(items, 12);
  return (
    <section className="rounded-[20px] border border-black/8 bg-white p-4 sm:rounded-[24px] sm:p-6">
      <div className="flex items-start gap-3">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
            warning ? "bg-[#faedc8] text-[#875f16]" : "bg-[#dff2e9] text-[#0b6d61]"
          }`}
        >
          {warning ? <Target className="size-4" /> : <Layers3 className="size-4" />}
        </span>
        <div>
          <h3 className="text-sm font-bold tracking-tight text-(--brand-ink) sm:text-base">
            {title}
          </h3>
          <p className="mt-0.5 text-[11px] text-(--brand-muted) sm:text-xs">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
        {values.length ? (
          values.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs ${
                warning
                  ? "border-[#e5cb88] bg-[#fff9e8] text-[#7b581c]"
                  : "border-[#b9d9cb] bg-[#f0f9f4] text-[#0b655a]"
              }`}
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-(--brand-muted)">Nothing was confidently detected.</p>
        )}
      </div>
    </section>
  );
}

export function ATSDashboard({ analysis, fileName, onReset }: ATSDashboardProps) {
  const score = scoreValue(analysis.score);
  const tone = scoreTone(score);
  const parser = analysis.atsCompatibility;
  const categories: AnalysisCategoryScore[] = analysis.categoryScores?.length
    ? analysis.categoryScores
    : [
        {
          name: "Content & impact",
          score,
          weight: 65,
          status: score >= 90 ? "excellent" : score >= 75 ? "good" : "needs-work",
          feedback: [],
        },
        {
          name: "Section structure",
          score: scoreValue(parser?.formattingScore, score),
          weight: 10,
          status: "good",
          feedback: [],
        },
        {
          name: "ATS essentials",
          score: scoreValue(parser?.parseabilityScore, score),
          weight: 10,
          status: "good",
          feedback: [],
        },
        {
          name: "Writing quality",
          score,
          weight: 7.5,
          status: "good",
          feedback: [],
        },
      ];
  const skills = stringList(
    analysis.skillsFound?.length ? analysis.skillsFound : analysis.techStack,
    12
  );
  const missing = stringList(
    analysis.skillsMissing?.length ? analysis.skillsMissing : analysis.missingKeywords,
    10
  );
  const issues = stringList(analysis.weaknesses, 5);
  const parserIssues = stringList(parser?.issues, 5);
  const focusCount = new Set([...issues, ...parserIssues]).size;
  const suggestions = stringList(analysis.suggestions, 4, [
    "Strengthen the highest-priority finding with a specific action and measurable result.",
  ]);

  return (
    <section className="w-full overflow-hidden rounded-[20px] border border-black/9 bg-[#f6f4ed] shadow-[0_24px_80px_rgba(21,30,26,0.10)] sm:rounded-[30px]">
      <header className="flex flex-col gap-3 border-b border-black/8 bg-white px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#e5f2eb] text-[#0b6d61] sm:size-11 sm:rounded-2xl">
            <FileCheck2 className="size-4 sm:size-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base font-bold tracking-[-0.03em] text-(--brand-ink) sm:text-lg">
                Resume review complete
              </h1>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${tone.soft} ${tone.text}`}
              >
                {tone.label}
              </span>
            </div>
            <p className="mt-0.5 max-w-[72vw] truncate text-[11px] text-(--brand-muted) sm:max-w-[60vw] sm:text-xs">
              {fileName || "Uploaded resume"} · Calibrated quality report
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-black/10 bg-white px-3 text-[11px] font-bold text-(--brand-ink) transition hover:bg-[#f4f4ef] cursor-pointer sm:h-10 sm:gap-2 sm:px-4 sm:text-xs"
          >
            <RotateCcw className="size-4" /> Analyze another
          </button>
          <Link
            href="/builder"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-(--brand-ink) px-3.5 text-[11px] font-bold text-white shadow-xs transition hover:bg-[#27332f] cursor-pointer sm:h-10 sm:gap-2 sm:px-5 sm:text-xs"
          >
            <PenLine className="size-4 text-white" /> Improve resume
          </Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-[275px_minmax(0,1fr)]">
        <aside className="border-b border-[#c5d6cb] bg-[#e2ece5] p-4 text-(--brand-ink) sm:p-6 lg:min-h-[760px] lg:border-r lg:border-b-0">
          <div className="flex items-center gap-5 lg:block">
            <CircularProgress
              value={score}
              size={124}
              strokeWidth={10}
              progressColor="text-[#5c9a72]"
              label={tone.label}
              className="-m-2 shrink-0 scale-[0.84] [&_span]:text-(--brand-ink) [&_span:last-child]:text-[#60766b] sm:m-0 sm:scale-100"
            />
            <div className="min-w-0 lg:mt-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#60766b] sm:text-[10px]">
                Resume quality score
              </p>
              <p className="mt-1 text-3xl font-bold tracking-[-0.06em] sm:text-4xl">
                {score}
                <span className="text-base font-semibold text-[#718279] sm:text-lg">/100</span>
              </p>
              <p className="mt-1.5 text-[11px] leading-4 text-[#546b60] sm:mt-2 sm:text-xs sm:leading-5">
                Based on document evidence and recruiter-facing quality—not hiring odds.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#c2d3c8] bg-white/55 p-3 sm:mt-6 sm:rounded-2xl sm:p-3.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold text-[#385448] sm:text-xs">
                Focus areas
              </span>
              <span className="flex size-7 items-center justify-center rounded-full bg-[#f5c46b] text-xs font-bold text-[#2f2614]">
                {focusCount}
              </span>
            </div>
            <p className="mt-1.5 text-[10px] leading-4 text-[#60766b] sm:mt-2 sm:text-[11px] sm:leading-5">
              Fix the highest-impact items first, then run a fresh scan.
            </p>
          </div>

          <nav
            className="mt-4 grid gap-1.5 sm:mt-6 sm:grid-cols-2 sm:gap-2 lg:grid-cols-1"
            aria-label="Report categories"
          >
            {categories.map((category) => (
              <CategoryRow key={category.name} category={category} />
            ))}
          </nav>

          <div className="mt-4 border-t border-[#c2d3c8] pt-4 text-[10px] leading-4 text-[#60766b] sm:mt-6 sm:pt-5 sm:text-[11px] sm:leading-5">
            Role-language coverage is inferred because no job description was supplied. It is not a
            job-match score.
          </div>
        </aside>

        <main className="min-w-0 p-3 sm:p-6 lg:p-8">
          <section className="rounded-[20px] border border-black/8 bg-white p-4 sm:rounded-[26px] sm:p-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#557264]">
                  <Gauge className="size-4" /> Detected direction
                </div>
                <h2 className="mt-2 wrap-break-word text-xl font-bold tracking-[-0.045em] text-(--brand-ink) sm:text-3xl">
                  {analysis.role || "General applicant"}
                </h2>
                <p className="mt-1 text-xs font-semibold text-(--brand-muted) sm:text-sm">
                  {analysis.level || "Level not confidently detected"}
                </p>
                <p className="mt-3 max-w-3xl text-xs leading-5 text-(--brand-muted) sm:mt-5 sm:text-sm sm:leading-6">
                  {analysis.summary ||
                    "This review measures document structure, measurable evidence, writing quality, and inferred role language."}
                </p>
              </div>
              <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 xl:w-[360px]">
                <div className="rounded-xl bg-[#eef6f1] p-3 sm:rounded-2xl sm:p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#557264]">
                    ATS read
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#0b6d61] sm:text-xl">
                    {scoreValue(parser?.parseabilityScore, score)}%
                  </p>
                </div>
                <div className="rounded-xl bg-[#fbf4df] p-3 sm:rounded-2xl sm:p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#76551f]">
                    Role terms
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#875f16] sm:text-xl">
                    {scoreValue(parser?.keywordMatchScore, score)}%
                  </p>
                </div>
                <div className="col-span-2 rounded-xl bg-[#f1f2ed] p-3 sm:col-span-1 sm:rounded-2xl sm:p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-(--brand-muted)">
                    Skills
                  </p>
                  <p className="mt-1 text-lg font-bold text-(--brand-ink) sm:text-xl">
                    {skills.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#557264]">
                  Score breakdown
                </p>
                <h2 className="mt-1 text-lg font-bold tracking-[-0.035em] text-(--brand-ink) sm:text-xl">
                  Why this score
                </h2>
              </div>
              <p className="hidden text-xs text-(--brand-muted) sm:block">
                Deterministic checks · repeatable results
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <CategoryCard key={category.name} category={category} />
              ))}
            </div>
          </section>

          <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 xl:grid-cols-2">
            <FindingList
              title="What is working"
              subtitle="Evidence worth keeping"
              items={analysis.strengths}
              positive
            />
            <FindingList
              title="Fix these first"
              subtitle="Concrete issues lowering the score"
              items={analysis.weaknesses}
            />
          </div>

          <section className="mt-4 rounded-[20px] border border-black/8 bg-[#eef5f0] p-4 sm:mt-5 sm:rounded-[26px] sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#d5e9dc] text-[#176453] sm:size-9 sm:rounded-xl">
                <Sparkles className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-(--brand-ink) sm:text-base">
                  Priority edit plan
                </h3>
                <p className="mt-0.5 text-[11px] text-(--brand-muted) sm:text-xs">
                  Apply these in order, then analyze the revised file.
                </p>
              </div>
            </div>
            <ol className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3 lg:grid-cols-2">
              {suggestions.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-start gap-2.5 rounded-xl border border-[#c8dacf] bg-white/80 p-3 sm:gap-3 sm:rounded-2xl sm:p-4"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#d5e9dc] text-[11px] font-bold text-[#155e52] sm:size-7 sm:text-xs">
                    {index + 1}
                  </span>
                  <p className="text-xs leading-5 text-(--brand-muted) sm:text-sm sm:leading-6">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 xl:grid-cols-2">
            <TagPanel
              title="Skills detected"
              subtitle="Present in the uploaded resume"
              items={skills}
            />
            <TagPanel
              title="Terms to consider"
              subtitle="Only add these when they are true"
              items={missing}
              warning
            />
          </div>

          {(parserIssues.length > 0 || analysis.scoreBreakdown?.capsApplied?.length) && (
            <details className="group mt-4 rounded-[18px] border border-black/8 bg-white p-3.5 sm:mt-5 sm:rounded-[22px] sm:p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2 text-xs font-bold text-(--brand-ink) sm:text-sm">
                  <AlertCircle className="size-4 text-[#c28a2c]" /> Parser notes and score limits
                </span>
                <ChevronRight className="size-4 transition group-open:rotate-90" />
              </summary>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {stringList(
                  [...(analysis.scoreBreakdown?.capsApplied ?? []), ...parserIssues],
                  8
                ).map((item, index) => (
                  <p
                    key={`${item}-${index}`}
                    className="rounded-xl bg-[#f6f4ed] px-3 py-2.5 text-xs leading-5 text-(--brand-muted)"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </details>
          )}

          <div className="mt-4 flex flex-col gap-3 rounded-[20px] border border-[#bdd2c4] bg-[#dfebe3] p-4 text-(--brand-ink) sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:rounded-[24px] sm:p-6">
            <div>
              <p className="text-sm font-bold">Turn the report into a stronger resume</p>
              <p className="mt-1 max-w-2xl text-[11px] leading-4 text-[#536a5f] sm:text-xs sm:leading-5">
                {analysis.advice ||
                  "Apply the priority fixes without adding claims you cannot support."}
              </p>
            </div>
            <Link
              href="/builder"
              className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-[#b5cabe] bg-white px-4 text-xs font-bold text-(--brand-ink) transition hover:-translate-y-0.5 hover:bg-[#f7fbf8] sm:h-11 sm:px-5 sm:text-sm"
            >
              Open builder <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </main>
      </div>
    </section>
  );
}
