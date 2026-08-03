"use client";

import type {
  ResumeCertification,
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

// ─── Experience ───────────────────────────────────────────────────────────────

export function ExperienceEditor({ data, onChange, stepLabel }: ResumeEditorContentProps) {
  const updateItem = (id: string, updates: Partial<ResumeExperience>) => {
    onChange({
      ...data,
      experience: data.experience.map((item) => (item.id === id ? { ...item, ...updates } : item)),
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
            <div className="grid gap-4 grid-cols-1 min-[500px]:grid-cols-2">
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
                className="min-[500px]:col-span-2"
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
                onChange={(event) => updateItem(item.id, { current: event.target.checked })}
                className="size-4 rounded border-black/20 accent-[#315f45]"
              />
              I currently work here
            </label>

            <BulletEditor
              values={item.highlights}
              onChange={(highlights) => updateItem(item.id, { highlights })}
            />
          </ItemCard>
        ))}
        <AddItemButton
          onClick={() =>
            onChange({
              ...data,
              experience: [...data.experience, getEmptyExperience(data.experience.length)],
            })
          }
        >
          Add work experience
        </AddItemButton>
        <WritingTip>
          Strong bullet: "Reduced support response time by 32% by redesigning the triage workflow."
          Numbers make outcomes easier to trust.
        </WritingTip>
      </div>
    </EditorSection>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────

export function EducationEditor({ data, onChange, stepLabel }: ResumeEditorContentProps) {
  const updateItem = (id: string, updates: Partial<ResumeEducation>) => {
    onChange({
      ...data,
      education: data.education.map((item) => (item.id === id ? { ...item, ...updates } : item)),
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
                education: data.education.filter((education) => education.id !== item.id),
              })
            }
          >
            <div className="grid gap-4 grid-cols-1 min-[500px]:grid-cols-2">
              <Field
                label="Degree or qualification"
                value={item.degree}
                onChange={(value) => updateItem(item.id, { degree: value })}
                placeholder="BSc, Computer Science"
                className="min-[500px]:col-span-2"
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
                className="min-[500px]:col-span-2"
              />
            </div>
          </ItemCard>
        ))}
        <AddItemButton
          onClick={() =>
            onChange({
              ...data,
              education: [...data.education, getEmptyEducation(data.education.length)],
            })
          }
        >
          Add education
        </AddItemButton>
      </div>
    </EditorSection>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export function ProjectsEditor({ data, onChange, stepLabel }: ResumeEditorContentProps) {
  const updateItem = (id: string, updates: Partial<ResumeProject>) => {
    onChange({
      ...data,
      projects: data.projects.map((item) => (item.id === id ? { ...item, ...updates } : item)),
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
                projects: data.projects.filter((project) => project.id !== item.id),
              })
            }
          >
            <div className="grid gap-4 grid-cols-1 min-[500px]:grid-cols-2">
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
              <Field
                label="Date or timeframe"
                value={item.date ?? ""}
                onChange={(value) => updateItem(item.id, { date: value })}
                placeholder="Mar 2025 – Apr 2025"
                className="min-[500px]:col-span-2"
              />
              <TextAreaField
                label="Short description"
                value={item.description}
                onChange={(value) => updateItem(item.id, { description: value })}
                placeholder="What did you build and why?"
                rows={3}
                className="min-[500px]:col-span-2"
              />
            </div>
            <BulletEditor
              label="Project outcomes"
              values={item.highlights}
              onChange={(highlights) => updateItem(item.id, { highlights })}
              placeholder="Add a result, scale, or notable technical detail…"
            />
          </ItemCard>
        ))}
        <AddItemButton
          onClick={() =>
            onChange({
              ...data,
              projects: [...data.projects, getEmptyProject(data.projects.length)],
            })
          }
        >
          Add project
        </AddItemButton>
      </div>
    </EditorSection>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export function SkillsEditor({ data, onChange, stepLabel }: ResumeEditorContentProps) {
  const updateItem = (id: string, updates: Partial<ResumeSkillGroup>) => {
    onChange({
      ...data,
      skillGroups: data.skillGroups.map((item) =>
        item.id === id ? { ...item, ...updates } : item
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
                skillGroups: data.skillGroups.filter((group) => group.id !== item.id),
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
              skillGroups: [...data.skillGroups, getEmptySkillGroup(data.skillGroups.length)],
            })
          }
        >
          Add skill group
        </AddItemButton>
        <WritingTip>
          Keep this targeted. A focused list of 8–15 relevant skills is stronger than a long
          inventory of everything you have tried.
        </WritingTip>
      </div>
    </EditorSection>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────

export function CertificationsEditor({ data, onChange, stepLabel }: ResumeEditorContentProps) {
  const certifications = data.certifications ?? [];
  const updateItem = (id: string, updates: Partial<ResumeCertification>) => {
    onChange({
      ...data,
      certifications: certifications.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  return (
    <EditorSection
      eyebrow={stepLabel}
      title="Add awards and certifications"
      description="Include relevant credentials, competitive achievements, and recognition that strengthen your target-role evidence."
    >
      <div className="space-y-4">
        {certifications.map((item) => (
          <ItemCard
            key={item.id}
            title={item.title || "Untitled credential"}
            subtitle={[item.issuer, item.date].filter(Boolean).join(" · ")}
            onRemove={() =>
              onChange({
                ...data,
                certifications: certifications.filter(
                  (certification) => certification.id !== item.id
                ),
              })
            }
          >
            <div className="grid grid-cols-1 gap-4 min-[500px]:grid-cols-2">
              <Field
                label="Award or certification"
                value={item.title}
                onChange={(value) => updateItem(item.id, { title: value })}
                placeholder="Power BI Data Analyst Associate"
                className="min-[500px]:col-span-2"
              />
              <Field
                label="Issuer"
                value={item.issuer}
                onChange={(value) => updateItem(item.id, { issuer: value })}
                placeholder="Microsoft"
              />
              <Field
                label="Date"
                value={item.date}
                onChange={(value) => updateItem(item.id, { date: value })}
                placeholder="2025"
              />
              <TextAreaField
                label="Why it matters"
                value={item.description}
                onChange={(value) => updateItem(item.id, { description: value })}
                placeholder="Describe the assessment, recognition, or demonstrated result."
                rows={3}
                className="min-[500px]:col-span-2"
              />
            </div>
          </ItemCard>
        ))}
        <AddItemButton
          onClick={() =>
            onChange({
              ...data,
              certifications: [...certifications, getEmptyCertification(certifications.length)],
            })
          }
        >
          Add award or certification
        </AddItemButton>
        <WritingTip>
          Prioritize recognized credentials and competitive achievements that directly support the
          role. Add scale or ranking where it is useful.
        </WritingTip>
      </div>
    </EditorSection>
  );
}
