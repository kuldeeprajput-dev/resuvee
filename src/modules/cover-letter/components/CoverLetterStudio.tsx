"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Cloud, Download, FileText } from "lucide-react";
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
} from "../types/cover-letter";
import { CoverLetterFormPanel } from "./CoverLetterFormPanel";
import { CoverLetterCanvasHeader } from "./CoverLetterCanvasHeader";
import { CoverLetterCanvasToolbar } from "./CoverLetterCanvasToolbar";
import { CoverLetterFormattingToolbar } from "./CoverLetterFormattingToolbar";
import { CoverLetterPreview } from "./CoverLetterPreview";

const STORAGE_KEY = "resulyra_cover_letter";
const RESUME_KEY = "resulyra_builder_draft";

const emptyLetter: CoverLetterData = {
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  recipient: "Hiring Manager",
  company: "",
  role: "",
  date: new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  greeting: "Dear hiring team,",
  opening: "",
  evidence: "",
  closing: "",
  signoff: "Sincerely,",
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
    opening: `I am excited to apply for ${role} at ${company}. My background in ${data.headline || "building thoughtful, measurable work"} has taught me how to turn complex goals into focused action while keeping customers and collaborators at the center.`,
    evidence:
      "In my recent work, I have led cross-functional projects from early discovery through delivery, created practical systems that improved team performance, and communicated decisions clearly across technical and business groups. I would bring that same combination of curiosity, ownership, and steady execution to this opportunity.",
    closing: `I would welcome the chance to learn more about ${company} and discuss how my experience could support the team’s priorities. Thank you for your time and consideration.`,
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

  // Escape key handler for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

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

    let computedTop = top - 52;
    if (computedTop < 65) {
      computedTop = top + targetRect.height + 12;
    }

    setToolbarPos({
      top: computedTop,
      left: computedLeft,
    });
  }, []);

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
    if (isHandTool || isSpacePressed) {
      clearSelection();
    }
  }, [isHandTool, isSpacePressed]);

  useEffect(() => {
    if (!selectedField) return;
    window.addEventListener("resize", updateSelectionBounds);
    return () => window.removeEventListener("resize", updateSelectionBounds);
  }, [selectedField, updateSelectionBounds]);

  useEffect(() => {
    if (selectedField) {
      updateSelectionBounds();
    }
  }, [zoom, pan, data, selectedField, updateSelectionBounds]);

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
          <div>
            <p className="flex items-center gap-2 text-sm font-bold">
              <FileText className="size-4 text-[var(--brand-muted)]" />
              {data.company ? `${data.company} — Letter` : "Untitled letter"}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-[var(--brand-muted)]">
              <Cloud className="size-3" />
              {saveLabel}
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => window.print()}
          className="h-10 rounded-xl bg-[var(--brand-ink)] px-4 font-bold text-white shadow-sm hover:bg-black/80 cursor-pointer"
        >
          <Download className="size-4" />
          Export PDF
        </Button>
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
              "relative flex flex-col overflow-hidden select-none transition-all duration-300 h-full shrink-0",
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
                "canvas-bg relative flex-1 overflow-hidden transition-colors duration-300",
                themeStyles[canvasTheme],
                isHandTool || isSpacePressed ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
              )}
            >
              {/* Visual Selection Bounding Box Overlay */}
              {highlightRect && (
                <div
                  className="no-print absolute z-30 pointer-events-none rounded-md ring-2 ring-emerald-500 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all duration-100 ease-out"
                  style={{
                    top: `${highlightRect.top}px`,
                    left: `${highlightRect.left}px`,
                    width: `${highlightRect.width}px`,
                    height: `${highlightRect.height}px`,
                  }}
                >
                  <span className="absolute -bottom-2.5 right-1 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[7.5px] font-extrabold uppercase tracking-widest text-white shadow-xs">
                    Selected
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
    </div>
  );
}

export const LetterStudio = CoverLetterStudio;
