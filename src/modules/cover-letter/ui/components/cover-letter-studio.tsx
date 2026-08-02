"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import type {
  CanvasTheme,
  ColorSwatch,
  CoverLetterData,
  CoverLetterTheme,
  PageSpacing,
  ThemeOption,
  TypographyFont,
} from "../../types/cover-letter";
import { CoverLetterHeader } from "./cover-letter-header";
import { CoverLetterFormPanel } from "./cover-letter-form-panel";
import { CoverLetterCanvasHeader } from "./cover-letter-canvas-header";
import { CoverLetterCanvasToolbar } from "./cover-letter-canvas-toolbar";
import { CoverLetterFormattingToolbar } from "./cover-letter-formatting-toolbar";
import { CoverLetterPreview } from "./cover-letter-preview";
import { CoverLetterStartFreshModal } from "./cover-letter-start-fresh-modal";
import { CoverLetterAiDrawer } from "./cover-letter-ai-drawer";

const INITIAL_DATA: CoverLetterData = {
  fullName: "Alex Morgan",
  headline: "Senior Product Specialist",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 019-2834",
  location: "San Francisco, CA",
  website: "alexmorgan.design",
  recipient: "Hiring Team",
  company: "Northstar Labs",
  role: "Product Manager",
  date: "July 27, 2026",
  greeting: "Dear Hiring Team,",
  opening:
    "I am writing to express my strong interest in the Product Manager position at Northstar Labs. Having followed your recent product innovations in automated workflows, I am eager to bring my background in product strategy, cross-functional leadership, and user-centered design to your team.",
  evidence:
    "In my recent role at Apex Systems, I led the redesign of our core dashboard, which increased daily active user retention by 28% within six months. I collaborated closely with engineering and design to streamline onboarding flows, cutting drop-off rates in half. My approach combines rigorous data analysis with empathetic user research to ensure every feature delivers measurable value.",
  closing:
    "I welcome the opportunity to discuss how my experience and passion for intuitive product experiences align with Northstar Labs' goals. Thank you for your time and consideration.",
  signoff: "Sincerely,",
};

const COLOR_SWATCHES: ColorSwatch[] = [
  { name: "Emerald", value: "#059669" },
  { name: "Forest", value: "#28785b" },
  { name: "Slate", value: "#334155" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Wine", value: "#881337" },
  { name: "Charcoal", value: "#1e293b" },
];

const themes: ThemeOption[] = [
  {
    id: "classic",
    name: "Classic",
    accent: "#059669",
    description: "Traditional top bar layout for formal applications",
  },
  {
    id: "signal",
    name: "Signal",
    accent: "#10b981",
    description: "Bold accent strip along left border",
  },
  {
    id: "linen",
    name: "Linen",
    accent: "#047857",
    description: "Soft backdrop element for modern creative roles",
  },
  {
    id: "ledger",
    name: "Ledger",
    accent: "#065f46",
    description: "Serif typography header designed for corporate positions",
  },
];

const themeStyles: Record<CanvasTheme, string> = {
  dots: "bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] bg-[#f8f7f2]",
  grid: "bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] bg-[#f8f7f2]",
  studio: "bg-[#1e2320]",
  clean: "bg-[#e5e7eb]",
};

function getStarterCopy(data: CoverLetterData) {
  const role = data.role || "this role";
  const company = data.company || "your company";
  return {
    greeting: `Dear ${data.recipient || "Hiring Team"},`,
    opening: `I am writing to express my enthusiastic interest in the ${role} position at ${company}.`,
    evidence: `In my previous work, I focused on high-impact execution and team collaboration to deliver reliable results.`,
    closing: `Thank you for your time and consideration. I look forward to discussing how I can contribute to ${company}.`,
    signoff: "Sincerely,",
  };
}

export function CoverLetterStudio() {
  const [data, setData] = useState<CoverLetterData>(INITIAL_DATA);
  const [theme, setTheme] = useState<CoverLetterTheme>("classic");
  const [font, setFont] = useState<TypographyFont>("template");
  const [pageSpacing, setPageSpacing] = useState<PageSpacing>("normal");
  const [customAccent, setCustomAccent] = useState<string>("");

  const [splitPercent, setSplitPercent] = useState<number>(42);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isLeftCollapsed] = useState<boolean>(false);
  const [isRightCollapsed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showDesignMenu, setShowDesignMenu] = useState(false);
  const [showTemplatesMenu, setShowTemplatesMenu] = useState(false);

  const [showStartFreshModal, setShowStartFreshModal] = useState(false);
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [aiRole, setAiRole] = useState(data.role || "");
  const [aiCompany, setAiCompany] = useState(data.company || "");
  const [aiHeadline, setAiHeadline] = useState(data.headline || "");
  const [aiKeyPoints, setAiKeyPoints] = useState("");
  const [aiTone, setAiTone] = useState("Professional");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState(false);

  const [history, setHistory] = useState<CoverLetterData[]>([]);
  const [future, setFuture] = useState<CoverLetterData[]>([]);

  const [selectedField, setSelectedField] = useState<keyof CoverLetterData | null>(null);
  const [inlineText, setInlineText] = useState("");
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [zoom, setZoom] = useState<number>(72);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHandTool, setIsHandTool] = useState<boolean>(false);
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>("dots");
  const [highlightRect, setHighlightRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const splitContainerRef = useRef<HTMLDivElement | null>(null);
  const selectedDomRef = useRef<HTMLElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const update = useCallback((field: keyof CoverLetterData, value: string) => {
    setHistory((prev) => [...prev, data]);
    setFuture([]);
    setData((prev) => ({ ...prev, [field]: value }));
  }, [data]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture((prev) => [data, ...prev]);
    setData(previous);
    setHistory((prev) => prev.slice(0, prev.length - 1));
  }, [history, data]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((prev) => [...prev, data]);
    setData(next);
    setFuture((prev) => prev.slice(1));
  }, [future, data]);

  const clearSelection = useCallback(() => {
    setSelectedField(null);
    setInlineText("");
    selectedDomRef.current = null;
    setShowColorPicker(false);
    setHighlightRect(null);
  }, []);

  const handleSelectField = useCallback(
    (e: React.MouseEvent<HTMLElement>, field: keyof CoverLetterData) => {
      e.stopPropagation();
      if (isHandTool || isSpacePressed) return;

      const target = e.currentTarget;
      selectedDomRef.current = target;
      setSelectedField(field);
      setInlineText(data[field] || "");

      if (containerRef.current) {
        const containerBounds = containerRef.current.getBoundingClientRect();
        const elementBounds = target.getBoundingClientRect();

        setHighlightRect({
          top: elementBounds.top - containerBounds.top - 4,
          left: elementBounds.left - containerBounds.left - 4,
          width: elementBounds.width + 8,
          height: elementBounds.height + 8,
        });

        const top = Math.max(70, elementBounds.top - containerBounds.top - 55);
        const left = Math.max(10, Math.min(containerBounds.width - 420, elementBounds.left - containerBounds.left));
        setToolbarPos({ top, left });
      }
    },
    [data, isHandTool, isSpacePressed]
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!splitContainerRef.current) return;
    const containerRect = splitContainerRef.current.getBoundingClientRect();
    const newPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setSplitPercent(Math.min(Math.max(newPercent, 25), 75));
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        setIsSpacePressed(true);
      }
      if (e.key === "Escape") {
        if (showStartFreshModal) setShowStartFreshModal(false);
        if (showAiDrawer) setShowAiDrawer(false);
        clearSelection();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        handleRedo();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") setIsSpacePressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [showStartFreshModal, showAiDrawer, clearSelection, handleUndo, handleRedo]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomDelta = e.deltaY < 0 ? 5 : -5;
      setZoom((prev) => Math.min(200, Math.max(30, prev + zoomDelta)));
    } else if (isHandTool || isSpacePressed) {
      setPan((prev) => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isHandTool || isSpacePressed) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (isDragging && (isHandTool || isSpacePressed)) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUpCanvas = () => setIsDragging(false);

  const handleConfirmStartFresh = () => {
    setHistory((prev) => [...prev, data]);
    setFuture([]);
    setData({
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
      greeting: "Dear Hiring Manager,",
      opening: "",
      evidence: "",
      closing: "",
      signoff: "Sincerely,",
    });
    setShowStartFreshModal(false);
  };

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

  const handleExportPdf = () => {
    clearSelection();
    window.print();
  };

  const activeTheme = themes.find((item) => item.id === theme) ?? themes[0];
  const activeAccent = customAccent || activeTheme.accent;

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[var(--brand-ink)]">
      <CoverLetterHeader
        data={data}
        onOpenAiDrawer={() => setShowAiDrawer(true)}
        onOpenStartFresh={() => setShowStartFreshModal(true)}
        onExportPdf={handleExportPdf}
      />

      <main
        ref={splitContainerRef}
        className={cn(
          "relative flex flex-col lg:flex-row h-[calc(100dvh-4rem)] overflow-hidden",
          isResizing && "select-none"
        )}
      >
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

        {!isRightCollapsed && (
          <section
            style={isFullscreen ? undefined : { width: `${100 - splitPercent}%` }}
            className={cn(
              "resume-preview-panel relative flex flex-col overflow-hidden select-none transition-all duration-300 h-full shrink-0",
              isFullscreen ? "fixed inset-0 z-[120] w-full h-full bg-[#1e2320]" : "",
              isResizing ? "transition-none" : "transition-[width] duration-150 ease-out"
            )}
          >
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

              <div
                ref={stageRef}
                className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-75 ease-out"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
                  transformOrigin: "center center",
                }}
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

              {selectedField && (
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
      </main>

      {showStartFreshModal && (
        <CoverLetterStartFreshModal
          onClose={() => setShowStartFreshModal(false)}
          onConfirm={handleConfirmStartFresh}
        />
      )}

      {showAiDrawer && (
        <CoverLetterAiDrawer
          onClose={() => setShowAiDrawer(false)}
          aiRole={aiRole}
          setAiRole={setAiRole}
          aiCompany={aiCompany}
          setAiCompany={setAiCompany}
          aiHeadline={aiHeadline}
          setAiHeadline={setAiHeadline}
          aiKeyPoints={aiKeyPoints}
          setAiKeyPoints={setAiKeyPoints}
          aiTone={aiTone}
          setAiTone={setAiTone}
          isGeneratingAi={isGeneratingAi}
          aiSuccessMessage={aiSuccessMessage}
          onGenerate={handleGenerateAiCoverLetter}
        />
      )}
    </div>
  );
}
