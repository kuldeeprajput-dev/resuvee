"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { BuilderSection } from "../../types/resume";
import type { builderSections } from "../../constants/resume-data";

interface ResumeStepTrackProps {
  hideLeftSidebar: boolean;
  showLeftFade: boolean;
  showRightFade: boolean;
  navScrollRef: React.RefObject<HTMLDivElement | null>;
  visibleSections: (typeof builderSections)[number][];
  activeSection: BuilderSection;
  activeIndex: number;
  setActiveSection: (section: BuilderSection) => void;
  goToRelativeSection: (direction: -1 | 1) => void;
}

export function ResumeStepTrack({
  hideLeftSidebar,
  showLeftFade,
  showRightFade,
  navScrollRef,
  visibleSections,
  activeSection,
  activeIndex,
  setActiveSection,
  goToRelativeSection,
}: ResumeStepTrackProps) {
  return (
    <>
      {/* Horizontal Step Pill Track */}
      <div
        className={cn(
          "relative flex items-center border-b border-black/[0.06] bg-[#f7f6f1] py-1.5 px-3",
          !hideLeftSidebar && "hidden"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-[#f7f6f1] via-[#f7f6f1]/80 to-transparent transition-opacity duration-200",
            showLeftFade ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          ref={navScrollRef}
          className="flex w-full gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1 py-0.5"
        >
          {visibleSections.map((section, index) => (
            <button
              key={section.id}
              type="button"
              data-section-id={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-150 cursor-pointer",
                activeSection === section.id
                  ? "bg-[var(--brand-ink)] text-white shadow-xs scale-[1.01]"
                  : "border border-black/10 bg-white text-[var(--brand-muted)] hover:border-black/20 hover:text-[var(--brand-ink)]"
              )}
            >
              <span
                className={cn(
                  "text-[10px]",
                  activeSection === section.id ? "opacity-90 font-extrabold" : "opacity-70"
                )}
              >
                {index + 1}
              </span>
              {section.shortLabel}
            </button>
          ))}
        </div>
        <div
          className={cn(
            "pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-[#f7f6f1] via-[#f7f6f1]/80 to-transparent transition-opacity duration-200",
            showRightFade ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      {/* Carousel Navigation Control Bar */}
      {hideLeftSidebar && (showLeftFade || showRightFade) && (
        <div className="flex items-center gap-2.5 border-b border-black/[0.06] bg-[#f7f6f1]/90 px-4 py-1.5 animate-in fade-in">
          <button
            type="button"
            onClick={() => goToRelativeSection(-1)}
            disabled={activeIndex === 0}
            aria-label="Previous section"
            className="flex size-6 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 shadow-xs transition hover:border-emerald-500/50 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="size-3.5" />
          </button>

          <div className="h-[1px] flex-1 bg-black/10" />

          <div className="flex items-center gap-1.5 px-1">
            {visibleSections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  title={sec.label}
                  className={cn(
                    "transition-all duration-150 cursor-pointer",
                    isActive
                      ? "size-2 rounded-full bg-[var(--brand-ink)] ring-2 ring-black/20"
                      : "size-2 rounded-full border border-black/20 bg-black/10 hover:bg-black/40"
                  )}
                />
              );
            })}
          </div>

          <div className="h-[1px] flex-1 bg-black/10" />

          <button
            type="button"
            onClick={() => goToRelativeSection(1)}
            disabled={activeIndex === visibleSections.length - 1}
            aria-label="Next section"
            className="flex size-6 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 shadow-xs transition hover:border-emerald-500/50 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
