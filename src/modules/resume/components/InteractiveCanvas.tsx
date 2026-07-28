"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
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
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import type { BuilderSection, ResumeData, ResumeTemplate } from "../types/resume";
import { useResumeBuilderStore } from "../store/useResumeBuilderStore";
import { ResumePreview } from "./ResumePreview";
import { resumeFontClass, type ResumeStyle } from "./CustomizePanel";
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

  const clearSelection = useCallback(() => {
    setSelectedElement(null);
    setHighlightRect(null);
    setToolbarPos(null);
    setShowColorPicker(false);
    selectedDomRef.current = null;
  }, []);

  const resetPanAndZoom = useCallback(() => {
    setPan({ x: 0, y: 0 });
    onZoomChange(80);
  }, [onZoomChange]);

  // Recalculate selection box bounds dynamically whenever text size/content changes
  const updateSelectionBounds = useCallback(() => {
    if (!selectedDomRef.current || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const elemRect = selectedDomRef.current.getBoundingClientRect();

    const box = {
      top: elemRect.top - containerRect.top - 2,
      left: elemRect.left - containerRect.left - 2,
      width: Math.max(40, elemRect.width + 4),
      height: Math.max(16, elemRect.height + 4),
    };

    const top = Math.max(65, box.top - 48);
    const left = Math.max(20, Math.min(containerRect.width - 420, box.left + box.width / 2 - 210));

    setHighlightRect(box);
    setToolbarPos({ top, left });
  }, []);

  // ResizeObserver to track dynamic line wrapping & font size changes automatically
  useEffect(() => {
    if (!selectedElement || !selectedDomRef.current) return;
    const observer = new ResizeObserver(() => {
      updateSelectionBounds();
    });
    observer.observe(selectedDomRef.current);
    return () => {
      observer.disconnect();
    };
  }, [selectedElement, updateSelectionBounds]);

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
            <span className="flex size-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
            <p className="whitespace-nowrap text-xs font-bold tracking-tight">Studio Canvas</p>
          </div>

          {/* Editorial Template Badge */}
          <span className="shrink-0 max-w-[110px] truncate rounded-full bg-[var(--brand-lime)] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[var(--brand-ink)]">
            {template.name}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 pl-2 ml-auto z-10">
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

        {/* Contextual Floating Formatting Bar (Appears directly above clicked element on PDF) */}
        {selectedElement && toolbarPos && (
          <div
            className="no-print absolute z-50 flex items-center gap-1 rounded-2xl border border-black/15 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in zoom-in-95"
            style={{
              top: `${toolbarPos.top}px`,
              left: `${toolbarPos.left}px`,
            }}
          >
            {/* Real-Time Inline Input */}
            <div className="flex items-center gap-1 rounded-xl bg-black/5 px-2 py-1">
              <Edit3 className="size-3.5 text-emerald-700" />
              <input
                type="text"
                value={inlineText}
                onChange={(e) => handleRealtimeTextChange(e.target.value)}
                className="w-40 rounded-md bg-white px-2 py-0.5 text-xs font-bold text-[var(--brand-ink)] focus:outline-none focus:ring-1 focus:ring-emerald-600"
                placeholder="Type in real-time..."
              />
            </div>

            <span className="h-5 w-px bg-black/10 mx-0.5" />

            {/* Localized Font Size Adjusters */}
            <div className="flex items-center gap-0.5 rounded-xl bg-black/5 p-0.5">
              <button
                type="button"
                onClick={() => changeFontSize(-1)}
                className="flex size-6 items-center justify-center rounded-md text-[11px] font-extrabold text-[var(--brand-ink)] hover:bg-white"
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => changeFontSize(1)}
                className="flex size-6 items-center justify-center rounded-md text-[11px] font-extrabold text-[var(--brand-ink)] hover:bg-white"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* Localized Bold & Italic Toggles */}
            <button
              type="button"
              onClick={toggleBold}
              className="builder-icon-button"
              title="Toggle Bold"
            >
              <Bold className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={toggleItalic}
              className="builder-icon-button"
              title="Toggle Italic"
            >
              <Italic className="size-3.5" />
            </button>

            {/* Case Transformer */}
            <button
              type="button"
              onClick={toggleCase}
              className="builder-icon-button"
              title="Cycle Text Case (UPPER / Title / lower)"
            >
              <CaseUpper className="size-3.5" />
            </button>

            {/* Clear Formatting (Tx Icon) */}
            <button
              type="button"
              onClick={clearFormatting}
              className="builder-icon-button"
              title="Clear Formatting (Reset font size, weight, style & color to template defaults)"
            >
              <RemoveFormatting className="size-3.5 text-[var(--brand-ink)]" />
            </button>

            <span className="h-5 w-px bg-black/10 mx-0.5" />

            {/* Alignment Controls */}
            <button
              type="button"
              onClick={() => setTextAlign("left")}
              className="builder-icon-button"
              title="Align Left"
            >
              <AlignLeft className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTextAlign("center")}
              className="builder-icon-button"
              title="Align Center"
            >
              <AlignCenter className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTextAlign("right")}
              className="builder-icon-button"
              title="Align Right"
            >
              <AlignRight className="size-3.5" />
            </button>

            <span className="h-5 w-px bg-black/10 mx-0.5" />

            {/* Color Swatch Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="builder-icon-button"
                title="Accent / Text Color"
              >
                <Palette className="size-3.5 text-emerald-600" />
              </button>

              {showColorPicker && (
                <div className="absolute top-10 left-0 z-50 flex items-center gap-2 rounded-2xl border border-black/15 bg-white p-2.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 min-w-[240px]">
                  {/* Custom Color Wheel Swatch */}
                  <label
                    className="relative flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 shadow-xs transition hover:scale-110 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-green-500 via-blue-500 to-red-500"
                    title="Pick Any Custom Color"
                  >
                    <input
                      type="color"
                      value={
                        (resumeStyle?.accent || template.accent || "#28785b").startsWith("#")
                          ? resumeStyle?.accent || template.accent || "#28785b"
                          : "#28785b"
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedDomRef.current) {
                          selectedDomRef.current.style.color = val;
                        }
                        onUpdateStyle?.({ ...resumeStyle, accent: val } as ResumeStyle);
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
                      onUpdateStyle?.({ ...resumeStyle, accent: val } as ResumeStyle);
                    }}
                    placeholder={template.accent || "#202020"}
                    className="w-16 h-6 rounded-lg border border-black/15 bg-black/5 px-1.5 text-[10px] font-mono font-bold text-[var(--brand-ink)] focus:outline-none focus:bg-white"
                  />

                  <span className="h-4 w-px bg-black/15 mx-0.5" />

                  {/* Preset Swatches */}
                  {COLOR_SWATCHES.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        if (selectedDomRef.current) {
                          selectedDomRef.current.style.color = color.value;
                        }
                        onUpdateStyle?.({ ...resumeStyle, accent: color.value } as ResumeStyle);
                        setShowColorPicker(false);
                      }}
                      className="size-5 rounded-full border border-black/10 transition hover:scale-110 shrink-0"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              )}
            </div>

            <span className="h-5 w-px bg-black/10 mx-0.5" />

            {/* Duplicate Item */}
            {selectedElement.id && (
              <button
                type="button"
                onClick={duplicateSelected}
                className="builder-icon-button"
                title="Duplicate Item"
              >
                <Copy className="size-3.5" />
              </button>
            )}

            {/* Delete Item */}
            {selectedElement.id && (
              <button
                type="button"
                onClick={deleteSelected}
                className="builder-icon-button text-red-600 hover:bg-red-50"
                title="Delete Item"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}

            {/* Close Toolbar */}
            <button type="button" onClick={clearSelection} className="builder-icon-button">
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {/* Rendered Document Sheet Container */}
        <div
          className="canvas-bg resume-preview-stage absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0)`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
        >
          <div
            ref={sheetRef}
            onClick={handleSheetClick}
            className="resume-preview-sheet pointer-events-auto relative transition-transform duration-100 ease-out shadow-[0_28px_85px_rgba(0,0,0,0.22)]"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center center",
            }}
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

      {/* Floating Bottom-Center Glassmorphic Zoom Toolbar */}
      <div className="no-print absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/40 bg-white/85 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-md">
        {/* Select vs Hand/Pan Tool Switcher */}
        <div className="flex items-center rounded-xl bg-black/5 p-0.5">
          <button
            type="button"
            onClick={() => setIsHandTool(false)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition",
              !isHandTool && !isSpacePressed
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
              "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition",
              isHandTool || isSpacePressed
                ? "bg-[var(--brand-ink)] text-white shadow-xs"
                : "text-[var(--brand-muted)] hover:text-black"
            )}
            title="Pan / Hand Tool (Drag Canvas)"
          >
            <Hand className="size-3.5" />
          </button>
        </div>

        <span className="h-5 w-px bg-black/10 mx-1" />

        {/* Zoom Out Button */}
        <button
          type="button"
          onClick={() => onZoomChange(zoom - 10)}
          className="builder-icon-button"
          title="Zoom Out (Ctrl + -)"
        >
          <Minus className="size-3.5" />
        </button>

        {/* Zoom Level & Presets Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowPresetsMenu(!showPresetsMenu);
              setShowThemeMenu(false);
            }}
            className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold text-[var(--brand-ink)] hover:bg-black/5"
          >
            <span>{Math.round(zoom)}%</span>
            <ChevronDown className="size-3 text-[var(--brand-muted)]" />
          </button>

          {showPresetsMenu && (
            <div className="absolute bottom-11 left-1/2 z-50 min-w-[120px] -translate-x-1/2 rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl backdrop-blur">
              <button
                type="button"
                onClick={() => {
                  fitToWidth();
                  setShowPresetsMenu(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[var(--brand-ink)] hover:bg-black/5"
              >
                <span>Fit Width</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  fitToPage();
                  setShowPresetsMenu(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[var(--brand-ink)] hover:bg-black/5"
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
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-[11px] font-medium transition hover:bg-black/5",
                    Math.round(zoom) === preset.value && "font-bold text-emerald-700 bg-emerald-50"
                  )}
                >
                  <span>{preset.label}</span>
                  {Math.round(zoom) === preset.value && <Check className="size-3" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zoom In Button */}
        <button
          type="button"
          onClick={() => onZoomChange(zoom + 10)}
          className="builder-icon-button"
          title="Zoom In (Ctrl + +)"
        >
          <Plus className="size-3.5" />
        </button>

        <span className="h-5 w-px bg-black/10 mx-1" />

        {/* Reset Pan & Zoom Button */}
        <button
          type="button"
          onClick={resetPanAndZoom}
          className="builder-icon-button"
          title="Reset Pan & Zoom (Ctrl + 0)"
        >
          <RotateCcw className="size-3.5" />
        </button>

        {/* Undo Button */}
        <button
          type="button"
          onClick={handleUndo}
          disabled={!canUndo}
          className="builder-icon-button disabled:opacity-30"
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
          className="builder-icon-button disabled:opacity-30"
          title="Redo (Ctrl + Y)"
          aria-label="Redo"
        >
          <Redo2 className="size-3.5" />
        </button>

        {/* Canvas Background Theme Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              setShowPresetsMenu(false);
            }}
            className="builder-icon-button"
            title="Canvas Theme"
          >
            <Grid className="size-3.5 text-[var(--brand-ink)]" />
          </button>

          {showThemeMenu && (
            <div className="absolute bottom-11 right-0 z-50 min-w-[130px] rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl">
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
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-medium hover:bg-black/5",
                    canvasTheme === theme.id && "font-bold text-emerald-700 bg-emerald-50"
                  )}
                >
                  <span>{theme.label}</span>
                  {canvasTheme === theme.id && <Check className="size-3" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
