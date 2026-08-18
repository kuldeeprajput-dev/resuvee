"use client";

import Image from "next/image";
import {
  Columns3,
  ImagePlus,
  LayoutPanelTop,
  Sparkles,
  UserRound,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRef, useState } from "react";
import { DisplayLabelControl } from "./display-label-control";
import { ContactOrderManager } from "./contact-order-manager";
import { CustomLinkItemCard } from "./custom-link-item-card";
import type {
  ResumeCertification,
  ResumeCustomLink,
  ResumeData,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkillGroup,
  ResumeTemplate,
} from "../../types/resume";
import {
  getEmptyEducation,
  getEmptyExperience,
  getEmptyCertification,
  getEmptyProject,
  getEmptySkillGroup,
} from "../../constants/resume-seed-data";
import { getTemplateStarterData } from "../../constants/resume-presets";
import { cn } from "@/shared/lib/utils";
import {
  AddItemButton,
  BulletEditor,
  EditorSection,
  Field,
  ItemCard,
  TextAreaField,
  WritingTip,
} from "./editor-fields";

interface ResumeEditorContentProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  template: ResumeTemplate;
  stepLabel: string;
}

// ─── Photo Editor ────────────────────────────────────────────────────────────

function PhotoEditor({
  photo,
  name,
  shape,
  onChange,
}: {
  photo: string;
  name: string;
  shape: ResumeTemplate["photoShape"];
  onChange: (photo: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Keep the profile image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
        setError("");
      }
    };
    reader.onerror = () => setError("The image could not be read.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-6 rounded-2xl border border-black/9 bg-white/60 p-4 shadow-sm">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "relative flex size-20 shrink-0 items-center justify-center overflow-hidden border border-black/10 bg-[#e8ece8] text-(--brand-muted)",
            shape === "circle" ? "rounded-full" : shape === "square" ? "rounded-md" : "rounded-2xl"
          )}
        >
          {photo ? (
            <Image
              src={photo}
              alt={name ? `${name} profile` : "Resume profile"}
              fill
              unoptimized
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <UserRound className="size-8" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-(--brand-ink)">Profile photo</p>
          <p className="mt-1 text-[11px] leading-4 text-(--brand-muted)">
            Optional. Used only by templates designed for a headshot.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-(--brand-ink) px-3 text-[10px] font-bold text-white transition hover:bg-[#293630]"
            >
              <ImagePlus className="size-3.5" />
              {photo ? "Replace photo" : "Upload photo"}
            </button>
            {photo && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 text-[10px] font-bold text-(--brand-muted) transition hover:text-red-600"
              >
                <X className="size-3.5" />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

// ─── Personal Details ─────────────────────────────────────────────────────────

export function PersonalDetailsEditor({
  data,
  onChange,
  template,
  stepLabel,
}: ResumeEditorContentProps) {
  const update = <K extends keyof ResumeData["basics"]>(
    field: K,
    value: ResumeData["basics"][K]
  ) => {
    onChange({
      ...data,
      basics: { ...data.basics, [field]: value },
    });
  };

  const setCustomLabel = (key: string, label: string | undefined) => {
    const currentMap = { ...(data.basics.customLabels || {}) };
    if (label && label.trim().length > 0) {
      currentMap[key] = label.trim();
    } else {
      delete currentMap[key];
    }
    update("customLabels", currentMap);
  };

  return (
    <EditorSection
      eyebrow={stepLabel}
      title="Let's start with the essentials"
      description="This information sits at the top of your resume. Use the name and contact details employers should use."
      action={
        <button
          type="button"
          onClick={() => {
            const starter = getTemplateStarterData(template.id);
            onChange(starter);
          }}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#047857] shadow-2xs transition hover:bg-emerald-100/80 cursor-pointer"
          title="Auto-fill with sample dummy data tailored to this template"
        >
          <Sparkles className="size-3.5 text-emerald-600" />
          <span>Fill Dummy Data</span>
        </button>
      }
    >
      <div className="mb-4 grid grid-cols-3 gap-1.5 sm:mb-6 sm:gap-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-black/8 bg-white/70 px-2 py-2 sm:px-3 sm:py-2.5">
          {template.layout === "sidebar" ? (
            <Columns3 className="size-3.5 shrink-0 text-[#4d7141]" />
          ) : (
            <LayoutPanelTop className="size-3.5 shrink-0 text-[#4d7141]" />
          )}
          <span className="truncate text-[9.5px] font-bold sm:text-[10px]">
            {template.layout === "sidebar" ? "Sidebar" : "Single col"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-black/8 bg-white/70 px-2 py-2 sm:px-3 sm:py-2.5">
          <UserRound className="size-3.5 shrink-0 text-[#4d7141]" />
          <span className="truncate text-[9.5px] font-bold sm:text-[10px]">
            {template.supportsPhoto ? "Photo layout" : "Photo-free"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-black/8 bg-white/70 px-2 py-2 sm:px-3 sm:py-2.5">
          <span className="flex size-3.5 shrink-0 items-center justify-center rounded-full border border-black/15 bg-black/5 text-[8px] font-extrabold text-(--brand-ink)">
            {template.sections.length}
          </span>
          <span className="truncate text-[9.5px] font-bold sm:text-[10px]">Editable sections</span>
        </div>
      </div>

      {template.supportsPhoto ? (
        <PhotoEditor
          photo={data.basics.photo || ""}
          name={data.basics.fullName}
          shape={template.photoShape}
          onChange={(photo) => update("photo", photo)}
        />
      ) : (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#bfd1c4] bg-[#edf4ef] p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#42634e]">
            <UserRound className="size-4" />
          </span>
          <div>
            <p className="text-xs font-bold">Photo-free template</p>
            <p className="mt-1 text-[11px] leading-4 text-(--brand-muted)">
              This design intentionally omits a profile image for a simpler, ATS-focused document.
            </p>
          </div>
        </div>
      )}
      <div className="grid gap-4 grid-cols-1 min-[500px]:grid-cols-2">
        <Field
          label="Full name"
          value={data.basics.fullName}
          onChange={(value) => update("fullName", value)}
          placeholder="e.g. Maya Patel"
          className="min-[500px]:col-span-2"
        />
        <Field
          label="Professional headline"
          value={data.basics.headline}
          onChange={(value) => update("headline", value)}
          placeholder="e.g. Senior Software Engineer"
          className="min-[500px]:col-span-2"
        />
        <Field
          label="Email"
          type="email"
          value={data.basics.email}
          onChange={(value) => update("email", value)}
          placeholder="you@example.com"
          action={
            <DisplayLabelControl
              currentValue={data.basics.email}
              defaultShortLabel="Email"
              customLabel={data.basics.customLabels?.email}
              align="left"
              onSetLabel={(text) => setCustomLabel("email", text)}
            />
          }
        />
        <Field
          label="Phone"
          type="tel"
          value={data.basics.phone}
          onChange={(value) => update("phone", value)}
          placeholder="+1 555 000 0000"
          action={
            <DisplayLabelControl
              currentValue={data.basics.phone}
              defaultShortLabel="Phone"
              customLabel={data.basics.customLabels?.phone}
              align="right"
              onSetLabel={(text) => setCustomLabel("phone", text)}
            />
          }
        />
        <Field
          label="Location"
          value={data.basics.location}
          onChange={(value) => update("location", value)}
          placeholder="City, Country"
          action={
            <DisplayLabelControl
              currentValue={data.basics.location}
              defaultShortLabel="Location"
              customLabel={data.basics.customLabels?.location}
              align="left"
              onSetLabel={(text) => setCustomLabel("location", text)}
            />
          }
        />
        <Field
          label="LinkedIn"
          value={data.basics.linkedin || ""}
          onChange={(value) => update("linkedin", value)}
          placeholder="linkedin.com/in/username"
          action={
            <DisplayLabelControl
              currentValue={data.basics.linkedin}
              defaultShortLabel="LinkedIn"
              customLabel={data.basics.customLabels?.linkedin}
              align="right"
              onSetLabel={(text) => setCustomLabel("linkedin", text)}
            />
          }
        />
        <Field
          label="GitHub"
          value={data.basics.github || ""}
          onChange={(value) => update("github", value)}
          placeholder="github.com/username"
          action={
            <DisplayLabelControl
              currentValue={data.basics.github}
              defaultShortLabel="GitHub"
              customLabel={data.basics.customLabels?.github}
              align="left"
              onSetLabel={(text) => setCustomLabel("github", text)}
            />
          }
        />
        <Field
          label="Portfolio"
          value={data.basics.website}
          onChange={(value) => update("website", value)}
          placeholder="yourportfolio.com"
          action={
            <DisplayLabelControl
              currentValue={data.basics.website}
              defaultShortLabel="Portfolio"
              customLabel={data.basics.customLabels?.website}
              align="right"
              onSetLabel={(text) => setCustomLabel("website", text)}
            />
          }
        />
      </div>

      {/* Interactive Contact & Links Order Manager */}
      <ContactOrderManager
        data={data}
        onUpdateOrder={(newOrder) => update("contactOrder", newOrder)}
      />

      {/* Custom Links & Additional Contact Details */}
      <div className="pt-5 border-t border-black/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-(--brand-ink)">Custom Links & Additional Details</h4>
            <p className="text-[11px] text-(--brand-muted)">
              Add portfolio, social profiles, or custom details with selectable icons and custom display text.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {(data.basics.customLinks || []).map((link, idx) => (
            <CustomLinkItemCard
              key={link.id || `custom-link-${idx}`}
              item={link}
              onUpdate={(updated) => {
                const nextLinks = [...(data.basics.customLinks || [])];
                nextLinks[idx] = updated;
                update("customLinks", nextLinks);
              }}
              onRemove={() => {
                const nextLinks = (data.basics.customLinks || []).filter((_, i) => i !== idx);
                update("customLinks", nextLinks);
              }}
            />
          ))}

          <button
            type="button"
            onClick={() => {
              const newLink: ResumeCustomLink = {
                id: `custom-link-${Date.now()}`,
                icon: "globe",
                label: "",
                url: "",
              };
              update("customLinks", [...(data.basics.customLinks || []), newLink]);
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-black/20 bg-white shadow-2xs hover:border-emerald-600/50 hover:bg-emerald-50/30 text-xs font-bold text-(--brand-ink) flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="size-4 text-emerald-700" />
            <span>Add Custom Link or Detail</span>
          </button>
        </div>
      </div>
    </EditorSection>
  );
}

// ─── Summary ──────────────────────────────────────────────────────────────────

export function SummaryEditor({ data, onChange, stepLabel }: ResumeEditorContentProps) {
  const wordCount = data.basics.summary.trim() ? data.basics.summary.trim().split(/\s+/).length : 0;

  return (
    <EditorSection
      eyebrow={stepLabel}
      title="Write a focused introduction"
      description="Summarize what you do, your strongest experience, and the kind of impact you create in 3–4 sentences."
    >
      <div className="space-y-4">
        <TextAreaField
          label="Professional summary"
          hint={`${wordCount} words`}
          value={data.basics.summary}
          onChange={(value) =>
            onChange({
              ...data,
              basics: { ...data.basics, summary: value },
            })
          }
          rows={7}
          placeholder="Experienced product manager with a track record of…"
        />
        <WritingTip>
          Lead with your role and years of experience, then add one specialty and a measurable
          result. Aim for 50–80 words.
        </WritingTip>
      </div>
    </EditorSection>
  );
}
