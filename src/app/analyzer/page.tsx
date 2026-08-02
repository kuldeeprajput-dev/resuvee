import type { Metadata } from "next";
import { AnalyzerView } from "@/modules/analyzer";

export const metadata: Metadata = {
  title: "ATS Resume Analyzer",
  description:
    "Upload your resume for an ATS score, keyword gaps, strengths, and practical improvements.",
};

export default function AnalyzerPage() {
  return <AnalyzerView />;
}
