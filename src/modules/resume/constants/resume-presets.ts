import type { ResumeData, ResumeTemplateId } from "../types/resume";
import { templateStarterData } from "./resume-preset-builder";
import { Award, Briefcase, FileText, GraduationCap, User, Wrench, FolderGit2 } from "lucide-react";
import type { BuilderSection } from "../types/resume";

export function cloneResumeData(data: ResumeData): ResumeData {
  return {
    basics: { ...data.basics },
    experience: data.experience.map((item) => ({ ...item, highlights: [...item.highlights] })),
    education: data.education.map((item) => ({ ...item })),
    projects: data.projects.map((item) => ({ ...item, highlights: [...item.highlights] })),
    skillGroups: data.skillGroups.map((group) => ({ ...group, skills: [...group.skills] })),
    certifications: (data.certifications ?? []).map((item) => ({ ...item })),
  };
}

function hasText(values: string[]) {
  return values.some((value) => value.trim().length > 0);
}

export function mergeResumeWithStarter(current: ResumeData, starter: ResumeData): ResumeData {
  const basics = Object.fromEntries(
    Object.entries(starter.basics).map(([key, sampleValue]) => {
      const currentValue = current.basics[key as keyof ResumeData["basics"]];
      const hasVal =
        typeof currentValue === "string"
          ? currentValue.trim().length > 0
          : Array.isArray(currentValue)
            ? currentValue.length > 0
            : Boolean(currentValue);
      return [key, hasVal ? currentValue : sampleValue];
    })
  ) as unknown as ResumeData["basics"];

  const hasExperience = current.experience.some((item) =>
    hasText([item.role, item.company, ...item.highlights])
  );
  const hasEducation = current.education.some((item) =>
    hasText([item.degree, item.school, item.details])
  );
  const hasProjects = current.projects.some((item) =>
    hasText([item.name, item.description, ...item.highlights])
  );
  const hasSkills = current.skillGroups.some((group) => hasText([group.name, ...group.skills]));
  const hasCertifications = (current.certifications ?? []).some((item) =>
    hasText([item.title, item.issuer, item.description])
  );

  return {
    basics,
    experience: hasExperience ? current.experience : cloneResumeData(starter).experience,
    education: hasEducation ? current.education : cloneResumeData(starter).education,
    projects: hasProjects ? current.projects : cloneResumeData(starter).projects,
    skillGroups: hasSkills ? current.skillGroups : cloneResumeData(starter).skillGroups,
    certifications: hasCertifications
      ? current.certifications
      : cloneResumeData(starter).certifications,
  };
}

export function getTemplateStarterData(templateId: ResumeTemplateId) {
  return cloneResumeData(templateStarterData[templateId]);
}

export const sectionMetadata: Record<
  BuilderSection,
  { title: string; icon: React.ComponentType<{ className?: string }> }
> = {
  basics: { title: "Personal", icon: User },
  summary: { title: "Summary", icon: FileText },
  experience: { title: "Experience", icon: Briefcase },
  education: { title: "Education", icon: GraduationCap },
  skills: { title: "Skills", icon: Wrench },
  projects: { title: "Projects", icon: FolderGit2 },
  certifications: { title: "Certifications", icon: Award },
};
