"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ResumeData } from "../types/resume";
import type { SelectedCanvasElement } from "../ui/components/interactive-canvas";

interface UseCanvasInteractionProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  selectedElement: SelectedCanvasElement | null;
  inlineText: string;
  data: ResumeData;
  isHandTool: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  handleUndo?: () => void;
  handleRedo?: () => void;
  clearSelection: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selectedDomRef: React.RefObject<HTMLElement | null>;
  toolbarRef: React.RefObject<HTMLDivElement | null>;
}

export function useCanvasInteraction({
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
}: UseCanvasInteractionProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const [highlightRect, setHighlightRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);

  const resetPanAndZoom = useCallback(() => {
    setPan({ x: 0, y: 0 });
    onZoomChange(80);
  }, [onZoomChange]);

  const updateSelectionBounds = useCallback(() => {
    if (!selectedDomRef.current || !containerRef.current) return;
    if (!selectedDomRef.current.isConnected) {
      clearSelection();
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = selectedDomRef.current.getBoundingClientRect();

    const top = targetRect.top - containerRect.top;
    const left = targetRect.left - containerRect.left;

    setHighlightRect({
      top: top - 4,
      left: left - 4,
      width: targetRect.width + 8,
      height: targetRect.height + 8,
    });

    const toolbarWidth = toolbarRef.current?.offsetWidth || 588;
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
  }, [containerRef, selectedDomRef, toolbarRef]);

  // ResizeObserver + Scroll + Window Resize listeners
  useEffect(() => {
    if (!selectedElement || !selectedDomRef.current) {
      setHighlightRect(null);
      setToolbarPos(null);
      return;
    }

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
  }, [selectedElement, inlineText, data, zoom, pan, updateSelectionBounds, selectedDomRef]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea") return;

      if (e.code === "Space" && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        onZoomChange(zoom + 10);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        onZoomChange(zoom - 10);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        resetPanAndZoom();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo && handleRedo) handleRedo();
        } else {
          if (canUndo && handleUndo) handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        if (canRedo && handleRedo) handleRedo();
      } else if (e.key === "Escape") {
        clearSelection();
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
  }, [
    isSpacePressed,
    zoom,
    onZoomChange,
    resetPanAndZoom,
    clearSelection,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
  ]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 8 : -8;
        onZoomChange(zoom + delta);
      } else {
        setPan((prev) => ({
          x: prev.x - e.deltaX * 0.8,
          y: prev.y - e.deltaY * 0.8,
        }));
      }
    },
    [zoom, onZoomChange]
  );

  const activeHand = isHandTool || isSpacePressed;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || activeHand || (e.target as HTMLElement).classList.contains("canvas-bg")) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomRef = useRef(zoom);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const lastZoomSentRef = useRef<number>(zoom);

  // Prevent full-screen browser zoom on trackpad pinch / touch pinch, scaling ONLY the document canvas
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheelNative = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 8 : -8;
        const nextZoom = Math.min(Math.max(zoomRef.current + delta, 30), 200);
        if (nextZoom !== lastZoomSentRef.current) {
          lastZoomSentRef.current = nextZoom;
          onZoomChange(nextZoom);
        }
      }
    };

    const onTouchMoveNative = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", onWheelNative, { passive: false });
    el.addEventListener("touchmove", onTouchMoveNative, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheelNative);
      el.removeEventListener("touchmove", onTouchMoveNative);
    };
  }, [containerRef, onZoomChange]);

  // Mobile Touch Pinch-to-Zoom & Touch Pan
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(zoom);
  const rafIdRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
      touchStartZoomRef.current = zoom;
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = currentDist / touchStartDistRef.current;
      const newZoom = Math.min(Math.max(Math.round(touchStartZoomRef.current * scale), 30), 200);
      if (newZoom !== lastZoomSentRef.current) {
        lastZoomSentRef.current = newZoom;
        if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => onZoomChange(newZoom));
      }
    } else if (e.touches.length === 1 && isDragging) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        setPan({ x: touchX - dragStart.x, y: touchY - dragStart.y });
      });
    }
  };

  const handleTouchEnd = () => {
    if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    touchStartDistRef.current = null;
    setIsDragging(false);
  };

  const fitToWidth = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 80;
    const calculatedZoom = Math.round((containerWidth / 595) * 100);
    onZoomChange(calculatedZoom);
    setPan({ x: 0, y: 0 });
  };

  const fitToPage = () => {
    if (!containerRef.current) return;
    const containerHeight = containerRef.current.clientHeight - 160;
    const calculatedZoom = Math.round((containerHeight / 842) * 100);
    onZoomChange(calculatedZoom);
    setPan({ x: 0, y: 0 });
  };

  return {
    pan,
    setPan,
    isDragging,
    activeHand,
    highlightRect,
    setHighlightRect,
    toolbarPos,
    setToolbarPos,
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
  };
}
