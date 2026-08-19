export interface ParseStats {
  experiences: number;
  education: number;
  projects: number;
  skills: number;
  certifications: number;
}

export type SectionKey =
  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "certifications"
  | "languages";

export interface DateRange {
  raw: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export const MAX_LINE_LENGTH = 700;
export const MAX_SUMMARY_LENGTH = 900;
export const MAX_HIGHLIGHT_LENGTH = 1200;
export const MAX_SHORT_FIELD_LENGTH = 180;
export const MAX_EXPERIENCES = 12;
export const MAX_PROJECTS = 12;
export const MAX_EDUCATION = 8;
export const MAX_CERTIFICATIONS = 16;
export const MAX_SKILL_GROUPS = 10;
export const MAX_SKILLS_PER_GROUP = 24;

export const BULLET_START_REGEX =
  /^(?:(?:[\u2022\u25cf\u2013\u2014*+>\u2043\u25aa\u25ab-])\s*|o\s+)/;
export const ACTION_VERB_REGEX =
  /^(achieved|accelerated|analyzed|architected|authored|automated|built|calculated|collaborated|configured|coordinated|created|decreased|delivered|deployed|designed|developed|diagnosed|directed|discovered|drafted|engineered|enhanced|established|executed|expanded|facilitated|formulated|fostered|found|identified|implemented|improved|increased|integrated|joined|launched|led|maintained|managed|mentored|migrated|monitored|negotiated|optimized|orchestrated|partnered|pioneered|presented|processed|produced|provided|reduced|refactored|researched|resolved|reviewed|scaled|spearheaded|standardized|streamlined|supported|tested|trained|transformed|uncovered)\b/i;
export const DATE_RANGE_REGEX =
  /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+)?(?:19|20)\d{2}\s*(?:[\u2013\u2014-]|to)\s*(?:(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+)?(?:19|20)\d{2}|present|current|now)/i;
export const EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
export const PHONE_REGEX =
  /(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,5}[\s.-]\d{3,5}(?:[\s.-]\d{2,4})?/;
export const URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:\/[^\s|,;]*)?/i;
export const HEADLINE_WORDS =
  /\b(analyst|architect|consultant|coordinator|designer|developer|director|engineer|executive|founder|intern|lead|leader|manager|marketing|operations|product|program|researcher|sales|scientist|specialist|strategist|student|technician)\b/i;
export const COMMON_ROLE_TITLES = [
  "Data Analyst",
  "Business Analyst",
  "Financial Analyst",
  "Software Developer",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Full Stack Engineer",
  "Product Manager",
  "Program Manager",
  "Project Manager",
  "Marketing Manager",
  "Sales Manager",
  "Operations Manager",
  "UX Designer",
  "UI Designer",
];
export const DEGREE_REGEX =
  /\b(b\.?a\.?|b\.?s\.?|bba|bca|bcom|b\.tech|btech|bachelor|m\.?a\.?|m\.?s\.?|mba|mca|m\.tech|master|ph\.?d\.?|doctorate|diploma|associate|degree|certificate)\b/i;
export const SCHOOL_REGEX = /\b(university|college|school|institute|academy|polytechnic)\b/i;
export const LOCATION_REGEX =
  /^(?:remote|hybrid|on-site|onsite|[a-z][a-z .'-]+,\s*[a-z][a-z .'-]+)$/i;
export const PAGE_ARTIFACT_REGEX =
  /^(?:page\s*)?\d+\s*(?:of|\/)\s*\d+$|^(?:resuvee|resulyra)(?:\s*[|\u00b7.-].*)?$/i;
export const PLACEHOLDER_REGEX =
  /^(?:your name|resume|company|school|degree|project name|position|job title|add (?:details|description))$/i;

export const SECTION_ALIASES: Array<[SectionKey, RegExp]> = [
  [
    "summary",
    /^(?:professional|career|executive|personal)?(?:summary|profile|objective|aboutme)$/,
  ],
  [
    "experience",
    /^(?:professional|relevant|work)?(?:experience|employment|employmenthistory|workhistory|careerhistory)$/,
  ],
  [
    "education",
    /^(?:education|academic|academics|academicbackground|academicqualifications|qualifications)$/,
  ],
  [
    "projects",
    /^(?:selected|key|personal|opensource|featured)?projects?(?:andportfolio)?$/,
  ],
  [
    "skills",
    /^(?:(?:technical|professional|core|key|soft)?(?:skills|expertise|competencies|technologies|tools|techstack|coretechnologies)(?:andexpertise)?|transferablestrengths)$/,
  ],
  [
    "certifications",
    /^(?:awards?|certifications?|licenses?|honors?|achievements?|accomplishments?|courses?)(?:and(?:awards?|certifications?|honors?))?$/,
  ],
  ["languages", /^(?:languages?|languageskills)$/],
];

export function compactKey(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z]/g, "");
}

export function sectionKey(value: string): SectionKey | null {
  const key = compactKey(value);
  for (const [section, pattern] of SECTION_ALIASES) {
    if (pattern.test(key)) return section;
  }
  return null;
}

export function collapseRepeatedSequence(value: string) {
  const text = value.trim();
  if (text.length < 60) return text;

  const searchLimit = Math.min(260, Math.floor(text.length / 3));
  for (let size = 20; size <= searchLimit; size += 1) {
    const phrase = text.slice(0, size);
    if (text.startsWith(phrase, size) && text.startsWith(phrase, size * 2)) {
      return phrase.trim();
    }
  }
  return text;
}

export function truncateAtWord(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const sliced = value.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  return (lastSpace > maxLength * 0.65 ? sliced.slice(0, lastSpace) : sliced).trim();
}

export function collapseRepeatedActionText(value: string) {
  if (value.length < 110) return value;
  const firstWord = value.match(/^([A-Za-z]+)/)?.[1];
  if (!firstWord || !ACTION_VERB_REGEX.test(value)) return value;
  const repeatedAt = value.toLowerCase().indexOf(firstWord.toLowerCase(), firstWord.length + 28);
  if (repeatedAt < 0) return value;
  return value.slice(0, repeatedAt).replace(/[,(\s]+$/, "").trim();
}

export function cleanText(value: string, maxLength = MAX_LINE_LENGTH) {
  const normalized = value
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u200b-\u200d\ufeff]/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
  return truncateAtWord(
    collapseRepeatedActionText(collapseRepeatedSequence(normalized)),
    maxLength
  );
}

export function isNoiseLine(value: string) {
  const line = cleanText(value);
  const compactPageLabel = line.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (
    !line ||
    PAGE_ARTIFACT_REGEX.test(line) ||
    /page\d+of\d+/.test(compactPageLabel) ||
    PLACEHOLDER_REGEX.test(line)
  ) {
    return true;
  }
  if (/^[|_=.\-\u2013\u2014\s]{3,}$/.test(line)) return true;

  const compact = line.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (compact.length >= 22 && new Set(compact).size <= 3) return true;
  return false;
}

export function normalizedLines(rawText: string) {
  const result: string[] = [];
  let previous = "";

  for (const rawLine of rawText.replace(/\r\n?/g, "\n").split("\n")) {
    const line = cleanText(rawLine);
    if (isNoiseLine(line)) continue;
    const fingerprint = line.toLowerCase().replace(/\s+/g, " ");
    if (fingerprint === previous) continue;
    previous = fingerprint;
    result.push(line);
  }

  return result;
}

export function uniqueText(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
