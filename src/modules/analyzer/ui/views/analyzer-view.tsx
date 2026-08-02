"use client";

import { ResumeAnalyzer } from "../components/resume-analyzer";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";

export function AnalyzerView() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--brand-canvas)] text-foreground">
      <SiteHeader blendWithPage />
      <main className="relative flex min-h-[calc(100vh-72px)] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(200,241,105,0.14),transparent_70%)]" />
        <div className="relative mx-auto flex w-full max-w-[1280px] items-center">
          <ResumeAnalyzer />
        </div>
      </main>
    </div>
  );
}
