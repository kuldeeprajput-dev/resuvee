"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Cloud, Download, FileText, Sparkles, RotateCcw, X, Loader2, Bot, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Brand } from "@/shared/components/layout/SiteHeader";
import { cn } from "@/shared/lib/utils";
import type { ResumeData } from "@/modules/resume/types/resume";
import type {
  CoverLetterData,
  CoverLetterTheme,
  CanvasTheme,
  TypographyFont,
  PageSpacing,
  ThemeOption,
  ColorSwatch,
} from "../../types/cover-letter";
import { CoverLetterFormPanel } from "./cover-letter-form-panel";
import { CoverLetterCanvasHeader } from "./cover-letter-canvas-header";
import { CoverLetterCanvasToolbar } from "./cover-letter-canvas-toolbar";
import { CoverLetterFormattingToolbar } from "./cover-letter-formatting-toolbar";
import { CoverLetterPreview } from "./cover-letter-preview";

const STORAGE_KEY = "resulyra_cover_letter";
const RESUME_KEY = "resulyra_builder_draft";

const emptyLetter: CoverLetterData = {
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  recipient: "",
  company: "",
  role: "",
  date: "",
  greeting: "",
  opening: "",
  evidence: "",
  closing: "",
  signoff: "",
};

const themes: ThemeOption[] = [
  {
    id: "linen",
    name: "Linen",
    description: "Warm and editorial",
    accent: "#537c45",
  },
  {
    id: "signal",
    name: "Signal",
    description: "Modern color rail",
    accent: "#1e3a8a",
  },
  {
    id: "ledger",
    name: "Ledger",
    description: "Crisp and traditional",
    accent: "#1c1917",
  },
];

const COLOR_SWATCHES: ColorSwatch[] = [
  { name: "Forest", value: "#28785b" },
  { name: "Charcoal", value: "#1e2320" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Deep Blue", value: "#203b57" },
  { name: "Plum", value: "#581c87" },
];

const themeStyles: Record<CanvasTheme, string> = {
  dots: "bg-[#e5e7e2] [background-image:radial-gradient(#b8beb5_1.2px,transparent_1.2px)] [background-size:20px_20px]",
  grid: "bg-[#e8e9e4] [background-image:linear-gradient(to_right,#d2d6cd_1px,transparent_1px),linear-gradient(to_bottom,#d2d6cd_1px,transparent_1px)] [background-size:24px_24px]",
  studio: "bg-[#1e2320] [background-image:radial-gradient(#3a453f_1.5px,transparent_1.5px)] [background-size:24px_24px]",
  clean: "bg-[#dfe2dc]",
};

function getStarterCopy(data: CoverLetterData) {
  const role = data.role || "this role";
  const company = data.company || "your team";
  return {
    greeting: data.greeting || "Dear hiring team,",
    opening: `I am excited to apply for ${role} at ${company}. My background in ${data.headline || "building thoughtful, measurable work"} has taught me how to turn complex goals into focused action while keeping customers and collaborators at the center.`,
    evidence:
      "In my recent work, I have led cross-functional projects from early discovery through delivery, created practical systems that improved team performance, and communicated decisions clearly across technical and business groups. I would bring that same combination of curiosity, ownership, and steady execution to this opportunity.",
    closing: `I would welcome the chance to learn more about ${company} and discuss how my experience could support the team’s priorities. Thank you for your time and consideration.`,
    signoff: data.signoff || "Sincerely,",
  };
}

export function CoverLetterStudio() {
  const [data, setData] = useState<CoverLetterData>(emptyLetter);
  const [theme, setTheme] = useState<CoverLetterTheme>("linen");
  const [customAccent, setCustomAccent] = useState<string | null>(null);
  const [saveLabel, setSaveLabel] = useState("Saved locally");
  const hasLoaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resizable Editor & Studio Canvas Split State
  const [splitPercent, setSplitPercent] = useState<number>(42);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  const isLeftCollapsed = splitPercent <= 1;
  const isRightCollapsed = splitPercent >= 99;

  // Undo / Redo History Stack
  const [history, setHistory] = useState<CoverLetterData[]>([]);
  const [future, setFuture] = useState<CoverLetterData[]>([]);

  // Interactive Canvas & Design States
  const [font, setFont] = useState<TypographyFont>("template");
  const [pageSpacing, setPageSpacing] = useState<PageSpacing>("normal");
  const [zoom, setZoom] = useState(72);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHandTool, setIsHandTool] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>("dots");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showDesignMenu, setShowDesignMenu] = useState(false);
  const [showTemplatesMenu, setShowTemplatesMenu] = useState(false);

  // Modals & AI Panel States
  const [showStartFreshModal, setShowStartFreshModal] = useState(false);
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [aiRole, setAiRole] = useState("");
  const [aiCompany, setAiCompany] = useState("");
  const [aiHeadline, setAiHeadline] = useState("");
  const [aiKeyPoints, setAiKeyPoints] = useState("");
  const [aiTone, setAiTone] = useState("Professional");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState(false);

  // On-Canvas Selection & Floating Formatting Bar State
  const [selectedField, setSelectedField] = useState<keyof CoverLetterData | null>(null);
  const [highlightRect, setHighlightRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const [inlineText, setInlineText] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDomRef = useRef<HTMLElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Synchronize AI drawer fields with current cover letter data when opened
  useEffect(() => {
    if (showAiDrawer) {
      setAiRole(data.role || "");
      setAiCompany(data.company || "");
      setAiHeadline(data.headline || "");
    }
  }, [showAiDrawer, data.role, data.company, data.headline]);

  // Handle panel width resizing via dragging
  useEffect(() => {
    let animId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !splitContainerRef.current) return;

      const rect = splitContainerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      let percent = (relativeX / rect.width) * 100;

      const minLeftPercent = (440 / rect.width) * 100;
      const maxLeftPercent = ((rect.width - 480) / rect.width) * 100;

      if (percent < 3) percent = 0;
      else if (percent > 97) percent = 100;
      else percent = Math.max(minLeftPercent, Math.min(maxLeftPercent, percent));

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

  // Escape key handler for fullscreen & modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        if (showStartFreshModal) setShowStartFreshModal(false);
        if (showAiDrawer) setShowAiDrawer(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, showStartFreshModal, showAiDrawer]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          data?: CoverLetterData;
          theme?: CoverLetterTheme;
          customAccent?: string;
        };
        if (parsed.data) setData(parsed.data);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.customAccent) setCustomAccent(parsed.customAccent);
      } else {
        const resumeDraft = window.localStorage.getItem(RESUME_KEY);
        if (resumeDraft) {
          const parsed = JSON.parse(resumeDraft) as { data?: ResumeData };
          if (parsed.data) {
            setData((current) => ({
              ...current,
              fullName: parsed.data?.basics.fullName ?? "",
              headline: parsed.data?.basics.headline ?? "",
              email: parsed.data?.basics.email ?? "",
              phone: parsed.data?.basics.phone ?? "",
              location: parsed.data?.basics.location ?? "",
              website: parsed.data?.basics.website ?? "",
            }));
          }
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      hasLoaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    setSaveLabel("Saving…");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data, theme, customAccent })
      );
      setSaveLabel("Saved locally");
    }, 400);
  }, [data, theme, customAccent]);

  const update = (field: keyof CoverLetterData, value: string) => {
    setHistory((prev) => [...prev, data]);
    setFuture([]);
    setData((current) => ({ ...current, [field]: value }));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture((prev) => [data, ...prev]);
    setData(previous);
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((prev) => [...prev, data]);
    setData(next);
    setFuture((prev) => prev.slice(1));
  };

  // Keyboard Shortcuts (Space bar pan, Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsSpacePressed(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [data, history, future]);

  const updateSelectionBounds = useCallback(() => {
    if (!selectedDomRef.current || !containerRef.current) return;

    const targetRect = selectedDomRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const top = targetRect.top - containerRect.top;
    const left = targetRect.left - containerRect.left;

    setHighlightRect({
      top: top - 4,
      left: left - 4,
      width: targetRect.width + 8,
      height: targetRect.height + 8,
    });

    const toolbarWidth = toolbarRef.current?.offsetWidth || 540;
    let computedLeft = left + targetRect.width / 2 - toolbarWidth / 2;
    computedLeft = Math.max(12, Math.min(containerRect.width - toolbarWidth - 16, computedLeft));

    let computedTop = top - 64;
    if (computedTop < 65) {
      computedTop = top + targetRect.height + 14;
    }

    setToolbarPos({
      top: computedTop,
      left: computedLeft,
    });
  }, []);

  useEffect(() => {
    if (!selectedField) return;

    const freshEl = containerRef.current?.querySelector(
      `[data-field="${selectedField}"]`
    ) as HTMLElement | null;
    if (freshEl) {
      selectedDomRef.current = freshEl;
    }

    if (!selectedDomRef.current) return;

    updateSelectionBounds();

    const observer = new ResizeObserver(() => {
      updateSelectionBounds();
    });
    observer.observe(selectedDomRef.current);

    const handleScroll = () => {
      updateSelectionBounds();
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", updateSelectionBounds);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updateSelectionBounds);
    };
  }, [selectedField, inlineText, data, zoom, pan, updateSelectionBounds]);

  const handleSelectField = (e: React.MouseEvent<HTMLElement>, field: keyof CoverLetterData) => {
    if (isHandTool || isSpacePressed) return;
    e.stopPropagation();
    setSelectedField(field);
    selectedDomRef.current = e.currentTarget;
    setInlineText(data[field] || "");
    setTimeout(updateSelectionBounds, 10);
  };

  const clearSelection = () => {
    setSelectedField(null);
    selectedDomRef.current = null;
    setHighlightRect(null);
    setToolbarPos(null);
    setShowColorPicker(false);
  };

  useEffect(() => {
    if (isHandTool || isSpacePressed || showDesignMenu || showTemplatesMenu) {
      clearSelection();
    }
  }, [isHandTool, isSpacePressed, showDesignMenu, showTemplatesMenu]);

  const SECTION_ORDER: (keyof CoverLetterData)[] = [
    "greeting",
    "opening",
    "evidence",
    "closing",
    "signoff",
  ];

  const handleMoveSectionUp = () => {
    if (!selectedField) return;
    const index = SECTION_ORDER.indexOf(selectedField);
    if (index <= 0) return;

    const prevField = SECTION_ORDER[index - 1];
    const currentVal = data[selectedField];
    const prevVal = data[prevField];

    setHistory((prev) => [...prev, data]);
    setFuture([]);
    setData((current) => ({
      ...current,
      [selectedField]: prevVal,
      [prevField]: currentVal,
    }));

    setSelectedField(prevField);
    setInlineText(currentVal);
    setTimeout(updateSelectionBounds, 30);
  };

  const handleMoveSectionDown = () => {
    if (!selectedField) return;
    const index = SECTION_ORDER.indexOf(selectedField);
    if (index === -1 || index >= SECTION_ORDER.length - 1) return;

    const nextField = SECTION_ORDER[index + 1];
    const currentVal = data[selectedField];
    const nextVal = data[nextField];

    setHistory((prev) => [...prev, data]);
    setFuture([]);
    setData((current) => ({
      ...current,
      [selectedField]: nextVal,
      [nextField]: currentVal,
    }));

    setSelectedField(nextField);
    setInlineText(currentVal);
    setTimeout(updateSelectionBounds, 30);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -5 : 5;
      setZoom((prev) => Math.min(Math.max(prev + zoomDelta, 30), 200));
    } else if (isHandTool || isSpacePressed) {
      setPan((prev) => ({
        x: prev.x - e.deltaX * 0.8,
        y: prev.y - e.deltaY * 0.8,
      }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && (isHandTool || isSpacePressed)) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUpCanvas = () => {
    setIsDragging(false);
  };

  // Start fresh handler
  const handleConfirmStartFresh = () => {
    setHistory((prev) => [...prev, data]);
    setFuture([]);
    setData(emptyLetter);
    setCustomAccent("");
    setTheme(themes[0].id);
    clearSelection();

    if (containerRef.current) {
      const styledEls = containerRef.current.querySelectorAll("[data-field]");
      styledEls.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.color = "";
        htmlEl.style.fontSize = "";
        htmlEl.style.textAlign = "";
        htmlEl.style.textTransform = "";
        htmlEl.classList.remove("font-bold", "italic", "underline");
      });
    }

    setShowStartFreshModal(false);
  };

  // Groq AI Generation Handler
  const handleGenerateAiCoverLetter = async () => {
    setIsGeneratingAi(true);
    setAiSuccessMessage(false);
    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: aiRole || data.role,
          company: aiCompany || data.company,
          headline: aiHeadline || data.headline,
          keyPoints: aiKeyPoints,
          tone: aiTone,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setHistory((prev) => [...prev, data]);
        setFuture([]);
        setData((current) => ({
          ...current,
          role: aiRole || current.role,
          company: aiCompany || current.company,
          headline: aiHeadline || current.headline,
          greeting: json.data.greeting || current.greeting,
          opening: json.data.opening || current.opening,
          evidence: json.data.evidence || current.evidence,
          closing: json.data.closing || current.closing,
          signoff: json.data.signoff || current.signoff,
        }));
        setAiSuccessMessage(true);
        setTimeout(() => setAiSuccessMessage(false), 4000);
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Export PDF Handler
  const handleExportPdf = () => {
    clearSelection();
    window.print();
  };

  const activeTheme = themes.find((item) => item.id === theme) ?? themes[0];
  const activeAccent = customAccent || activeTheme.accent;

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[var(--brand-ink)]">
      {/* Pinned Top Navigation Header */}
      <header className="no-print sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/10 bg-[#f8f7f2]/90 px-4 backdrop-blur sm:px-8">
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <Brand />
          </div>
          <span className="hidden h-6 w-px bg-black/10 lg:block" />
          <div className="min-w-0 max-w-[180px] sm:max-w-[300px] md:max-w-[420px]">
            <p className="flex items-center gap-2 text-sm font-bold truncate">
              <FileText className="size-4 shrink-0 text-[var(--brand-muted)]" />
              <span className="truncate">
                {data.fullName
                  ? `${data.fullName}'s Cover Letter`
                  : data.company
                    ? `${data.company} — Cover Letter`
                    : "Cover Letter"}
              </span>
            </p>
          </div>
        </div>

        {/* Top Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAiDrawer(true)}
            className="h-9 rounded-xl border border-black/15 bg-white px-3 sm:px-3.5 text-xs font-bold text-[var(--brand-ink)] shadow-xs transition hover:bg-black/5 hover:border-black/25 flex items-center gap-1.5 cursor-pointer"
            title="Open AI Cover Letter Assistant"
          >
            <Sparkles className="size-3.5 text-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">Writing with AI</span>
            <span className="sm:hidden">AI Write</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStartFreshModal(true)}
            className="h-9 rounded-xl border border-black/15 bg-white px-3 sm:px-3.5 text-xs font-bold text-[var(--brand-ink)] shadow-xs transition hover:bg-black/5 hover:border-black/25 flex items-center gap-1.5 cursor-pointer"
            title="Start fresh with a clean cover letter"
          >
            <RotateCcw className="size-3.5 text-[var(--brand-muted)]" />
            <span className="hidden sm:inline">Start fresh</span>
            <span className="sm:hidden">Fresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="h-9 rounded-xl border border-black/15 bg-white px-3 sm:px-3.5 text-xs font-bold text-[var(--brand-ink)] shadow-xs transition hover:bg-black/5 hover:border-black/25 flex items-center gap-1.5 cursor-pointer"
            title="Export PDF Document"
          >
            <Download className="size-3.5 text-emerald-600" />
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      <main
        ref={splitContainerRef}
        className={cn(
          "relative flex flex-col lg:flex-row h-[calc(100dvh-4rem)] overflow-hidden",
          isResizing && "select-none"
        )}
      >
        {/* Left Form Section with Independent Scrollbar */}
        {!isLeftCollapsed && (
          <CoverLetterFormPanel
            data={data}
            theme={theme}
            themes={themes}
            update={update}
            setData={setData}
            setTheme={setTheme}
            getStarterCopy={getStarterCopy}
            splitPercent={splitPercent}
            isResizing={isResizing}
          />
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

        {/* Right Section Interactive Studio Canvas */}
        {!isRightCollapsed && (
          <section
            style={isFullscreen ? undefined : { width: `${100 - splitPercent}%` }}
            className={cn(
              "resume-preview-panel relative flex flex-col overflow-hidden select-none transition-all duration-300 h-full shrink-0",
              isFullscreen ? "fixed inset-0 z-[120] w-full h-full bg-[#1e2320]" : "",
              isResizing ? "transition-none" : "transition-[width] duration-150 ease-out"
            )}
          >
            {/* Top Studio Canvas Bar */}
            <CoverLetterCanvasHeader
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              showTemplatesMenu={showTemplatesMenu}
              setShowTemplatesMenu={setShowTemplatesMenu}
              showDesignMenu={showDesignMenu}
              setShowDesignMenu={setShowDesignMenu}
              theme={theme}
              setTheme={setTheme}
              themes={themes}
              activeAccent={activeAccent}
              setCustomAccent={setCustomAccent}
              font={font}
              setFont={setFont}
              pageSpacing={pageSpacing}
              setPageSpacing={setPageSpacing}
              colorSwatches={COLOR_SWATCHES}
            />

            {/* Main Interactive Canvas Area */}
            <div
              ref={containerRef}
              onClick={clearSelection}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMoveCanvas}
              onMouseUp={handleMouseUpCanvas}
              onMouseLeave={handleMouseUpCanvas}
              className={cn(
                "canvas-bg resume-preview-stage relative flex-1 overflow-hidden transition-colors duration-300",
                themeStyles[canvasTheme],
                isHandTool || isSpacePressed ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
              )}
            >
              {/* Visual Selection Bounding Box Overlay */}
              {highlightRect && (
                <div
                  className="no-print absolute z-30 pointer-events-none rounded-2xl border-2 border-[#059669] bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all duration-100 ease-out"
                  style={{
                    top: `${highlightRect.top}px`,
                    left: `${highlightRect.left}px`,
                    width: `${highlightRect.width}px`,
                    height: `${highlightRect.height}px`,
                  }}
                >
                  <span className="absolute -bottom-3 right-2 rounded-full bg-[#059669] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                    SELECTED
                  </span>
                </div>
              )}

              {/* Contextual Floating Formatting Bar */}
              {selectedField && toolbarPos && (
                <CoverLetterFormattingToolbar
                  toolbarRef={toolbarRef}
                  toolbarPos={toolbarPos}
                  selectedField={selectedField}
                  inlineText={inlineText}
                  setInlineText={setInlineText}
                  update={update}
                  selectedDomRef={selectedDomRef}
                  showColorPicker={showColorPicker}
                  setShowColorPicker={setShowColorPicker}
                  activeAccent={activeAccent}
                  setCustomAccent={setCustomAccent}
                  colorSwatches={COLOR_SWATCHES}
                  clearSelection={clearSelection}
                  onMoveUp={handleMoveSectionUp}
                  onMoveDown={handleMoveSectionDown}
                />
              )}

              <div className="absolute inset-0 flex items-center justify-center p-8 overflow-auto">
                <div
                  style={{
                    transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 0.15s ease-out",
                  }}
                  className="no-print-transform flex items-center justify-center shadow-2xl"
                >
                  <CoverLetterPreview
                    data={data}
                    theme={theme}
                    accent={activeAccent}
                    font={font}
                    pageSpacing={pageSpacing}
                    onSelectField={handleSelectField}
                    selectedField={selectedField}
                    isHandTool={isHandTool || isSpacePressed}
                  />
                </div>
              </div>

              {/* Bottom Floating Canvas Control Toolbar Pill */}
              <CoverLetterCanvasToolbar
                isHandTool={isHandTool}
                setIsHandTool={setIsHandTool}
                isSpacePressed={isSpacePressed}
                zoom={zoom}
                setZoom={setZoom}
                setPan={setPan}
                historyLength={history.length}
                futureLength={future.length}
                handleUndo={handleUndo}
                handleRedo={handleRedo}
                canvasTheme={canvasTheme}
                setCanvasTheme={setCanvasTheme}
                showThemeMenu={showThemeMenu}
                setShowThemeMenu={setShowThemeMenu}
                showPresetsMenu={showPresetsMenu}
                setShowPresetsMenu={setShowPresetsMenu}
              />
            </div>
          </section>
        )}

        {/* Global drag overlay safeguard during mouse resize */}
        {isResizing && <div className="fixed inset-0 z-[9999] cursor-col-resize select-none" />}
      </main>

      {/* Start Fresh Confirmation Modal */}
      {showStartFreshModal && (
        <div className="no-print fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
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
              All current letter sections and details will be cleared to a completely blank template. Are you sure you want to start fresh?
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
                onClick={handleConfirmStartFresh}
                className="h-9 rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition cursor-pointer"
              >
                Start fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Writing with AI Side-Over Drawer (Right Side Panel) */}
      {showAiDrawer && (
        <div className="no-print fixed inset-0 z-[150] flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in">
          <div className="relative flex h-full w-full sm:w-[420px] flex-col border-l border-black/10 bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <Bot className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--brand-ink)]">
                    AI Writing Assistant
                  </h3>
                  <p className="text-[10px] text-[var(--brand-muted)]">
                    Generate tailored cover letter paragraphs
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiDrawer(false)}
                className="builder-icon-button cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
                  Target Role
                </label>
                <input
                  type="text"
                  value={aiRole}
                  onChange={(e) => setAiRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  className="h-10 w-full rounded-xl border border-black/15 bg-black/5 px-3 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
                  Target Company
                </label>
                <input
                  type="text"
                  value={aiCompany}
                  onChange={(e) => setAiCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="h-10 w-full rounded-xl border border-black/15 bg-black/5 px-3 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
                  Your Title / Specialty
                </label>
                <input
                  type="text"
                  value={aiHeadline}
                  onChange={(e) => setAiHeadline(e.target.value)}
                  placeholder="e.g. Full Stack Engineer with 5+ yrs experience"
                  className="h-10 w-full rounded-xl border border-black/15 bg-black/5 px-3 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
                  Key Skills & Highlights
                </label>
                <textarea
                  rows={3}
                  value={aiKeyPoints}
                  onChange={(e) => setAiKeyPoints(e.target.value)}
                  placeholder="e.g. React, Next.js, performance optimization, leading cross-functional teams"
                  className="w-full rounded-xl border border-black/15 bg-black/5 p-3 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
                  Tone & Style
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {["Professional", "Enthusiastic", "Executive", "Concise"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAiTone(t)}
                      className={cn(
                        "rounded-xl border py-2 text-center text-xs font-bold transition cursor-pointer",
                        aiTone === t
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold"
                          : "border-black/10 bg-white text-[var(--brand-ink)] hover:bg-black/5"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {aiSuccessMessage && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 p-3 text-xs font-bold text-emerald-900 animate-in fade-in">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Cover letter successfully generated with AI!</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-black/10 mt-4">
              <button
                type="button"
                onClick={handleGenerateAiCoverLetter}
                disabled={isGeneratingAi}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-xs font-bold text-white shadow-md transition hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-white" />
                    <span>Writing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 text-emerald-200" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const LetterStudio = CoverLetterStudio;
