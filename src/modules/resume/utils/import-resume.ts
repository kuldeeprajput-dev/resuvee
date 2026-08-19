import mammoth from "mammoth";
import JSZip from "jszip";
import { extractTextFromPDF } from "@/shared/lib/extractors/client-pdf";
import type { ResumeData } from "../types/resume";
import { DOCX_RESUME_DATA_PROPERTY, parseDocxResumePayload } from "./docx-resume-metadata";
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
  return (await extractResumeFileContent(file)).text;
}

async function readEmbeddedResumeData(arrayBuffer: ArrayBuffer) {
  try {
    const archive = await JSZip.loadAsync(arrayBuffer);
    const customProperties = archive.file("docProps/custom.xml");
    if (!customProperties) return null;
    const xml = await customProperties.async("string");
    const documentNode = new DOMParser().parseFromString(xml, "application/xml");
    if (documentNode.querySelector("parsererror")) return null;
    const property = Array.from(documentNode.getElementsByTagNameNS("*", "property")).find(
      (node) => node.getAttribute("name") === DOCX_RESUME_DATA_PROPERTY
    );
    return parseDocxResumePayload(property?.textContent ?? "");
  } catch {
    return null;
  }
}

export interface ExtractedResumeFileContent {
  text: string;
  embeddedData: ResumeData | null;
}

export async function extractResumeFileContent(file: File): Promise<ExtractedResumeFileContent> {
  const extension = resumeExtension(file.name);
  if (!extension) throw new Error("Unsupported resume format.");
  await assertFileSignature(file, extension);

  if (extension === ".pdf") {
    return { text: await extractTextFromPDF(file), embeddedData: null };
  }

  const arrayBuffer = await file.arrayBuffer();
  const embeddedData = await readEmbeddedResumeData(arrayBuffer);
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return {
    text: htmlToStructuredText(result.value || ""),
    embeddedData,
  };
}

export function statsForResumeData(data: ResumeData): ParseStats {
  return {
    experiences: data.experience.length,
    education: data.education.length,
    projects: data.projects.length,
    skills: data.skillGroups.reduce((total, group) => total + group.skills.length, 0),
    certifications: data.certifications?.length ?? 0,
  };
}

export function parseExtractedResumeText(
  rawText: string,
  currentData: ResumeData
): { data: ResumeData; stats: ParseStats } {
  return parseResumeText(rawText, currentData);
}

export type { ParseStats };
