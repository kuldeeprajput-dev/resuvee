import type { Metadata } from "next";
import { ResumeAnalyzer } from "@/modules/analyzer";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "ATS Resume Analyzer",
  description:
    "Upload your resume for an ATS score, keyword gaps, strengths, and practical improvements.",
};

export default function AnalyzerPage() {
  return (
    <div className="min-h-screen bg-[var(--brand-canvas)] text-foreground">
      <SiteHeader blendWithPage />
      <main className="flex min-h-[calc(100vh-72px)] px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="flex w-full items-center">
          <ResumeAnalyzer />
        </div>
      </main>
    </div>
  );
}
