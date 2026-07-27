"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Download,
  Eye,
  FilePlus2,
  FileText,
  LayoutTemplate,
  Minus,
  Plus,
  Redo2,
  Undo2,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  BuilderSection,
  ResumeData,
  ResumeTemplateId,
} from "@/types/resume";
import {
  builderSections,
  calculateResumeStrength,
  createBlankResumeData,
  defaultResumeData,
  resumeTemplates,
} from "@/lib/resume-data";
import { Brand } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResumeEditor } from "./ResumeEditor";
import { ResumePreview } from "./ResumePreview";
import { TemplateThumbnail } from "./TemplateThumbnail";

interface ResumeBuilderProps {
  initialTemplate?: string;
}

const STORAGE_KEY = "resulyra-draft-v1";
const LEGACY_STORAGE_KEY = "resumix-draft-v1";
const SAMPLE_VERSION = 2;

function isTemplateId(value: string | undefined): value is ResumeTemplateId {
  return resumeTemplates.some((template) => template.id === value);
}

function getInitialTemplate(value: string | undefined): ResumeTemplateId {
  return isTemplateId(value) ? value : "nova";
}

export function ResumeBuilder({ initialTemplate }: ResumeBuilderProps) {
  const [data, setData] = useState<ResumeData>(defaultResumeData);
  const [templateId, setTemplateId] = useState<ResumeTemplateId>(
    getInitialTemplate(initialTemplate),
  );
  const [activeSection, setActiveSection] =
    useState<BuilderSection>("basics");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [zoom, setZoom] = useState(72);
  const [history, setHistory] = useState<ResumeData[]>([]);
  const [future, setFuture] = useState<ResumeData[]>([]);
  const [saveLabel, setSaveLabel] = useState("Saved locally");
  const hasLoadedDraft = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const template =
    resumeTemplates.find((item) => item.id === templateId) ??
    resumeTemplates[0];
  const strength = calculateResumeStrength(data);
  const activeIndex = builderSections.findIndex(
    (section) => section.id === activeSection,
  );

  useEffect(() => {
    try {
      const currentDraft = window.localStorage.getItem(STORAGE_KEY);
      const storedDraft =
        currentDraft ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (storedDraft) {
        const parsed = JSON.parse(storedDraft) as {
          data?: ResumeData;
          templateId?: ResumeTemplateId;
          sampleVersion?: number;
        };
        const isPreviousDemo =
          parsed.data?.basics.fullName === "Alex Morgan" &&
          parsed.data.basics.email === "alex.morgan@example.com";
        const restoredData = isPreviousDemo
          ? defaultResumeData
          : parsed.data;
        if (restoredData) setData(restoredData);
        if (!initialTemplate && isTemplateId(parsed.templateId)) {
          setTemplateId(parsed.templateId);
        }
        if (!currentDraft || isPreviousDemo) {
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              data: restoredData,
              templateId: parsed.templateId,
              sampleVersion: SAMPLE_VERSION,
            }),
          );
          window.localStorage.removeItem(LEGACY_STORAGE_KEY);
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } finally {
      hasLoadedDraft.current = true;
    }
  }, [initialTemplate]);

  useEffect(() => {
    if (!hasLoadedDraft.current) return;

    setSaveLabel("Saving…");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data, templateId, sampleVersion: SAMPLE_VERSION }),
      );
      setSaveLabel("Saved locally");
    }, 450);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, templateId]);

  const updateData = (nextData: ResumeData) => {
    setHistory((items) => [...items.slice(-39), data]);
    setFuture([]);
    setData(nextData);
  };

  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((items) => [data, ...items].slice(0, 40));
    setData(previous);
    setHistory((items) => items.slice(0, -1));
  };

  const redo = () => {
    const next = future[0];
    if (!next) return;
    setHistory((items) => [...items.slice(-39), data]);
    setData(next);
    setFuture((items) => items.slice(1));
  };

  const goToRelativeSection = (direction: -1 | 1) => {
    const target = builderSections[activeIndex + direction];
    if (target) setActiveSection(target.id);
  };

  const exportResume = () => {
    window.print();
  };

  const startFresh = () => {
    const confirmed = window.confirm(
      "Start a new blank resume? Your current local draft will be replaced.",
    );
    if (!confirmed) return;

    updateData(createBlankResumeData());
    setActiveSection("basics");
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#e8e8e2] text-[var(--brand-ink)]">
      <header className="no-print flex h-16 items-center justify-between border-b border-black/10 bg-[var(--brand-paper)] px-4 sm:px-5">
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/"
            aria-label="Back to home"
            className="flex size-9 items-center justify-center rounded-xl border border-black/10 text-[var(--brand-muted)] transition hover:bg-black/5 hover:text-[var(--brand-ink)] lg:hidden"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="hidden lg:block">
            <Brand />
          </div>
          <span className="hidden h-6 w-px bg-black/10 lg:block" />
          <div>
            <div className="flex items-center gap-2">
              <FileText className="hidden size-4 text-[var(--brand-muted)] sm:block" />
              <p className="max-w-[155px] truncate text-sm font-bold sm:max-w-none">
                {data.basics.fullName
                  ? `${data.basics.fullName} — Resume`
                  : "Untitled resume"}
              </p>
            </div>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-[var(--brand-muted)]">
              <Cloud className="size-3" />
              {saveLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="mr-1 hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={undo}
              disabled={!history.length}
              aria-label="Undo"
              className="builder-icon-button"
            >
              <Undo2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!future.length}
              aria-label="Redo"
              className="builder-icon-button"
            >
              <Redo2 className="size-4" />
            </button>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={startFresh}
            className="hidden h-10 rounded-xl px-3 text-xs font-bold text-[var(--brand-muted)] hover:text-[var(--brand-ink)] md:inline-flex"
          >
            <FilePlus2 className="size-4" />
            Start fresh
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMobilePreview(true)}
            className="h-10 rounded-xl border-black/10 bg-white px-3 font-bold lg:hidden"
          >
            <Eye className="size-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            type="button"
            onClick={exportResume}
            className="h-10 rounded-xl bg-[var(--brand-ink)] px-3.5 font-bold text-white hover:bg-[#293630]"
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </header>

      <div className="grid h-[calc(100dvh-4rem)] grid-cols-[minmax(0,1fr)] lg:grid-cols-[220px_minmax(390px,0.86fr)_minmax(520px,1.14fr)] xl:grid-cols-[235px_minmax(440px,0.84fr)_minmax(580px,1.16fr)]">
        <aside className="no-print hidden flex-col border-r border-black/10 bg-[#eeeee8] lg:flex">
          <div className="border-b border-black/10 px-5 py-5">
            <div className="mb-2 flex items-center justify-between text-xs font-bold">
              <span>Resume strength</span>
              <span>{strength}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-[var(--brand-lime)] transition-all duration-500"
                style={{ width: `${strength}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] leading-4 text-[var(--brand-muted)]">
              {strength >= 80
                ? "Looking strong. Review every detail before exporting."
                : "Complete each section to strengthen your resume."}
            </p>
          </div>

          <nav
            className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
            aria-label="Resume sections"
          >
            {builderSections.map((section, index) => {
              const isActive = activeSection === section.id;
              const isComplete = index < activeIndex;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition",
                    isActive
                      ? "bg-[var(--brand-ink)] text-white shadow-sm"
                      : "text-[var(--brand-muted)] hover:bg-white/70 hover:text-[var(--brand-ink)]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                      isActive
                        ? "border-white/20 bg-white/10 text-[var(--brand-lime)]"
                        : isComplete
                          ? "border-[#9ebd56] bg-[var(--brand-lime)] text-[var(--brand-ink)]"
                          : "border-black/15",
                    )}
                  >
                    {isComplete ? <Check className="size-3" /> : index + 1}
                  </span>
                  <span className="text-xs font-bold">{section.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-black/10 p-3">
            <button
              type="button"
              onClick={() => setShowTemplates(true)}
              className="flex w-full items-center gap-3 rounded-xl bg-white/70 p-3 text-left shadow-sm transition hover:bg-white"
            >
              <span
                className="size-9 rounded-lg border border-black/10"
                style={{ backgroundColor: template.background }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold text-[var(--brand-muted)]">
                  Template
                </span>
                <span className="block truncate text-xs font-bold">
                  {template.name}
                </span>
              </span>
              <LayoutTemplate className="size-4 text-[var(--brand-muted)]" />
            </button>
          </div>
        </aside>

        <section className="no-print flex min-h-0 min-w-0 flex-col border-r border-black/10 bg-[#f7f6f1]">
          <div className="border-b border-black/[0.08] px-5 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {builderSections.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold",
                    activeSection === section.id
                      ? "bg-[var(--brand-ink)] text-white"
                      : "border border-black/10 bg-white text-[var(--brand-muted)]",
                  )}
                >
                  <span>{index + 1}</span>
                  {section.shortLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <ResumeEditor
              activeSection={activeSection}
              data={data}
              onChange={updateData}
            />
          </div>

          <div className="flex items-center justify-between border-t border-black/10 bg-white/80 px-5 py-3 backdrop-blur sm:px-7">
            <Button
              type="button"
              variant="ghost"
              onClick={() => goToRelativeSection(-1)}
              disabled={activeIndex === 0}
              className="h-10 rounded-xl px-3 font-bold"
            >
              <ChevronLeft className="size-4" />
              Back
            </Button>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--brand-muted)]">
              {activeIndex + 1} / {builderSections.length}
            </span>
            <Button
              type="button"
              onClick={() => {
                if (activeIndex === builderSections.length - 1) {
                  setShowMobilePreview(true);
                } else {
                  goToRelativeSection(1);
                }
              }}
              className="h-10 rounded-xl bg-[var(--brand-ink)] px-4 font-bold text-white hover:bg-[#293630]"
            >
              {activeIndex === builderSections.length - 1
                ? "Preview"
                : "Continue"}
              {activeIndex === builderSections.length - 1 ? (
                <Eye className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </Button>
          </div>
        </section>

        <section
          className={cn(
            "resume-preview-panel relative min-h-0 overflow-hidden bg-[#dfe1dc] lg:block",
            showMobilePreview
              ? "fixed inset-0 z-[80] block"
              : "hidden",
          )}
        >
          <div className="no-print absolute inset-x-0 top-0 z-20 flex h-14 items-center justify-between border-b border-black/10 bg-white/90 px-4 backdrop-blur lg:px-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMobilePreview(false)}
                className="builder-icon-button lg:hidden"
                aria-label="Close preview"
              >
                <X className="size-4" />
              </button>
              <p className="text-xs font-bold">Live preview</p>
              <span className="hidden rounded-full bg-[var(--brand-lime)] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] sm:inline">
                {template.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowTemplates(true)}
                className="mr-1 flex h-8 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-2.5 text-[10px] font-bold hover:bg-black/5"
              >
                <LayoutTemplate className="size-3.5" />
                Templates
              </button>
              <button
                type="button"
                onClick={() => setZoom((value) => Math.max(50, value - 5))}
                className="builder-icon-button"
                aria-label="Zoom out"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-9 text-center text-[10px] font-bold text-[var(--brand-muted)]">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((value) => Math.min(95, value + 5))}
                className="builder-icon-button"
                aria-label="Zoom in"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="resume-preview-scroll h-full overflow-auto px-5 pb-20 pt-20">
            <div
              className="resume-preview-stage mx-auto origin-top transition-transform duration-300"
              style={{
                width: 595,
                transform: `scale(${zoom / 100})`,
              }}
            >
              <ResumePreview data={data} template={template} />
            </div>
          </div>
        </section>
      </div>

      {showTemplates && (
        <div className="no-print fixed inset-0 z-[100] flex items-end justify-center bg-black/35 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-[24px] bg-[var(--brand-paper)] p-5 shadow-2xl sm:rounded-[24px] sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c65b38]">
                  Original collection
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-[-0.035em]">
                  Choose a template
                </h2>
                <p className="mt-1 text-sm text-[var(--brand-muted)]">
                  Your content stays exactly the same when you switch.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplates(false)}
                className="builder-icon-button"
                aria-label="Close templates"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {resumeTemplates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTemplateId(item.id);
                    setShowTemplates(false);
                  }}
                  className={cn(
                    "group rounded-2xl border p-2 text-left transition hover:-translate-y-1",
                    templateId === item.id
                      ? "border-[#315f45] bg-[#edf4ef] ring-2 ring-[#315f45]/10"
                      : "border-black/10 bg-white hover:shadow-lg",
                  )}
                >
                  <TemplateThumbnail
                    template={item}
                    className="shadow-md"
                  />
                  <div className="flex items-center justify-between gap-1 px-1 pb-1 pt-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold">{item.name}</p>
                      <p className="truncate text-[9px] text-[var(--brand-muted)]">
                        {item.eyebrow}
                      </p>
                    </div>
                    {templateId === item.id && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-lime)]">
                        <Check className="size-3" />
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
