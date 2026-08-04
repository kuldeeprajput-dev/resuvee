import type { Metadata } from "next";
import { CoverLetterView } from "@/modules/cover-letter";

export const metadata: Metadata = {
  title: "Cover Letter Studio — Resuvee",
  description:
    "Write custom, high-converting cover letters matched to any job target.",
};

export default function CoverLetterPage() {
  return <CoverLetterView />;
}
