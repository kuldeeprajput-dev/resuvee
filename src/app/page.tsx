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
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroResumeStack } from "@/components/home/HeroResumeStack";
import { LandingTemplateShowcase } from "@/components/home/LandingTemplateShowcase";

const productBenefits = [
  "18 original templates across proven resume formats",
  "Dedicated fresher layouts with no experience section",
  "Switch designs without losing any of your work",
];

const workflow = [
  {
    number: "01",
    icon: LayoutTemplate,
    title: "Choose your direction",
    description:
      "Pick one of six original templates made for different careers and levels.",
  },
  {
    number: "02",
    icon: PenLine,
    title: "Shape your story",
    description:
      "Add your experience, education, projects and skills with a guided editor.",
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "Review and apply",
    description:
      "Export a polished resume, then run it through the ATS analyzer before applying.",
  },
];

const productTools = [
  {
    icon: PenLine,
    title: "Resume Builder",
    description:
      "Write section by section, check spelling and grammar with AI, tune the design, and export a clean PDF.",
    href: "/builder",
    action: "Build a resume",
  },
  {
    icon: FileSearch,
    title: "ATS Analyzer",
    description:
      "Review an existing resume for structure, clarity, keyword coverage, and practical improvements.",
    href: "/analyzer",
    action: "Check a resume",
  },
  {
    icon: Files,
    title: "Letter Studio",
    description:
      "Create a focused cover letter that reuses your local resume details and matches your visual direction.",
    href: "/cover-letter",
    action: "Write a letter",
  },
  {
    icon: BriefcaseBusiness,
    title: "Application Board",
    description:
      "Track saved roles, applications, interviews, offers, notes, due dates, and every next action.",
    href: "/job-tracker",
    action: "Track applications",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--brand-canvas)] text-[var(--brand-ink)]">
      <SiteHeader />

      <main>
        <section className="relative border-b border-black/[0.08]">
          <div className="absolute inset-0 paper-grid opacity-60" />
          <div className="relative mx-auto grid min-h-[720px] w-full max-w-[1440px] items-start gap-14 px-5 py-14 sm:px-8 md:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-12 lg:pb-16 lg:pt-12">
            <div className="relative z-10 max-w-[650px] lg:flex lg:h-[656px] lg:flex-col">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand-muted)] shadow-sm">
                <Sparkles className="size-3.5 text-[#e36c43]" />
                18 original, white-page resume templates
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
                Start with the format employers know, a focused fresher
                layout, or a role-specific design. Then write, check,
                customize, and export from one focused workspace.
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

              <div className="mt-9 space-y-2.5 lg:mt-auto">
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
              ["18", "original templates"],
              ["4", "connected career tools"],
              ["0", "design licensing worries"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="flex items-baseline gap-3 py-7 sm:justify-center sm:py-8"
              >
                <span className="text-4xl font-bold tracking-[-0.05em] text-[var(--brand-lime)]">
                  {value}
                </span>
                <span className="text-sm font-medium text-white/60">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          id="templates"
          className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 md:py-28 lg:px-12"
        >
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#c65b38]">
                Template screenshot library
              </p>
              <h2 className="max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                Start with a format people already understand.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-[var(--brand-muted)]">
              Browse realistic previews of reverse-chronological, hybrid,
              role-focused, and fresher layouts. Every page stays white,
              readable, editable, and original to Resulyra.
            </p>
          </div>

          <LandingTemplateShowcase />
        </section>

        <section className="border-y border-black/[0.08] bg-[#e9e7df]">
          <div className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c65b38]">
                  The Resulyra toolkit
                </p>
                <h2 className="mt-4 text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                  More than a resume builder.
                </h2>
                <p className="mt-5 max-w-md text-base leading-7 text-[var(--brand-muted)]">
                  Move from first draft to active job search in one
                  privacy-friendly workspace. Everything saves in your
                  browser for now.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-7 h-11 rounded-full border-black/15 bg-white px-5 font-bold"
                >
                  <Link href="/examples">
                    Explore resume examples
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-px overflow-hidden rounded-[26px] border border-black/10 bg-black/10 sm:grid-cols-2">
                {productTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group bg-[var(--brand-paper)] p-7 transition hover:bg-white sm:p-8"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-[var(--brand-lime)]">
                        <tool.icon className="size-5" />
                      </span>
                      <ArrowRight className="size-4 -rotate-45 text-black/25 transition group-hover:rotate-0 group-hover:text-black/70" />
                    </div>
                    <h3 className="mt-9 text-xl font-bold tracking-[-0.03em]">
                      {tool.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
                      {tool.description}
                    </p>
                    <p className="mt-5 text-xs font-bold text-[#4f7242]">
                      {tool.action}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-[var(--brand-ink)] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <ScanSearch className="size-5 text-[var(--brand-lime)]" />
                <p className="text-sm font-bold">
                  Applying to a specific role?
                </p>
                <p className="hidden text-xs text-white/50 md:block">
                  Compare its language against your resume before sending.
                </p>
              </div>
              <Link
                href="/builder"
                className="text-xs font-bold text-[var(--brand-lime)] hover:underline"
              >
                Open Role Match →
              </Link>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-y border-black/[0.08] bg-[#e9e7df]"
        >
          <div className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#c65b38]">
                  One clear workflow
                </p>
                <h2 className="text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                  From blank page to ready to send.
                </h2>
              </div>

              <div className="grid gap-px overflow-hidden rounded-[24px] border border-black/10 bg-black/10 md:grid-cols-3">
                {workflow.map((item) => (
                  <article
                    key={item.number}
                    className="group bg-[var(--brand-paper)] p-7 sm:p-8"
                  >
                    <div className="mb-12 flex items-center justify-between">
                      <span className="text-xs font-bold tracking-[0.15em] text-[var(--brand-muted)]">
                        {item.number}
                      </span>
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-[var(--brand-lime)] transition-transform duration-300 group-hover:-rotate-6">
                        <item.icon className="size-5" />
                      </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-[-0.025em]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-[30px] bg-[var(--brand-orange)] px-6 py-16 sm:px-10 md:py-20 lg:px-16">
            <div className="absolute -right-20 -top-32 size-80 rounded-full border-[54px] border-white/15" />
            <div className="absolute -bottom-32 right-[28%] size-60 rounded-full bg-[var(--brand-lime)]/35 blur-2xl" />
            <div className="relative z-10 flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
                  <Sparkles className="size-4" />
                  Your next application starts here
                </p>
                <h2 className="max-w-4xl text-4xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                  Make the resume you wish you already had.
                </h2>
              </div>
              <Button
                asChild
                className="h-14 shrink-0 rounded-full bg-[var(--brand-ink)] px-7 font-bold text-white hover:bg-[#27332f]"
              >
                <Link href="/builder">
                  Start for free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
