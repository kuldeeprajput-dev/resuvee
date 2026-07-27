import type { Metadata } from "next";
import { ResumeBuilder } from "@/components/resume/ResumeBuilder";

export const metadata: Metadata = {
  title: "Resume Builder",
  description:
    "Create a professional resume with guided sections, live preview, and original templates.",
};

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; starter?: string }>;
}) {
  const { template, starter } = await searchParams;

  return (
    <ResumeBuilder
      initialTemplate={template}
      initialStarter={starter}
    />
  );
}
