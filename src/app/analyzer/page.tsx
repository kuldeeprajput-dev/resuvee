import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import { ResumeAnalyzer } from "@/components/home/ResumeAnalyzer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "ATS Resume Analyzer",
  description:
    "Upload your resume for an ATS score, keyword gaps, strengths, and practical improvements.",
};

export default function AnalyzerPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8f8f2_0%,#edf3ef_36%,#f4ecd9_68%,#efe9f2_100%)] text-foreground">
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-7xl flex-col px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/65 px-4 py-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-lime)]">
              <PenLine className="size-4 text-[var(--brand-ink)]" />
            </span>
            <div>
              <p className="text-sm font-bold text-[var(--brand-ink)]">
                Need a stronger starting point?
              </p>
              <p className="text-xs text-muted-foreground">
                Build a polished resume with a guided editor and live preview.
              </p>
            </div>
          </div>
          <Link
            href="/builder"
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--brand-ink)] px-4 text-xs font-bold text-white transition hover:bg-[#293630]"
          >
            Open builder
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="flex flex-1 items-stretch xl:items-center">
          <ResumeAnalyzer />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
