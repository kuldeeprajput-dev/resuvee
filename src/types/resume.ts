export type ResumeTemplateId =
  | "nova"
  | "classic"
  | "executive"
  | "minimal"
  | "studio"
  | "terminal"
  | "standard"
  | "compact"
  | "hybrid"
  | "consulting"
  | "finance"
  | "sales"
  | "healthcare"
  | "educator"
  | "research"
  | "fresher"
  | "internship"
  | "career-change";

export type ResumeRendererId =
  | "meridian"
  | "editorial"
  | "summit"
  | "column"
  | "horizon"
  | "blueprint"
  | "chronological"
  | "compact"
  | "hybrid"
  | "fresher";

export interface ResumeBasics {
  fullName: string;
  headline: string;
  photo: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
}

export interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface ResumeEducation {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  link: string;
  highlights: string[];
}

export interface ResumeSkillGroup {
  id: string;
  name: string;
  skills: string[];
}

export interface ResumeData {
  basics: ResumeBasics;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  skillGroups: ResumeSkillGroup[];
}

export interface ResumeTemplate {
  id: ResumeTemplateId;
  renderer: ResumeRendererId;
  name: string;
  eyebrow: string;
  description: string;
  accent: string;
  background: string;
  suitableFor: string;
  layout: "single" | "sidebar";
  supportsPhoto: boolean;
  audience: "experienced" | "fresher" | "career-change";
  popular?: boolean;
}

export type BuilderSection =
  | "basics"
  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "skills";
