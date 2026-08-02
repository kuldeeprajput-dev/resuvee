"use client";

import { ResumeAnalyzer } from "../components/resume-analyzer";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";

export function AnalyzerView() {
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
