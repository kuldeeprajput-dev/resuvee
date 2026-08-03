"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { defaultResumeStyle, type ResumeStyle } from "../ui/components/customize-panel";
import { resumeTemplates } from "../constants/resume-data";
import { createBlankResumeData } from "../constants/resume-seed-data";
import { getTemplateStarterData } from "../constants/resume-presets";
import type { BuilderSection, ResumeData, ResumeTemplateId } from "../types/resume";
import type { WritingIssue } from "../types/writing";

export type TemplateFilter = "all" | "popular" | "fresher" | "professional";

interface PersistedBuilderState {
  data: ResumeData;
  templateId: ResumeTemplateId;
  resumeStyle: ResumeStyle;
  writingIssues?: WritingIssue[];
  writingHasChecked?: boolean;
}

interface ResumeBuilderState extends PersistedBuilderState {
  activeSection: BuilderSection;
  zoom: number;
  history: ResumeData[];
  future: ResumeData[];
  saveLabel: string;
  hydrated: boolean;
  initialized: boolean;
  showTemplates: boolean;
  showMobilePreview: boolean;
  showTailor: boolean;
  showCustomize: boolean;
  showWritingCheck: boolean;
  templateFilter: TemplateFilter;
  writingIssues: WritingIssue[];
  writingHasChecked: boolean;
  initialize: (template?: string, starter?: string) => void;
  setHydrated: (hydrated: boolean) => void;
  updateData: (data: ResumeData) => void;
  selectTemplate: (templateId: ResumeTemplateId) => void;
  setActiveSection: (section: BuilderSection) => void;
  setResumeStyle: (style: ResumeStyle) => void;
  setZoom: (zoom: number) => void;
  setTemplateFilter: (filter: TemplateFilter) => void;
  setShowTemplates: (open: boolean) => void;
  setShowMobilePreview: (open: boolean) => void;
  setShowTailor: (open: boolean) => void;
  setShowCustomize: (open: boolean) => void;
  setShowWritingCheck: (open: boolean) => void;
  setWritingCheckResults: (issues: WritingIssue[]) => void;
  removeWritingIssue: (issueId: string) => void;
  clearWritingIssues: () => void;
  undo: () => void;
  redo: () => void;
  startFresh: () => void;
}

const STORAGE_KEY = "resulyra-builder-v3";
const LEGACY_STORAGE_KEYS = ["resulyra-draft-v1", "resumix-draft-v1"];

export function isResumeTemplateId(value: string | undefined): value is ResumeTemplateId {
  return resumeTemplates.some((template) => template.id === value);
}

function safeTemplateId(value: unknown): ResumeTemplateId {
  if (typeof value === "string" && isResumeTemplateId(value)) {
    return value;
  }
  return "standard";
}

function cloneData(data: ResumeData): ResumeData {
  return JSON.parse(JSON.stringify(data)) as ResumeData;
}

export const useResumeBuilderStore = create<ResumeBuilderState>()(
  persist(
    (set, get) => ({
      data: getTemplateStarterData("standard"),
      templateId: "standard",
      resumeStyle: defaultResumeStyle,
      activeSection: "basics",
      zoom: 100,
      history: [],
      future: [],
      saveLabel: "Draft ready",
      hydrated: false,
      initialized: false,
      showTemplates: false,
      showMobilePreview: false,
      showTailor: false,
      showCustomize: false,
      showWritingCheck: false,
      templateFilter: "all",
      writingIssues: [],
      writingHasChecked: false,

      initialize: (initialTemplate, initialStarter) => {
        if (get().initialized) return;

        const requestedTemplate = isResumeTemplateId(initialTemplate)
          ? initialTemplate
          : safeTemplateId(get().templateId);

        let baseData = get().data;

        if (typeof window !== "undefined") {
          for (const key of LEGACY_STORAGE_KEYS) {
            try {
              const raw = localStorage.getItem(key);
              if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object" && "basics" in parsed) {
                  baseData = parsed as ResumeData;
                  break;
                }
              }
            } catch {
              // Ignore legacy format errors
            }
          }
        }

        if (isResumeTemplateId(initialStarter)) {
          const starter = getTemplateStarterData(initialStarter);
          baseData = starter;
        }

        set({
          data: baseData,
          templateId: requestedTemplate,
        });

        if (isResumeTemplateId(initialTemplate)) {
          set({
            templateId: requestedTemplate,
          });
        }

        set({ initialized: true, hydrated: true });
      },

      setHydrated: (hydrated) => set({ hydrated }),

      updateData: (data) => {
        const current = get().data;
        const snapshot = cloneData(current);
        const nextData = cloneData(data);
        set((state) => ({
          data: nextData,
          history: [...state.history.slice(-39), snapshot],
          future: [],
          saveLabel: "Saved locally",
        }));
      },

      selectTemplate: (templateId) => {
        const template = resumeTemplates.find((item) => item.id === templateId);
        if (!template) return;

        const activeSection = template.sections.includes(get().activeSection)
          ? get().activeSection
          : template.sections[0];
        set({
          templateId,
          activeSection,
          showTemplates: false,
          saveLabel: "Template applied",
        });
      },

      setActiveSection: (activeSection) => set({ activeSection }),
      setResumeStyle: (resumeStyle) => set({ resumeStyle }),
      setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(300, Math.round(zoom))) }),
      setTemplateFilter: (templateFilter) => set({ templateFilter }),
      setShowTemplates: (showTemplates) => set({ showTemplates }),
      setShowMobilePreview: (showMobilePreview) => set({ showMobilePreview }),
      setShowTailor: (showTailor) => set({ showTailor }),
      setShowCustomize: (showCustomize) => set({ showCustomize }),
      setShowWritingCheck: (showWritingCheck) => set({ showWritingCheck }),

      setWritingCheckResults: (issues) => set({ writingIssues: issues, writingHasChecked: true }),
      removeWritingIssue: (issueId) =>
        set((state) => ({
          writingIssues: state.writingIssues.filter((item) => item.id !== issueId),
        })),
      clearWritingIssues: () => set({ writingIssues: [], writingHasChecked: false }),

      undo: () => {
        const state = get();
        const previous = state.history.at(-1);
        if (!previous) return;
        const currentSnapshot = cloneData(state.data);
        set({
          data: cloneData(previous),
          history: state.history.slice(0, -1),
          future: [currentSnapshot, ...state.future].slice(0, 40),
          saveLabel: "Undo applied",
        });
      },

      redo: () => {
        const state = get();
        const next = state.future[0];
        if (!next) return;
        const currentSnapshot = cloneData(state.data);
        set({
          data: cloneData(next),
          history: [...state.history.slice(-39), currentSnapshot],
          future: state.future.slice(1),
          saveLabel: "Redo applied",
        });
      },

      startFresh: () => {
        if (typeof window !== "undefined") {
          localStorage.setItem("active-resume-id", "new");
        }
        set({
          data: createBlankResumeData(),
          activeSection: "basics",
          history: [],
          future: [],
          writingIssues: [],
          writingHasChecked: false,
          saveLabel: "New resume",
        });
      },
    }),
    {
      name: STORAGE_KEY,
      version: 3,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state): PersistedBuilderState => ({
        data: state.data,
        templateId: state.templateId,
        resumeStyle: state.resumeStyle,
        writingIssues: state.writingIssues,
        writingHasChecked: state.writingHasChecked,
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<PersistedBuilderState>;
        return {
          ...state,
          templateId: safeTemplateId(state.templateId),
        } as PersistedBuilderState;
      },
    }
  )
);
