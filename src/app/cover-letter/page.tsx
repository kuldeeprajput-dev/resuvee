import type { Metadata } from "next";
import { CoverLetterStudio } from "@/modules/cover-letter";

export const metadata: Metadata = {
  title: "Cover Letter Builder | Resulyra",
  description: "Write, customize, save, and export a focused cover letter in your browser.",
};

export default function CoverLetterPage() {
  return <CoverLetterStudio />;
}
