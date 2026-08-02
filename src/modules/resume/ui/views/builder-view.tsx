"use client";

import { ResumeBuilder } from "../components/resume-builder";

interface BuilderViewProps {
  initialTemplate?: string;
  initialStarter?: string;
}

export function BuilderView({ initialTemplate, initialStarter }: BuilderViewProps) {
  return <ResumeBuilder initialTemplate={initialTemplate} initialStarter={initialStarter} />;
}
