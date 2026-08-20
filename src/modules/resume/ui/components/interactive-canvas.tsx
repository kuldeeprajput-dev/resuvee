"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/modules/auth";
import { getAuthHeaders } from "@/shared/lib/api-headers";
import { Maximize2, Minimize2 } from "lucide-react";
import type { BuilderSection, ResumeData, ResumeTemplate } from "../../types/resume";
import { useResumeBuilderStore } from "../../hooks/use-resume-builder-store";
import { PaginatedResumePreview } from "./paginated-resume-preview";
import { resumeFontClass, type ResumeStyle } from "./customize-panel";
import { cn } from "@/shared/lib/utils";
import { CanvasTopBar } from "./canvas-toolbar-top";
import { CanvasBottomToolbar } from "./canvas-toolbar-bottom";
import { CanvasFormattingBar } from "./canvas-formatting-bar";
import { CanvasSelectionOverlay } from "./canvas-selection-overlay";
import { findSelectedCanvasElement } from "../../constants/canvas-element-finder";
import {
  updateDataForFieldChange,
  duplicateSelectedItem,
  deleteSelectedItem,
} from "../../constants/canvas-data-updates";
import { useCanvasInteraction } from "../../hooks/use-canvas-interaction";

export type CanvasTheme = "dots" | "grid" | "studio" | "clean";

export interface SelectedCanvasElement {
  section: "basics" | "experience" | "education" | "projects" | "skills" | "certifications";
  id?: string;
  field?: string;
  highlightIndex?: number;
  title: string;
  subtitle?: string;
}

interface InteractiveCanvasProps {
  data: ResumeData;
  template: ResumeTemplate;
  previewTemplate: ResumeTemplate;
  showPhoto: boolean;
  font: ResumeStyle["font"];
  resumeStyle?: ResumeStyle;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onShowTemplates: () => void;
  onShowWritingCheck?: () => void;
  onShowTailor?: () => void;
  onCloseMobilePreview?: () => void;
  isMobilePreview?: boolean;
  onUpdateData?: (data: ResumeData) => void;
  onUpdateStyle?: (style: ResumeStyle) => void;
  onSelectSection?: (section: BuilderSection) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onExportPdf?: () => void;
  onExportDocx?: () => void;
  isExportingDocx?: boolean;
  exportDocxStatus?: "idle" | "exported" | "error";
  onUploadResume?: (file: File) => void;
  isImportingResume?: boolean;
  uploadFileInputRef?: React.RefObject<HTMLInputElement | null>;
  onSave?: () => void;
  isSaving?: boolean;
  saveStatus?: "idle" | "saved" | "error";
}

const ZOOM_PRESETS = [
  { label: "25%", value: 25 },
  { label: "50%", value: 50 },
  { label: "75%", value: 75 },
  { label: "100%", value: 100 },
  { label: "125%", value: 125 },
  { label: "150%", value: 150 },
  { label: "200%", value: 200 },
  { label: "300%", value: 300 },
];

const COLOR_SWATCHES = [
  { name: "Forest", value: "#28785b" },
  { name: "Ink", value: "#243934" },
  { name: "Ocean", value: "#2f6fa3" },
  { name: "Navy", value: "#203b57" },
  { name: "Plum", value: "#6c4c70" },
];

export function InteractiveCanvas({
  data,
  template,
  previewTemplate,
  showPhoto,
  font,
  resumeStyle,
  zoom,
  onZoomChange,
  onShowTemplates,
  onShowWritingCheck,
  onShowTailor,
  onCloseMobilePreview,
  isMobilePreview = false,
  onUpdateData,
  onUpdateStyle,
  onSelectSection,
  canUndo: propCanUndo,
  canRedo: propCanRedo,
  onUndo,
  onRedo,
  onExportPdf,
  onExportDocx,
  isExportingDocx,
  exportDocxStatus,
  onUploadResume,
  isImportingResume,
  uploadFileInputRef,
  onSave,
  isSaving,
  saveStatus,
}: InteractiveCanvasProps) {
  const storeUndo = useResumeBuilderStore((state) => state.undo);
  const storeRedo = useResumeBuilderStore((state) => state.redo);
  const history = useResumeBuilderStore((state) => state.history);
  const future = useResumeBuilderStore((state) => state.future);

  const canUndo = propCanUndo || history.length > 0;
  const canRedo = propCanRedo || future.length > 0;
  const handleUndo = onUndo ?? storeUndo;
  const handleRedo = onRedo ?? storeRedo;

  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const selectedDomRef = useRef<HTMLElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [isHandTool, setIsHandTool] = useState(false);
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>("dots");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Menus
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showDesignMenu, setShowDesignMenu] = useState(false);

  // Direct On-Canvas Element Selection, Bounding Highlight & Real-Time Toolbar State
  const [selectedElement, setSelectedElement] = useState<SelectedCanvasElement | null>(null);
  const [inlineText, setInlineText] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);

  const clearSelection = useCallback(() => {
    if (selectedDomRef.current) {
      selectedDomRef.current.classList.remove("resume-field-active");
    }
    setSelectedElement(null);
    setShowColorPicker(false);
    setIsExpanded(false);
    selectedDomRef.current = null;
  }, []);

  const {
    pan,
    isDragging,
    activeHand,
    highlightRect,
    toolbarPos,
    updateSelectionBounds,
    resetPanAndZoom,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    fitToWidth,
    fitToPage,
  } = useCanvasInteraction({
    zoom,
    onZoomChange,
    selectedElement,
    inlineText,
    data,
    isHandTool,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    clearSelection,
    containerRef,
    selectedDomRef,
    toolbarRef,
  });

  const handleAiRefine = async () => {
    if (!user) {
      openAuthModal("sign_in", "Please sign in to refine text with AI.");
      return;
    }

    const trimmed = (inlineText || "").trim();
    if (!trimmed || trimmed.length < 15 || isRefining) return;
    setIsRefining(true);

    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/refine-text", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          text: trimmed,
          fieldName: selectedElement?.field || selectedElement?.title || "resume section",
        }),
      });

      if (res.status === 401) {
        openAuthModal("sign_in", "Please sign in to refine text with AI.");
        return;
      }

      if (!res.ok) throw new Error("Refinement failed");
      const dataRes = await res.json();
      if (dataRes.refinedText) {
        handleRealtimeTextChange(dataRes.refinedText);
      }
    } catch (err) {
      console.error("AI Refine Error:", err);
    } finally {
      setIsRefining(false);
    }
  };

  // Direct Granular Element Click Handler + Left Editor Step Sync
  const handleSheetClick = (e: React.MouseEvent) => {
    if (activeHand || isDragging || (typeof window !== "undefined" && window.innerWidth < 1024))
      return;

    const target = e.target as HTMLElement;
    const container = containerRef.current;
    if (!container) return;

    const elem = target.closest("h1, h2, h3, h4, p, li, span, a") || target;
    if (
      !elem ||
      elem.tagName.toLowerCase() === "article" ||
      elem.tagName.toLowerCase() === "section"
    ) {
      clearSelection();
      return;
    }
    if (selectedDomRef.current) {
      selectedDomRef.current.classList.remove("resume-field-active");
    }
    const newElem = elem as HTMLElement;
    selectedDomRef.current = newElem;
    newElem.classList.add("resume-field-active");

    const clickedText = elem.textContent?.trim() || "";
    const { found, inlineText: text } = findSelectedCanvasElement(
      clickedText,
      elem as HTMLElement,
      data
    );

    setInlineText(text);
    setSelectedElement(found);
    requestAnimationFrame(() => updateSelectionBounds());

    // Sync section with Left-Side Editor
    onSelectSection?.(found.section);
  };

  // REAL-TIME INSTANT TYPING UPDATE FOR SPECIFIC FIELD
  const handleRealtimeTextChange = (newText: string) => {
    setInlineText(newText);
    if (selectedDomRef.current) {
      selectedDomRef.current.textContent = newText;
    }
    requestAnimationFrame(() => updateSelectionBounds());
    if (!selectedElement || !onUpdateData) return;

    const nextData = updateDataForFieldChange(data, selectedElement, newText);
    onUpdateData(nextData);
  };

  // Localized Micro-Formatting Tools
  const changeFontSize = (delta: number) => {
    if (!selectedDomRef.current) return;
    const currentSize = parseFloat(window.getComputedStyle(selectedDomRef.current).fontSize) || 14;
    const newSize = Math.max(8, Math.min(48, currentSize + delta));
    selectedDomRef.current.style.fontSize = `${newSize}px`;
    requestAnimationFrame(() => updateSelectionBounds());
  };

  const toggleBold = () => {
    if (!selectedDomRef.current) return;
    const weight = window.getComputedStyle(selectedDomRef.current).fontWeight;
    const isBold = weight === "700" || weight === "bold";
    selectedDomRef.current.style.fontWeight = isBold ? "normal" : "bold";
    requestAnimationFrame(() => updateSelectionBounds());
  };

  const toggleItalic = () => {
    if (!selectedDomRef.current) return;
    const style = window.getComputedStyle(selectedDomRef.current).fontStyle;
    const isItalic = style === "italic";
    selectedDomRef.current.style.fontStyle = isItalic ? "normal" : "italic";
    requestAnimationFrame(() => updateSelectionBounds());
  };

  const setTextAlign = (align: "left" | "center" | "right") => {
    if (!selectedDomRef.current) return;
    selectedDomRef.current.style.textAlign = align;
    requestAnimationFrame(() => updateSelectionBounds());
  };

  const toggleCase = () => {
    if (!inlineText) return;
    let nextText = inlineText;
    if (inlineText === inlineText.toUpperCase()) {
      nextText = inlineText.toLowerCase();
    } else if (inlineText === inlineText.toLowerCase()) {
      nextText = inlineText.replace(/\b\w/g, (c) => c.toUpperCase());
    } else {
      nextText = inlineText.toUpperCase();
    }
    setInlineText(nextText);
    if (selectedDomRef.current) {
      selectedDomRef.current.textContent = nextText;
    }
    handleRealtimeTextChange(nextText);
    requestAnimationFrame(() => updateSelectionBounds());
  };

  const clearFormatting = () => {
    if (!selectedDomRef.current) return;
    selectedDomRef.current.style.fontSize = "";
    selectedDomRef.current.style.fontWeight = "";
    selectedDomRef.current.style.fontStyle = "";
    selectedDomRef.current.style.textAlign = "";
    selectedDomRef.current.style.color = "";
    selectedDomRef.current.style.textTransform = "";
    selectedDomRef.current.style.letterSpacing = "";
    selectedDomRef.current.style.lineHeight = "";
    selectedDomRef.current.style.textDecoration = "";
    selectedDomRef.current.style.background = "";
    selectedDomRef.current.style.backgroundColor = "";

    const children = selectedDomRef.current.querySelectorAll("*");
    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        child.style.fontSize = "";
        child.style.fontWeight = "";
        child.style.fontStyle = "";
        child.style.textAlign = "";
        child.style.color = "";
        child.style.textTransform = "";
      }
    });

    requestAnimationFrame(() => updateSelectionBounds());
  };

  // Duplicate Selected Item
  const duplicateSelected = () => {
    if (!selectedElement || !onUpdateData) return;
    const nextData = duplicateSelectedItem(data, selectedElement);
    if (nextData) {
      onUpdateData(nextData);
    }
  };

  // Delete Selected Item or Clear Field
  const deleteSelected = () => {
    setInlineText("");
    if (selectedDomRef.current) {
      selectedDomRef.current.textContent = "";
    }
    if (selectedElement && onUpdateData) {
      const nextData = deleteSelectedItem(data, selectedElement);
      onUpdateData(nextData);
    }
    clearSelection();
  };

  // Background style classes
  const themeStyles: Record<CanvasTheme, string> = {
    dots: "bg-[#e5e7e2] bg-[radial-gradient(#b8beb5_1.2px,transparent_1.2px)] bg-size-[20px_20px]",
    grid: "bg-[#e8e9e4] bg-[linear-gradient(to_right,#d2d6cd_1px,transparent_1px),linear-gradient(to_bottom,#d2d6cd_1px,transparent_1px)] bg-size-[24px_24px]",
    studio:
      "bg-[#1e2320] bg-[radial-gradient(#3a453f_1.5px,transparent_1.5px)] bg-size-[24px_24px]",
    clean: "bg-[#dfe2dc]",
  };

  return (
    <div
      className={cn(
        "resume-canvas-root relative flex flex-col overflow-hidden select-none transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-120 bg-black" : "h-full w-full"
      )}
    >
      {/* Top Header Bar */}
      <CanvasTopBar
        template={template}
        resumeStyle={resumeStyle}
        isMobilePreview={isMobilePreview}
        isFullscreen={isFullscreen}
        showDesignMenu={showDesignMenu}
        onCloseMobilePreview={onCloseMobilePreview}
        onShowTemplates={onShowTemplates}
        onShowWritingCheck={onShowWritingCheck}
        onShowTailor={onShowTailor}
        onToggleDesignMenu={() => {
          setShowDesignMenu(!showDesignMenu);
          setShowPresetsMenu(false);
          setShowThemeMenu(false);
        }}
        onCloseDesignMenu={() => setShowDesignMenu(false)}
        onUpdateStyle={onUpdateStyle}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onExportPdf={onExportPdf}
        onExportDocx={onExportDocx}
        isExportingDocx={isExportingDocx}
        exportDocxStatus={exportDocxStatus}
        onUploadResume={onUploadResume}
        isImportingResume={isImportingResume}
        uploadFileInputRef={uploadFileInputRef}
        onSave={onSave}
        isSaving={isSaving}
        saveStatus={saveStatus}
      />

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={cn(
          "canvas-bg relative flex-1 overflow-hidden transition-colors duration-300",
          themeStyles[canvasTheme],
          activeHand ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        )}
      >
        {/* Visual Granular Selection Bounding Box Overlay */}
        <CanvasSelectionOverlay highlightRect={highlightRect} />

        {/* Contextual Floating Formatting Bar (Appears directly above clicked element on PDF) */}
        {selectedElement && toolbarPos && (
          <CanvasFormattingBar
            selectedElement={selectedElement}
            toolbarPos={toolbarPos}
            toolbarRef={toolbarRef}
            inlineText={inlineText}
            isRefining={isRefining}
            isExpanded={isExpanded}
            showColorPicker={showColorPicker}
            template={template}
            resumeStyle={resumeStyle}
            selectedDomRef={selectedDomRef}
            handleAiRefine={handleAiRefine}
            handleRealtimeTextChange={handleRealtimeTextChange}
            setIsExpanded={setIsExpanded}
            changeFontSize={changeFontSize}
            toggleBold={toggleBold}
            toggleItalic={toggleItalic}
            toggleCase={toggleCase}
            clearFormatting={clearFormatting}
            setTextAlign={setTextAlign}
            setShowColorPicker={setShowColorPicker}
            deleteSelected={deleteSelected}
            clearSelection={clearSelection}
            updateSelectionBounds={updateSelectionBounds}
          />
        )}

        {/* Rendered Document Sheet Container */}
        <div className="resume-preview-scroll absolute inset-x-0 top-14 bottom-0 overflow-auto">
          <div className="resume-page-viewport flex min-h-full min-w-max items-center justify-center p-4 sm:p-8">
            <div
              style={{
                transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.15s ease-out",
              }}
              className="no-print-transform flex items-center justify-center"
            >
              <div
                ref={sheetRef}
                onClick={handleSheetClick}
                className={cn(
                  "resume-preview-sheet pointer-events-auto relative",
                  activeHand && "hand-mode"
                )}
              >
                {/* Resume Sheet Preview */}
                <PaginatedResumePreview
                  data={data}
                  template={previewTemplate}
                  showPhoto={showPhoto}
                  pagePadding={resumeStyle?.pagePadding || "normal"}
                  sectionSpacing={resumeStyle?.sectionSpacing || "normal"}
                  fontSizeScale={resumeStyle?.fontSizeScale || 1.0}
                  lineHeight={resumeStyle?.lineHeight || "normal"}
                  className={resumeFontClass(font)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom-Center Glassmorphic Zoom Toolbar */}
      <CanvasBottomToolbar
        zoom={zoom}
        canvasTheme={canvasTheme}
        activeHand={activeHand}
        canUndo={canUndo}
        canRedo={canRedo}
        showPresetsMenu={showPresetsMenu}
        showThemeMenu={showThemeMenu}
        isHandTool={isHandTool}
        onZoomChange={onZoomChange}
        onZoomIn={() => onZoomChange(Math.min(300, zoom + 10))}
        onZoomOut={() => onZoomChange(Math.max(25, zoom - 10))}
        onResetPan={resetPanAndZoom}
        onFitToWidth={fitToWidth}
        onFitToPage={fitToPage}
        onSetHandTool={setIsHandTool}
        onCanvasThemeChange={setCanvasTheme}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onTogglePresetsMenu={() => {
          setShowPresetsMenu(!showPresetsMenu);
          setShowThemeMenu(false);
        }}
        onToggleThemeMenu={() => {
          setShowThemeMenu(!showThemeMenu);
          setShowPresetsMenu(false);
        }}
      />
    </div>
  );
}
