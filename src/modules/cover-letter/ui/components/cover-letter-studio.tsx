"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { CoverLetterFormPanel } from "./cover-letter-form-panel";
import { CoverLetterCanvasHeader } from "./cover-letter-canvas-header";
import { CoverLetterCanvasToolbar } from "./cover-letter-canvas-toolbar";
import { CoverLetterFormattingToolbar } from "./cover-letter-formatting-toolbar";
import { CoverLetterPreview } from "./cover-letter-preview";
import { CoverLetterStudioHeader } from "./cover-letter-studio-header";
import { CoverLetterStartFreshModal } from "./cover-letter-start-fresh-modal";
import { CoverLetterAiDrawer } from "./cover-letter-ai-drawer";
import { useCoverLetterState } from "../../hooks/use-cover-letter-state";
import { COLOR_SWATCHES, themeStyles, themes, getStarterCopy } from "../../constants";

export function CoverLetterStudio() {
  const state = useCoverLetterState();

  const {
    data, setData,
    theme, setTheme,
    customAccent, setCustomAccent,
    splitPercent, setSplitPercent,
    isResizing, setIsResizing,
    splitContainerRef,
    isLeftCollapsed, isRightCollapsed,
    history, future,
    font, setFont,
    pageSpacing, setPageSpacing,
    zoom, setZoom,
    pan, setPan,
    isDragging,
    isHandTool, setIsHandTool,
    isSpacePressed,
    canvasTheme, setCanvasTheme,
    isFullscreen, setIsFullscreen,
    showThemeMenu, setShowThemeMenu,
    showPresetsMenu, setShowPresetsMenu,
    showDesignMenu, setShowDesignMenu,
    showTemplatesMenu, setShowTemplatesMenu,
    showMobilePreview, setShowMobilePreview,
    containerWidth,
    showStartFreshModal, setShowStartFreshModal,
    showAiDrawer, setShowAiDrawer,
    aiRole, setAiRole,
    aiCompany, setAiCompany,
    aiHeadline, setAiHeadline,
    aiKeyPoints, setAiKeyPoints,
    aiTone, setAiTone,
    isGeneratingAi,
    aiSuccessMessage,
    isSaving,
    saveStatus,
    isImportingLetter,
    selectedField,
    highlightRect,
    toolbarPos,
    inlineText, setInlineText,
    showColorPicker, setShowColorPicker,
    containerRef,
    selectedDomRef,
    toolbarRef,
    update,
    handleUndo,
    handleRedo,
    handleSelectField,
    clearSelection,
    handleMoveSectionUp,
    handleMoveSectionDown,
    handleWheel,
    handleMouseDown,
    handleMouseMoveCanvas,
    handleMouseUpCanvas,
    handleConfirmStartFresh,
    handleSaveToCloud,
    handleUploadLetter,
    handleGenerateAiCoverLetter,
    handleExportPdf,
  } = state;

  const activeTheme = themes.find((item) => item.id === theme) ?? themes[0];
  const activeAccent = customAccent || activeTheme.accent;

  const documentTitle = data.fullName
    ? `${data.fullName}'s Cover Letter`
    : data.company
      ? `${data.company} — Cover Letter`
      : "Cover Letter";

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[var(--brand-ink)]">
      {/* Pinned Top Navigation Header */}
      <CoverLetterStudioHeader
        documentTitle={documentTitle}
        isSaving={isSaving}
        saveStatus={saveStatus}
        isImportingLetter={isImportingLetter}
        handleSaveToCloud={handleSaveToCloud}
        onUploadLetter={handleUploadLetter}
        setShowAiDrawer={setShowAiDrawer}
        setShowStartFreshModal={setShowStartFreshModal}
        handleExportPdf={handleExportPdf}
        setShowMobilePreview={setShowMobilePreview}
      />

      <main
        ref={splitContainerRef}
        className={cn(
          "relative flex flex-col lg:flex-row h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] overflow-hidden",
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
            style={isFullscreen || containerWidth < 1024 ? undefined : { width: `${100 - splitPercent}%` }}
            className={cn(
              "resume-preview-panel relative overflow-hidden select-none transition-all duration-300 h-full shrink-0",
              showMobilePreview
                ? "fixed inset-0 z-[80] flex flex-col"
                : "hidden lg:flex lg:flex-col",
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
              isMobilePreview={showMobilePreview}
              onCloseMobilePreview={() => setShowMobilePreview(false)}
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
                  className="no-print absolute z-30 pointer-events-none hidden lg:block rounded-2xl border-2 border-[#059669] bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all duration-100 ease-out"
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
        <CoverLetterStartFreshModal
          onCancel={() => setShowStartFreshModal(false)}
          onConfirm={handleConfirmStartFresh}
        />
      )}

      {/* Writing with AI Side-Over Drawer */}
      {showAiDrawer && (
        <CoverLetterAiDrawer
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
          onClose={() => setShowAiDrawer(false)}
          onGenerate={handleGenerateAiCoverLetter}
        />
      )}
    </div>
  );
}

export const LetterStudio = CoverLetterStudio;
