import { createBlankResumeData } from "../constants/resume-seed-data";
import type { ResumeData } from "../types/resume";
import {
  cleanText,
  COMMON_ROLE_TITLES,
  compactKey,
  DEGREE_REGEX,
  EMAIL_REGEX,
  HEADLINE_WORDS,
  isNoiseLine,
  LOCATION_REGEX,
  MAX_SKILL_GROUPS,
  MAX_SUMMARY_LENGTH,
  normalizedLines,
  PHONE_REGEX,
  SCHOOL_REGEX,
  sectionKey,
  uniqueText,
  URL_REGEX,
  type ParseStats,
  type SectionKey,
} from "./resume-parser-patterns";
import {
  parseEducation,
  parseSkills,
  parseCertifications,
} from "./resume-education-skills-parser";
import {
  parseExperience,
  parseProjects,
} from "./resume-experience-projects-parser";

export type { ParseStats };

function isContactLine(value: string) {
  return EMAIL_REGEX.test(value) || PHONE_REGEX.test(value) || URL_REGEX.test(value);
}

function titleCaseName(value: string) {
  if (value !== value.toUpperCase()) return value;
  return value
    .toLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (letter) => letter.toUpperCase());
}

function normalizeRoleTitle(value: string) {
  const compact = compactKey(value);
  const knownTitle = COMMON_ROLE_TITLES.find((title) => compactKey(title) === compact);
  return knownTitle ?? cleanText(value, 120);
}

function scoreNameCandidate(value: string, index: number, emailLocal: string) {
  const line = cleanText(value, 100);
  const words = line.split(/\s+/);
  if (line.length < 2 || line.length > 70 || words.length > 5) return -100;
  if (/[\d@]|[,|]/.test(line) || isContactLine(line) || sectionKey(line)) return -100;

  let score = 8 - index * 0.35;
  if (HEADLINE_WORDS.test(line)) score -= 10;
  if (DEGREE_REGEX.test(line) || SCHOOL_REGEX.test(line)) score -= 8;
  if (
    words.every((word) => /^[A-Z][A-Za-z.'-]*$/.test(word) || word === word.toUpperCase())
  ) {
    score += 3;
  }

  const compact = line.toLowerCase().replace(/[^a-z]/g, "");
  if (compact.length > 4 && emailLocal.replace(/[^a-z]/g, "").includes(compact)) score += 8;
  return score;
}

function parseHeader(
  headerLines: string[],
  discoveryLines: string[],
  data: ResumeData
) {
  const headerWindow = uniqueText(headerLines.slice(0, 20));
  const discoveryWindow = uniqueText([...headerWindow, ...discoveryLines.slice(0, 48)]);
  const headerText = headerWindow.join(" | ");
  const email = headerText.match(EMAIL_REGEX)?.[0] ?? "";
  const emailLocal = email.split("@")[0]?.toLowerCase() ?? "";
  const candidates = discoveryWindow.slice(0, 36).map(normalizeRoleTitle);
  const scored = candidates
    .map((line, index) => ({ line, score: scoreNameCandidate(line, index, emailLocal) }))
    .sort((left, right) => right.score - left.score);
  const name = scored[0]?.score > 0 ? scored[0].line : "";

  data.basics.fullName = titleCaseName(cleanText(name, 100));
  data.basics.email = email;
  data.basics.phone = cleanText(headerText.match(PHONE_REGEX)?.[0] ?? "", 50);

  const tokens = headerWindow.flatMap((line) => line.split(/\s+(?:\||\u00b7|\u2022)\s+/));
  const linkedin = tokens.find((token) => /linkedin\.com\/in\//i.test(token));
  const github = tokens.find((token) => /github\.com\//i.test(token));
  const website = tokens.find(
    (token) =>
      URL_REGEX.test(token) &&
      !/linkedin\.com|github\.com/i.test(token) &&
      !EMAIL_REGEX.test(token)
  );
  const location = tokens.find(
    (token) =>
      LOCATION_REGEX.test(token.trim()) && !isContactLine(token) && token.trim() !== name
  );

  data.basics.linkedin = cleanText(linkedin?.match(URL_REGEX)?.[0] ?? "", 220).replace(
    /^https?:\/\/(?:www\.)?/i,
    ""
  );
  data.basics.github = cleanText(github?.match(URL_REGEX)?.[0] ?? "", 220).replace(
    /^https?:\/\/(?:www\.)?/i,
    ""
  );
  data.basics.website = cleanText(website?.match(URL_REGEX)?.[0] ?? "", 220).replace(
    /^https?:\/\/(?:www\.)?/i,
    ""
  );
  data.basics.location = cleanText(location ?? "", 100);

  const headline = candidates
    .filter((line) => line !== name && !isContactLine(line) && !sectionKey(line))
    .sort(
      (left, right) => Number(HEADLINE_WORDS.test(right)) - Number(HEADLINE_WORDS.test(left))
    )[0];
  data.basics.headline = normalizeRoleTitle(headline ?? "");

  return {
    repeatedHeaderValues: new Set(
      [data.basics.fullName, data.basics.headline]
        .map((value) => compactKey(value))
        .filter((value) => value.length >= 4)
    ),
  };
}

function splitSections(lines: string[]) {
  const header: string[] = [];
  const sections = new Map<SectionKey, string[]>();
  let active: SectionKey | null = null;

  for (const line of lines) {
    const nextSection = sectionKey(line);
    if (nextSection) {
      active = nextSection;
      if (!sections.has(active)) sections.set(active, []);
      continue;
    }

    if (!active) header.push(line);
    else sections.get(active)?.push(line);
  }

  return { header, sections };
}

function sanitizeSectionLines(lines: string[], repeatedHeaderValues: Set<string>) {
  return lines.filter((line) => {
    if (isNoiseLine(line) || EMAIL_REGEX.test(line) || PHONE_REGEX.test(line)) return false;
    const compact = compactKey(line);
    return !repeatedHeaderValues.has(compact);
  });
}

export function parseResumeText(
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
  const lines = normalizedLines(rawText);
  if (!lines.length) return { data: currentData, stats: emptyStats };

  const { header, sections } = splitSections(lines);
  const data = createBlankResumeData();
  const { repeatedHeaderValues } = parseHeader(header, lines, data);
  const getLines = (key: SectionKey) =>
    sanitizeSectionLines(sections.get(key) ?? [], repeatedHeaderValues);

  const summaryLines = getLines("summary");
  data.basics.summary = cleanText(uniqueText(summaryLines).join(" "), MAX_SUMMARY_LENGTH);
  data.experience = parseExperience(getLines("experience"));
  data.education = parseEducation(getLines("education"));
  data.projects = parseProjects(getLines("projects"));
  data.skillGroups = parseSkills(getLines("skills"));

  const languageLines = getLines("languages");
  if (languageLines.length) {
    data.skillGroups.push(...parseSkills(languageLines, "Languages"));
  }
  data.skillGroups = data.skillGroups.slice(0, MAX_SKILL_GROUPS);
  data.certifications = parseCertifications(getLines("certifications"));

  if (!sections.size) {
    const fallback = header.filter(
      (line) =>
        compactKey(line) !== compactKey(data.basics.fullName) &&
        compactKey(line) !== compactKey(data.basics.headline) &&
        !isContactLine(line)
    );
    data.basics.summary = cleanText(uniqueText(fallback).join(" "), MAX_SUMMARY_LENGTH);
  }

  const stats: ParseStats = {
    experiences: data.experience.length,
    education: data.education.length,
    projects: data.projects.length,
    skills: data.skillGroups.reduce((total, group) => total + group.skills.length, 0),
    certifications: data.certifications.length,
  };

  return { data, stats };
}
