import Link from "next/link";
import {
  ArrowRight,
  Check,
  BriefcaseBusiness,
  Files,
  FileSearch,
  PenLine,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { HeroResumeStack, LandingTemplateShowcase } from "@/modules/landing";
import { resumeTemplates } from "@/modules/resume";

const productBenefits = [
  `${resumeTemplates.length} original templates across proven resume formats`,
  "Dedicated fresher layouts with no experience section",
  "Switch designs without losing any of your work",
];

const workspaceBenefits = [
  "Secure cloud & browser sync",
  "Reuse your story across every tool",
  "Export clean files when you are ready",
];

const productTools = [
  {
    number: "01",
    category: "Create",
    icon: PenLine,
    title: "Resume Builder",
    description:
      "Write section by section, check spelling and grammar with AI, tune the design, and export a clean PDF.",
    features: ["Guided editor", "18 original layouts"],
    href: "/builder",
    action: "Build a resume",
    accent: "bg-[var(--brand-lime)]",
    wash: "from-[#eff8d8] to-[#fffefa]",
  },
  {
    number: "02",
    category: "Review",
    icon: FileSearch,
    title: "ATS Analyzer",
    description:
      "Review an existing resume for structure, clarity, keyword coverage, and practical improvements.",
    features: ["ATS score", "Clear next steps"],
    href: "/analyzer",
    action: "Check a resume",
    accent: "bg-[var(--brand-blue)]",
    wash: "from-[#e7f2fb] to-[#fffefa]",
  },
  {
    number: "03",
    category: "Personalize",
    icon: Files,
    title: "Letter Studio",
    description:
      "Create a focused cover letter that reuses your local resume details and matches your visual direction.",
    features: ["Resume-aware", "Role focused"],
    href: "/cover-letter",
    action: "Write a letter",
    accent: "bg-[#ffd8ca]",
    wash: "from-[#fff0e9] to-[#fffefa]",
  },
  {
    number: "04",
    category: "Explore",
    icon: BriefcaseBusiness,
    title: "Template Gallery",
    description: "Explore curated white-page resume templates designed for every experience level.",
    features: ["White-page templates", "Live previews"],
    href: "/#templates",
    action: "View templates",
    accent: "bg-[#d8d1f5]",
    wash: "from-[#efecfb] to-[#fffefa]",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--brand-canvas)] text-[var(--brand-ink)]">
      <SiteHeader />

      <main>
        <section className="relative border-b border-black/[0.08]">
          <div className="absolute inset-0 paper-grid opacity-60" />
          <div className="relative mx-auto grid min-h-0 w-full max-w-[1440px] items-center gap-4 px-5 pb-6 pt-14 sm:gap-14 sm:px-8 sm:pb-20 sm:pt-20 lg:min-h-[690px] lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:pb-24 lg:pt-24">
            <div className="relative z-10 max-w-[650px]">
              <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--brand-muted)] shadow-sm sm:mb-7 sm:text-xs sm:tracking-[0.12em]">
                <Sparkles className="size-3.5 text-[#e36c43]" />
                <span className="truncate">
                  {resumeTemplates.length} original, white-page resume templates
                </span>
              </div>

              <h1 className="max-w-[11ch] text-balance text-[clamp(2.85rem,13vw,7.1rem)] font-bold leading-[0.9] tracking-[-0.07em] sm:max-w-none sm:text-[clamp(3.5rem,7.1vw,7.1rem)] sm:leading-[0.88] sm:tracking-[-0.075em]">
                Your story,
                <span className="relative ml-[0.08em] inline-block">
                  clearly told.
                  <svg
                    className="absolute -bottom-[0.02em] left-0 -z-10 w-full text-[var(--brand-lime)]"
                    viewBox="0 0 400 35"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 24C94 5 245 5 392 17"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="20"
                    />
                  </svg>
                </span>
              </h1>

              <p className="mt-6 max-w-[580px] text-base leading-7 text-[var(--brand-muted)] sm:mt-8 sm:text-xl sm:leading-8">
                Start with the format employers know, a focused fresher layout, or a role-specific
                design. Then write, check, customize, and export from one focused workspace.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                <Button
                  asChild
                  className="h-12 w-full rounded-full bg-[var(--brand-ink)] px-5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(22,32,28,0.18)] hover:bg-[#27332f] sm:h-13 sm:w-auto sm:px-6"
                >
                  <Link href="/builder">
                    Build my resume
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full rounded-full border-black/15 bg-white/65 px-5 text-sm font-bold hover:bg-white sm:h-13 sm:w-auto sm:px-6"
                >
                  <Link href="/analyzer">
                    <FileSearch className="size-4" />
                    Analyze existing resume
                  </Link>
                </Button>
              </div>

              <div className="mt-8 hidden space-y-2.5 sm:mt-9 sm:block">
                {productBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-2.5 text-sm font-medium leading-6 text-[var(--brand-muted)]"
                  >
                    <span className="flex size-5 items-center justify-center rounded-full bg-[var(--brand-lime)]">
                      <Check className="size-3 text-[var(--brand-ink)]" />
                    </span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <HeroResumeStack />
          </div>
        </section>

        <section className="hidden sm:block bg-[var(--brand-ink)] text-white">
          <div className="mx-auto grid w-full max-w-[1440px] divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
            {[
              [String(resumeTemplates.length), "curated templates"],
              ["3", "connected tools"],
              ["0", "design licensing worries"],
            ].map(([value, label]) => (
              <div key={label} className="flex items-baseline gap-3 py-7 sm:justify-center sm:py-8">
                <span className="text-4xl font-bold tracking-[-0.05em] text-[var(--brand-lime)]">
                  {value}
                </span>
                <span className="text-sm font-medium text-white/60">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          id="templates"
          className="mx-auto w-full max-w-[1440px] px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-16 md:pb-10 md:pt-24 lg:px-12"
        >
          <div className="mb-6 flex flex-col gap-6 sm:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#c65b38]">
                Live template library
              </p>
              <h2 className="max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                Start with a format people already understand.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-[var(--brand-muted)]">
              Every card is rendered from the same layout and starter content used by the builder,
              so the template you choose is the document you edit. Each design is original to
              Resulyra.
            </p>
          </div>

          <LandingTemplateShowcase />
        </section>

        <section
          id="toolkit"
          className="relative overflow-hidden bg-[var(--brand-canvas)]"
        >
          <div className="paper-grid pointer-events-none absolute inset-0 opacity-35" />
          <div className="pointer-events-none absolute -right-32 -top-40 size-[420px] rounded-full bg-[var(--brand-lime)]/15 blur-3xl" />

          <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-12 pt-4 sm:px-8 sm:pb-16 sm:pt-6 md:pb-16 md:pt-8 lg:px-12">
            <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr] xl:items-stretch xl:gap-12">
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c65b38]">
                    The Resulyra toolkit
                  </p>
                  <h2 className="mt-4 max-w-xl text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                    One workspace for the whole job search.
                  </h2>
                  <p className="mt-5 max-w-lg text-base leading-7 text-[var(--brand-muted)]">
                    Build your story, check how it reads, tailor every application, and keep the
                    follow-up moving—all without leaving your private workspace.
                  </p>
                </div>

                <div className="mt-8 rounded-[24px] border border-black/10 bg-white/55 p-5 shadow-[0_18px_50px_rgba(22,32,28,0.06)] backdrop-blur-sm sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold">Your work stays yours</p>
                    <span className="rounded-full bg-[#e7f3db] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#46613c]">
                      Cloud Sync
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {workspaceBenefits.map((benefit) => (
                      <div
                        key={benefit}
                        className="flex items-center gap-3 rounded-xl border border-black/[0.07] bg-white/70 px-3 py-2.5"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-lime)]">
                          <Check className="size-3" strokeWidth={2.5} />
                        </span>
                        <span className="text-xs font-bold">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[var(--brand-muted)]">
                    No scattered documents or repeated setup while you move from writing to
                    applying.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-4">
                {productTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/10 bg-[var(--brand-paper)] p-3 shadow-[0_18px_55px_rgba(22,32,28,0.04)] transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_24px_70px_rgba(22,32,28,0.11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63864d] sm:rounded-[26px] sm:p-6"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tool.wash} opacity-0 transition duration-300 group-hover:opacity-100`}
                    />
                    <div className="relative flex items-start justify-between">
                      <span
                        className={`flex size-8 items-center justify-center rounded-lg sm:size-11 sm:rounded-2xl ${tool.accent} shadow-sm transition duration-300 group-hover:scale-105 group-hover:-rotate-3`}
                      >
                        <tool.icon className="size-4 sm:size-5" strokeWidth={1.9} />
                      </span>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="font-mono text-[9px] font-bold tracking-[0.14em] text-black/35 sm:text-[10px]">
                          {tool.number}
                        </span>
                        <ArrowRight className="size-3.5 -rotate-45 text-black/25 transition duration-300 group-hover:rotate-0 group-hover:text-black/70 sm:size-4" />
                      </div>
                    </div>

                    <div className="relative mt-2 sm:mt-5">
                      <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-[#6a725f] sm:text-[10px] sm:tracking-[0.16em]">
                        {tool.category}
                      </p>
                      <h3 className="mt-0.5 text-sm font-bold tracking-[-0.03em] sm:mt-1.5 sm:text-xl sm:tracking-[-0.035em]">
                        {tool.title}
                      </h3>
                      <p className="mt-1 hidden text-xs leading-5 text-[var(--brand-muted)] sm:mt-2 sm:block sm:text-sm sm:leading-6">
                        {tool.description}
                      </p>
                    </div>

                    <div className="relative mt-3 hidden flex-wrap gap-1.5 sm:flex sm:mt-4">
                      {tool.features.map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full border border-black/[0.07] bg-white/70 px-2.5 py-0.5 text-[10px] font-bold text-[#59615a]"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="relative mt-auto flex items-center gap-1 pt-2 text-[10.5px] font-bold text-[#3f6438] sm:gap-2 sm:pt-4 sm:text-xs">
                      <span>{tool.action}</span>
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-1 sm:size-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>


          </div>
        </section>



        <section className="bg-[var(--brand-canvas)] pb-6 pt-2 sm:pb-16 sm:pt-6">
          <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[var(--brand-orange)] p-6 shadow-[0_24px_70px_-15px_rgba(217,93,48,0.3)] sm:rounded-[32px] sm:p-12 lg:p-14">
              <div className="pointer-events-none absolute -right-16 -top-28 size-72 rounded-full border-[42px] border-white/20" />
              <div className="pointer-events-none absolute -bottom-24 right-[30%] size-56 rounded-full bg-[var(--brand-lime)]/35 blur-3xl" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200/35 via-transparent to-transparent opacity-80" />

              <div className="relative z-10 flex flex-col gap-5 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-black/80 backdrop-blur-md sm:mb-4 sm:px-3.5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.16em]">
                    <Sparkles className="size-3 text-[#3a2016] sm:size-3.5" />
                    <span>Your next application starts here</span>
                  </div>
                  <h2 className="text-2xl font-bold leading-[1.05] tracking-[-0.04em] text-[#1c1917] sm:text-5xl lg:text-[56px]">
                    Make the resume you wish you already had.
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-2.5">
                    {["Free to start", "Cloud & Local Sync", "Clean PDF export"].map((benefit) => (
                      <span
                        key={benefit}
                        className="rounded-full border border-white/40 bg-white/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-[#2c1d18] shadow-sm backdrop-blur-md transition-colors hover:bg-white/45 sm:px-3.5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.08em]"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  asChild
                  className="group h-11 w-full shrink-0 rounded-full bg-[var(--brand-ink)] px-6 text-xs font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.03] hover:bg-[#18231f] sm:h-13 sm:w-fit sm:px-7 sm:text-sm"
                >
                  <Link href="/builder">
                    Start building
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
