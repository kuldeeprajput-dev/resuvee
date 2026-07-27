"use client";

import Image from "next/image";
import { Columns3, ImagePlus, LayoutPanelTop, UserRound, X } from "lucide-react";
import { useRef, useState } from "react";
import type {
  BuilderSection,
  ResumeData,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkillGroup,
  ResumeTemplate,
} from "@/types/resume";
import {
  getEmptyEducation,
  getEmptyExperience,
  getEmptyProject,
  getEmptySkillGroup,
} from "@/lib/resume-data";
import { cn } from "@/lib/utils";
import {
  AddItemButton,
  BulletEditor,
  EditorSection,
  Field,
  ItemCard,
  TextAreaField,
  WritingTip,
} from "./EditorFields";

interface ResumeEditorProps {
  activeSection: BuilderSection;
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  template: ResumeTemplate;
}

interface ResumeEditorContentProps
  extends Omit<ResumeEditorProps, "activeSection"> {
  stepLabel: string;
}

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
    <div className="mb-6 rounded-2xl border border-black/[0.09] bg-white/60 p-4 shadow-sm">
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
            "relative flex size-20 shrink-0 items-center justify-center overflow-hidden border border-black/10 bg-[#e8ece8] text-[var(--brand-muted)]",
            shape === "circle"
              ? "rounded-full"
              : shape === "square"
                ? "rounded-md"
                : "rounded-2xl",
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
          <p className="text-xs font-bold text-[var(--brand-ink)]">
            Profile photo
          </p>
          <p className="mt-1 text-[11px] leading-4 text-[var(--brand-muted)]">
            Optional. Used only by templates designed for a headshot.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--brand-ink)] px-3 text-[10px] font-bold text-white transition hover:bg-[#293630]"
            >
              <ImagePlus className="size-3.5" />
              {photo ? "Replace photo" : "Upload photo"}
            </button>
            {photo && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 text-[10px] font-bold text-[var(--brand-muted)] transition hover:text-red-600"
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

function PersonalDetailsEditor({
  data,
  onChange,
  template,
  stepLabel,
}: ResumeEditorContentProps) {
  const update = (field: keyof ResumeData["basics"], value: string) => {
    onChange({
      ...data,
      basics: { ...data.basics, [field]: value },
    });
  };

  return (
    <EditorSection
      eyebrow={stepLabel}
      title="Let’s start with the essentials"
      description="This information sits at the top of your resume. Use the name and contact details employers should use."
    >
      <div className="mb-6 grid gap-2 sm:grid-cols-3">
        <div className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white/70 px-3 py-2.5">
          {template.layout === "sidebar" ? (
            <Columns3 className="size-4 text-[#4d7141]" />
          ) : (
            <LayoutPanelTop className="size-4 text-[#4d7141]" />
          )}
          <span className="text-[10px] font-bold">
            {template.layout === "sidebar" ? "Sidebar layout" : "Single column"}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white/70 px-3 py-2.5">
          <UserRound className="size-4 text-[#4d7141]" />
          <span className="text-[10px] font-bold">
            {template.supportsPhoto ? "Photo supported" : "Photo-free"}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white/70 px-3 py-2.5">
          <span className="flex size-4 items-center justify-center rounded-full bg-[var(--brand-lime)] text-[8px] font-black">
            {template.sections.length}
          </span>
          <span className="text-[10px] font-bold">Editable sections</span>
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
            <p className="mt-1 text-[11px] leading-4 text-[var(--brand-muted)]">
              This design intentionally omits a profile image for a simpler,
              ATS-focused document.
            </p>
          </div>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          value={data.basics.fullName}
          onChange={(value) => update("fullName", value)}
          placeholder="e.g. Maya Patel"
          className="sm:col-span-2"
        />
        <Field
          label="Professional headline"
          value={data.basics.headline}
          onChange={(value) => update("headline", value)}
          placeholder="e.g. Senior Software Engineer"
          className="sm:col-span-2"
        />
        <Field
          label="Email"
          type="email"
          value={data.basics.email}
          onChange={(value) => update("email", value)}
          placeholder="you@example.com"
        />
        <Field
          label="Phone"
          type="tel"
          value={data.basics.phone}
          onChange={(value) => update("phone", value)}
          placeholder="+1 555 000 0000"
        />
        <Field
          label="Location"
          value={data.basics.location}
          onChange={(value) => update("location", value)}
          placeholder="City, Country"
        />
        <Field
          label="Website or portfolio"
          value={data.basics.website}
          onChange={(value) => update("website", value)}
          placeholder="yourportfolio.com"
        />
      </div>
    </EditorSection>
  );
}

function SummaryEditor({
  data,
  onChange,
  stepLabel,
}: ResumeEditorContentProps) {
  const wordCount = data.basics.summary.trim()
    ? data.basics.summary.trim().split(/\s+/).length
    : 0;

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
          Lead with your role and years of experience, then add one specialty
          and a measurable result. Aim for 50–80 words.
        </WritingTip>
      </div>
    </EditorSection>
  );
}

function ExperienceEditor({
  data,
  onChange,
  stepLabel,
}: ResumeEditorContentProps) {
  const updateItem = (
    id: string,
    updates: Partial<ResumeExperience>,
  ) => {
    onChange({
      ...data,
      experience: data.experience.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    });
  };

  const removeItem = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((item) => item.id !== id),
    });
  };

  return (
    <EditorSection
      eyebrow={stepLabel}
      title="Show how you made a difference"
      description="List your most relevant work first. Focus each highlight on an action, the context, and a result."
    >
      <div className="space-y-4">
        {data.experience.map((item) => (
          <ItemCard
            key={item.id}
            title={item.role || "Untitled role"}
            subtitle={item.company || "Add company"}
            onRemove={() => removeItem(item.id)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Job title"
                value={item.role}
                onChange={(value) => updateItem(item.id, { role: value })}
                placeholder="Product Designer"
              />
              <Field
                label="Company"
                value={item.company}
                onChange={(value) => updateItem(item.id, { company: value })}
                placeholder="Northstar Labs"
              />
              <Field
                label="Location"
                value={item.location}
                onChange={(value) => updateItem(item.id, { location: value })}
                placeholder="Remote or City"
                className="sm:col-span-2"
              />
              <Field
                label="Start date"
                value={item.startDate}
                onChange={(value) => updateItem(item.id, { startDate: value })}
                placeholder="Jan 2022"
              />
              <Field
                label="End date"
                value={item.current ? "Present" : item.endDate}
                onChange={(value) => updateItem(item.id, { endDate: value })}
                placeholder="Dec 2025"
                disabled={item.current}
              />
            </div>

            <label className="flex w-fit cursor-pointer items-center gap-2 text-xs font-semibold text-[var(--brand-muted)]">
              <input
                type="checkbox"
                checked={item.current}
                onChange={(event) =>
                  updateItem(item.id, { current: event.target.checked })
                }
                className="size-4 rounded border-black/20 accent-[#315f45]"
              />
              I currently work here
            </label>

            <BulletEditor
              values={item.highlights}
              onChange={(highlights) =>
                updateItem(item.id, { highlights })
              }
            />
          </ItemCard>
        ))}
        <AddItemButton
          onClick={() =>
            onChange({
              ...data,
              experience: [
                ...data.experience,
                getEmptyExperience(data.experience.length),
              ],
            })
          }
        >
          Add work experience
        </AddItemButton>
        <WritingTip>
          Strong bullet: “Reduced support response time by 32% by redesigning
          the triage workflow.” Numbers make outcomes easier to trust.
        </WritingTip>
      </div>
    </EditorSection>
  );
}

function EducationEditor({
  data,
  onChange,
  stepLabel,
}: ResumeEditorContentProps) {
  const updateItem = (
    id: string,
    updates: Partial<ResumeEducation>,
  ) => {
    onChange({
      ...data,
      education: data.education.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    });
  };

  return (
    <EditorSection
      eyebrow={stepLabel}
      title="Add your education"
      description="Include degrees, certifications, bootcamps, or relevant training. You can keep this concise once you have work experience."
    >
      <div className="space-y-4">
        {data.education.map((item) => (
          <ItemCard
            key={item.id}
            title={item.degree || "Untitled education"}
            subtitle={item.school || "Add school"}
            onRemove={() =>
              onChange({
                ...data,
                education: data.education.filter(
                  (education) => education.id !== item.id,
                ),
              })
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Degree or qualification"
                value={item.degree}
                onChange={(value) => updateItem(item.id, { degree: value })}
                placeholder="BSc, Computer Science"
                className="sm:col-span-2"
              />
              <Field
                label="School"
                value={item.school}
                onChange={(value) => updateItem(item.id, { school: value })}
                placeholder="University name"
              />
              <Field
                label="Location"
                value={item.location}
                onChange={(value) => updateItem(item.id, { location: value })}
                placeholder="City, Country"
              />
              <Field
                label="Start date"
                value={item.startDate}
                onChange={(value) => updateItem(item.id, { startDate: value })}
                placeholder="2018"
              />
              <Field
                label="End date"
                value={item.endDate}
                onChange={(value) => updateItem(item.id, { endDate: value })}
                placeholder="2022"
              />
              <Field
                label="Additional detail"
                value={item.details}
                onChange={(value) => updateItem(item.id, { details: value })}
                placeholder="Honors, GPA, or focus"
                className="sm:col-span-2"
              />
            </div>
          </ItemCard>
        ))}
        <AddItemButton
          onClick={() =>
            onChange({
              ...data,
              education: [
                ...data.education,
                getEmptyEducation(data.education.length),
              ],
            })
          }
        >
          Add education
        </AddItemButton>
      </div>
    </EditorSection>
  );
}

function ProjectsEditor({
  data,
  onChange,
  stepLabel,
}: ResumeEditorContentProps) {
  const updateItem = (
    id: string,
    updates: Partial<ResumeProject>,
  ) => {
    onChange({
      ...data,
      projects: data.projects.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    });
  };

  return (
    <EditorSection
      eyebrow={stepLabel}
      title="Bring your work to life"
      description="Projects are especially useful for showing hands-on ability, independent work, and relevant interests."
    >
      <div className="space-y-4">
        {data.projects.map((item) => (
          <ItemCard
            key={item.id}
            title={item.name || "Untitled project"}
            subtitle={item.link || "Add a project link"}
            onRemove={() =>
              onChange({
                ...data,
                projects: data.projects.filter(
                  (project) => project.id !== item.id,
                ),
              })
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Project name"
                value={item.name}
                onChange={(value) => updateItem(item.id, { name: value })}
                placeholder="Project name"
              />
              <Field
                label="Link"
                value={item.link}
                onChange={(value) => updateItem(item.id, { link: value })}
                placeholder="project.example.com"
              />
              <TextAreaField
                label="Short description"
                value={item.description}
                onChange={(value) =>
                  updateItem(item.id, { description: value })
                }
                placeholder="What did you build and why?"
                rows={3}
                className="sm:col-span-2"
              />
            </div>
            <BulletEditor
              label="Project outcomes"
              values={item.highlights}
              onChange={(highlights) =>
                updateItem(item.id, { highlights })
              }
              placeholder="Add a result, scale, or notable technical detail…"
            />
          </ItemCard>
        ))}
        <AddItemButton
          onClick={() =>
            onChange({
              ...data,
              projects: [
                ...data.projects,
                getEmptyProject(data.projects.length),
              ],
            })
          }
        >
          Add project
        </AddItemButton>
      </div>
    </EditorSection>
  );
}

function SkillsEditor({
  data,
  onChange,
  stepLabel,
}: ResumeEditorContentProps) {
  const updateItem = (
    id: string,
    updates: Partial<ResumeSkillGroup>,
  ) => {
    onChange({
      ...data,
      skillGroups: data.skillGroups.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    });
  };

  return (
    <EditorSection
      eyebrow={stepLabel}
      title="Finish with relevant skills"
      description="Group related skills so they are easy to scan. Prioritize the tools and abilities mentioned in your target job descriptions."
    >
      <div className="space-y-4">
        {data.skillGroups.map((item) => (
          <ItemCard
            key={item.id}
            title={item.name || "Untitled skill group"}
            subtitle={`${item.skills.length} skills`}
            onRemove={() =>
              onChange({
                ...data,
                skillGroups: data.skillGroups.filter(
                  (group) => group.id !== item.id,
                ),
              })
            }
          >
            <Field
              label="Group name"
              value={item.name}
              onChange={(value) => updateItem(item.id, { name: value })}
              placeholder="e.g. Languages, Design, Tools"
            />
            <Field
              label="Skills"
              hint="Separate with commas"
              value={item.skills.join(", ")}
              onChange={(value) =>
                updateItem(item.id, {
                  skills: value
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean),
                })
              }
              placeholder="TypeScript, React, Node.js"
            />
          </ItemCard>
        ))}
        <AddItemButton
          onClick={() =>
            onChange({
              ...data,
              skillGroups: [
                ...data.skillGroups,
                getEmptySkillGroup(data.skillGroups.length),
              ],
            })
          }
        >
          Add skill group
        </AddItemButton>
        <WritingTip>
          Keep this targeted. A focused list of 8–15 relevant skills is
          stronger than a long inventory of everything you have tried.
        </WritingTip>
      </div>
    </EditorSection>
  );
}

export function ResumeEditor({
  activeSection,
  data,
  onChange,
  template,
}: ResumeEditorProps) {
  const sectionIndex = Math.max(0, template.sections.indexOf(activeSection));
  const sharedProps = {
    data,
    onChange,
    template,
    stepLabel: `Step ${sectionIndex + 1} of ${template.sections.length}`,
  };

  switch (activeSection) {
    case "basics":
      return <PersonalDetailsEditor {...sharedProps} />;
    case "summary":
      return <SummaryEditor {...sharedProps} />;
    case "experience":
      return <ExperienceEditor {...sharedProps} />;
    case "education":
      return <EducationEditor {...sharedProps} />;
    case "projects":
      return <ProjectsEditor {...sharedProps} />;
    case "skills":
      return <SkillsEditor {...sharedProps} />;
  }
}
