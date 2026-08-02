"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Bold,
  CaseSensitive,
  CaseUpper,
  Check,
  ChevronDown,
  Copy,
  Download,
  Edit3,
  Grid,
  Hand,
  Italic,
  LayoutTemplate,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  MousePointer,
  Palette,
  Pipette,
  Plus,
  Redo2,
  RemoveFormatting,
  RotateCcw,
  ScanSearch,
  Sparkles,
  SpellCheck2,
  Trash2,
  Undo2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { BuilderSection, ResumeData, ResumeTemplate } from "../../types/resume";
import { useResumeBuilderStore } from "../../store/use-resume-builder-store";
import { ResumePreview } from "./resume-preview";
import { resumeFontClass, type ResumeStyle } from "./customize-panel";
import { cn } from "@/shared/lib/utils";

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

  // Pan & Drag States
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHandTool, setIsHandTool] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>("dots");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Menus
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showDesignMenu, setShowDesignMenu] = useState(false);

  // Direct On-Canvas Element Selection, Bounding Highlight & Real-Time Toolbar State
  const [selectedElement, setSelectedElement] = useState<SelectedCanvasElement | null>(null);
  const [highlightRect, setHighlightRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const [inlineText, setInlineText] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const clearSelection = useCallback(() => {
    setSelectedElement(null);
    setHighlightRect(null);
    setToolbarPos(null);
    setShowColorPicker(false);
    setIsExpanded(false);
    selectedDomRef.current = null;
  }, []);

  const handleAiRefine = async () => {
    if (!inlineText || !inlineText.trim() || isRefining) return;
    setIsRefining(true);

    try {
      const res = await fetch("/api/refine-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inlineText,
          fieldName: selectedElement?.field || selectedElement?.title || "resume section",
        }),
      });

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

  const resetPanAndZoom = useCallback(() => {
    setPan({ x: 0, y: 0 });
    onZoomChange(80);
  }, [onZoomChange]);

  // Recalculate selection box bounds dynamically whenever text size/content changes
  const updateSelectionBounds = useCallback(() => {
    if (!selectedDomRef.current || !containerRef.current) return;
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

  // ResizeObserver + Scroll + Window Resize listeners to track position locked onto element
  useEffect(() => {
    if (!selectedElement || !selectedDomRef.current) return;

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
  }, [selectedElement, inlineText, data, zoom, pan, updateSelectionBounds]);

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
          if (canRedo) handleRedo();
        } else {
          if (canUndo) handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        if (canRedo) handleRedo();
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

  // Wheel zoom & pan
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

  // Direct Granular Element Click Handler + Left Editor Step Sync
  const handleSheetClick = (e: React.MouseEvent) => {
    if (activeHand || isDragging) return;

    const target = e.target as HTMLElement;
    const container = containerRef.current;
    if (!container) return;

    // Granular text element: h1, h2, h3, h4, p, li, span, a, or direct target
    const elem = target.closest("h1, h2, h3, h4, p, li, span, a") || target;
    if (
      !elem ||
      elem.tagName.toLowerCase() === "article" ||
      elem.tagName.toLowerCase() === "section"
    ) {
      clearSelection();
      return;
    }
    selectedDomRef.current = elem as HTMLElement;

    const clickedText = elem.textContent?.trim() || "";
    let found: SelectedCanvasElement | null = null;

    // Basics fields
    if (clickedText === data.basics.fullName || elem.tagName.toLowerCase() === "h1") {
      found = { section: "basics", field: "fullName", title: "Full Name" };
      setInlineText(data.basics.fullName);
    } else if (clickedText === data.basics.headline) {
      found = { section: "basics", field: "headline", title: "Headline" };
      setInlineText(data.basics.headline);
    } else if (clickedText === data.basics.summary) {
      found = { section: "basics", field: "summary", title: "Summary" };
      setInlineText(data.basics.summary);
    } else if (clickedText === data.basics.email) {
      found = { section: "basics", field: "email", title: "Email" };
      setInlineText(data.basics.email);
    } else if (clickedText === data.basics.phone) {
      found = { section: "basics", field: "phone", title: "Phone" };
      setInlineText(data.basics.phone);
    } else if (clickedText === data.basics.location) {
      found = { section: "basics", field: "location", title: "Location" };
      setInlineText(data.basics.location);
    }

    // Experience
    if (!found) {
      for (const item of data.experience) {
        if (clickedText === item.role) {
          found = {
            section: "experience",
            id: item.id,
            field: "role",
            title: "Job Role",
            subtitle: item.company,
          };
          setInlineText(item.role);
          break;
        } else if (clickedText.includes(item.company)) {
          found = {
            section: "experience",
            id: item.id,
            field: "company",
            title: "Company",
            subtitle: item.role,
          };
          setInlineText(item.company);
          break;
        } else {
          const hIndex = item.highlights.findIndex(
            (hl) => clickedText.includes(hl) || hl.includes(clickedText)
          );
          if (hIndex !== -1) {
            found = {
              section: "experience",
              id: item.id,
              field: "highlight",
              highlightIndex: hIndex,
              title: "Highlight",
            };
            setInlineText(item.highlights[hIndex]);
            break;
          }
        }
      }
    }

    // Education
    if (!found) {
      for (const item of data.education) {
        if (clickedText === item.degree) {
          found = {
            section: "education",
            id: item.id,
            field: "degree",
            title: "Degree",
            subtitle: item.school,
          };
          setInlineText(item.degree);
          break;
        } else if (clickedText === item.school) {
          found = {
            section: "education",
            id: item.id,
            field: "school",
            title: "School",
            subtitle: item.degree,
          };
          setInlineText(item.school);
          break;
        } else if (item.details && clickedText.includes(item.details)) {
          found = {
            section: "education",
            id: item.id,
            field: "details",
            title: "Education Details",
          };
          setInlineText(item.details);
          break;
        }
      }
    }

    // Projects
    if (!found) {
      for (const item of data.projects) {
        if (clickedText === item.name) {
          found = { section: "projects", id: item.id, field: "name", title: "Project Name" };
          setInlineText(item.name);
          break;
        } else if (clickedText === item.description) {
          found = {
            section: "projects",
            id: item.id,
            field: "description",
            title: "Project Description",
          };
          setInlineText(item.description);
          break;
        }
      }
    }

    // Skills
    if (!found) {
      for (const group of data.skillGroups) {
        if (clickedText === group.name) {
          found = { section: "skills", id: group.id, field: "name", title: "Skill Category" };
          setInlineText(group.name);
          break;
        } else if (group.skills.some((s) => clickedText.includes(s))) {
          found = { section: "skills", id: group.id, field: "skills", title: "Skills List" };
          setInlineText(group.skills.join(", "));
          break;
        }
      }
    }

    // Awards and certifications
    if (!found) {
      for (const item of data.certifications ?? []) {
        if (clickedText === item.title) {
          found = {
            section: "certifications",
            id: item.id,
            field: "title",
            title: "Award or certification",
            subtitle: item.issuer,
          };
          setInlineText(item.title);
          break;
        } else if (clickedText === item.issuer) {
          found = {
            section: "certifications",
            id: item.id,
            field: "issuer",
            title: "Issuer",
            subtitle: item.title,
          };
          setInlineText(item.issuer);
          break;
        } else if (clickedText === item.description) {
          found = {
            section: "certifications",
            id: item.id,
            field: "description",
            title: "Credential detail",
            subtitle: item.title,
          };
          setInlineText(item.description);
          break;
        }
      }
    }

    // Fallback
    if (!found) {
      found = {
        section: "basics",
        field: "fullName",
        title: "Selected Text",
      };
      setInlineText(clickedText);
    }

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

    const { section, id, field, highlightIndex } = selectedElement;

    if (section === "basics") {
      const fieldKey = (field || "fullName") as keyof ResumeData["basics"];
      onUpdateData({
        ...data,
        basics: { ...data.basics, [fieldKey]: newText },
      });
    } else if (section === "experience" && id) {
      onUpdateData({
        ...data,
        experience: data.experience.map((item) => {
          if (item.id !== id) return item;
          if (field === "company") return { ...item, company: newText };
          if (field === "highlight" && highlightIndex !== undefined) {
            const nextH = [...item.highlights];
            nextH[highlightIndex] = newText;
            return { ...item, highlights: nextH };
          }
          return { ...item, role: newText };
        }),
      });
    } else if (section === "education" && id) {
      onUpdateData({
        ...data,
        education: data.education.map((item) => {
          if (item.id !== id) return item;
          if (field === "school") return { ...item, school: newText };
          if (field === "details") return { ...item, details: newText };
          return { ...item, degree: newText };
        }),
      });
    } else if (section === "projects" && id) {
      onUpdateData({
        ...data,
        projects: data.projects.map((item) => {
          if (item.id !== id) return item;
          if (field === "description") return { ...item, description: newText };
          return { ...item, name: newText };
        }),
      });
    } else if (section === "skills" && id) {
      onUpdateData({
        ...data,
        skillGroups: data.skillGroups.map((group) => {
          if (group.id !== id) return group;
          if (field === "skills") {
            return {
              ...group,
              skills: newText
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            };
          }
          return { ...group, name: newText };
        }),
      });
    } else if (section === "certifications" && id) {
      onUpdateData({
        ...data,
        certifications: (data.certifications ?? []).map((item) => {
          if (item.id !== id) return item;
          if (field === "issuer") return { ...item, issuer: newText };
          if (field === "description") {
            return { ...item, description: newText };
          }
          if (field === "date") return { ...item, date: newText };
          return { ...item, title: newText };
        }),
      });
    }
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
    if (selectedElement.section === "experience" && selectedElement.id) {
      const target = data.experience.find((i) => i.id === selectedElement.id);
      if (target) {
        onUpdateData({
          ...data,
          experience: [
            ...data.experience,
            { ...target, id: `exp-${Date.now()}`, role: `${target.role} (Copy)` },
          ],
        });
      }
    } else if (selectedElement.section === "education" && selectedElement.id) {
      const target = data.education.find((i) => i.id === selectedElement.id);
      if (target) {
        onUpdateData({
          ...data,
          education: [
            ...data.education,
            { ...target, id: `edu-${Date.now()}`, degree: `${target.degree} (Copy)` },
          ],
        });
      }
    } else if (selectedElement.section === "projects" && selectedElement.id) {
      const target = data.projects.find((i) => i.id === selectedElement.id);
      if (target) {
        onUpdateData({
          ...data,
          projects: [
            ...data.projects,
            { ...target, id: `proj-${Date.now()}`, name: `${target.name} (Copy)` },
          ],
        });
      }
    } else if (selectedElement.section === "certifications" && selectedElement.id) {
      const certifications = data.certifications ?? [];
      const target = certifications.find((item) => item.id === selectedElement.id);
      if (target) {
        onUpdateData({
          ...data,
          certifications: [
            ...certifications,
            {
              ...target,
              id: `cert-${Date.now()}`,
              title: `${target.title} (Copy)`,
            },
          ],
        });
      }
    }
  };

  // Delete Selected Item
  const deleteSelected = () => {
    if (!selectedElement || !onUpdateData) return;
    if (selectedElement.section === "experience" && selectedElement.id) {
      onUpdateData({
        ...data,
        experience: data.experience.filter((i) => i.id !== selectedElement.id),
      });
    } else if (selectedElement.section === "education" && selectedElement.id) {
      onUpdateData({
        ...data,
        education: data.education.filter((i) => i.id !== selectedElement.id),
      });
    } else if (selectedElement.section === "projects" && selectedElement.id) {
      onUpdateData({
        ...data,
        projects: data.projects.filter((i) => i.id !== selectedElement.id),
      });
    } else if (selectedElement.section === "certifications" && selectedElement.id) {
      onUpdateData({
        ...data,
        certifications: (data.certifications ?? []).filter(
          (item) => item.id !== selectedElement.id
        ),
      });
    }
    clearSelection();
  };

  // Background style classes
  const themeStyles: Record<CanvasTheme, string> = {
    dots: "bg-[#e5e7e2] [background-image:radial-gradient(#b8beb5_1.2px,transparent_1.2px)] [background-size:20px_20px]",
    grid: "bg-[#e8e9e4] [background-image:linear-gradient(to_right,#d2d6cd_1px,transparent_1px),linear-gradient(to_bottom,#d2d6cd_1px,transparent_1px)] [background-size:24px_24px]",
    studio:
      "bg-[#1e2320] [background-image:radial-gradient(#3a453f_1.5px,transparent_1.5px)] [background-size:24px_24px]",
    clean: "bg-[#dfe2dc]",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden select-none transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-[120] bg-black" : "h-full w-full"
      )}
    >
      {/* Top Header Bar */}
      <div className="no-print absolute inset-x-0 top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-black/10 bg-white/90 px-3 backdrop-blur sm:px-4 lg:px-5">
        <div className="flex flex-1 items-center gap-2 min-w-0 overflow-hidden sm:gap-2.5">
          {isMobilePreview && (
            <button
              type="button"
              onClick={onCloseMobilePreview}
              className="builder-icon-button shrink-0 lg:hidden"
              aria-label="Close preview"
            >
              <X className="size-4" />
            </button>
          )}
          <div className="flex shrink-0 items-center gap-2">
            <span className="flex size-2 shrink-0 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
            <p className="whitespace-nowrap text-xs font-extrabold tracking-tight text-[var(--brand-ink)]">Studio Canvas</p>
            <span className="text-black/25 text-xs font-semibold mx-0.5">·</span>
            <span className="shrink-0 max-w-[140px] truncate text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#059669] border-b-2 border-[#059669] pb-0.5 transition-all">
              {template.name}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 pl-2 ml-auto z-10">
          {/* Check with AI Button - Only visible in Fullscreen Studio mode */}
          {isFullscreen && onShowWritingCheck && (
            <button
              type="button"
              onClick={onShowWritingCheck}
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold text-[var(--brand-ink)] transition hover:bg-black/5 shadow-xs sm:px-3 cursor-pointer animate-in fade-in"
              title="Scan and improve resume text with AI writing check"
            >
              <SpellCheck2 className="size-3.5 text-emerald-600" />
              <span className="whitespace-nowrap">Check with AI</span>
            </button>
          )}

          {/* Role Match Button - Only visible in Fullscreen Studio mode */}
          {isFullscreen && onShowTailor && (
            <button
              type="button"
              onClick={onShowTailor}
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold text-[var(--brand-ink)] transition hover:bg-black/5 shadow-xs sm:px-3 cursor-pointer animate-in fade-in"
              title="Compare with job description keywords"
            >
              <ScanSearch className="size-3.5 text-emerald-600" />
              <span className="whitespace-nowrap">Role match</span>
            </button>
          )}

          {/* Export PDF Button - Only visible in Fullscreen / Zoom mode */}
          {isFullscreen && (
            <button
              type="button"
              onClick={() => window.print()}
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold text-[var(--brand-ink)] transition hover:bg-black/5 shadow-xs sm:px-3 animate-in fade-in"
              title="Export PDF Document"
            >
              <Download className="size-3.5 text-emerald-600" />
              <span className="whitespace-nowrap">Export PDF</span>
            </button>
          )}

          {/* Template Selector Button */}
          <button
            type="button"
            onClick={onShowTemplates}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold transition hover:bg-black/5 shadow-xs sm:px-3"
          >
            <LayoutTemplate className="size-3.5 text-[var(--brand-muted)]" />
            <span className="whitespace-nowrap">Templates</span>
          </button>

          {/* Design Controls Button in Canvas Bar */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowDesignMenu(!showDesignMenu);
                setShowPresetsMenu(false);
                setShowThemeMenu(false);
              }}
              className={cn(
                "flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold transition hover:bg-black/5 shadow-xs sm:px-3",
                showDesignMenu &&
                  "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50 text-emerald-800"
              )}
            >
              <Palette className="size-3.5 text-emerald-600" />
              <span className="whitespace-nowrap">Design</span>
            </button>

            {/* Design Popover Dropdown Panel */}
            {showDesignMenu && (
              <div className="absolute top-10 right-0 z-50 w-72 sm:w-80 rounded-2xl border border-black/15 bg-white p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2.5 border-b border-black/10 mb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="size-4 text-emerald-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-ink)]">
                      Canvas Design
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDesignMenu(false)}
                    className="builder-icon-button"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                {/* Accent Color Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[var(--brand-ink)]">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[var(--brand-muted)] font-bold">
                        {resumeStyle?.accent || template.accent || "#28785b"}
                      </span>
                      <span
                        className="size-3.5 rounded-full border border-black/20"
                        style={{
                          backgroundColor: resumeStyle?.accent || template.accent || "#28785b",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Custom Color Wheel Swatch on Left Side */}
                    <label
                      className={cn(
                        "relative flex size-6 cursor-pointer items-center justify-center rounded-full border border-black/20 shadow-xs transition hover:scale-110 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-green-500 via-blue-500 to-red-500",
                        !COLOR_SWATCHES.some(
                          (c) => c.value.toLowerCase() === (resumeStyle?.accent || "").toLowerCase()
                        ) && "ring-2 ring-emerald-600 ring-offset-1"
                      )}
                      title="Pick Any Custom Color"
                    >
                      <input
                        type="color"
                        value={
                          (resumeStyle?.accent || template.accent || "#28785b").startsWith("#")
                            ? resumeStyle?.accent || template.accent || "#28785b"
                            : "#28785b"
                        }
                        onChange={(e) =>
                          onUpdateStyle?.({ ...resumeStyle, accent: e.target.value } as ResumeStyle)
                        }
                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                      />
                      <Pipette className="size-3 text-white drop-shadow-md" />
                    </label>

                    {/* Custom Hex Code Text Input */}
                    <input
                      type="text"
                      value={resumeStyle?.accent || ""}
                      onChange={(e) =>
                        onUpdateStyle?.({ ...resumeStyle, accent: e.target.value } as ResumeStyle)
                      }
                      placeholder={template.accent || "#28785b"}
                      className="w-16 h-6 rounded-lg border border-black/15 bg-black/5 px-1.5 text-[10px] font-mono font-bold text-[var(--brand-ink)] focus:outline-none focus:bg-white"
                    />

                    <span className="h-4 w-px bg-black/15 mx-0.5" />

                    {/* Preset Swatches */}
                    {COLOR_SWATCHES.map((color) => {
                      const isSelected =
                        (resumeStyle?.accent || template.accent).toLowerCase() ===
                        color.value.toLowerCase();
                      return (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() =>
                            onUpdateStyle?.({ ...resumeStyle, accent: color.value } as ResumeStyle)
                          }
                          className={cn(
                            "size-6 rounded-full border border-black/20 transition hover:scale-110 flex items-center justify-center",
                            isSelected && "ring-2 ring-emerald-600 ring-offset-1"
                          )}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {isSelected && <Check className="size-3 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Typography / Font Section */}
                <div className="mb-4 pt-3 border-t border-black/10">
                  <label className="block text-xs font-bold text-[var(--brand-ink)] mb-2">
                    Font / Typography
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(
                      [
                        {
                          id: "template",
                          name: "Template",
                          desc: "Designed pairing",
                          cls: "font-sans",
                        },
                        { id: "sans", name: "Modern", desc: "Clean & Direct", cls: "font-sans" },
                        {
                          id: "serif",
                          name: "Editorial",
                          desc: "Classic & Formal",
                          cls: "font-serif",
                        },
                        { id: "mono", name: "Technical", desc: "Structured", cls: "font-mono" },
                      ] satisfies {
                        id: ResumeStyle["font"];
                        name: string;
                        desc: string;
                        cls: string;
                      }[]
                    ).map((f) => {
                      const isSelected = (resumeStyle?.font || "template") === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() =>
                            onUpdateStyle?.({
                              ...(resumeStyle || {}),
                              font: f.id,
                            } as ResumeStyle)
                          }
                          className={cn(
                            "flex flex-col items-start rounded-xl border p-2 text-left transition",
                            isSelected
                              ? "border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600/30"
                              : "border-black/10 bg-white hover:border-black/25"
                          )}
                        >
                          <span className={cn("text-base font-bold leading-none mb-1", f.cls)}>
                            Aa
                          </span>
                          <span className="text-[11px] font-bold leading-tight">{f.name}</span>
                          <span className="text-[9px] text-[var(--brand-muted)]">{f.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Layout Spacing Options */}
                <div className="pt-3 border-t border-black/10">
                  <label className="block text-xs font-bold text-[var(--brand-ink)] mb-2">
                    Page Spacing
                  </label>
                  <div className="flex gap-1.5">
                    {(
                      [
                        { id: "compact", label: "Compact" },
                        { id: "normal", label: "Normal" },
                        { id: "spacious", label: "Spacious" },
                      ] satisfies {
                        id: NonNullable<ResumeStyle["pagePadding"]>;
                        label: string;
                      }[]
                    ).map((p) => {
                      const isSelected = (resumeStyle?.pagePadding || "normal") === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() =>
                            onUpdateStyle?.({
                              ...(resumeStyle || {}),
                              pagePadding: p.id,
                            } as ResumeStyle)
                          }
                          className={cn(
                            "flex-1 rounded-lg border py-1 text-center text-[10px] font-bold transition",
                            isSelected
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-black/10 bg-white text-[var(--brand-muted)] hover:border-black/25"
                          )}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="builder-icon-button shrink-0"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={cn(
          "canvas-bg relative flex-1 overflow-hidden transition-colors duration-300",
          themeStyles[canvasTheme],
          activeHand ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        )}
      >
        {/* Visual Granular Selection Bounding Box Overlay */}
        {highlightRect && (
          <div
            className="no-print pointer-events-none absolute z-30 rounded-2xl border-2 border-[#059669] bg-emerald-500/10 transition-all duration-150 ease-out"
            style={{
              top: `${highlightRect.top}px`,
              left: `${highlightRect.left}px`,
              width: `${highlightRect.width}px`,
              height: `${highlightRect.height}px`,
            }}
          >
            <span className="absolute -bottom-3 right-2 rounded-full bg-[#059669] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-white shadow-xs">
              SELECTED
            </span>
          </div>
        )}

        {/* Contextual Floating Formatting Bar (Appears directly above clicked element on PDF) */}
        {selectedElement && toolbarPos && (
          <div
            ref={toolbarRef}
            onClick={(e) => e.stopPropagation()}
            className="no-print absolute z-50 flex items-center gap-1.5 rounded-full border border-black/15 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95 overflow-visible"
            style={{
              top: `${toolbarPos.top}px`,
              left: `${toolbarPos.left}px`,
            }}
          >
            {/* AI Icon & Inline Text Input Pill Container */}
            <div className="relative flex items-center gap-1.5 rounded-full bg-black/5 px-2 py-1 shrink-0">
              <button
                type="button"
                onClick={handleAiRefine}
                disabled={isRefining}
                className="flex size-6 shrink-0 items-center justify-center rounded-full hover:bg-black/10 transition cursor-pointer disabled:opacity-50"
                title="AI Smart Refine Text"
              >
                {isRefining ? (
                  <Loader2 className="size-3.5 text-[#059669] animate-spin" />
                ) : (
                  <Sparkles className="size-3.5 text-[#059669]" />
                )}
              </button>

              <input
                type="text"
                value={inlineText}
                onChange={(e) => handleRealtimeTextChange(e.target.value)}
                className="h-7 w-32 sm:w-44 rounded-xl bg-white px-2.5 text-xs font-bold text-[var(--brand-ink)] shadow-xs outline-none focus:ring-1 focus:ring-[#059669] truncate"
                placeholder="Edit inline..."
              />

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full transition cursor-pointer",
                  isExpanded ? "bg-[#059669] text-white" : "hover:bg-black/10 text-[var(--brand-muted)]"
                )}
                title={isExpanded ? "Collapse Editor Card" : "Expand Full Paragraph Editor Card"}
              >
                {isExpanded ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />}
              </button>

              {/* Expandable Floating Paragraph Editor Card */}
              {isExpanded && (
                <div className="absolute top-12 left-0 z-[100] flex w-80 sm:w-[400px] flex-col gap-2 rounded-2xl border border-black/15 bg-white p-3 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-auto">
                  <div className="flex items-center justify-between border-b border-black/10 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#059669] border border-emerald-500/20">
                        {selectedElement.title || selectedElement.field || "Section"}
                      </span>
                      <span className="text-[10px] font-semibold text-[var(--brand-muted)]">
                        {inlineText.length} chars
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleAiRefine}
                        disabled={isRefining}
                        className="flex h-7 items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 px-2.5 text-[11px] font-bold text-[#059669] hover:bg-emerald-100 transition cursor-pointer disabled:opacity-50"
                      >
                        {isRefining ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Sparkles className="size-3" />
                        )}
                        <span>AI Refine</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="flex size-7 items-center justify-center rounded-xl hover:bg-black/5 text-[var(--brand-muted)] transition cursor-pointer"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={5}
                    value={inlineText}
                    onChange={(e) => handleRealtimeTextChange(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-black/5 p-2.5 text-xs font-medium leading-relaxed text-[var(--brand-ink)] outline-none focus:border-[#059669] focus:bg-white resize-y scrollbar-thin transition-all"
                    placeholder="Type or edit full section text..."
                    autoFocus
                  />
                </div>
              )}
            </div>

            <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

            {/* A- / A+ Font Size Control Pill */}
            <div className="flex items-center rounded-xl bg-black/5 p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => changeFontSize(-1)}
                className="flex h-7 px-2 items-center justify-center rounded-lg text-xs font-bold text-[var(--brand-ink)] hover:bg-white hover:shadow-xs transition cursor-pointer"
                title="Decrease font size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => changeFontSize(1)}
                className="flex h-7 px-2 items-center justify-center rounded-lg text-xs font-bold text-[var(--brand-ink)] hover:bg-white hover:shadow-xs transition cursor-pointer"
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Bold, Italic, Case Transform, Clear Formatting */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={toggleBold}
                className="builder-icon-button cursor-pointer"
                title="Bold text formatting"
              >
                <Bold className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={toggleItalic}
                className="builder-icon-button cursor-pointer"
                title="Italic text formatting"
              >
                <Italic className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={toggleCase}
                className="builder-icon-button cursor-pointer"
                title="Toggle UPPERCASE / Normal Case (AB)"
              >
                <CaseSensitive className="size-4" />
              </button>

              <button
                type="button"
                onClick={clearFormatting}
                className="builder-icon-button cursor-pointer"
                title="Clear text formatting (Tx)"
              >
                <RemoveFormatting className="size-4" />
              </button>
            </div>

            <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

            {/* Text Alignment */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setTextAlign("left")}
                className="builder-icon-button cursor-pointer"
                title="Align Left"
              >
                <AlignLeft className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setTextAlign("center")}
                className="builder-icon-button cursor-pointer"
                title="Align Center"
              >
                <AlignCenter className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setTextAlign("right")}
                className="builder-icon-button cursor-pointer"
                title="Align Right"
              >
                <AlignRight className="size-3.5" />
              </button>
            </div>

            <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

            {/* Color Swatch & Trash Picker */}
            <div className="relative flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="builder-icon-button cursor-pointer"
                title="Text / Accent Color"
              >
                <Palette className="size-3.5 text-[#059669]" />
              </button>

              {selectedElement.id && (
                <button
                  type="button"
                  onClick={deleteSelected}
                  className="builder-icon-button text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Delete item"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}

              {showColorPicker && (
                <div className="absolute top-12 right-0 z-[100] flex items-center gap-2 rounded-full border border-black/15 bg-white p-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-auto">
                  {/* Custom Color Wheel Swatch */}
                  <label
                    className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-green-500 via-blue-500 to-red-500 shadow-xs transition hover:scale-105"
                    title="Pick Custom Color"
                  >
                    <input
                      type="color"
                      value={
                        (resumeStyle?.accent || template.accent || "#059669").startsWith("#")
                          ? resumeStyle?.accent || template.accent || "#059669"
                          : "#059669"
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedDomRef.current) {
                          selectedDomRef.current.style.color = val;
                        }
                      }}
                      className="absolute inset-0 size-full cursor-pointer opacity-0"
                    />
                    <Pipette className="size-3 text-white drop-shadow-md" />
                  </label>

                  {/* Custom Hex Code Input */}
                  <input
                    type="text"
                    value={resumeStyle?.accent || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (selectedDomRef.current && val.startsWith("#") && val.length >= 4) {
                        selectedDomRef.current.style.color = val;
                      }
                    }}
                    placeholder="#059669"
                    className="w-16 h-7 rounded-xl border border-black/15 bg-black/5 px-2 text-[10px] font-mono font-bold text-[var(--brand-ink)] outline-none focus:bg-white"
                  />

                  <span className="h-4 w-px bg-black/15 mx-0.5 shrink-0" />

                  {/* Preset Swatches */}
                  <div className="flex items-center gap-1.5">
                    {COLOR_SWATCHES.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => {
                          if (selectedDomRef.current) {
                            selectedDomRef.current.style.color = color.value;
                          }
                          setShowColorPicker(false);
                        }}
                        className="size-6 rounded-full border border-black/20 shadow-xs transition hover:scale-110 cursor-pointer"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

            {/* Close Formatting Bar Button */}
            <button
              type="button"
              onClick={clearSelection}
              className="builder-icon-button cursor-pointer shrink-0"
              title="Close formatting bar"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {/* Rendered Document Sheet Container */}
        <div className="absolute inset-0 flex items-center justify-center p-8 overflow-auto">
          <div
            style={{
              transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.15s ease-out",
            }}
            className="no-print-transform flex items-center justify-center shadow-2xl"
          >
            <div
              ref={sheetRef}
              onClick={handleSheetClick}
              className={cn(
                "resume-preview-sheet pointer-events-auto relative shadow-[0_28px_85px_rgba(0,0,0,0.22)]",
                activeHand && "hand-mode"
              )}
            >
              {/* Resume Sheet Preview */}
              <ResumePreview
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

      {/* Floating Bottom-Center Glassmorphic Zoom Toolbar */}
      <div className="no-print absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-black/15 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md transition-all duration-200">
        {/* Select vs Hand/Pan Tool Switcher */}
        <div className="flex items-center rounded-xl bg-black/5 p-0.5">
          <button
            type="button"
            onClick={() => setIsHandTool(false)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition cursor-pointer",
              !activeHand
                ? "bg-white text-[var(--brand-ink)] shadow-xs"
                : "text-[var(--brand-muted)] hover:text-black"
            )}
            title="Select Mode (Click text on PDF to highlight & edit)"
          >
            <MousePointer className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsHandTool(true)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition cursor-pointer",
              activeHand
                ? "bg-white text-[var(--brand-ink)] shadow-xs"
                : "text-[var(--brand-muted)] hover:text-black"
            )}
            title="Pan / Hand Tool (Drag Canvas)"
          >
            <Hand className="size-3.5" />
          </button>
        </div>

        <span className="h-4 w-px bg-black/10 mx-0.5" />

        {/* Zoom Out Button */}
        <button
          type="button"
          onClick={() => onZoomChange(Math.max(30, zoom - 10))}
          className="builder-icon-button cursor-pointer"
          title="Zoom Out (Ctrl + -)"
        >
          <ZoomOut className="size-3.5" />
        </button>

        {/* Zoom Level & Presets Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowPresetsMenu(!showPresetsMenu);
              setShowThemeMenu(false);
            }}
            className="flex h-8 items-center gap-1 rounded-xl bg-black/5 px-2.5 text-xs font-bold text-[var(--brand-ink)] transition hover:bg-black/10 cursor-pointer"
            title="Choose Zoom Scale"
          >
            <span>{Math.round(zoom)}%</span>
            <span className="text-[10px] text-[var(--brand-muted)]">▼</span>
          </button>

          {showPresetsMenu && (
            <div className="absolute bottom-11 left-1/2 z-50 min-w-[120px] -translate-x-1/2 rounded-2xl border border-black/15 bg-white p-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => {
                  fitToWidth();
                  setShowPresetsMenu(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold text-[var(--brand-ink)] hover:bg-black/5 cursor-pointer"
              >
                <span>Fit Width</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  fitToPage();
                  setShowPresetsMenu(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold text-[var(--brand-ink)] hover:bg-black/5 cursor-pointer"
              >
                <span>Fit Page</span>
              </button>
              <div className="my-1 h-px bg-black/10" />
              {ZOOM_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    onZoomChange(preset.value);
                    setShowPresetsMenu(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-2.5 py-1 text-xs font-bold transition cursor-pointer",
                    Math.round(zoom) === preset.value
                      ? "bg-emerald-50 text-emerald-900 font-extrabold"
                      : "text-[var(--brand-ink)] hover:bg-black/5"
                  )}
                >
                  <span>{preset.label}</span>
                  {Math.round(zoom) === preset.value && <Check className="size-3 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zoom In Button */}
        <button
          type="button"
          onClick={() => onZoomChange(Math.min(200, zoom + 10))}
          className="builder-icon-button cursor-pointer"
          title="Zoom In (Ctrl + +)"
        >
          <ZoomIn className="size-3.5" />
        </button>

        {/* Reset Pan & Zoom Button */}
        <button
          type="button"
          onClick={resetPanAndZoom}
          className="builder-icon-button cursor-pointer"
          title="Reset Pan & Zoom (Ctrl + 0)"
        >
          <RotateCcw className="size-3.5" />
        </button>

        <span className="h-4 w-px bg-black/10 mx-0.5" />

        {/* Undo Button */}
        <button
          type="button"
          onClick={handleUndo}
          disabled={!canUndo}
          className="builder-icon-button disabled:opacity-30 cursor-pointer"
          title="Undo (Ctrl + Z)"
          aria-label="Undo"
        >
          <Undo2 className="size-3.5" />
        </button>

        {/* Redo Button */}
        <button
          type="button"
          onClick={handleRedo}
          disabled={!canRedo}
          className="builder-icon-button disabled:opacity-30 cursor-pointer"
          title="Redo (Ctrl + Y)"
          aria-label="Redo"
        >
          <Redo2 className="size-3.5" />
        </button>

        <span className="h-4 w-px bg-black/10 mx-0.5" />

        {/* Canvas Background Theme Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              setShowPresetsMenu(false);
            }}
            className="builder-icon-button cursor-pointer"
            title="Canvas Theme"
          >
            <Grid className="size-3.5 text-[var(--brand-ink)]" />
          </button>

          {showThemeMenu && (
            <div className="absolute bottom-11 right-0 z-50 min-w-[130px] rounded-2xl border border-black/15 bg-white p-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
              {[
                { id: "dots", label: "Studio Dots" },
                { id: "grid", label: "CAD Grid" },
                { id: "studio", label: "Dark Studio" },
                { id: "clean", label: "Clean Paper" },
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    setCanvasTheme(theme.id as CanvasTheme);
                    setShowThemeMenu(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer",
                    canvasTheme === theme.id
                      ? "bg-emerald-50 text-emerald-900 font-extrabold"
                      : "text-[var(--brand-ink)] hover:bg-black/5"
                  )}
                >
                  <span>{theme.label}</span>
                  {canvasTheme === theme.id && <Check className="size-3 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
