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
  /^(Standardized|Built|Engineered|Developed|Partnered|Created|Managed|Led|Designed|Implemented|Analyzed|Produced|Found|Joined|Spearheaded|Architected|Optimized|Increased|Reduced|Decreased|Expanded|Delivered|Formulated|Collaborated|Directed|Established|Maintained|Automated|Executed|Researched|Transformed|Calculated|Assisted|Provided|Achieved|Supported|Drafted|Authored|Extracted|Processed|Accelerated|Pioneered|Orchestrated|Fostered)\b/i;

export function parseExtractedResumeText(rawText: string, currentData: ResumeData): ResumeData {
  if (!rawText || !rawText.trim()) return currentData;

  const cleanedRaw = collapseSpacedLetters(
    rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  );

  const lines = cleanedRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return currentData;

  const newData: ResumeData = JSON.parse(JSON.stringify(currentData));

  // Extract Email, Phone, Website, Location from global text
  const fullText = lines.join(" ");
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) newData.basics.email = emailMatch[0];

  const phoneMatch = fullText.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  if (phoneMatch) newData.basics.phone = phoneMatch[0];

  const linkedinMatch = fullText.match(/(?:linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) newData.basics.website = `https://${linkedinMatch[0]}`;

  const locationMatch = fullText.match(/(?:New Delhi|Delhi|Mumbai|Bangalore|San Francisco|New York|London|Tokyo|Remote|[A-Z][a-z]+,\s*[A-Z][a-z]+)/);
  if (locationMatch) newData.basics.location = locationMatch[0];

  // Extract Full Name from line 0
  if (lines[0] && lines[0].length < 40 && !lines[0].includes("@")) {
    newData.basics.fullName = lines[0];
  }

  // Extract Headline/Title from line 1
  if (lines[1] && lines[1].length < 50 && !lines[1].includes("@") && !lines[1].match(/phone|email|linkedin/i)) {
    newData.basics.headline = lines[1];
  }

  // Identify Section Headers
  const sections: { title: string; lines: string[] }[] = [];
  let currentSection: { title: string; lines: string[] } = { title: "header", lines: [] };

  const isSectionHeader = (line: string) => {
    const cleaned = line.toLowerCase().replace(/[^a-z]/g, "");
    return /^(summary|profile|about|objective|experience|workexperience|employment|workhistory|education|academic|academics|projects|keyprojects|skills|technicalskills|expertise|certifications|awards|certification)$/.test(
      cleaned
    );
  };

  for (const line of lines) {
    if (isSectionHeader(line)) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { title: line.toLowerCase(), lines: [] };
    } else {
      currentSection.lines.push(line);
    }
  }
  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  // Process Each Section
  for (const sec of sections) {
    const title = sec.title.replace(/[^a-z]/g, "");

    // 1. SUMMARY / PROFILE
    if (title.includes("summary") || title.includes("profile") || title.includes("about") || title.includes("objective")) {
      newData.basics.summary = sec.lines.join(" ");
    }

    // 2. EXPERIENCE
    else if (title.includes("experience") || title.includes("employment") || title.includes("work")) {
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

          let titleText = line.replace(dateStr, "").trim();
          let roleStr = titleText;
          let companyStr = "";
          let locStr = "";

          // Check if next line contains company / location info
          if (i + 1 < sec.lines.length && !BULLET_START_REGEX.test(sec.lines[i + 1]) && !ACTION_VERB_REGEX.test(sec.lines[i + 1]) && !sec.lines[i + 1].match(DATE_RANGE_REGEX)) {
            const companyLine = sec.lines[i + 1];
            i++;
            const compParts = companyLine.split(/[·•|-]/);
            companyStr = compParts[0]?.trim() || companyLine;
            if (compParts.length > 1) {
              locStr = compParts.slice(1).join(" · ").trim();
            }
          }

          currentExp = {
            id: `imported-exp-${Date.now()}-${Math.random()}`,
            role: roleStr || "Position",
            company: companyStr,
            location: locStr,
            startDate,
            endDate,
            current: /present|current/i.test(endDate),
            highlights: [],
          };
        } else {
          // Non-bullet, non-date line: start of new role title or company
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
            const parts = line.split(/[·•|-]/);
            currentExp.company = parts[0]?.trim() || line;
            if (parts.length > 1) {
              currentExp.location = parts.slice(1).join(" · ").trim();
            }
          }
        }
      }
      if (currentExp) expList.push(currentExp);
      if (expList.length > 0) newData.experience = expList;
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

          const parts = name.split(/[:·•|-]/);
          name = parts[0]?.trim() || name;
          const desc = parts.length > 1 ? parts.slice(1).join(" · ").trim() : "";

          currentProj = {
            id: `imported-proj-${Date.now()}-${Math.random()}`,
            name,
            description: desc,
            link: "",
            date,
            highlights: [],
          };
        }
      }
      if (currentProj) projList.push(currentProj);
      if (projList.length > 0) newData.projects = projList;
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
          const parts = line.split(/[,·•|-]/);
          currentEdu.school = parts[0]?.trim() || line;
          if (parts.length > 1) {
            currentEdu.location = parts.slice(1).join(", ").trim();
          }
        } else if (currentEdu && line.match(/cgpa|gpa|marks|grade|distinction|first-year|final-year/i)) {
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
      if (eduList.length > 0) newData.education = eduList;
    }

    // 5. SKILLS
    else if (title.includes("skill") || title.includes("competencies") || title.includes("expertise")) {
      const skillGroups: ResumeSkillGroup[] = [];

      for (const line of sec.lines) {
        if (line.includes(":")) {
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
          const skills = line
            .split(/[,•|·;]/)
            .map((s) => s.trim())
            .filter(Boolean);
          if (skills.length > 0) {
            skillGroups.push({
              id: `imported-skill-${Date.now()}-${Math.random()}`,
              name: "Core Skills",
              skills,
            });
          }
        }
      }
      if (skillGroups.length > 0) newData.skillGroups = skillGroups;
    }

    // 6. CERTIFICATIONS & AWARDS
    else if (title.includes("certification") || title.includes("award") || title.includes("license")) {
      const certList: ResumeCertification[] = [];

      for (const line of sec.lines) {
        const text = line.replace(BULLET_START_REGEX, "").trim();
        if (!text) continue;

        const parts = text.split(/[\u2014\u2013\-—:]/);
        const title = parts[0]?.trim() || text;
        const issuerAndDesc = parts.slice(1).join(" — ").trim();

        certList.push({
          id: `imported-cert-${Date.now()}-${Math.random()}`,
          title,
          issuer: issuerAndDesc,
          date: "",
          description: issuerAndDesc,
        });
      }
      if (certList.length > 0) newData.certifications = certList;
    }
  }

  return newData;
}
