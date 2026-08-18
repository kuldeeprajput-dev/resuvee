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
  | "fresher"
  | "internship"
  | "career-change"
  | "finance"
  | "healthcare"
  | "sales"
  | "analyst";

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
  | "fresher"
  | "first-step"
  | "pivot"
  | "finance"
  | "healthcare"
  | "sales"
  | "analyst";

export interface ResumeCustomLink {
  id: string;
  icon?: string;
  label?: string;
  url?: string;
}

export interface ResumeBasics {
  fullName: string;
  headline: string;
  photo: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin?: string;
  github?: string;
  textOnlyLinks?: Record<string, boolean>;
  customLabels?: Record<string, string>;
  contactOrder?: string[];
  customLinks?: ResumeCustomLink[];
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
  githubUrl?: string;
  linkLabel?: string;
  githubLabel?: string;
  date?: string;
  highlights: string[];
}

export interface ResumeSkillGroup {
  id: string;
  name: string;
  skills: string[];
}

export interface ResumeCertification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface ResumeData {
  basics: ResumeBasics;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  skillGroups: ResumeSkillGroup[];
  certifications?: ResumeCertification[];
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
  photoShape?: "circle" | "rounded" | "square";
  sections: BuilderSection[];
  sidebarSections: BuilderSection[];
  audience: "experienced" | "fresher" | "career-change";
  popular?: boolean;
}

export type BuilderSection =
  "basics" | "summary" | "experience" | "education" | "projects" | "skills" | "certifications";
