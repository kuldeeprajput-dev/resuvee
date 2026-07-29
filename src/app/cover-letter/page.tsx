import type { Metadata } from "next";
import { CoverLetterStudio } from "@/modules/cover-letter";

export const metadata: Metadata = {
  title: "Cover Letter Studio — ResuLyra",
  description:
    "Write targeted, high-impact cover letters designed specifically for your next role.",
};

export default function CoverLetterPage() {
  return <CoverLetterStudio />;
}
