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
    setHistory: dataHook.setHistory,
    setFuture: dataHook.setFuture,
    setData: dataHook.setData,
    containerRef: canvasHook.containerRef,
  });

  const aiHook = useCoverLetterAi({
    data: dataHook.data,
    showAiDrawer: canvasHook.showAiDrawer,
    setHistory: dataHook.setHistory,
    setFuture: dataHook.setFuture,
    setData: dataHook.setData,
  });

  // Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y / Ctrl+Shift+Z (redo)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
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
    window.print();
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
