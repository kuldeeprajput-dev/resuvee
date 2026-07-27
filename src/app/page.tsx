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
  WandSparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TemplateThumbnail } from "@/components/resume/TemplateThumbnail";
import { resumeTemplates } from "@/lib/resume-data";

const productBenefits = [
  "Build from scratch or start with sample content",
  "Switch templates without losing your work",
  "Check ATS readiness in the same workspace",
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
      "Write section by section, choose an original template, tune the design, and export a clean PDF.",
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
          <div className="relative mx-auto grid min-h-[720px] w-full max-w-[1440px] items-center gap-14 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-24">
            <div className="relative z-10 max-w-[650px]">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand-muted)] shadow-sm">
                <Sparkles className="size-3.5 text-[#e36c43]" />
                Your complete application workspace
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
                Build a resume that looks like you, reads clearly, and gets
                through the first screen. One focused workspace from first
                draft to final check.
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

            <div className="relative mx-auto h-[520px] w-full max-w-[660px] sm:h-[620px]">
              <div className="absolute left-[2%] top-[9%] w-[52%] -rotate-6 opacity-65 sm:left-[5%]">
                <TemplateThumbnail template={resumeTemplates[1]} />
              </div>
              <div className="absolute right-[2%] top-[1%] w-[57%] rotate-[5deg] opacity-80 sm:right-[4%]">
                <TemplateThumbnail template={resumeTemplates[4]} />
              </div>
              <div className="absolute left-1/2 top-[7%] w-[59%] -translate-x-1/2">
                <TemplateThumbnail template={resumeTemplates[0]} showLabel />
              </div>

              <div className="absolute bottom-[8%] left-[1%] z-20 rounded-2xl border border-black/10 bg-white/90 p-4 shadow-[0_18px_55px_rgba(22,32,28,0.18)] backdrop-blur sm:left-[5%] sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-lime)]">
                    <Zap className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[var(--brand-muted)]">
                      Resume strength
                    </p>
                    <p className="text-xl font-bold tracking-tight">
                      90% ready
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[1%] right-[1%] z-20 max-w-[210px] rounded-2xl bg-[var(--brand-ink)] p-4 text-white shadow-[0_18px_55px_rgba(22,32,28,0.25)] sm:bottom-[4%] sm:right-[3%] sm:p-5">
                <WandSparkles className="mb-3 size-5 text-[var(--brand-lime)]" />
                <p className="text-sm font-bold">Made to be yours</p>
                <p className="mt-1 text-xs leading-5 text-white/60">
                  Original layouts, built from the ground up.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--brand-ink)] text-white">
          <div className="mx-auto grid w-full max-w-[1440px] divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
            {[
              ["6", "original templates"],
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
                Template collection
              </p>
              <h2 className="max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                A strong first impression,
                <br />
                in your own style.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-[var(--brand-muted)]">
              Six original designs based on proven resume structures. Every
              option is editable, printable, and safe to use.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resumeTemplates.map((template, index) => (
              <Link
                key={template.id}
                href={`/builder?template=${template.id}`}
                className="group rounded-[24px] border border-black/[0.08] bg-white/55 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(22,32,28,0.11)] sm:p-5"
              >
                <div
                  className="relative overflow-hidden rounded-2xl p-8 sm:p-10"
                  style={{ backgroundColor: template.background }}
                >
                  <span className="absolute left-4 top-4 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-black/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <TemplateThumbnail
                    template={template}
                    className="mx-auto max-w-[235px] transition-transform duration-500 group-hover:scale-[1.025] group-hover:-rotate-1"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 px-1 pb-1 pt-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold tracking-[-0.025em]">
                        {template.name}
                      </h3>
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: template.accent }}
                      />
                    </div>
                    <p className="mt-1 text-sm text-[var(--brand-muted)]">
                      {template.suitableFor}
                    </p>
                  </div>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/10 transition-colors group-hover:bg-[var(--brand-lime)]">
                    <ArrowRight className="size-4 -rotate-45 transition-transform group-hover:rotate-0" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
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
