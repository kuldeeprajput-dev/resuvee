import mammoth from "mammoth";
import { extractTextFromPDF } from "@/shared/lib/extractors/client-pdf";
import type { ResumeData } from "../types/resume";
import { parseResumeText, type ParseStats } from "./resume-text-parser";

export const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
];
export const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".docx"] as const;
export const MAX_RESUME_FILE_SIZE_MB = 10;

export interface ResumeFileValidationResult {
  valid: boolean;
  error?: string;
}

function resumeExtension(fileName: string): (typeof ALLOWED_RESUME_EXTENSIONS)[number] | undefined {
  const name = fileName.toLowerCase();
  return ALLOWED_RESUME_EXTENSIONS.find((extension) => name.endsWith(extension));
}

export function validateResumeFile(file: File): ResumeFileValidationResult {
  if (file.size <= 0) {
    return { valid: false, error: "This file is empty. Choose a populated PDF or DOCX resume." };
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_RESUME_FILE_SIZE_MB) {
    return {
      valid: false,
      error: `File is too large (${sizeMB.toFixed(1)} MB). Maximum allowed size is ${MAX_RESUME_FILE_SIZE_MB} MB.`,
    };
  }

  const extension = resumeExtension(file.name);
  if (!extension) {
    return { valid: false, error: "Unsupported file. Upload a PDF or DOCX resume." };
  }

  if (file.type && !ALLOWED_RESUME_TYPES.includes(file.type)) {
    return { valid: false, error: "The file type does not match a supported PDF or DOCX resume." };
  }

  const expectedType = extension === ".pdf" ? "application/pdf" : ALLOWED_RESUME_TYPES[1];
  if (file.type && file.type !== "application/octet-stream" && file.type !== expectedType) {
    return { valid: false, error: "The filename and document type do not match." };
  }

  return { valid: true };
}

async function assertFileSignature(file: File, extension: ".pdf" | ".docx") {
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (extension === ".pdf") {
    const signature = String.fromCharCode(...bytes.slice(0, 5));
    if (signature !== "%PDF-") throw new Error("The selected file is not a valid PDF document.");
    return;
  }

  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (!isZip) throw new Error("The selected file is not a valid DOCX document.");
}

function htmlToStructuredText(html: string) {
  const documentNode = new DOMParser().parseFromString(html, "text/html");
  const lines: string[] = [];

  for (const element of Array.from(documentNode.body.children)) {
    if (element.matches("ul, ol")) {
      for (const item of Array.from(element.querySelectorAll(":scope > li"))) {
        const text = item.textContent?.trim();
        if (text) lines.push(`• ${text}`);
      }
      continue;
    }

    const text = element.textContent?.trim();
    if (text) lines.push(text);
  }

  return lines.join("\n");
}

export async function extractTextFromResumeFile(file: File): Promise<string> {
  const extension = resumeExtension(file.name);
  if (!extension) throw new Error("Unsupported resume format.");
  await assertFileSignature(file, extension);

  if (extension === ".pdf") return extractTextFromPDF(file);

  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return htmlToStructuredText(result.value || "");
}

export function parseExtractedResumeText(
  rawText: string,
  currentData: ResumeData
): { data: ResumeData; stats: ParseStats } {
  return parseResumeText(rawText, currentData);
}

export type { ParseStats };
