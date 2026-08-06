"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { CoverLetterData } from "../types/cover-letter";

const SECTION_ORDER: (keyof CoverLetterData)[] = [
  "greeting",
  "opening",
  "evidence",
  "closing",
  "signoff",
];

interface UseSelectionOptions {
  data: CoverLetterData;
  zoom: number;
  pan: { x: number; y: number };
  isHandTool: boolean;
  isSpacePressed: boolean;
  showDesignMenu: boolean;
  showTemplatesMenu: boolean;
  setHistory: React.Dispatch<React.SetStateAction<CoverLetterData[]>>;
  setFuture: React.Dispatch<React.SetStateAction<CoverLetterData[]>>;
  setData: React.Dispatch<React.SetStateAction<CoverLetterData>>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function useCoverLetterSelection({
  data,
  zoom,
  pan,
  isHandTool,
  isSpacePressed,
  showDesignMenu,
  showTemplatesMenu,
  setHistory,
  setFuture,
  setData,
  containerRef: externalContainerRef,
}: UseSelectionOptions) {
  const [selectedField, setSelectedField] = useState<keyof CoverLetterData | null>(null);
  const [highlightRect, setHighlightRect] = useState<{
    top: number; left: number; width: number; height: number;
  } | null>(null);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const [inlineText, setInlineText] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const localContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = externalContainerRef || localContainerRef;
  const selectedDomRef = useRef<HTMLElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const boundsRafIdRef = useRef<number | null>(null);

  const updateSelectionBounds = useCallback(() => {
    if (!selectedDomRef.current || !containerRef.current) return;
    if (boundsRafIdRef.current !== null) cancelAnimationFrame(boundsRafIdRef.current);
    boundsRafIdRef.current = requestAnimationFrame(() => {
      if (!selectedDomRef.current || !containerRef.current) return;
      const targetRect = selectedDomRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const top = targetRect.top - containerRect.top;
      const left = targetRect.left - containerRect.left;

      setHighlightRect({ top: top - 4, left: left - 4, width: targetRect.width + 8, height: targetRect.height + 8 });

      const toolbarWidth = toolbarRef.current?.offsetWidth || 540;
      let computedLeft = Math.max(12, Math.min(containerRect.width - toolbarWidth - 16, left + targetRect.width / 2 - toolbarWidth / 2));
      let computedTop = top - 64;
      if (computedTop < 65) computedTop = top + targetRect.height + 14;

      setToolbarPos({ top: computedTop, left: computedLeft });
    });
  }, []);

  useEffect(() => {
    if (!selectedField) return;
    const freshEl = containerRef.current?.querySelector(`[data-field="${selectedField}"]`) as HTMLElement | null;
    if (freshEl) selectedDomRef.current = freshEl;
    if (!selectedDomRef.current) return;

    updateSelectionBounds();
    const observer = new ResizeObserver(() => updateSelectionBounds());
    observer.observe(selectedDomRef.current);
    const onScroll = () => updateSelectionBounds();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", updateSelectionBounds);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", updateSelectionBounds);
    };
  }, [selectedField, inlineText, data, zoom, pan, updateSelectionBounds]);

  const clearSelection = () => {
    setSelectedField(null);
    selectedDomRef.current = null;
    setHighlightRect(null);
    setToolbarPos(null);
    setShowColorPicker(false);
  };

  useEffect(() => {
    if (isHandTool || isSpacePressed || showDesignMenu || showTemplatesMenu) clearSelection();
  }, [isHandTool, isSpacePressed, showDesignMenu, showTemplatesMenu]);

  const handleSelectField = (e: React.MouseEvent<HTMLElement>, field: keyof CoverLetterData) => {
    if (isHandTool || isSpacePressed || (typeof window !== "undefined" && window.innerWidth < 1024)) return;
    e.stopPropagation();
    setSelectedField(field);
    selectedDomRef.current = e.currentTarget;
    setInlineText(data[field] || "");
    setTimeout(updateSelectionBounds, 10);
  };

  const handleMoveSectionUp = () => {
    if (!selectedField) return;
    const index = SECTION_ORDER.indexOf(selectedField);
    if (index <= 0) return;
    const prevField = SECTION_ORDER[index - 1];
    const currentVal = data[selectedField];
    const prevVal = data[prevField];
    setHistory((prev) => [...prev, data]);
    setFuture([]);
    setData((cur) => ({ ...cur, [selectedField]: prevVal, [prevField]: currentVal }));
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
    setData((cur) => ({ ...cur, [selectedField]: nextVal, [nextField]: currentVal }));
    setSelectedField(nextField);
    setInlineText(currentVal);
    setTimeout(updateSelectionBounds, 30);
  };

  return {
    selectedField, setSelectedField,
    highlightRect,
    toolbarPos,
    inlineText, setInlineText,
    showColorPicker, setShowColorPicker,
    containerRef,
    selectedDomRef,
    toolbarRef,
    clearSelection,
    handleSelectField,
    handleMoveSectionUp,
    handleMoveSectionDown,
  };
}
