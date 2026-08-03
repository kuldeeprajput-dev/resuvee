import mammoth from "mammoth";
import { extractTextFromPDF } from "@/shared/lib/extractors/client-pdf";
import type { CoverLetterData } from "../types/cover-letter";

export async function extractTextFromCoverLetterFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".pdf")) {
    return await extractTextFromPDF(file);
  }

  if (fileName.endsWith(".docx")) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || "";
  }

  return await file.text();
}

/**
 * Collapses spaced out text like "S E N I O R  P R O D U C T" -> "SENIOR PRODUCT"
 */
function collapseSpacedLetters(text: string): string {
  return text.replace(/\b(?:[A-Z]\s+){2,}[A-Z]\b/g, (match) =>
    match.replace(/\s+/g, "")
  );
}

/**
 * Reconstructs fragmented raw lines from PDF into clean body paragraphs.
 */
function rebuildBodyParagraphs(rawLines: string[]): string[] {
  const paragraphs: string[] = [];
  let currentPara: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i].trim();
    if (!line) {
      if (currentPara.length > 0) {
        paragraphs.push(joinLineArray(currentPara));
        currentPara = [];
      }
      continue;
    }

    currentPara.push(line);

    // If line ends with sentence terminal punctuation (. ? !), end paragraph
    if (/[.?!]$/.test(line)) {
      paragraphs.push(joinLineArray(currentPara));
      currentPara = [];
    }
  }

  if (currentPara.length > 0) {
    paragraphs.push(joinLineArray(currentPara));
  }

  return paragraphs.filter((p) => p.trim().length > 0);
}

function joinLineArray(lines: string[]): string {
  let result = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (result.endsWith("-")) {
      // Hyphenated word across line break: e.g. "high-" + "performing" -> "high-performing"
      result = `${result}${line}`;
    } else {
      result = result ? `${result} ${line}` : line;
    }
  }
  return result.replace(/\s+/g, " ").trim();
}

export function parseExtractedLetterText(rawText: string, currentData: CoverLetterData): CoverLetterData {
  if (!rawText || !rawText.trim()) return currentData;

  // 1. Clean raw text & collapse spaced uppercase characters
  const cleanedRaw = collapseSpacedLetters(
    rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  );

  const rawLines = cleanedRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (rawLines.length === 0) return currentData;

  const newData: CoverLetterData = { ...currentData };

  // 2. Find Greeting line (Dear..., To..., Hello...)
  const greetingIndex = rawLines.findIndex((l) =>
    /^(dear|to the|hello|hi|respectful|to:)\b/i.test(l)
  );
  if (greetingIndex !== -1) {
    newData.greeting = rawLines[greetingIndex];
  }

  // 3. Find Signoff line (Sincerely, Best regards...)
  const signoffIndex = rawLines.findIndex((l) =>
    /^(sincerely|best regards|kind regards|warm regards|regards|thank you|thanks|yours truly)/i.test(l)
  );
  if (signoffIndex !== -1) {
    newData.signoff = rawLines[signoffIndex];
  }

  // 4. Extract global Email & Phone numbers
  const fullText = rawLines.join(" ");
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) newData.email = emailMatch[0];

  const phoneMatch = fullText.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  if (phoneMatch) newData.phone = phoneMatch[0];

  // 5. Header Section Parsing (Lines before Greeting)
  const headerLines = greetingIndex !== -1 ? rawLines.slice(0, greetingIndex) : [];

  if (headerLines.length > 0) {
    let remainingHeader = [...headerLines];

    // Extract Date from header lines if present (e.g. "August 3, 2026", "08/03/2026")
    const dateRegex = /(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}|\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}/i;
    for (let i = 0; i < remainingHeader.length; i++) {
      const match = remainingHeader[i].match(dateRegex);
      if (match) {
        newData.date = match[0];
        // Strip date from header line
        remainingHeader[i] = remainingHeader[i].replace(match[0], "").trim();
        break;
      }
    }
    remainingHeader = remainingHeader.filter(Boolean);

    // Applicant Name (Line 0 of header)
    if (remainingHeader.length > 0) {
      const nameCandidate = remainingHeader[0];
      if (
        nameCandidate.length < 45 &&
        !nameCandidate.includes("@") &&
        !/^(hiring manager|recruiter|hr manager|to:)/i.test(nameCandidate)
      ) {
        newData.fullName = nameCandidate;
        remainingHeader.shift();
      }
    }

    // Applicant Title / Headline (Line 1 of header)
    if (remainingHeader.length > 0) {
      const headlineCandidate = remainingHeader[0];
      if (
        headlineCandidate.length < 50 &&
        !headlineCandidate.includes("@") &&
        !/^(hiring manager|recruiter|hr manager|to:)/i.test(headlineCandidate)
      ) {
        newData.headline = headlineCandidate;
        remainingHeader.shift();
      }
    }

    // Recipient, Company & Target Role
    if (remainingHeader.length > 0) {
      const recipientIndex = remainingHeader.findIndex((l) =>
        /^(hiring manager|recruiter|hr manager|head of|director|to:)/i.test(l)
      );

      if (recipientIndex !== -1) {
        newData.recipient = remainingHeader[recipientIndex];
        if (remainingHeader[recipientIndex + 1]) {
          newData.company = remainingHeader[recipientIndex + 1];
        }
        if (remainingHeader[recipientIndex + 2]) {
          newData.role = remainingHeader[recipientIndex + 2];
        }
      } else {
        if (remainingHeader[0]) newData.recipient = remainingHeader[0];
        if (remainingHeader[1]) newData.company = remainingHeader[1];
        if (remainingHeader[2]) newData.role = remainingHeader[2];
      }
    }
  }

  // 6. Body Paragraph Parsing (Lines between Greeting and Signoff)
  const bodyStart = greetingIndex !== -1 ? greetingIndex + 1 : 0;
  const bodyEnd = signoffIndex !== -1 ? signoffIndex : rawLines.length;
  const rawBodyLines = rawLines.slice(bodyStart, bodyEnd).filter((l) => {
    // Filter out email/phone repeats
    if (l.includes("@") || /^\+?\d[\d\s-]{8,}/.test(l)) return false;
    return true;
  });

  const bodyParagraphs = rebuildBodyParagraphs(rawBodyLines);

  if (bodyParagraphs.length === 1) {
    newData.opening = bodyParagraphs[0];
    newData.evidence = "";
    newData.closing = "";
  } else if (bodyParagraphs.length === 2) {
    newData.opening = bodyParagraphs[0];
    newData.evidence = bodyParagraphs[1];
    newData.closing = "";
  } else if (bodyParagraphs.length === 3) {
    newData.opening = bodyParagraphs[0];
    newData.evidence = bodyParagraphs[1];
    newData.closing = bodyParagraphs[2];
  } else if (bodyParagraphs.length > 3) {
    newData.opening = bodyParagraphs[0];
    newData.evidence = bodyParagraphs.slice(1, bodyParagraphs.length - 1).join("\n\n");
    newData.closing = bodyParagraphs[bodyParagraphs.length - 1];
  } else if (rawText.trim()) {
    newData.opening = rawText.trim();
  }

  return newData;
}
