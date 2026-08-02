"use client";

import { useState, useEffect, useRef } from "react";
import type { CanvasTheme, TypographyFont, PageSpacing } from "../types/cover-letter";

export function useCoverLetterCanvas() {
  // Split resizer
  const [splitPercent, setSplitPercent] = useState<number>(42);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const isLeftCollapsed = splitPercent <= 1;
  const isRightCollapsed = splitPercent >= 99;

  // Design / typography
  const [font, setFont] = useState<TypographyFont>("template");
  const [pageSpacing, setPageSpacing] = useState<PageSpacing>("normal");

  // Zoom & pan
  const [zoom, setZoom] = useState(72);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Tool & canvas mode
  const [isHandTool, setIsHandTool] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>("dots");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Menu visibility
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showDesignMenu, setShowDesignMenu] = useState(false);
  const [showTemplatesMenu, setShowTemplatesMenu] = useState(false);

  // Mobile
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(1400);

  // Modals
  const [showStartFreshModal, setShowStartFreshModal] = useState(false);
  const [showAiDrawer, setShowAiDrawer] = useState(false);

  // Window width tracker for mobile vs desktop
  useEffect(() => {
    const updateWidth = () => { setContainerWidth(window.innerWidth); };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Handle panel split resizing via mouse drag
  useEffect(() => {
    let animId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      let percent = ((e.clientX - rect.left) / rect.width) * 100;
      const min = (440 / rect.width) * 100;
      const max = ((rect.width - 480) / rect.width) * 100;
      if (percent < 3) percent = 0;
      else if (percent > 97) percent = 100;
      else percent = Math.max(min, Math.min(max, percent));
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

  // Escape key: close fullscreen / modals
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isFullscreen) setIsFullscreen(false);
      if (showStartFreshModal) setShowStartFreshModal(false);
      if (showAiDrawer) setShowAiDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen, showStartFreshModal, showAiDrawer]);

  // Spacebar press tracking
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") { e.preventDefault(); setIsSpacePressed(true); }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === "Space") setIsSpacePressed(false);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom((prev) => Math.min(Math.max(prev + (e.deltaY > 0 ? -5 : 5), 30), 200));
    } else if (isHandTool || isSpacePressed) {
      setPan((prev) => ({ x: prev.x - e.deltaX * 0.8, y: prev.y - e.deltaY * 0.8 }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && (isHandTool || isSpacePressed)) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUpCanvas = () => setIsDragging(false);

  return {
    splitPercent, setSplitPercent,
    isResizing, setIsResizing,
    splitContainerRef,
    isLeftCollapsed, isRightCollapsed,
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
    handleWheel,
    handleMouseDown,
    handleMouseMoveCanvas,
    handleMouseUpCanvas,
  };
}
