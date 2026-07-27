"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Download,
  Eye,
  FilePlus2,
  FileText,
  GripVertical,
  LayoutTemplate,
  ScanSearch,
  Palette,
  SpellCheck2,
  Redo2,
  Undo2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  builderSections,
  calculateResumeStrength,
  resumeTemplates,
} from "@/lib/resume-data";
import { useResumeBuilderStore } from "@/stores/useResumeBuilderStore";
import { Brand } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResumeEditor } from "./ResumeEditor";
import { InteractiveCanvas } from "./InteractiveCanvas";
import { TemplateThumbnail } from "./TemplateThumbnail";
import { TailorPanel } from "./TailorPanel";
import { WritingCheckPanel } from "./WritingCheckPanel";
import { CustomizePanel } from "./CustomizePanel";

interface ResumeBuilderProps {
  initialTemplate?: string;
  initialStarter?: string;
}

export function ResumeBuilder({
  initialTemplate,
  initialStarter,
}: ResumeBuilderProps) {
  const {
    data,
    templateId,
    activeSection,
    showTemplates,
    showMobilePreview,
    showTailor,
    showCustomize,
    showWritingCheck,
    templateFilter,
    resumeStyle,
    zoom,
    history,
    future,
    saveLabel,
    initialize,
    updateData,
    selectTemplate,
    setActiveSection,
    setShowTemplates,
    setShowMobilePreview,
    setShowTailor,
    setShowCustomize,
    setShowWritingCheck,
    setTemplateFilter,
    setResumeStyle,
    setZoom,
    undo,
    redo,
    startFresh: clearResume,
  } = useResumeBuilderStore();

  const template =
    resumeTemplates.find((item) => item.id === templateId) ??
    resumeTemplates.find((item) => item.id === "standard") ??
    resumeTemplates[0];
  const isFresherTemplate = template.audience === "fresher";
  const visibleSections = template.sections
    .map((sectionId) =>
      builderSections.find((section) => section.id === sectionId),
    )
    .filter((section): section is (typeof builderSections)[number] =>
      Boolean(section),
    );
  const strength = calculateResumeStrength(data, {
    fresher: isFresherTemplate,
  });
  const activeIndex = visibleSections.findIndex(
    (section) => section.id === activeSection,
  );
  const filteredTemplates = resumeTemplates.filter((item) => {
    if (templateFilter === "popular") return item.popular;
    if (templateFilter === "fresher") return item.audience === "fresher";
    if (templateFilter === "professional") {
      return item.audience !== "fresher";
    }
    return true;
  });
  // Resizable Editor & Studio Canvas Split State
  const [splitPercent, setSplitPercent] = useState<number>(42);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isLeftCollapsed = splitPercent <= 1;
  const isRightCollapsed = splitPercent >= 99;

  const containerWidth =
    containerRef.current?.getBoundingClientRect().width ||
    (typeof window !== "undefined" ? window.innerWidth : 1200);
  const totalLeftWidthPx = (splitPercent / 100) * containerWidth;
  const hideLeftSidebar = isLeftCollapsed || totalLeftWidthPx < 360;

  useEffect(() => {
    let animId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      let percent = (relativeX / rect.width) * 100;

      // Edge snapping for complete collapse
      if (percent < 3) percent = 0;
      else if (percent > 97) percent = 100;
      else percent = Math.max(0, Math.min(100, percent));

      if (animId !== null) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(() => {
        setSplitPercent(percent);
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      if (animId !== null) cancelAnimationFrame(animId);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (animId !== null) cancelAnimationFrame(animId);
    };
  }, [isResizing]);

  useEffect(() => {
    let active = true;
    Promise.resolve(useResumeBuilderStore.persist.rehydrate()).finally(() => {
      if (active) initialize(initialTemplate, initialStarter);
    });

    return () => {
      active = false;
    };
  }, [initialStarter, initialTemplate, initialize]);

  const goToRelativeSection = (direction: -1 | 1) => {
    const target = visibleSections[activeIndex + direction];
    if (target) setActiveSection(target.id);
  };

  const exportResume = () => {
    window.print();
  };

  const startFresh = () => {
    const confirmed = window.confirm(
      "Start a new blank resume? Your current local draft will be replaced.",
    );
    if (!confirmed) return;

    clearResume();
  };

  const addTargetKeywords = (keywords: string[]) => {
    const targetGroup = data.skillGroups.find(
      (group) => group.name.toLowerCase() === "target role",
    );
    const nextGroups = targetGroup
      ? data.skillGroups.map((group) =>
          group.id === targetGroup.id
            ? {
                ...group,
                skills: [...new Set([...group.skills, ...keywords])],
              }
            : group,
        )
      : [
          ...data.skillGroups,
          {
            id: `target-role-${Date.now()}`,
            name: "Target role",
            skills: keywords,
          },
        ];

    updateData({ ...data, skillGroups: nextGroups });
  };

  const previewTemplate = {
    ...template,
    accent: resumeStyle.accent || template.accent,
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#e8e8e2] text-[var(--brand-ink)]">
      <header className="no-print flex h-16 items-center justify-between border-b border-black/10 bg-[var(--brand-paper)] px-4 sm:px-5">
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/"
            aria-label="Back to home"
            className="flex size-9 items-center justify-center rounded-xl border border-black/10 text-[var(--brand-muted)] transition hover:bg-black/5 hover:text-[var(--brand-ink)] lg:hidden"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="hidden lg:block">
            <Brand />
          </div>
          <span className="hidden h-6 w-px bg-black/10 lg:block" />
          <div>
            <div className="flex items-center gap-2">
              <FileText className="hidden size-4 text-[var(--brand-muted)] sm:block" />
              <p className="max-w-[155px] truncate text-sm font-bold sm:max-w-none">
                {data.basics.fullName
                  ? `${data.basics.fullName} — Resume`
                  : "Untitled resume"}
              </p>
            </div>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-[var(--brand-muted)]">
              <Cloud className="size-3" />
              {saveLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="mr-1 hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={undo}
              disabled={!history.length}
              aria-label="Undo"
              className="builder-icon-button"
            >
              <Undo2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!future.length}
              aria-label="Redo"
              className="builder-icon-button"
            >
              <Redo2 className="size-4" />
            </button>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowWritingCheck(true)}
            className="hidden h-10 rounded-xl border-black/10 bg-white px-3 text-xs font-bold lg:inline-flex"
          >
            <SpellCheck2 className="size-4" />
            Writing
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCustomize(true)}
            className="hidden h-10 rounded-xl border-black/10 bg-white px-3 text-xs font-bold xl:inline-flex"
          >
            <Palette className="size-4" />
            Design
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowTailor(true)}
            className="hidden h-10 rounded-xl border-black/10 bg-white px-3 text-xs font-bold sm:inline-flex"
          >
            <ScanSearch className="size-4" />
            Role match
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={startFresh}
            className="hidden h-10 rounded-xl px-3 text-xs font-bold text-[var(--brand-muted)] hover:text-[var(--brand-ink)] md:inline-flex"
          >
            <FilePlus2 className="size-4" />
            Start fresh
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMobilePreview(true)}
            className="h-10 rounded-xl border-black/10 bg-white px-3 font-bold lg:hidden"
          >
            <Eye className="size-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            type="button"
            onClick={exportResume}
            className="h-10 rounded-xl bg-[var(--brand-ink)] px-3.5 font-bold text-white hover:bg-[#293630]"
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </header>

      <div
        ref={containerRef}
        className={cn(
          "relative flex h-[calc(100dvh-4rem)] w-full overflow-hidden",
          isResizing && "select-none",
        )}
      >
        <aside
          className={cn(
            "no-print hidden w-[220px] shrink-0 flex-col border-r border-black/10 bg-[#eeeee8] lg:flex",
            hideLeftSidebar && "lg:hidden",
          )}
        >
          <div className="border-b border-black/10 px-5 py-5">
            <div className="mb-2 flex items-center justify-between text-xs font-bold">
              <span>
                {isFresherTemplate
                  ? "Fresher readiness"
                  : "Resume strength"}
              </span>
              <span>{strength}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-[var(--brand-lime)] transition-all duration-500"
                style={{ width: `${strength}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] leading-4 text-[var(--brand-muted)]">
              {strength >= 80
                ? "Looking strong. Review every detail before exporting."
                : "Complete each section to strengthen your resume."}
            </p>
          </div>

          <nav
            className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
            aria-label="Resume sections"
          >
            {visibleSections.map((section, index) => {
              const isActive = activeSection === section.id;
              const isComplete = index < activeIndex;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition",
                    isActive
                      ? "bg-[var(--brand-ink)] text-white shadow-sm"
                      : "text-[var(--brand-muted)] hover:bg-white/70 hover:text-[var(--brand-ink)]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                      isActive
                        ? "border-white/20 bg-white/10 text-[var(--brand-lime)]"
                        : isComplete
                          ? "border-[#9ebd56] bg-[var(--brand-lime)] text-[var(--brand-ink)]"
                          : "border-black/15",
                    )}
                  >
                    {isComplete ? <Check className="size-3" /> : index + 1}
                  </span>
                  <span className="text-xs font-bold">{section.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-black/10 p-3">
            <button
              type="button"
              onClick={() => setShowTemplates(true)}
              className="flex w-full items-center gap-3 rounded-xl bg-white/70 p-3 text-left shadow-sm transition hover:bg-white"
            >
              <span
                className="size-9 rounded-lg border border-black/10"
                style={{ backgroundColor: template.background }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold text-[var(--brand-muted)]">
                  Template
                </span>
                <span className="block truncate text-xs font-bold">
                  {template.name}
                </span>
              </span>
              <LayoutTemplate className="size-4 text-[var(--brand-muted)]" />
            </button>
          </div>
        </aside>

        {/* Resizable Left Editor Panel */}
        {!isLeftCollapsed && (
          <section
            className={cn(
              "no-print flex min-h-0 flex-col border-r border-black/10 bg-[#f7f6f1]",
              isResizing
                ? "transition-none"
                : "transition-[width] duration-150 ease-out",
              isRightCollapsed ? "flex-1" : "shrink-0",
            )}
            style={
              isRightCollapsed
                ? undefined
                : {
                    width: hideLeftSidebar
                      ? `${splitPercent}%`
                      : `calc(${splitPercent}% - 220px)`,
                  }
            }
          >
            <div className="border-b border-black/[0.08] px-5 py-3 lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {visibleSections.map((section, index) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold",
                      activeSection === section.id
                        ? "bg-[var(--brand-ink)] text-white"
                        : "border border-black/10 bg-white text-[var(--brand-muted)]",
                    )}
                  >
                    <span>{index + 1}</span>
                    {section.shortLabel}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <ResumeEditor
                activeSection={activeSection}
                data={data}
                onChange={updateData}
                template={template}
              />
            </div>

            <div className="flex items-center justify-between border-t border-black/10 bg-white/80 px-5 py-3 backdrop-blur sm:px-7">
              <Button
                type="button"
                variant="ghost"
                onClick={() => goToRelativeSection(-1)}
                disabled={activeIndex === 0}
                className="h-10 rounded-xl px-3 font-bold"
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--brand-muted)]">
                {activeIndex + 1} / {visibleSections.length}
              </span>
              <Button
                type="button"
                onClick={() => {
                  if (activeIndex === visibleSections.length - 1) {
                    setShowMobilePreview(true);
                  } else {
                    goToRelativeSection(1);
                  }
                }}
                className="h-10 rounded-xl bg-[var(--brand-ink)] px-4 font-bold text-white hover:bg-[#293630]"
              >
                {activeIndex === visibleSections.length - 1
                  ? "Preview"
                  : "Continue"}
                {activeIndex === visibleSections.length - 1 ? (
                  <Eye className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </Button>
            </div>
          </section>
        )}

        {/* Draggable Thin Vertical Splitter Resizer Bar */}
        <div
          onMouseDown={() => setIsResizing(true)}
          onDoubleClick={() => setSplitPercent(42)}
          className="no-print relative z-30 hidden w-3 shrink-0 cursor-col-resize items-center justify-center select-none lg:flex group -mx-1.5"
          title="Drag left/right to adjust width (Double-click to reset)"
        >
          {/* Thin visual line */}
          <div
            className={cn(
              "h-full w-px bg-black/20 transition-all duration-150 group-hover:w-1 group-hover:bg-emerald-500",
              isResizing && "w-1 bg-emerald-500 shadow-sm",
            )}
          />

          {isLeftCollapsed && (
            <button
              type="button"
              onClick={() => setSplitPercent(42)}
              className="absolute left-2.5 z-40 flex size-7 items-center justify-center rounded-full border border-black/15 bg-white text-black/70 shadow-lg transition-all hover:scale-110 hover:text-black"
              title="Expand Left Panels"
            >
              <ChevronRight className="size-4" />
            </button>
          )}

          {isRightCollapsed && (
            <button
              type="button"
              onClick={() => setSplitPercent(42)}
              className="absolute right-2.5 z-40 flex size-7 items-center justify-center rounded-full border border-black/15 bg-white text-black/70 shadow-lg transition-all hover:scale-110 hover:text-black"
              title="Expand Studio Canvas"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
        </div>

        {/* Resizable Studio Canvas Panel */}
        {!isRightCollapsed && (
          <section
            className={cn(
              "resume-preview-panel relative min-h-0 flex-1 overflow-hidden bg-[#dfe1dc] lg:block",
              showMobilePreview ? "fixed inset-0 z-[80] block" : "hidden",
            )}
          >
            <InteractiveCanvas
              data={data}
              template={template}
              previewTemplate={previewTemplate}
              showPhoto={Boolean(
                resumeStyle.showPhoto && template.supportsPhoto,
              )}
              font={resumeStyle.font}
              resumeStyle={resumeStyle}
              zoom={zoom}
              onZoomChange={setZoom}
              onShowTemplates={() => setShowTemplates(true)}
              onCloseMobilePreview={() => setShowMobilePreview(false)}
              isMobilePreview={showMobilePreview}
              onUpdateData={updateData}
              onUpdateStyle={setResumeStyle}
              onSelectSection={setActiveSection}
            />
          </section>
        )}
      </div>

      {isResizing && (
        <div className="fixed inset-0 z-[9999] cursor-col-resize select-none" />
      )}

      {showTemplates && (
        <div className="no-print fixed inset-0 z-[100] flex items-end justify-center bg-black/35 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="max-h-[92dvh] w-full max-w-6xl overflow-y-auto rounded-t-[24px] bg-[var(--brand-paper)] p-5 shadow-2xl sm:rounded-[24px] sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c65b38]">
                  Original collection
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-[-0.035em]">
                  Choose a template
                </h2>
                <p className="mt-1 text-sm text-[var(--brand-muted)]">
                  Your content stays. Select any template layout for your resume.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplates(false)}
                className="builder-icon-button"
                aria-label="Close templates"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
              {(
                [
                  ["popular", "Most used"],
                  ["all", `All ${resumeTemplates.length}`],
                  ["fresher", "Fresher"],
                  ["professional", "Professional"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTemplateFilter(id)}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-2 text-[11px] font-bold transition",
                    templateFilter === id
                      ? "bg-[var(--brand-ink)] text-white"
                      : "border border-black/10 bg-white text-[var(--brand-muted)]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {filteredTemplates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    selectTemplate(item.id);
                  }}
                  className={cn(
                    "group rounded-2xl border p-2 text-left transition hover:-translate-y-1",
                    templateId === item.id
                      ? "border-[#315f45] bg-[#edf4ef] ring-2 ring-[#315f45]/10"
                      : "border-black/10 bg-white hover:shadow-lg",
                  )}
                >
                  <TemplateThumbnail
                    template={item}
                    className="shadow-md"
                  />
                  <div className="flex items-center justify-between gap-1 px-1 pb-1 pt-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold">{item.name}</p>
                      <p className="truncate text-[9px] text-[var(--brand-muted)]">
                        {item.layout === "sidebar" ? "Sidebar" : "Single column"}
                        {" · "}
                        {item.supportsPhoto ? "Photo" : "Photo-free"}
                      </p>
                    </div>
                    {templateId === item.id && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-lime)]">
                        <Check className="size-3" />
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showTailor && (
        <TailorPanel
          data={data}
          onAddKeywords={addTargetKeywords}
          onClose={() => setShowTailor(false)}
        />
      )}
      {showCustomize && (
        <CustomizePanel
          style={resumeStyle}
          templateAccent={template.accent}
          supportsPhoto={template.supportsPhoto}
          onChange={setResumeStyle}
          onClose={() => setShowCustomize(false)}
        />
      )}
      {showWritingCheck && (
        <WritingCheckPanel
          data={data}
          onChange={updateData}
          onClose={() => setShowWritingCheck(false)}
        />
      )}
    </div>
  );
}
