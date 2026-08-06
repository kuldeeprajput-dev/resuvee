"use client";

import { Check, ChevronLeft, ChevronRight, Eye, LayoutTemplate } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { builderSections, resumeTemplates } from "../../constants/resume-data";
import { calculateResumeStrength } from "../../constants/resume-seed-data";
import { useResumeBuilderStore } from "../../hooks/use-resume-builder-store";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/modules/auth";
import { getAuthHeaders } from "@/shared/lib/api-headers";
import { ResumeEditor } from "./resume-editor";
import { InteractiveCanvas } from "./interactive-canvas";
import { TailorPanel } from "./tailor-panel";
import { WritingCheckPanel } from "./writing-check-panel";
import { CustomizePanel } from "./customize-panel";
import { ResumeBuilderHeader } from "./resume-builder-header";
import { TemplatePickerPanel, StartFreshModal } from "./resume-builder-panels";
import { ResumeSidebar } from "./resume-sidebar";
import { ResumeStepTrack } from "./resume-step-track";
import { exportResumeDocx } from "../../utils/export-docx";
import { extractTextFromResumeFile, parseExtractedResumeText } from "../../utils/import-resume";
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
  const [isImportingResume, setIsImportingResume] = useState(false);

  const handleUploadResume = async (file: File) => {
    try {
      setIsImportingResume(true);
      const rawText = await extractTextFromResumeFile(file);
      if (!rawText || !rawText.trim()) {
        showToast("Could not extract readable text from uploaded file.", "error");
        return;
      }
      const parsedData = parseExtractedResumeText(rawText, data);
      updateData(parsedData);
      showToast("Resume uploaded and parsed successfully!", "success");
    } catch (err) {
      console.error("Failed to upload resume:", err);
      showToast("Failed to parse uploaded resume file.", "error");
    } finally {
      setIsImportingResume(false);
    }
  };

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
      const activeId =
        storedId && storedId !== "undefined" && storedId !== "null" && storedId !== "new"
          ? storedId
          : undefined;

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
      showToast(
        "Resume Saved",
        "Your resume was saved successfully to your account.",
        "success"
      );
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
  const strength = calculateResumeStrength(data, { fresher: isFresherTemplate });
  const activeIndex = visibleSections.findIndex((section) => section.id === activeSection);

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
      activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
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
      if (percent < 3) percent = 0;
      else if (percent > 97) percent = 100;
      else percent = Math.max(0, Math.min(100, percent));
      if (animId !== null) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(() => setSplitPercent(percent));
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
    return () => { active = false; };
  }, [initialStarter, initialTemplate, initialize]);

  const goToRelativeSection = (direction: -1 | 1) => {
    const target = visibleSections[activeIndex + direction];
    if (target) setActiveSection(target.id);
  };

  const addTargetKeywords = (keywords: string[]) => {
    const targetGroup = data.skillGroups.find(
      (group) => group.name.toLowerCase() === "target role"
    );
    const nextGroups = targetGroup
      ? data.skillGroups.map((group) =>
          group.id === targetGroup.id
            ? { ...group, skills: [...new Set([...group.skills, ...keywords])] }
            : group
        )
      : [
          ...data.skillGroups,
          { id: `target-role-${Date.now()}`, name: "Target role", skills: keywords },
        ];
    updateData({ ...data, skillGroups: nextGroups });
  };

  const previewTemplate = {
    ...template,
    accent: resumeStyle.accent || template.accent,
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#e8e8e2] text-[var(--brand-ink)]">
      <ResumeBuilderHeader
        fullName={data.basics.fullName}
        data={data}
        isSaving={isSaving}
        saveStatus={saveStatus}
        hideLeftSidebar={hideLeftSidebar}
        onSave={handleSaveToCloud}
        onStartFresh={() => setShowStartFreshModal(true)}
        onShowMobilePreview={() => setShowMobilePreview(true)}
        onShowTailor={() => setShowTailor(true)}
        onShowWritingCheck={() => setShowWritingCheck(true)}
        onExportPdf={() => window.print()}
        onExportDocx={async () => await exportResumeDocx(data, template.accent)}
        onUploadResume={handleUploadResume}
        isImportingResume={isImportingResume}
      />

      <div
        ref={containerRef}
        className={cn(
          "relative flex h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] w-full max-w-full overflow-hidden",
          isResizing && "select-none"
        )}
      >
        {/* Left Section Sidebar (Desktop) */}
        <ResumeSidebar
          isFresherTemplate={isFresherTemplate}
          strength={strength}
          visibleSections={visibleSections}
          activeSection={activeSection}
          activeIndex={activeIndex}
          hideLeftSidebar={hideLeftSidebar}
          setActiveSection={setActiveSection}
          setShowTemplates={setShowTemplates}
        />

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
            {/* Horizontal Step Pill Track & Navigation */}
            <ResumeStepTrack
              hideLeftSidebar={hideLeftSidebar}
              showLeftFade={showLeftFade}
              showRightFade={showRightFade}
              navScrollRef={navScrollRef}
              visibleSections={visibleSections}
              activeSection={activeSection}
              activeIndex={activeIndex}
              setActiveSection={setActiveSection}
              goToRelativeSection={goToRelativeSection}
            />

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

      {/* Template Picker Overlay */}
      {showTemplates && (
        <TemplatePickerPanel
          templateId={templateId}
          templateFilter={templateFilter}
          onSelectTemplate={selectTemplate}
          onFilterChange={setTemplateFilter}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Start Fresh Modal */}
      {showStartFreshModal && (
        <StartFreshModal
          onConfirm={() => { clearResume(); setShowStartFreshModal(false); }}
          onCancel={() => setShowStartFreshModal(false)}
        />
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
