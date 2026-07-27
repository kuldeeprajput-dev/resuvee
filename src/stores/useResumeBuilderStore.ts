"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { defaultResumeStyle, type ResumeStyle } from "@/components/resume/CustomizePanel";
import { createBlankResumeData, resumeTemplates } from "@/lib/resume-data";
import { getTemplateStarterData } from "@/lib/resume-presets";
import type {
  BuilderSection,
  ResumeData,
  ResumeTemplateId,
} from "@/types/resume";

export type TemplateFilter =
  | "all"
  | "popular"
  | "fresher"
  | "professional";

interface PersistedBuilderState {
  data: ResumeData;
  templateId: ResumeTemplateId;
  resumeStyle: ResumeStyle;
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
  undo: () => void;
  redo: () => void;
  startFresh: () => void;
}

const STORAGE_KEY = "resulyra-builder-v3";
const LEGACY_STORAGE_KEYS = ["resulyra-draft-v1", "resumix-draft-v1"];

export function isResumeTemplateId(
  value: string | undefined,
): value is ResumeTemplateId {
  return resumeTemplates.some((template) => template.id === value);
}

function safeTemplateId(value: string | undefined): ResumeTemplateId {
  return isResumeTemplateId(value) ? value : "standard";
}

function getLegacyDraft(): Partial<PersistedBuilderState> | null {
  if (typeof window === "undefined") return null;

  for (const key of LEGACY_STORAGE_KEYS) {
    const value = window.localStorage.getItem(key);
    if (!value) continue;

    try {
      const parsed = JSON.parse(value) as {
        data?: ResumeData;
        templateId?: string;
        style?: ResumeStyle;
      };
      return {
        data: parsed.data,
        templateId: safeTemplateId(parsed.templateId),
        resumeStyle: parsed.style,
      };
    } catch {
      window.localStorage.removeItem(key);
    }
  }

  return null;
}

function firstAllowedSection(templateId: ResumeTemplateId) {
  return (
    resumeTemplates.find((template) => template.id === templateId)?.sections[0] ??
    "basics"
  );
}

export const useResumeBuilderStore = create<ResumeBuilderState>()(
  persist(
    (set, get) => ({
      data: getTemplateStarterData("standard"),
      templateId: "standard",
      resumeStyle: defaultResumeStyle,
      activeSection: "basics",
      zoom: 72,
      history: [],
      future: [],
      saveLabel: "Saved locally",
      hydrated: false,
      initialized: false,
      showTemplates: false,
      showMobilePreview: false,
      showTailor: false,
      showCustomize: false,
      showWritingCheck: false,
      templateFilter: "popular",

      initialize: (initialTemplate, starter) => {
        if (get().initialized) return;

        const requestedTemplate = safeTemplateId(initialTemplate);
        const hasPersistedDraft =
          typeof window !== "undefined" &&
          Boolean(window.localStorage.getItem(STORAGE_KEY));
        const legacyDraft = hasPersistedDraft ? null : getLegacyDraft();
        const launchWithExample =
          starter === "template" || starter === "fresher";

        if (launchWithExample && isResumeTemplateId(initialTemplate)) {
          set({
            data: getTemplateStarterData(requestedTemplate),
            templateId: requestedTemplate,
            activeSection: firstAllowedSection(requestedTemplate),
            history: [],
            future: [],
            initialized: true,
            hydrated: true,
            saveLabel: "Example loaded",
          });
          return;
        }

        if (legacyDraft?.data) {
          const legacyTemplate = legacyDraft.templateId ?? requestedTemplate;
          set({
            data: legacyDraft.data,
            templateId: legacyTemplate,
            resumeStyle: legacyDraft.resumeStyle ?? defaultResumeStyle,
          });
        }

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
        set((state) => ({
          data,
          history: [...state.history.slice(-39), current],
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
      setZoom: (zoom) => set({ zoom: Math.max(50, Math.min(95, zoom)) }),
      setTemplateFilter: (templateFilter) => set({ templateFilter }),
      setShowTemplates: (showTemplates) => set({ showTemplates }),
      setShowMobilePreview: (showMobilePreview) => set({ showMobilePreview }),
      setShowTailor: (showTailor) => set({ showTailor }),
      setShowCustomize: (showCustomize) => set({ showCustomize }),
      setShowWritingCheck: (showWritingCheck) => set({ showWritingCheck }),

      undo: () => {
        const state = get();
        const previous = state.history.at(-1);
        if (!previous) return;
        set({
          data: previous,
          history: state.history.slice(0, -1),
          future: [state.data, ...state.future].slice(0, 40),
          saveLabel: "Undo applied",
        });
      },

      redo: () => {
        const state = get();
        const next = state.future[0];
        if (!next) return;
        set({
          data: next,
          history: [...state.history.slice(-39), state.data],
          future: state.future.slice(1),
          saveLabel: "Redo applied",
        });
      },

      startFresh: () =>
        set({
          data: createBlankResumeData(),
          activeSection: "basics",
          history: [],
          future: [],
          saveLabel: "New resume",
        }),
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
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<PersistedBuilderState>;
        return {
          ...state,
          templateId: safeTemplateId(state.templateId),
        } as PersistedBuilderState;
      },
    },
  ),
);
