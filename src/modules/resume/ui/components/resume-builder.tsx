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
  LayoutTemplate,
  Loader2,
  RotateCcw,
  ScanSearch,
  SpellCheck2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { builderSections, calculateResumeStrength, resumeTemplates } from "../../utils/resume-data";
import { useResumeBuilderStore } from "../../store/use-resume-builder-store";
import { Brand } from "@/shared/components/layout/SiteHeader";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/modules/auth";
import { getAuthHeaders } from "@/shared/lib/api-headers";
import { ResumeEditor } from "./resume-editor";
import { InteractiveCanvas } from "./interactive-canvas";
import { TemplateThumbnail } from "./template-thumbnail";
import { TailorPanel } from "./tailor-panel";
import { WritingCheckPanel } from "./writing-check-panel";
import { CustomizePanel } from "./customize-panel";
import { useNotification } from "@/shared/lib/use-notification";

interface ResumeBuilderProps {
  initialTemplate?: string;
  initialStarter?: string;
}

export function ResumeBuilder({ initialTemplate, initialStarter }: ResumeBuilderProps) {
  const showToast = useNotification((state) => state.showToast);
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
    startFresh: clearResume,
  } = useResumeBuilderStore();

  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    async function loadCloudResume() {
      if (!user) return;
      try {
        const storedId = typeof window !== "undefined" ? localStorage.getItem("active-resume-id") : null;
        if (storedId === "new") return;

        if (storedId && storedId !== "undefined" && storedId !== "null") {
          const authHeaders = await getAuthHeaders();
          const res = await fetch("/api/resumes", { headers: authHeaders });
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const target = json.data.find((item: any) => item.id === storedId);
            if (target && target.data) {
              updateData(target.data);
            }
          }
        }
      } catch (err) {
        console.error("Cloud fetch initial resume error:", err);
      }
    }
    loadCloudResume();
  }, [user, updateData]);

  const handleSaveToCloud = async () => {
    if (!user) {
      openAuthModal("sign_in", "Please sign in to save your resume to your account.");
      return;
    }
    setIsSaving(true);
    try {
      const storedId = typeof window !== "undefined" ? localStorage.getItem("active-resume-id") : null;
      const activeId = storedId && storedId !== "undefined" && storedId !== "null" && storedId !== "new" ? storedId : undefined;

      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          id: activeId,
          title: data.basics.fullName ? `${data.basics.fullName}'s Resume` : "Untitled Resume",
          targetRole: data.basics.headline || "",
          data,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Could not save resume.");
      }

      const resumeId = json.data?.id || `local-${Date.now()}`;
      if (typeof window !== "undefined") {
        localStorage.setItem("active-resume-id", resumeId);
        try {
          const localListRaw = localStorage.getItem("local-saved-resumes");
          const localList: any[] = localListRaw ? JSON.parse(localListRaw) : [];
          const newItem = {
            id: resumeId,
            title: data.basics.fullName ? `${data.basics.fullName}'s Resume` : "Untitled Resume",
            target_role: data.basics.headline || "",
            data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          const updatedList = [newItem, ...localList.filter((item) => item.id !== resumeId)];
          localStorage.setItem("local-saved-resumes", JSON.stringify(updatedList));
        } catch (e) {
          console.error("Local backup error:", e);
        }
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: any) {
      console.error("Save error:", err);
      showToast("Save Error", err.message || "Failed to save resume.", "error");
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const template =
    resumeTemplates.find((item) => item.id === templateId) ??
    resumeTemplates.find((item) => item.id === "standard") ??
    resumeTemplates[0];
  const isFresherTemplate = template.audience === "fresher";
  const visibleSections = template.sections
    .map((sectionId) => builderSections.find((section) => section.id === sectionId))
    .filter((section): section is (typeof builderSections)[number] => Boolean(section));
  const strength = calculateResumeStrength(data, {
    fresher: isFresherTemplate,
  });
  const activeIndex = visibleSections.findIndex((section) => section.id === activeSection);
  const filteredTemplates = resumeTemplates.filter((item) => {
    if (templateFilter === "popular") return item.popular;
    if (templateFilter === "fresher") return item.audience === "fresher";
    if (templateFilter === "professional") {
      return item.audience !== "fresher";
    }
    return true;
  });

  // Resizable Editor & Studio Canvas Split State
  const [showStartFreshModal, setShowStartFreshModal] = useState<boolean>(false);
  const [splitPercent, setSplitPercent] = useState<number>(42);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(1400);
  const containerRef = useRef<HTMLDivElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      } else if (typeof window !== "undefined") {
        setContainerWidth(window.innerWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const isLeftCollapsed = splitPercent <= 1;
  const isRightCollapsed = splitPercent >= 99;
  const totalLeftWidthPx = (splitPercent / 100) * containerWidth;
  const hideLeftSidebar = isLeftCollapsed || totalLeftWidthPx < 560;

  const [showLeftFade, setShowLeftFade] = useState<boolean>(false);
  const [showRightFade, setShowRightFade] = useState<boolean>(true);

  const checkScrollFades = useCallback(() => {
    if (!navScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
    setShowLeftFade(scrollLeft > 6);
    setShowRightFade(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;

    checkScrollFades();
    el.addEventListener("scroll", checkScrollFades, { passive: true });
    window.addEventListener("resize", checkScrollFades);

    return () => {
      el.removeEventListener("scroll", checkScrollFades);
      window.removeEventListener("resize", checkScrollFades);
    };
  }, [checkScrollFades, visibleSections]);

  useEffect(() => {
    if (!navScrollRef.current) return;
    const activeBtn = navScrollRef.current.querySelector<HTMLButtonElement>(
      `[data-section-id="${activeSection}"]`
    );
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
    setTimeout(checkScrollFades, 250);
  }, [activeSection, checkScrollFades]);

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
    setShowStartFreshModal(true);
  };

  const addTargetKeywords = (keywords: string[]) => {
    const targetGroup = data.skillGroups.find(
      (group) => group.name.toLowerCase() === "target role"
    );
    const nextGroups = targetGroup
      ? data.skillGroups.map((group) =>
          group.id === targetGroup.id
            ? {
                ...group,
                skills: [...new Set([...group.skills, ...keywords])],
              }
            : group
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
      <header className="no-print flex h-14 sm:h-16 items-center justify-between border-b border-black/10 bg-[var(--brand-paper)] px-3 sm:px-5">
        <div className="flex h-full items-center min-w-0">
          {/* Logo Section matched to Left Sidebar width (w-[220px]) */}
          <div
            className={cn(
              "flex h-full items-center px-1 sm:px-5",
              !hideLeftSidebar ? "lg:w-[220px] lg:shrink-0 lg:justify-center" : "w-auto"
            )}
          >
            <Link
              href="/"
              aria-label="Back to home"
              className="flex size-8 sm:size-9 items-center justify-center rounded-xl border border-black/10 text-[var(--brand-muted)] transition hover:bg-black/5 hover:text-[var(--brand-ink)] lg:hidden shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="hidden lg:block">
              <Brand />
            </div>
          </div>

          {/* Document Title */}
          <div className="min-w-0 pl-1.5 sm:pl-1">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <FileText className="hidden size-4 shrink-0 text-[var(--brand-muted)] sm:block" />
              <p
                className="hidden max-w-[100px] truncate text-xs font-bold sm:block sm:max-w-[220px] sm:text-sm md:max-w-[300px] lg:max-w-[380px]"
                title={
                  data.basics.fullName ? `${data.basics.fullName} — Resume` : "Untitled resume"
                }
              >
                {data.basics.fullName ? `${data.basics.fullName} — Resume` : "Untitled resume"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowWritingCheck(true)}
            className="hidden h-9 sm:h-10 rounded-xl border-black/10 bg-white px-2.5 sm:px-3 text-xs font-bold lg:inline-flex"
          >
            <SpellCheck2 className="size-4 text-emerald-600" />
            Check with AI
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowTailor(true)}
            className="hidden h-9 sm:h-10 rounded-xl border-black/10 bg-white px-2.5 sm:px-3 text-xs font-bold sm:inline-flex"
          >
            <ScanSearch className="size-4 text-[var(--brand-ink)]" />
            Role match
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleSaveToCloud}
            disabled={isSaving}
            className="h-8.5 sm:h-10 rounded-xl border-black/10 bg-white px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold text-[var(--brand-ink)] shadow-2xs transition cursor-pointer"
            title="Save resume to your account"
          >
            {isSaving ? (
              <Loader2 className="size-3.5 sm:size-4 animate-spin text-emerald-600" />
            ) : saveStatus === "saved" ? (
              <Check className="size-3.5 sm:size-4 text-emerald-600" />
            ) : (
              <Cloud className="size-3.5 sm:size-4 text-emerald-600" />
            )}
            <span>{isSaving ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={startFresh}
            className="hidden h-9 sm:h-10 rounded-xl border-black/10 bg-white px-2.5 sm:px-3 text-xs font-bold text-[var(--brand-ink)] md:inline-flex"
          >
            <FilePlus2 className="size-4 text-[var(--brand-muted)]" />
            Start fresh
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMobilePreview(true)}
            className="h-8.5 sm:h-10 rounded-xl border-black/10 bg-white px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold lg:hidden"
          >
            <Eye className="size-3.5 sm:size-4 text-emerald-600" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={exportResume}
            className="h-8.5 sm:h-10 rounded-xl border-black/10 bg-white px-2.5 sm:px-3.5 text-[11px] sm:text-xs font-bold text-[var(--brand-ink)]"
          >
            <Download className="size-3.5 sm:size-4 text-emerald-600" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </header>

      <div
        ref={containerRef}
        className={cn(
          "relative flex h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] w-full max-w-full overflow-hidden",
          isResizing && "select-none"
        )}
      >
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

          <nav
            className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4"
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

        {/* Resizable Left Editor Panel */}
        {!isLeftCollapsed && (
          <section
            className={cn(
              "no-print flex min-h-0 w-full max-w-full flex-col border-r border-black/10 bg-[#f7f6f1] lg:w-auto",
              isResizing ? "transition-none" : "transition-[width] duration-150 ease-out",
              isRightCollapsed ? "flex-1" : "lg:shrink-0"
            )}
            style={
              isRightCollapsed || containerWidth < 1024
                ? undefined
                : {
                    width: hideLeftSidebar
                      ? `${Math.max(540, totalLeftWidthPx)}px`
                      : `${Math.max(540, totalLeftWidthPx - 220)}px`,
                  }
            }
          >
            {/* Horizontal Step Pill Track (Only visible when left sidebar is hidden) */}
            <div
              className={cn(
                "relative flex items-center border-b border-black/[0.06] bg-[#f7f6f1] py-1.5 px-3",
                !hideLeftSidebar && "hidden"
              )}
            >
              {/* Left Edge Fade Overlay */}
              <div
                className={cn(
                  "pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-[#f7f6f1] via-[#f7f6f1]/80 to-transparent transition-opacity duration-200",
                  showLeftFade ? "opacity-100" : "opacity-0"
                )}
              />

              {/* Carousel Track */}
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

              {/* Right Edge Fade Overlay */}
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

            <div className="min-h-0 flex-1 overflow-y-auto">
              <ResumeEditor
                activeSection={activeSection}
                data={data}
                onChange={updateData}
                template={template}
              />
            </div>

            <div className="flex h-14 shrink-0 items-center justify-between border-t border-black/10 bg-white/80 px-3 backdrop-blur sm:h-[64px] sm:px-7">
              <Button
                type="button"
                variant="outline"
                onClick={() => goToRelativeSection(-1)}
                disabled={activeIndex === 0}
                className="h-9 rounded-xl border-black/10 bg-white px-3 text-xs font-bold text-[var(--brand-ink)] shadow-xs transition hover:bg-black/5 disabled:opacity-30 cursor-pointer sm:h-10 sm:px-3.5"
              >
                <ChevronLeft className="size-3.5 text-[var(--brand-muted)] sm:size-4" />
                Back
              </Button>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--brand-muted)]">
                {activeIndex + 1} / {visibleSections.length}
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (activeIndex === visibleSections.length - 1) {
                    setShowMobilePreview(true);
                  } else {
                    goToRelativeSection(1);
                  }
                }}
                className="h-9 rounded-xl border-black/10 bg-white px-3.5 text-xs font-bold text-[var(--brand-ink)] shadow-xs transition hover:bg-black/5 cursor-pointer sm:h-10 sm:px-4"
              >
                <span>{activeIndex === visibleSections.length - 1 ? "Preview" : "Continue"}</span>
                {activeIndex === visibleSections.length - 1 ? (
                  <Eye className="size-3.5 text-emerald-600 sm:size-4" />
                ) : (
                  <ChevronRight className="size-3.5 text-emerald-600 sm:size-4" />
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
              "h-full w-px bg-black/20 transition-colors duration-150 group-hover:bg-emerald-500",
              isResizing && "bg-emerald-500 shadow-sm"
            )}
          />
        </div>

        {/* Resizable Studio Canvas Panel */}
        {!isRightCollapsed && (
          <section
            className={cn(
              "resume-preview-panel relative min-h-0 flex-1 overflow-hidden bg-[#dfe1dc] lg:block",
              showMobilePreview ? "fixed inset-0 z-[80] block" : "hidden"
            )}
          >
            <InteractiveCanvas
              data={data}
              template={template}
              previewTemplate={previewTemplate}
              showPhoto={Boolean(resumeStyle.showPhoto && template.supportsPhoto)}
              font={resumeStyle.font}
              resumeStyle={resumeStyle}
              zoom={zoom}
              onZoomChange={setZoom}
              onShowTemplates={() => setShowTemplates(true)}
              onShowWritingCheck={() => setShowWritingCheck(true)}
              onShowTailor={() => setShowTailor(true)}
              onCloseMobilePreview={() => setShowMobilePreview(false)}
              isMobilePreview={showMobilePreview}
              onUpdateData={updateData}
              onUpdateStyle={setResumeStyle}
              onSelectSection={setActiveSection}
            />
          </section>
        )}
      </div>

      {isResizing && <div className="fixed inset-0 z-[9999] cursor-col-resize select-none" />}

      {showTemplates && (
        <div className="no-print fixed inset-0 z-[200] flex items-end justify-center bg-black/35 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="max-h-[92dvh] w-full max-w-6xl overflow-y-auto rounded-t-[24px] bg-[var(--brand-paper)] p-5 shadow-2xl sm:rounded-[24px] sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c65b38]">
                  Original collection
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-[-0.035em]">Choose a template</h2>
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
                      : "border border-black/10 bg-white text-[var(--brand-muted)]"
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
                      : "border-black/10 bg-white hover:shadow-lg"
                  )}
                >
                  <TemplateThumbnail template={item} size="picker" className="mx-auto shadow-md" />
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

      {/* Start Fresh Confirmation Modal */}
      {showStartFreshModal && (
        <div className="no-print fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-black/15 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <RotateCcw className="size-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--brand-ink)]">Start fresh?</h3>
                <p className="text-xs text-[var(--brand-muted)]">Clear all text and start blank</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[var(--brand-muted)] mb-6">
              All current resume sections and details will be cleared to a completely blank template.
              Are you sure you want to start fresh?
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowStartFreshModal(false)}
                className="h-9 rounded-xl border border-black/15 bg-white px-4 text-xs font-bold text-[var(--brand-ink)] hover:bg-black/5 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearResume();
                  setShowStartFreshModal(false);
                }}
                className="h-9 rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition cursor-pointer"
              >
                Start fresh
              </button>
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
          onSelectSection={(section) => setActiveSection(section)}
        />
      )}
    </div>
  );
}
