import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  BriefcaseBusiness,
  Files,
  FileSearch,
  LayoutTemplate,
  PenLine,
  ScanSearch,
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
  "Drafts save in your browser",
  "Reuse your story across every tool",
  "Export clean files when you are ready",
];

const workflow = [
  {
    number: "01",
    label: "Format",
    icon: LayoutTemplate,
    title: "Choose your direction",
    description: "Pick from curated formats made for different careers and experience levels.",
    outcome: "A structure matched to your goals",
    accent: "bg-[var(--brand-lime)]",
  },
  {
    number: "02",
    label: "Content",
    icon: PenLine,
    title: "Shape your story",
    description: "Add your experience, education, projects and skills with a guided editor.",
    outcome: "Every section stays in sync",
    accent: "bg-[var(--brand-blue)]",
  },
  {
    number: "03",
    label: "Quality",
    icon: ClipboardCheck,
    title: "Review and apply",
    description: "Export a polished resume, then run it through the ATS analyzer before applying.",
    outcome: "An ATS-ready file you can send",
    accent: "bg-[#ffd8ca]",
  },
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
    description:
      "Explore curated white-page resume templates designed for every experience level.",
    features: ["White-page templates", "Live previews"],
    href: "/#templates",
    action: "View templates",
    accent: "bg-[#d8d1f5]",
    wash: "from-[#efecfb] to-[#fffefa]",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--brand-canvas)] text-[var(--brand-ink)]">
      <SiteHeader />

      <main>
        <section className="relative border-b border-black/[0.08]">
          <div className="absolute inset-0 paper-grid opacity-60" />
          <div className="relative mx-auto grid min-h-[720px] w-full max-w-[1440px] items-center gap-14 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-24">
            <div className="relative z-10 max-w-[650px]">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand-muted)] shadow-sm">
                <Sparkles className="size-3.5 text-[#e36c43]" />
                {resumeTemplates.length} original, white-page resume templates
              </div>

              <h1 className="text-balance text-[clamp(3.5rem,7.1vw,7.1rem)] font-bold leading-[0.88] tracking-[-0.075em]">
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

              <p className="mt-8 max-w-[580px] text-lg leading-8 text-[var(--brand-muted)] sm:text-xl">
                Start with the format employers know, a focused fresher layout, or a role-specific
                design. Then write, check, customize, and export from one focused workspace.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-13 rounded-full bg-[var(--brand-ink)] px-6 text-sm font-bold text-white shadow-[0_8px_24px_rgba(22,32,28,0.18)] hover:bg-[#27332f]"
                >
                  <Link href="/builder">
                    Build my resume
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-13 rounded-full border-black/15 bg-white/65 px-6 text-sm font-bold hover:bg-white"
                >
                  <Link href="/analyzer">
                    <FileSearch className="size-4" />
                    Analyze existing resume
                  </Link>
                </Button>
              </div>

              <div className="mt-9 space-y-2.5">
                {productBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2.5 text-sm font-medium text-[var(--brand-muted)]"
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

        <section className="bg-[var(--brand-ink)] text-white">
          <div className="mx-auto grid w-full max-w-[1440px] divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
            {[
              [String(resumeTemplates.length), "curated templates"],
              ["4", "connected career tools"],
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
          className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-20 sm:px-8 md:pb-20 md:pt-24 lg:px-12"
        >
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
          className="relative overflow-hidden border-y border-black/[0.08] bg-[#e9e7df]"
        >
          <div className="paper-grid pointer-events-none absolute inset-0 opacity-35" />
          <div className="pointer-events-none absolute -right-32 -top-40 size-[420px] rounded-full bg-[var(--brand-lime)]/15 blur-3xl" />

          <div className="relative mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 md:py-20 lg:px-12">
            <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr] xl:gap-12">
              <div className="flex flex-col xl:py-3">
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

                <div className="mt-9 rounded-[24px] border border-black/10 bg-white/55 p-5 shadow-[0_18px_50px_rgba(22,32,28,0.06)] backdrop-blur-sm sm:p-6 xl:mt-auto">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold">Your work stays yours</p>
                    <span className="rounded-full bg-[#e7f3db] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#46613c]">
                      Local-first
                    </span>
                  </div>
                  <div className="mt-5 space-y-2">
                    {workspaceBenefits.map((benefit) => (
                      <div
                        key={benefit}
                        className="flex items-center gap-3 rounded-xl border border-black/[0.07] bg-white/70 px-3 py-3"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-lime)]">
                          <Check className="size-3" strokeWidth={2.5} />
                        </span>
                        <span className="text-xs font-bold">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs leading-5 text-[var(--brand-muted)]">
                    No scattered documents or repeated setup while you move from writing to
                    applying.
                  </p>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="mt-5 h-11 w-fit rounded-full border-black/15 bg-white px-5 font-bold shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <Link href="/builder">
                    Start building now
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {productTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group relative flex min-h-[290px] flex-col overflow-hidden rounded-[26px] border border-black/10 bg-[var(--brand-paper)] p-6 shadow-[0_18px_55px_rgba(22,32,28,0.04)] transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_24px_70px_rgba(22,32,28,0.11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63864d] sm:p-7"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tool.wash} opacity-0 transition duration-300 group-hover:opacity-100`}
                    />
                    <div className="relative flex items-start justify-between">
                      <span
                        className={`flex size-12 items-center justify-center rounded-2xl ${tool.accent} shadow-sm transition duration-300 group-hover:scale-105 group-hover:-rotate-3`}
                      >
                        <tool.icon className="size-5" strokeWidth={1.9} />
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-black/35">
                          {tool.number}
                        </span>
                        <ArrowRight className="size-4 -rotate-45 text-black/25 transition duration-300 group-hover:rotate-0 group-hover:text-black/70" />
                      </div>
                    </div>

                    <div className="relative mt-8">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6a725f]">
                        {tool.category}
                      </p>
                      <h3 className="mt-2 text-[22px] font-bold tracking-[-0.035em]">
                        {tool.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
                        {tool.description}
                      </p>
                    </div>

                    <div className="relative mt-5 flex flex-wrap gap-2">
                      {tool.features.map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full border border-black/[0.07] bg-white/70 px-2.5 py-1 text-[10px] font-bold text-[#59615a]"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="relative mt-auto flex items-center gap-2 pt-6 text-xs font-bold text-[#3f6438]">
                      <span>{tool.action}</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-5 rounded-[24px] border border-[#bed0b4] bg-[#e5efdf] p-5 shadow-[0_15px_45px_rgba(22,32,28,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-ink)] text-[var(--brand-lime)]">
                  <ScanSearch className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">Applying to a specific role?</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--brand-muted)]">
                    Compare the job description with your resume and find the gaps before you send
                    it.
                  </p>
                </div>
              </div>
              <Link
                href="/builder"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--brand-ink)] px-5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#25332d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63864d]"
              >
                Open Role Match
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-black/[0.08] bg-[#e9e7df]">
          <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 md:py-20 lg:px-12">
            <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c65b38]">
                  One clear workflow
                </p>
                <h2 className="mt-4 text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                  From blank page to ready to send.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[var(--brand-muted)]">
                Three focused steps, one continuous draft. Move forward without copying details
                between disconnected tools.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {workflow.map((item) => (
                <article
                  key={item.number}
                  className="group flex min-h-[270px] flex-col rounded-[24px] border border-black/10 bg-[var(--brand-paper)] p-6 shadow-[0_14px_45px_rgba(22,32,28,0.035)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(22,32,28,0.09)] sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-black/35">
                        {item.number}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#697166]">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`flex size-11 items-center justify-center rounded-2xl ${item.accent} transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105`}
                    >
                      <item.icon className="size-5" strokeWidth={1.9} />
                    </span>
                  </div>
                  <div className="mt-9">
                    <h3 className="text-xl font-bold tracking-[-0.025em]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 border-t border-black/[0.07] pt-5 text-xs font-bold text-[#4f664b]">
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#e7f3db]">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                    {item.outcome}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#e9e7df]">
          <div className="mx-auto w-full max-w-[1440px] px-5 py-5 sm:px-8 md:py-6 lg:px-12">
            <div className="relative overflow-hidden rounded-[28px] bg-[var(--brand-orange)] px-6 py-10 sm:px-9 sm:py-12 lg:px-12">
              <div className="absolute -right-16 -top-28 size-64 rounded-full border-[42px] border-white/15" />
              <div className="absolute -bottom-24 right-[30%] size-48 rounded-full bg-[var(--brand-lime)]/30 blur-2xl" />
              <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-4xl">
                  <p className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em]">
                    <Sparkles className="size-4" />
                    Your next application starts here
                  </p>
                  <h2 className="text-4xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[58px]">
                    Make the resume you wish you already had.
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Free to start", "No account required", "Clean PDF export"].map((benefit) => (
                      <span
                        key={benefit}
                        className="rounded-full border border-black/10 bg-white/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em]"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  asChild
                  className="h-12 w-fit shrink-0 rounded-full bg-[var(--brand-ink)] px-6 font-bold text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#27332f]"
                >
                  <Link href="/builder">
                    Start building
                    <ArrowRight className="size-4" />
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
