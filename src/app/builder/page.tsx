import type { Metadata } from "next";
import { BuilderView } from "@/modules/resume";

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

  return <BuilderView initialTemplate={template} initialStarter={starter} />;
}
