import type { Metadata } from "next";
import { ExamplesLibrary } from "@/components/examples/ExamplesLibrary";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Resume Examples by Role | Resulyra",
  description:
    "Explore original, role-specific resume guidance and evidence prompts for business, technology, creative, and early-career applications.",
};

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-[var(--brand-canvas)] text-[var(--brand-ink)]">
      <SiteHeader />
      <main>
        <ExamplesLibrary />
      </main>
      <SiteFooter />
    </div>
  );
}
