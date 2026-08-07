"use client";

import type { BuilderSection, ResumeData, ResumeTemplate } from "../../types/resume";
import { PersonalDetailsEditor, SummaryEditor } from "./resume-editor-sections";
import {
  ExperienceEditor,
  EducationEditor,
  ProjectsEditor,
  SkillsEditor,
  CertificationsEditor,
} from "./resume-editor-list-sections";

interface ResumeEditorProps {
  activeSection: BuilderSection;
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  template: ResumeTemplate;
}

export function ResumeEditor({ activeSection, data, onChange, template }: ResumeEditorProps) {
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
    case "certifications":
      return <CertificationsEditor {...sharedProps} />;
  }
}
