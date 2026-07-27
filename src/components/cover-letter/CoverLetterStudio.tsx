"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Cloud,
  Download,
  FileText,
  LayoutTemplate,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  CoverLetterData,
  CoverLetterTheme,
} from "@/types/cover-letter";
import type { ResumeData } from "@/types/resume";

const STORAGE_KEY = "resulyra-cover-letter-v1";
const RESUME_KEY = "resulyra-draft-v1";

const emptyLetter: CoverLetterData = {
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  recipient: "Hiring team",
  company: "",
  role: "",
  date: "",
  greeting: "Dear hiring team,",
  opening: "",
  evidence: "",
  closing: "",
  signoff: "Warmly,",
};

const themes: {
  id: CoverLetterTheme;
  name: string;
  description: string;
  accent: string;
}[] = [
  {
    id: "linen",
    name: "Linen",
    description: "Warm and editorial",
    accent: "#416b53",
  },
  {
    id: "signal",
    name: "Signal",
    description: "Modern color rail",
    accent: "#2f6fa3",
  },
  {
    id: "ledger",
    name: "Ledger",
    description: "Crisp and traditional",
    accent: "#4a4540",
  },
];

function getStarterCopy(data: CoverLetterData) {
  const role = data.role || "this role";
  const company = data.company || "your team";
  return {
    opening:
      `I am excited to apply for ${role} at ${company}. My background in ${data.headline || "building thoughtful, measurable work"} has taught me how to turn complex goals into focused action while keeping customers and collaborators at the center.`,
    evidence:
      "In my recent work, I have led cross-functional projects from early discovery through delivery, created practical systems that improved team performance, and communicated decisions clearly across technical and business groups. I would bring that same combination of curiosity, ownership, and steady execution to this opportunity.",
    closing:
      `I would welcome the chance to learn more about ${company} and discuss how my experience could support the team’s priorities. Thank you for your time and consideration.`,
  };
}

export function CoverLetterStudio() {
  const [data, setData] = useState<CoverLetterData>(emptyLetter);
  const [theme, setTheme] = useState<CoverLetterTheme>("linen");
  const [saveLabel, setSaveLabel] = useState("Saved locally");
  const hasLoaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          data?: CoverLetterData;
          theme?: CoverLetterTheme;
        };
        if (parsed.data) setData(parsed.data);
        if (parsed.theme) setTheme(parsed.theme);
      } else {
        const resumeDraft = window.localStorage.getItem(RESUME_KEY);
        if (resumeDraft) {
          const parsed = JSON.parse(resumeDraft) as { data?: ResumeData };
          if (parsed.data) {
            setData((current) => ({
              ...current,
              fullName: parsed.data?.basics.fullName ?? "",
              headline: parsed.data?.basics.headline ?? "",
              email: parsed.data?.basics.email ?? "",
              phone: parsed.data?.basics.phone ?? "",
              location: parsed.data?.basics.location ?? "",
              website: parsed.data?.basics.website ?? "",
            }));
          }
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      hasLoaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    setSaveLabel("Saving…");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data, theme }),
      );
      setSaveLabel("Saved locally");
    }, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [data, theme]);

  const update = (field: keyof CoverLetterData, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
  };

  const activeTheme =
    themes.find((item) => item.id === theme) ?? themes[0];

  return (
    <div className="min-h-[100dvh] bg-[#e5e6e1] text-[var(--brand-ink)]">
      <header className="no-print flex h-16 items-center justify-between border-b border-black/10 bg-[var(--brand-paper)] px-4 sm:px-5">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            aria-label="Back to home"
            className="builder-icon-button lg:hidden"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="hidden lg:block">
            <Brand />
          </div>
          <span className="hidden h-6 w-px bg-black/10 lg:block" />
          <div>
            <p className="flex items-center gap-2 text-sm font-bold">
              <FileText className="size-4 text-[var(--brand-muted)]" />
              {data.company
                ? `${data.company} — Cover letter`
                : "Untitled cover letter"}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-[var(--brand-muted)]">
              <Cloud className="size-3" />
              {saveLabel}
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => window.print()}
          className="h-10 rounded-xl bg-[var(--brand-ink)] px-4 font-bold text-white"
        >
          <Download className="size-4" />
          Export PDF
        </Button>
      </header>

      <main className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(390px,0.88fr)_minmax(600px,1.12fr)]">
        <section className="no-print border-r border-black/10 bg-[#f8f7f2]">
          <div className="mx-auto max-w-2xl p-5 sm:p-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#bd593a]">
                Letter studio
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-[-0.04em]">
                Write for one specific role
              </h1>
              <p className="mt-2 text-xs leading-5 text-[var(--brand-muted)]">
                Start from your resume details, then make every sentence
                truthful and personal.
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
                className="mb-3 h-10 rounded-xl border-black/10 bg-white text-xs font-bold"
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
                      "rounded-2xl border bg-white p-3 text-left transition",
                      theme === item.id
                        ? "border-[#537c45] ring-2 ring-[#8baa54]/15"
                        : "border-black/10",
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

        <section className="flex min-h-[900px] items-start justify-center overflow-auto bg-[#dcded9] p-6 lg:p-12">
          <CoverLetterPreview
            data={data}
            theme={theme}
            accent={activeTheme.accent}
          />
        </section>
      </main>
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-28 w-full resize-y rounded-xl border border-black/10 bg-white px-3.5 py-3 text-sm leading-6 outline-none transition focus:border-[#537c45] focus:ring-3 focus:ring-[#a8ca59]/20"
      />
    </label>
  );
}

function CoverLetterPreview({
  data,
  theme,
  accent,
}: {
  data: CoverLetterData;
  theme: CoverLetterTheme;
  accent: string;
}) {
  const contact = [data.email, data.phone, data.location, data.website]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <article
      className={cn(
        "resume-print-area relative min-h-[842px] w-[595px] shrink-0 overflow-hidden bg-white px-14 py-12 text-[#232824] shadow-[0_24px_65px_rgba(22,32,28,0.18)]",
        theme === "ledger" ? "font-serif" : "font-sans",
      )}
    >
      {theme === "signal" && (
        <div
          className="absolute inset-y-0 left-0 w-3"
          style={{ backgroundColor: accent }}
        />
      )}
      {theme === "linen" && (
        <div className="absolute -right-20 -top-24 size-64 rounded-full bg-[#e7f1e8]" />
      )}
      <header className="relative border-b pb-6" style={{ borderColor: accent }}>
        <h1 className="text-[29px] font-bold leading-none tracking-[-0.045em]">
          {data.fullName || "Your Name"}
        </h1>
        <p
          className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em]"
          style={{ color: accent }}
        >
          {data.headline || "Professional title"}
        </p>
        <p className="mt-3 text-[7px] leading-4 text-black/50">{contact}</p>
      </header>

      <div className="relative mt-8">
        <div className="flex items-start justify-between gap-8 text-[8px] leading-4">
          <div>
            <p className="font-bold">{data.recipient || "Hiring team"}</p>
            <p className="text-black/50">
              {data.company || "Company name"}
            </p>
            <p className="text-black/50">{data.role || "Role title"}</p>
          </div>
          <p className="text-black/45">{data.date || "Date"}</p>
        </div>

        <div className="mt-9 space-y-5 text-[9px] leading-[1.75] text-black/70">
          <p className="font-semibold text-black/85">
            {data.greeting || "Dear hiring team,"}
          </p>
          <p>{data.opening || "Your tailored opening will appear here."}</p>
          <p>
            {data.evidence ||
              "Use this paragraph to connect relevant experience, outcomes, and strengths to the role."}
          </p>
          <p>
            {data.closing ||
              "Close with a sincere expression of interest and a clear next step."}
          </p>
        </div>

        <div className="mt-8 text-[9px] leading-5">
          <p>{data.signoff || "Warmly,"}</p>
          <p className="mt-4 font-bold">{data.fullName || "Your Name"}</p>
        </div>
      </div>

      <div className="absolute bottom-8 left-14 right-14 flex items-center justify-between border-t border-black/10 pt-3 text-[5.5px] uppercase tracking-[0.15em] text-black/25">
        <span>Resulyra · Letter Studio</span>
        <LayoutTemplate className="size-2.5" />
      </div>
    </article>
  );
}
