import type { Metadata } from "next";
import { LetterStudio } from "@/modules/letters";

export const metadata: Metadata = {
  title: "Letter Studio — ResuLyra",
  description:
    "Write targeted, high-impact letters designed specifically for your next role.",
};

export default function LetterPage() {
  return <LetterStudio />;
}
