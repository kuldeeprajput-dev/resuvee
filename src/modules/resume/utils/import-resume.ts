import mammoth from "mammoth";
import { extractTextFromPDF } from "@/shared/lib/extractors/client-pdf";
import type {
  ResumeData,
  ResumeExperience,
  ResumeEducation,
  ResumeProject,
  ResumeSkillGroup,
  ResumeCertification,
} from "../types/resume";

// ─────────────────────────────────────────────
// File Validation
// ─────────────────────────────────────────────

export const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];
export const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"];
export const MAX_RESUME_FILE_SIZE_MB = 10;

export interface ResumeFileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateResumeFile(file: File): ResumeFileValidationResult {
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_RESUME_FILE_SIZE_MB) {
    return {
      valid: false,
      error: `File is too large (${sizeMB.toFixed(1)} MB). Maximum allowed size is ${MAX_RESUME_FILE_SIZE_MB} MB.`,
    };
  }

  const name = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_RESUME_EXTENSIONS.some((ext) => name.endsWith(ext));
  const hasValidType = !file.type || file.type === "" || ALLOWED_RESUME_TYPES.includes(file.type);

  if (!hasValidExtension && !hasValidType) {
    return {
      valid: false,
      error: `Unsupported file type. Please upload a PDF, Word document (.docx), or plain text file.`,
    };
  }

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Invalid file extension. Accepted formats: PDF, DOCX, DOC, TXT.`,
    };
  }

  return { valid: true };
}

// ─────────────────────────────────────────────
// Text Extraction
// ─────────────────────────────────────────────

export async function extractTextFromResumeFile(file: File): Promise<string> {
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

// ─────────────────────────────────────────────
// Internal Helpers
// ─────────────────────────────────────────────

function collapseSpacedLetters(text: string): string {
  return text.replace(/\b([A-Z])(?:\s+([A-Z]))+\b/g, (match) => {
    const words = match.split(/\s{2,}/);
    return words.map((w) => w.replace(/\s+/g, "")).join(" ");
  });
}

const DATE_RANGE_REGEX =
  /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*(?:[\u2013\u2014\-]|to)\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current)/i;

const BULLET_START_REGEX = /^[\u2022\u25cf\u2013\u2014\*\+\-o>•⁃▪▫]\s*/;

const ACTION_VERB_REGEX =
  /^(Standardized|Built|Engineered|Developed|Partnered|Created|Managed|Led|Designed|Implemented|Analyzed|Produced|Found|Joined|Spearheaded|Architected|Optimized|Increased|Reduced|Decreased|Expanded|Delivered|Formulated|Collaborated|Directed|Established|Maintained|Automated|Executed|Researched|Transformed|Calculated|Assisted|Provided|Achieved|Supported|Drafted|Authored|Extracted|Processed|Accelerated|Pioneered|Orchestrated|Fostered|Improved|Enhanced|Deployed|Configured|Integrated|Migrated|Refactored|Tested|Reviewed|Mentored|Trained|Launched|Scaled|Monitored|Diagnosed|Resolved|Implemented|Streamlined|Facilitated|Coordinated|Presented|Negotiated)\b/i;

// Broader section header detection covering more real-world resume formats
const SECTION_HEADER_PATTERNS =
  /^(summary|profile|about|aboutme|objective|careerobjective|experience|workexperience|employment|employmenthistory|workhistory|professionalexperience|education|academic|academics|academicbackground|academicqualifications|projects|keyprojects|personalprojects|opensourceprojects|skills|technicalskills|expertise|coretechnologies|technologies|tools|competencies|softskills|certifications|certification|awards|awardsandhonors|honors|achievements|accomplishments|languages|languageskills|volunteer|volunteerexperience|volunteerwork|publications|interests|extracurricular|activities|leadership|references|links|sociallinks|contactinformation)$/i;

function isSectionHeader(line: string): boolean {
  const cleaned = line.toLowerCase().replace(/[^a-z]/g, "");
  return SECTION_HEADER_PATTERNS.test(cleaned);
}

// General location pattern: "City, State", "City, Country", or known remote keywords
const LOCATION_REGEX =
  /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2}|[A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b|Remote|Hybrid/;

// Lines that look like contact info and should not be used as name/headline
const CONTACT_LINE_REGEX =
  /@|linkedin|github|twitter|portfolio|http|www\.|phone:|email:|tel:|mobile:|\.com|\.io|\.me|\.net\b/i;

// ─────────────────────────────────────────────
// Parse Stats (for rich success messages)
// ─────────────────────────────────────────────

export interface ParseStats {
  experiences: number;
  education: number;
  projects: number;
  skills: number;
  certifications: number;
}

// ─────────────────────────────────────────────
// Main Parser
// ─────────────────────────────────────────────

export function parseExtractedResumeText(
  rawText: string,
  currentData: ResumeData
): { data: ResumeData; stats: ParseStats } {
  const emptyStats: ParseStats = {
    experiences: 0,
    education: 0,
    projects: 0,
    skills: 0,
    certifications: 0,
  };

  if (!rawText || !rawText.trim()) {
    return { data: currentData, stats: emptyStats };
  }

  const cleanedRaw = collapseSpacedLetters(rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n"));

  const lines = cleanedRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return { data: currentData, stats: emptyStats };

  // Deep clone current data so we don't mutate in place
  const newData: ResumeData = JSON.parse(JSON.stringify(currentData));

  // ── Global contact info extraction ──────────────────────────────────────
  const fullText = lines.join(" ");

  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) newData.basics.email = emailMatch[0];

  const phoneMatch = fullText.match(
    /(?:\+?[\d]{1,3}[\s.-]?)?\(?[\d]{3}\)?[\s.-]?[\d]{3}[\s.-]?[\d]{4}/
  );
  if (phoneMatch) newData.basics.phone = phoneMatch[0];

  // LinkedIn takes priority over generic website
  const linkedinMatch = fullText.match(/(?:linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) newData.basics.website = `https://${linkedinMatch[0]}`;
  else {
    const githubMatch = fullText.match(/(?:github\.com\/[a-zA-Z0-9_-]+)/i);
    if (githubMatch) newData.basics.website = `https://${githubMatch[0]}`;
    else {
      const webMatch = fullText.match(/https?:\/\/[^\s,]+/i);
      if (webMatch) newData.basics.website = webMatch[0];
    }
  }

  const locationMatch = fullText.match(LOCATION_REGEX);
  if (locationMatch) newData.basics.location = locationMatch[0];

  // ── Name & Headline from first non-contact lines ─────────────────────────
  let nameLineIdx = -1;
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    if (
      line.length < 50 &&
      !CONTACT_LINE_REGEX.test(line) &&
      !isSectionHeader(line) &&
      !DATE_RANGE_REGEX.test(line)
    ) {
      if (nameLineIdx === -1) {
        newData.basics.fullName = line;
        nameLineIdx = i;
      } else if (i === nameLineIdx + 1 && line.length < 80) {
        newData.basics.headline = line;
        break;
      }
    }
  }

  // ── Section splitting ────────────────────────────────────────────────────
  const sections: { title: string; lines: string[] }[] = [];
  let currentSection: { title: string; lines: string[] } = {
    title: "header",
    lines: [],
  };

  for (const line of lines) {
    if (isSectionHeader(line)) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.toLowerCase().replace(/[^a-z]/g, ""),
        lines: [],
      };
    } else {
      currentSection.lines.push(line);
    }
  }
  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  // ── Process each section ─────────────────────────────────────────────────
  const stats: ParseStats = { ...emptyStats };

  for (const sec of sections) {
    const title = sec.title;

    // 1. SUMMARY / PROFILE / OBJECTIVE
    if (
      title.includes("summary") ||
      title.includes("profile") ||
      title.includes("about") ||
      title.includes("objective")
    ) {
      newData.basics.summary = sec.lines.join(" ");
    }

    // 2. EXPERIENCE
    else if (
      title.includes("experience") ||
      title.includes("employment") ||
      title.includes("work")
    ) {
      const expList: ResumeExperience[] = [];
      let currentExp: ResumeExperience | null = null;

      for (let i = 0; i < sec.lines.length; i++) {
        const line = sec.lines[i];
        const isExplicitBullet = BULLET_START_REGEX.test(line);
        const startsWithActionVerb = ACTION_VERB_REGEX.test(line.replace(BULLET_START_REGEX, ""));
        const dateMatch = line.match(DATE_RANGE_REGEX);

        if (isExplicitBullet || (currentExp && startsWithActionVerb)) {
          const bulletText = line.replace(BULLET_START_REGEX, "").trim();
          if (currentExp) {
            currentExp.highlights.push(bulletText);
          } else {
            currentExp = {
              id: `imported-exp-${Date.now()}-${Math.random()}`,
              role: "Experience",
              company: "",
              location: "",
              startDate: "",
              endDate: "",
              current: false,
              highlights: [bulletText],
            };
          }
        } else if (dateMatch) {
          if (currentExp) expList.push(currentExp);

          const dateStr = dateMatch[0];
          const parts = dateStr.split(/(?:[\u2013\u2014\-]|to)/i);
          const startDate = parts[0]?.trim() || "";
          const endDate = parts[1]?.trim() || "";

          const titleText = line.replace(dateStr, "").trim();

          // Try to peek at next line for company info
          let companyStr = "";
          let locStr = "";
          if (
            i + 1 < sec.lines.length &&
            !BULLET_START_REGEX.test(sec.lines[i + 1]) &&
            !ACTION_VERB_REGEX.test(sec.lines[i + 1]) &&
            !sec.lines[i + 1].match(DATE_RANGE_REGEX) &&
            !isSectionHeader(sec.lines[i + 1])
          ) {
            const companyLine = sec.lines[i + 1];
            i++;
            const compParts = companyLine.split(/[·•|\-,]/);
            companyStr = compParts[0]?.trim() || companyLine;
            if (compParts.length > 1) {
              locStr = compParts.slice(1).join(" · ").trim();
            }
          }

          currentExp = {
            id: `imported-exp-${Date.now()}-${Math.random()}`,
            role: titleText || "Position",
            company: companyStr,
            location: locStr,
            startDate,
            endDate,
            current: /present|current/i.test(endDate),
            highlights: [],
          };
        } else {
          // Non-bullet, non-date line: role title or company
          if (!currentExp || currentExp.highlights.length > 0) {
            if (currentExp) expList.push(currentExp);
            currentExp = {
              id: `imported-exp-${Date.now()}-${Math.random()}`,
              role: line,
              company: "",
              location: "",
              startDate: "",
              endDate: "",
              current: false,
              highlights: [],
            };
          } else if (currentExp && !currentExp.company) {
            const parts = line.split(/[·•|\-,]/);
            currentExp.company = parts[0]?.trim() || line;
            if (parts.length > 1) {
              currentExp.location = parts.slice(1).join(" · ").trim();
            }
          }
        }
      }
      if (currentExp) expList.push(currentExp);
      if (expList.length > 0) {
        newData.experience = expList;
        stats.experiences = expList.length;
      }
    }

    // 3. PROJECTS
    else if (title.includes("project")) {
      const projList: ResumeProject[] = [];
      let currentProj: ResumeProject | null = null;

      for (const line of sec.lines) {
        const isExplicitBullet = BULLET_START_REGEX.test(line);
        const startsWithAction = ACTION_VERB_REGEX.test(line.replace(BULLET_START_REGEX, ""));
        const isLongSentence = line.split(/\s+/).length > 6;
        const dateMatch = line.match(DATE_RANGE_REGEX);

        if (isExplicitBullet || (currentProj && (startsWithAction || isLongSentence))) {
          const text = line.replace(BULLET_START_REGEX, "").trim();
          if (currentProj) {
            currentProj.highlights.push(text);
          } else {
            currentProj = {
              id: `imported-proj-${Date.now()}-${Math.random()}`,
              name: "Project",
              description: "",
              link: "",
              highlights: [text],
            };
          }
        } else {
          if (currentProj) projList.push(currentProj);

          let name = line;
          let date = "";
          if (dateMatch) {
            date = dateMatch[0];
            name = line.replace(dateMatch[0], "").trim();
          }

          // Extract link if present in line
          const urlMatch = name.match(/https?:\/\/[^\s]+/);
          let link = "";
          if (urlMatch) {
            link = urlMatch[0];
            name = name.replace(urlMatch[0], "").trim();
          }

          const parts = name.split(/[:·•|\-]/);
          name = parts[0]?.trim() || name;
          const desc = parts.length > 1 ? parts.slice(1).join(" · ").trim() : "";

          currentProj = {
            id: `imported-proj-${Date.now()}-${Math.random()}`,
            name,
            description: desc,
            link,
            date,
            highlights: [],
          };
        }
      }
      if (currentProj) projList.push(currentProj);
      if (projList.length > 0) {
        newData.projects = projList;
        stats.projects = projList.length;
      }
    }

    // 4. EDUCATION
    else if (title.includes("education") || title.includes("academic")) {
      const eduList: ResumeEducation[] = [];
      let currentEdu: ResumeEducation | null = null;

      for (const line of sec.lines) {
        const dateMatch = line.match(DATE_RANGE_REGEX);

        if (dateMatch) {
          if (currentEdu) eduList.push(currentEdu);
          const dateStr = dateMatch[0];
          const parts = dateStr.split(/(?:[\u2013\u2014\-]|to)/i);

          currentEdu = {
            id: `imported-edu-${Date.now()}-${Math.random()}`,
            degree: line.replace(dateMatch[0], "").trim() || "Degree",
            school: "",
            location: "",
            startDate: parts[0]?.trim() || "",
            endDate: parts[1]?.trim() || "",
            details: "",
          };
        } else if (currentEdu && !currentEdu.school) {
          const parts = line.split(/[,·•|\-]/);
          currentEdu.school = parts[0]?.trim() || line;
          if (parts.length > 1) {
            currentEdu.location = parts.slice(1).join(", ").trim();
          }
        } else if (
          currentEdu &&
          line.match(
            /cgpa|gpa|marks|grade|distinction|first[\s-]?year|final[\s-]?year|percentage|score/i
          )
        ) {
          currentEdu.details = line;
        } else {
          if (currentEdu) eduList.push(currentEdu);
          currentEdu = {
            id: `imported-edu-${Date.now()}-${Math.random()}`,
            degree: line,
            school: "",
            location: "",
            startDate: "",
            endDate: "",
            details: "",
          };
        }
      }
      if (currentEdu) eduList.push(currentEdu);
      if (eduList.length > 0) {
        newData.education = eduList;
        stats.education = eduList.length;
      }
    }

    // 5. SKILLS — smarter grouping
    else if (
      title.includes("skill") ||
      title.includes("competencies") ||
      title.includes("expertise") ||
      title.includes("technologies") ||
      title.includes("tools") ||
      title.includes("technology")
    ) {
      const skillGroups: ResumeSkillGroup[] = [];

      for (const line of sec.lines) {
        if (line.includes(":")) {
          // "Languages: Python, Go, TypeScript"
          const [groupName, skillText] = line.split(":", 2);
          const skills = skillText
            .split(/[,•|·;]/)
            .map((s) => s.trim())
            .filter(Boolean);
          if (skills.length > 0) {
            skillGroups.push({
              id: `imported-skill-${Date.now()}-${Math.random()}`,
              name: groupName.trim(),
              skills,
            });
          }
        } else {
          // Ungrouped: try to infer a reasonable group name
          const skills = line
            .split(/[,•|·;]/)
            .map((s) => s.trim())
            .filter(Boolean);
          if (skills.length > 0) {
            // Try to detect category from section title context
            let groupName = "Core Skills";
            if (title.includes("language")) groupName = "Languages";
            else if (title.includes("tool")) groupName = "Tools";
            else if (title.includes("technolog")) groupName = "Technologies";
            else if (title.includes("soft")) groupName = "Soft Skills";

            // Merge into an existing group with the same name if it exists
            const existing = skillGroups.find((g) => g.name === groupName);
            if (existing) {
              existing.skills = [...new Set([...existing.skills, ...skills])];
            } else {
              skillGroups.push({
                id: `imported-skill-${Date.now()}-${Math.random()}`,
                name: groupName,
                skills,
              });
            }
          }
        }
      }
      if (skillGroups.length > 0) {
        newData.skillGroups = skillGroups;
        stats.skills = skillGroups.reduce((acc, g) => acc + g.skills.length, 0);
      }
    }

    // 6. CERTIFICATIONS & AWARDS & HONORS
    else if (
      title.includes("certification") ||
      title.includes("award") ||
      title.includes("license") ||
      title.includes("honor") ||
      title.includes("achievement") ||
      title.includes("accomplishment")
    ) {
      const certList: ResumeCertification[] = [];

      for (const line of sec.lines) {
        const text = line.replace(BULLET_START_REGEX, "").trim();
        if (!text) continue;

        const dateMatch = text.match(DATE_RANGE_REGEX) || text.match(/\d{4}/);
        const date = dateMatch ? dateMatch[0] : "";
        const textWithoutDate = date ? text.replace(date, "").trim() : text;

        const parts = textWithoutDate.split(/[\u2014\u2013\-—:·|]/);
        const certTitle = parts[0]?.trim() || text;
        const issuerAndDesc = parts.slice(1).join(" — ").trim();

        certList.push({
          id: `imported-cert-${Date.now()}-${Math.random()}`,
          title: certTitle,
          issuer: issuerAndDesc,
          date,
          description: issuerAndDesc,
        });
      }
      if (certList.length > 0) {
        newData.certifications = certList;
        stats.certifications = certList.length;
      }
    }

    // 7. LANGUAGES
    else if (title.includes("language")) {
      const skills = sec.lines.flatMap((line) =>
        line
          .split(/[,•|·;]/)
          .map((s) => s.trim())
          .filter(Boolean)
      );
      if (skills.length > 0) {
        const existing = newData.skillGroups.find((g) => g.name.toLowerCase() === "languages");
        if (existing) {
          existing.skills = [...new Set([...existing.skills, ...skills])];
        } else {
          newData.skillGroups = [
            ...newData.skillGroups,
            {
              id: `imported-lang-${Date.now()}-${Math.random()}`,
              name: "Languages",
              skills,
            },
          ];
        }
      }
    }
  }

  return { data: newData, stats };
}
