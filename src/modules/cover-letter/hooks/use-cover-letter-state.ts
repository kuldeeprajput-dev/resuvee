"use client";

import { useEffect } from "react";
import { useCoverLetterData } from "./use-cover-letter-data";
import { useCoverLetterCanvas } from "./use-cover-letter-canvas";
import { useCoverLetterSelection } from "./use-cover-letter-selection";
import { useCoverLetterAi } from "./use-cover-letter-ai";

export function useCoverLetterState() {
  const dataHook = useCoverLetterData();
  const canvasHook = useCoverLetterCanvas();

  const selectionHook = useCoverLetterSelection({
    data: dataHook.data,
    zoom: canvasHook.zoom,
    pan: canvasHook.pan,
    isHandTool: canvasHook.isHandTool,
    isSpacePressed: canvasHook.isSpacePressed,
    showDesignMenu: canvasHook.showDesignMenu,
    showTemplatesMenu: canvasHook.showTemplatesMenu,
    setData: dataHook.setData,
    containerRef: canvasHook.containerRef,
  });

  const aiHook = useCoverLetterAi({
    data: dataHook.data,
    showAiDrawer: canvasHook.showAiDrawer,
    setData: dataHook.setData,
  });

  // Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y / Ctrl+Shift+Z (redo)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? dataHook.handleRedo() : dataHook.handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        dataHook.handleRedo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dataHook.handleUndo, dataHook.handleRedo]);

  const handleExportPdf = () => {
    selectionHook.clearSelection();
    const originalTitle = document.title;
    const title = dataHook.data.fullName
      ? `${dataHook.data.fullName}'s Cover Letter`
      : dataHook.data.company
        ? `${dataHook.data.company} — Cover Letter`
        : "Cover Letter";
    const fileName = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    document.title = fileName || "cover-letter";
    window.print();

    const restoreTitle = () => {
      document.title = originalTitle;
      window.removeEventListener("afterprint", restoreTitle);
    };
    window.addEventListener("afterprint", restoreTitle);
    setTimeout(restoreTitle, 2000);
  };

  // Wrap handleConfirmStartFresh to also close the modal
  const handleConfirmStartFresh = () => {
    dataHook.handleConfirmStartFresh();
    canvasHook.setFont("template");
    canvasHook.setPageSpacing("normal");
    canvasHook.setShowStartFreshModal(false);
  };

  return {
    ...dataHook,
    ...canvasHook,
    ...selectionHook,
    ...aiHook,
    handleExportPdf,
    handleConfirmStartFresh,
  };
}
