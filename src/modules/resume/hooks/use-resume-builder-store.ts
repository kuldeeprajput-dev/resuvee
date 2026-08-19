"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { defaultResumeStyle, type ResumeStyle } from "../ui/components/customize-panel";
import { resumeTemplates } from "../constants/resume-data";
import { createBlankResumeData } from "../constants/resume-seed-data";
import { getTemplateStarterData, hasResumeContent } from "../constants/resume-presets";
import type { BuilderSection, ResumeData, ResumeTemplateId } from "../types/resume";
import type { WritingIssue } from "../types/writing";
import { idbGet, idbSet, idbDel } from "../services/resume-idb";

export type TemplateFilter = "all" | "popular" | "fresher" | "professional";

interface PersistedBuilderState {
  activeResumeId: string | null;
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
  setActiveResumeId: (id: string | null) => void;
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

export const RESUME_STORAGE_KEY = "resuvee-builder-v3";
const LEGACY_STORAGE_KEYS = ["resulyra-builder-v3", "resulyra-draft-v1", "resumix-draft-v1"];

export function isResumeTemplateId(value: string | undefined): value is ResumeTemplateId {
  return resumeTemplates.some((template) => template.id === value);
}

function safeTemplateId(value: unknown): ResumeTemplateId {
  if (typeof value === "string" && isResumeTemplateId(value)) {
    return value;
  }
  return "standard";
}

/**
 * Lightweight shallow clone — only deep-clones when absolutely required.
 * Used for undo/redo snapshots where we need a true copy.
 */
function cloneData(data: ResumeData): ResumeData {
  return JSON.parse(JSON.stringify(data)) as ResumeData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom IndexedDB storage engine for Zustand persist middleware.
// createJSONStorage handles JSON serialization — we just need to store/retrieve
// raw strings. IDB is async and non-blocking (unlike localStorage).
// ─────────────────────────────────────────────────────────────────────────────
const idbStringEngine = {
  getItem: async (name: string): Promise<string | null> => {
    return idbGet<string>(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    return idbSet(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    return idbDel(name);
  },
};

// Debounce timer for history snapshots — prevents history from growing on every
// single keystroke; only commits a snapshot 400 ms after the user stops typing.
let historyDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSnapshot: ResumeData | null = null;

export const useResumeBuilderStore = create<ResumeBuilderState>()(
  persist(
    (set, get) => ({
      activeResumeId: null,
      data: createBlankResumeData(),
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
        // A template link can mount the builder again in the same browser
        // session. Process that explicit selection even after an earlier
        // builder mount; a direct revisit without a template remains a no-op.
        if (get().initialized && !isResumeTemplateId(initialTemplate)) return;

        const requestedTemplate = isResumeTemplateId(initialTemplate)
          ? initialTemplate
          : safeTemplateId(get().templateId);

        let baseData = get().data;

        // Migrate legacy localStorage keys on first load
        if (typeof window !== "undefined") {
          for (const key of LEGACY_STORAGE_KEYS) {
            try {
              const raw = localStorage.getItem(key);
              if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object" && "basics" in parsed) {
                  baseData = parsed as ResumeData;
                  // Clean up legacy key so we don't read it again
                  localStorage.removeItem(key);
                  break;
                }
              }
            } catch {
              // Ignore legacy format errors
            }
          }
        }

        if (isResumeTemplateId(initialStarter) && !hasResumeContent(baseData)) {
          baseData = getTemplateStarterData(initialStarter);
        }

        set({
          data: baseData,
          templateId: requestedTemplate,
          initialized: true,
          hydrated: true,
        });
      },

      setActiveResumeId: (activeResumeId) => set({ activeResumeId }),
      setHydrated: (hydrated) => set({ hydrated }),

      /**
       * updateData — performance-critical hot path.
       *
       * Optimizations vs old implementation:
       * 1. Only ONE JSON clone (for the history snapshot), not two.
       * 2. Incoming `data` is passed directly — caller already has a new ref.
       * 3. History push is debounced 400 ms so rapid typing doesn't grow the
       *    history array on every single keystroke.
       */
      updateData: (data) => {
        const current = get().data;

        // Schedule a debounced history snapshot
        if (historyDebounceTimer) clearTimeout(historyDebounceTimer);
        pendingSnapshot = current; // capture before next render

        historyDebounceTimer = setTimeout(() => {
          if (!pendingSnapshot) return;
          const snapshot = cloneData(pendingSnapshot);
          set((state) => ({
            history: [...state.history.slice(-29), snapshot],
            future: [],
          }));
          pendingSnapshot = null;
          historyDebounceTimer = null;
        }, 400);

        // Immediately update data for a responsive UI — no clone needed here
        set({ data, saveLabel: "Saved locally" });
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
        // Cancel any pending debounced snapshot so undo is clean
        if (historyDebounceTimer) {
          clearTimeout(historyDebounceTimer);
          historyDebounceTimer = null;
          pendingSnapshot = null;
        }
        const currentSnapshot = cloneData(state.data);
        set({
          data: cloneData(previous),
          history: state.history.slice(0, -1),
          future: [currentSnapshot, ...state.future].slice(0, 30),
          saveLabel: "Undo applied",
        });
      },

      redo: () => {
        const state = get();
        const next = state.future[0];
        if (!next) return;
        if (historyDebounceTimer) {
          clearTimeout(historyDebounceTimer);
          historyDebounceTimer = null;
          pendingSnapshot = null;
        }
        const currentSnapshot = cloneData(state.data);
        set({
          data: cloneData(next),
          history: [...state.history.slice(-29), currentSnapshot],
          future: state.future.slice(1),
          saveLabel: "Redo applied",
        });
      },

      startFresh: () => {
        // Fire-and-forget IDB write
        idbSet("active-resume-id", "new").catch(console.error);
        set({
          activeResumeId: null,
          data: createBlankResumeData(),
          resumeStyle: {
            accent: "#000000",
            font: "template",
            showPhoto: true,
            pagePadding: "normal",
            sectionSpacing: "normal",
            fontSizeScale: 1.0,
            lineHeight: "normal",
          },
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
      name: RESUME_STORAGE_KEY,
      version: 3,
      // ── Async IndexedDB storage (non-blocking) ──
      storage: createJSONStorage(() => idbStringEngine),
      skipHydration: true,
      partialize: (state): PersistedBuilderState => ({
        activeResumeId: state.activeResumeId,
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
