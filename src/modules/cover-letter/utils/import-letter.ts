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
 * Converts ALL CAPS or all lowercase text to proper Title Case
 */
function formatTitleCase(str: string): string {
  if (!str) return "";
  const trimmed = str.trim();
  const hasLower = /[a-z]/.test(trimmed);
  const hasUpper = /[A-Z]/.test(trimmed);
  // If already mixed case (e.g. "Senior Product Specialist"), keep as is
  if (hasLower && hasUpper) {
    return trimmed;
  }
  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Splits and cleans title / headline, turning squashed ALLCAPS or spaced letters
 * like "S E N I O R  P R O D U C T" or "SENIORPRODUCTSPECIALIST" into "Senior Product Specialist".
 */
function cleanHeadlineOrTitle(title: string): string {
  if (!title) return "";
  let clean = title.trim();

  // 1. If text has single spaced letters like "S E N I O R  P R O D U C T" or "S E N I O R P R O D U C T"
  clean = clean.replace(/\b([A-Za-z])(?:\s+([A-Za-z]))+\b/g, (match) => {
    if (/\s{2,}/.test(match)) {
      return match.split(/\s{2,}/).map((w) => w.replace(/\s+/g, "")).join(" ");
    }
    return match.replace(/\s+/g, "");
  });

  // 2. If text is squashed together without spaces (e.g. "SENIORPRODUCTSPECIALIST" or "SeniorProductSpecialist")
  const titleKeywords = [
    "Senior", "Junior", "Lead", "Staff", "Principal", "Chief", "Head", "VP", "Director",
    "Product", "Project", "Program", "Software", "Hardware", "Frontend", "Backend", "Fullstack", "Full", "Stack",
    "Engineer", "Engineering", "Developer", "Development", "Specialist", "Manager", "Management",
    "Designer", "Design", "Architect", "Architecture", "Consultant", "Analyst", "Analytics",
    "Scientist", "Science", "Researcher", "Research", "Officer", "Coordinator", "Administrator",
    "Executive", "Associate", "Assistant", "Representative", "Strategist", "Advisor",
    "Operations", "Marketing", "Sales", "Finance", "Financial", "Accountant", "Accounting",
    "Creative", "Art", "Content", "Writer", "Editor", "Media", "Digital", "Growth", "Customer",
    "Success", "Support", "Service", "Services", "Technical", "Technology", "Technician",
    "Security", "Quality", "Assurance", "DevOps", "Cloud", "Data", "AI", "ML", "Business"
  ];

  if (!clean.includes(" ") && clean.length > 8) {
    let segmented = clean;
    for (const kw of titleKeywords) {
      const reg = new RegExp(`(?<=[a-zA-Z])(${kw})|(${kw})(?=[a-zA-Z])`, "gi");
      segmented = segmented.replace(reg, (m) => ` ${m} `);
    }
    segmented = segmented.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\s+/g, " ").trim();
    if (segmented.includes(" ")) {
      clean = segmented;
    }
  } else {
    clean = clean.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  // 3. Format into proper Title Case
  return formatTitleCase(clean);
}

/**
 * Reconstructs fragmented raw lines from PDF into clean body paragraphs.
 */
function rebuildBodyParagraphs(rawLines: string[]): string[] {
  const paragraphs: string[] = [];
  let currentPara: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) {
      if (currentPara.length > 0) {
        paragraphs.push(joinLineArray(currentPara));
        currentPara = [];
      }
      continue;
    }

    currentPara.push(line);

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
      result = `${result}${line}`;
    } else {
      result = result ? `${result} ${line}` : line;
    }
  }
  return result.replace(/\s+/g, " ").trim();
}

/**
 * Main parser for extracting cover letter text from imported files
 */
export function parseExtractedLetterText(
  rawText: string,
  currentData: CoverLetterData
): CoverLetterData {
  if (!rawText || !rawText.trim()) return currentData;

  const normalized = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rawLines = normalized
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (rawLines.length === 0) return currentData;

  const newData: CoverLetterData = { ...currentData };
  const fullText = rawLines.join(" ");

  // 1. Extract Email
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) newData.email = emailMatch[0];

  // 2. Extract Phone (Supports international, domestic, 7-digit, 10-digit, and formats like +1 555 0100)
  const phoneLabeled = fullText.match(/(?:phone|tel|mobile|cell|contact):\s*([+\d\s().-]{7,25})/i);
  if (phoneLabeled) {
    newData.phone = phoneLabeled[1].trim();
  } else {
    const phoneMatch = fullText.match(
      /(?:\+?\d{1,4}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{3,4}(?:[\s.-]?\d{1,4})?|\+?\d{1,3}[\s.-]\d{3,4}[\s.-]\d{3,4}/
    );
    if (phoneMatch) newData.phone = phoneMatch[0].trim();
  }

  // 3. Extract Website / LinkedIn
  const linkedinMatch = fullText.match(/(?:linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    newData.website = `https://${linkedinMatch[0]}`;
  } else {
    const webMatch = fullText.match(/(?:https?:\/\/|www\.)[^\s,]+|[a-zA-Z0-9_-]+\.(?:dev|me|io|design|portfolio|info)/i);
    if (webMatch) newData.website = webMatch[0];
  }

  // 4. Find Greeting line (Dear..., To..., Hello...)
  const greetingIndex = rawLines.findIndex((l) =>
    /^(dear|to the|hello|hi|respectful|to:)\b/i.test(l)
  );
  if (greetingIndex !== -1) {
    newData.greeting = rawLines[greetingIndex];
  }

  // 5. Find Signoff line (Sincerely, Best regards...)
  const signoffIndex = rawLines.findIndex((l) =>
    /^(sincerely|best regards|kind regards|warm regards|regards|thank you|thanks|yours truly)/i.test(
      l
    )
  );
  if (signoffIndex !== -1) {
    newData.signoff = rawLines[signoffIndex];
  }

  // 6. Header lines before Greeting
  const headerLines = greetingIndex !== -1 ? rawLines.slice(0, greetingIndex) : rawLines.slice(0, 8);
  let remainingHeader = [...headerLines];

  // A. Extract Date
  const dateRegex =
    /(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}|\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}/i;
  for (let i = 0; i < remainingHeader.length; i++) {
    const match = remainingHeader[i].match(dateRegex);
    if (match) {
      newData.date = match[0];
      remainingHeader[i] = remainingHeader[i].replace(match[0], "").trim();
      break;
    }
  }
  remainingHeader = remainingHeader.filter(Boolean);

  // B. Extract Company and Role from lines with separators (e.g. "Northstar Labs · Product Manager" or "Company - Role")
  for (let i = 0; i < remainingHeader.length; i++) {
    const line = remainingHeader[i];
    if (/[·•|]/.test(line)) {
      const parts = line.split(/[·•|]/).map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const isPart1Role = /manager|engineer|lead|specialist|developer|designer|analyst|director|associate|intern|consultant|architect|officer|assistant/i.test(parts[1]);
        const isPart0Role = /manager|engineer|lead|specialist|developer|designer|analyst|director|associate|intern|consultant|architect|officer|assistant/i.test(parts[0]);
        if (isPart0Role && !isPart1Role) {
          newData.role = formatTitleCase(parts[0]);
          newData.company = parts[1];
        } else {
          newData.company = parts[0];
          newData.role = formatTitleCase(parts[1]);
        }
        remainingHeader.splice(i, 1);
        break;
      }
    }
  }

  // C. Extract Applicant Full Name (Line 0 of remaining header)
  if (remainingHeader.length > 0) {
    const nameCandidate = remainingHeader[0];
    if (
      nameCandidate.length < 45 &&
      !nameCandidate.includes("@") &&
      !/^(hiring manager|recruiter|hr manager|head of|to:)/i.test(nameCandidate)
    ) {
      newData.fullName = formatTitleCase(nameCandidate);
      remainingHeader.shift();
    }
  }

  // D. Extract Applicant Professional Title / Headline (Line 1 of remaining header)
  if (remainingHeader.length > 0) {
    const headlineCandidate = remainingHeader[0];
    if (
      headlineCandidate.length < 60 &&
      !headlineCandidate.includes("@") &&
      !/^(hiring manager|recruiter|hr manager|head of|to:)/i.test(headlineCandidate)
    ) {
      newData.headline = cleanHeadlineOrTitle(headlineCandidate);
      remainingHeader.shift();
    }
  }

  // E. Extract Recipient & remaining Company/Role
  for (let i = 0; i < remainingHeader.length; i++) {
    const line = remainingHeader[i];
    if (/^(hiring manager|recruiter|hr team|hiring team|talent acquisition|to the|to:)/i.test(line)) {
      newData.recipient = formatTitleCase(line);
      remainingHeader.splice(i, 1);
      break;
    }
  }

  if (!newData.recipient && remainingHeader.length > 0) {
    const cand = remainingHeader.shift()!;
    newData.recipient = formatTitleCase(cand);
  }

  if (!newData.company && remainingHeader.length > 0) {
    newData.company = remainingHeader.shift()!;
  }
  if (!newData.role && remainingHeader.length > 0) {
    newData.role = formatTitleCase(remainingHeader.shift()!);
  }

  // 7. Body Paragraph Parsing (Lines between Greeting and Signoff)
  const bodyStart = greetingIndex !== -1 ? greetingIndex + 1 : 0;
  const bodyEnd = signoffIndex !== -1 ? signoffIndex : rawLines.length;
  const rawBodyLines = rawLines.slice(bodyStart, bodyEnd).filter((l) => {
    if (l.includes("@") || /^\+?\d[\d\s-]{7,}/.test(l)) return false;
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

  // 8. Fallback for Role & Company from opening paragraph if still missing
  if ((!newData.role || !newData.company) && newData.opening) {
    const roleCompMatch = newData.opening.match(
      /(?:apply for|applying for|interest in|opening for|position of|role of|opportunity as)\s+(?:the\s+|a\s+|an\s+)?([A-Za-z\s]+?)\s+(?:position|role|opportunity)?\s+(?:at|with|for)\s+([A-Za-z0-9\s&.,'-]+?)(?:\.|\band\b|,|\bin\b)/i
    );
    if (roleCompMatch) {
      if (!newData.role && roleCompMatch[1]) {
        newData.role = formatTitleCase(roleCompMatch[1].trim());
      }
      if (!newData.company && roleCompMatch[2]) {
        newData.company = roleCompMatch[2].trim();
      }
    }
  }

  // 9. Extract Location from footer lines if present
  if (!newData.location) {
    const locationMatch = fullText.match(
      /\b([A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z\s]+))\b/
    );
    if (locationMatch && !locationMatch[1].includes("Dear") && !locationMatch[1].includes("Sincerely")) {
      newData.location = locationMatch[1].trim();
    }
  }

  return newData;
}
