"use client";

import { Check, LayoutTemplate } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { BuilderSection } from "../../types/resume";
import type { builderSections } from "../../constants/resume-data";

interface ResumeSidebarProps {
  isFresherTemplate: boolean;
  strength: number;
  visibleSections: (typeof builderSections)[number][];
  activeSection: BuilderSection;
  activeIndex: number;
  hideLeftSidebar: boolean;
  setActiveSection: (section: BuilderSection) => void;
  setShowTemplates: (show: boolean) => void;
}

export function ResumeSidebar({
  isFresherTemplate,
  strength,
  visibleSections,
  activeSection,
  activeIndex,
  hideLeftSidebar,
  setActiveSection,
  setShowTemplates,
}: ResumeSidebarProps) {
  return (
    <aside
      className={cn(
        "no-print hidden w-[220px] shrink-0 flex-col border-r border-black/10 bg-[#eeeee8] lg:flex",
        hideLeftSidebar && "lg:hidden"
      )}
    >
      <div className="border-b border-black/10 px-5 py-5">
        <div className="mb-2 flex items-center justify-between text-xs font-bold">
          <span>{isFresherTemplate ? "Fresher readiness" : "Resume strength"}</span>
          <span>{strength}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${strength}%` }}
          />
        </div>
        <p className="mt-2 text-[10px] leading-4 text-[var(--brand-muted)]">
          {strength >= 80
            ? "Looking strong. Review every detail before exporting."
            : "Complete each section to strengthen your resume."}
        </p>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4" aria-label="Resume sections">
        {visibleSections.map((section, index) => {
          const isActive = activeSection === section.id;
          const isComplete = index < activeIndex;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 cursor-pointer",
                isActive
                  ? "bg-white text-[var(--brand-ink)] border border-black/15 shadow-xs font-bold"
                  : "text-[var(--brand-muted)] hover:bg-white/60 hover:text-[var(--brand-ink)]"
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all",
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : isComplete
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300/80"
                      : "border border-black/20 text-[var(--brand-muted)] bg-white/50"
                )}
              >
                {isComplete ? <Check className="size-3 stroke-[2.5]" /> : index + 1}
              </span>
              <span className="text-xs font-bold">{section.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex h-[64px] shrink-0 items-center border-t border-black/10 bg-white/80 px-3 backdrop-blur">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowTemplates(true)}
          className="h-10 w-full rounded-xl border-black/10 bg-white px-3 text-xs font-bold text-[var(--brand-ink)] shadow-xs transition hover:bg-black/5 cursor-pointer"
        >
          <LayoutTemplate className="size-4 text-emerald-600" />
          <span>Templates</span>
        </Button>
      </div>
    </aside>
  );
}
