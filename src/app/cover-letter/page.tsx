import type { Metadata } from "next";
import { LetterStudio } from "@/modules/cover-letter";

export const metadata: Metadata = {
  title: "Letter Studio | Resulyra",
  description: "Write, customize, save, and export a focused letter in your browser.",
};

export default function CoverLetterPage() {
  return <LetterStudio />;
}
