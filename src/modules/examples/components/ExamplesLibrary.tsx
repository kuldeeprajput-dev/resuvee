"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  Code2,
  GraduationCap,
  HeartHandshake,
  Megaphone,
  Palette,
  Search,
  Settings2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { ResumeTemplateId } from "@/modules/resume";

type ExampleCategory = "All" | "Business" | "Technology" | "Creative" | "Early career";

interface ResumeExample {
  role: string;
  category: Exclude<ExampleCategory, "All">;
  level: string;
  summary: string;
  skills: string[];
  proof: string;
  template: ResumeTemplateId;
  icon: typeof BriefcaseBusiness;
}

const categories: ExampleCategory[] = ["All", "Business", "Technology", "Creative", "Early career"];

const examples: ResumeExample[] = [
  {
    role: "Product Manager",
    category: "Business",
    level: "Mid–senior",
    summary:
      "Show how customer insight, prioritization, and cross-functional delivery produced measurable product outcomes.",
    skills: ["Product strategy", "Discovery", "Roadmaps"],
    proof: "Quantify adoption, conversion, retention, or delivery improvements.",
    template: "nova",
    icon: BriefcaseBusiness,
  },
  {
    role: "Operations Manager",
    category: "Business",
    level: "Mid–senior",
    summary:
      "Connect process ownership and people leadership to improvements in speed, cost, quality, or service.",
    skills: ["Operations", "Process design", "Leadership"],
    proof: "Use before-and-after measures for systems you improved.",
    template: "executive",
    icon: Settings2,
  },
  {
    role: "Sales Executive",
    category: "Business",
    level: "Experienced",
    summary:
      "Lead with territory performance, relationship building, and the commercial impact of deals you shaped.",
    skills: ["Pipeline", "Negotiation", "CRM"],
    proof: "Include quota attainment, revenue, deal size, and sales-cycle gains.",
    template: "classic",
    icon: BarChart3,
  },
  {
    role: "Software Engineer",
    category: "Technology",
    level: "All levels",
    summary:
      "Balance technical depth with clear evidence of reliability, scale, collaboration, and customer value.",
    skills: ["Architecture", "Testing", "Cloud"],
    proof: "Name the technical constraint, your action, and the observable result.",
    template: "terminal",
    icon: Code2,
  },
  {
    role: "Data Analyst",
    category: "Technology",
    level: "Early–mid",
    summary:
      "Explain how you turned imperfect data into decisions, not only which tools or queries you used.",
    skills: ["SQL", "Dashboards", "Statistics"],
    proof: "Show decisions influenced, time saved, or risk identified.",
    template: "minimal",
    icon: BarChart3,
  },
  {
    role: "UX Designer",
    category: "Creative",
    level: "Mid–senior",
    summary:
      "Connect research, interaction decisions, and collaboration to a stronger user or business outcome.",
    skills: ["User research", "Prototyping", "Systems"],
    proof: "Pair portfolio links with concise impact statements.",
    template: "studio",
    icon: Palette,
  },
  {
    role: "Content Strategist",
    category: "Creative",
    level: "All levels",
    summary:
      "Demonstrate editorial judgment, audience understanding, and the measurable reach of content systems.",
    skills: ["Content design", "SEO", "Research"],
    proof: "Use engagement, findability, conversion, or production measures.",
    template: "nova",
    icon: Megaphone,
  },
  {
    role: "Marketing Manager",
    category: "Creative",
    level: "Mid–senior",
    summary:
      "Frame campaigns as business experiments with audiences, channels, budgets, and measurable results.",
    skills: ["Campaigns", "Analytics", "Positioning"],
    proof: "Show pipeline, acquisition cost, conversion, or reach changes.",
    template: "studio",
    icon: Megaphone,
  },
  {
    role: "Customer Success Manager",
    category: "Business",
    level: "Mid–senior",
    summary:
      "Make retention, adoption, and trusted customer relationships the center of the story.",
    skills: ["Onboarding", "Retention", "Enablement"],
    proof: "Quantify portfolio size, renewal rate, expansion, or time to value.",
    template: "executive",
    icon: HeartHandshake,
  },
  {
    role: "Project Coordinator",
    category: "Early career",
    level: "Entry level",
    summary:
      "Show reliable execution through scheduling, communication, documentation, and issue resolution.",
    skills: ["Coordination", "Planning", "Reporting"],
    proof: "Count projects, stakeholders, deadlines, or hours saved.",
    template: "minimal",
    icon: Check,
  },
  {
    role: "Graduate Analyst",
    category: "Early career",
    level: "Graduate",
    summary:
      "Use coursework, internships, and projects to prove structured thinking and confident communication.",
    skills: ["Analysis", "Research", "Presentation"],
    proof: "Describe the question, method, and outcome for each project.",
    template: "classic",
    icon: GraduationCap,
  },
  {
    role: "Junior Developer",
    category: "Early career",
    level: "Entry level",
    summary:
      "Let practical projects prove your ability to build, debug, learn, and collaborate with version control.",
    skills: ["JavaScript", "APIs", "Git"],
    proof: "Link live work and explain the most difficult problem you solved.",
    template: "terminal",
    icon: Code2,
  },
];

export function ExamplesLibrary() {
  const [category, setCategory] = useState<ExampleCategory>("All");
  const [query, setQuery] = useState("");

  const visibleExamples = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return examples.filter((example) => {
      const categoryMatches = category === "All" || example.category === category;
      const queryMatches =
        !normalized ||
        [example.role, example.category, example.summary, ...example.skills]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return categoryMatches && queryMatches;
    });
  }, [category, query]);

  return (
    <>
      <section className="border-b border-black/[0.08]">
        <div className="paper-grid mx-auto max-w-[1440px] px-5 py-16 sm:px-8 md:py-24 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd593a]">
            Original guidance library
          </p>
          <h1 className="mt-4 max-w-5xl text-5xl font-bold leading-[0.95] tracking-[-0.065em] sm:text-7xl">
            Strong resumes start with the right evidence.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--brand-muted)] sm:text-lg">
            Explore role-specific direction written for Resulyra. Use the examples as prompts, then
            replace every idea with your own honest experience and results.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 border-b border-black/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition",
                  category === item
                    ? "bg-[var(--brand-ink)] text-white"
                    : "border border-black/10 bg-white/70 text-[var(--brand-muted)] hover:bg-white"
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="flex h-11 min-w-[300px] items-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 shadow-sm">
            <Search className="size-4 text-[var(--brand-muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search roles or skills"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleExamples.map((example) => (
            <article
              key={example.role}
              className="group flex flex-col rounded-3xl border border-black/[0.08] bg-white/65 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_45px_rgba(22,32,28,0.09)]"
            >
              <div className="flex items-start justify-between gap-5">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-[var(--brand-lime)]">
                  <example.icon className="size-5" />
                </span>
                <span className="rounded-full border border-black/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--brand-muted)]">
                  {example.level}
                </span>
              </div>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.15em] text-[#bd593a]">
                {example.category}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-[-0.04em]">{example.role}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{example.summary}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {example.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-[#eef0e9] px-2.5 py-1.5 text-[10px] font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-[#f4f5f0] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#4f7946]">
                  Evidence prompt
                </p>
                <p className="mt-1.5 text-xs leading-5 text-black/65">{example.proof}</p>
              </div>

              <Button
                asChild
                className="mt-6 h-11 rounded-xl bg-[var(--brand-ink)] font-bold text-white"
              >
                <Link href={`/builder?template=${example.template}`}>
                  Build this resume
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>

        {!visibleExamples.length && (
          <div className="mt-8 rounded-3xl border border-dashed border-black/15 py-16 text-center">
            <Search className="mx-auto size-6 text-black/25" />
            <p className="mt-3 text-sm font-bold">No matching role yet</p>
            <p className="mt-1 text-xs text-[var(--brand-muted)]">
              Try a broader search or choose another category.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
