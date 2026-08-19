import type {
  ResumeCertification,
  ResumeEducation,
  ResumeSkillGroup,
} from "../types/resume";
import {
  cleanText,
  DEGREE_REGEX,
  isNoiseLine,
  LOCATION_REGEX,
  MAX_CERTIFICATIONS,
  MAX_EDUCATION,
  MAX_HIGHLIGHT_LENGTH,
  MAX_SHORT_FIELD_LENGTH,
  MAX_SKILL_GROUPS,
  MAX_SKILLS_PER_GROUP,
  SCHOOL_REGEX,
  uniqueText,
  type DateRange,
} from "./resume-parser-patterns";
import {
  looksLikeSentence,
  makeId,
  parseDateRange,
  splitEntryHeader,
  stripBullet,
} from "./resume-experience-projects-parser";

export function parseEducation(lines: string[]) {
  const entries: ResumeEducation[] = [];
  let current: ResumeEducation | null = null;

  const commit = () => {
    if (!current) return;
    current.degree = cleanText(current.degree || "Qualification", MAX_SHORT_FIELD_LENGTH);
    current.school = cleanText(current.school, MAX_SHORT_FIELD_LENGTH);
    current.details = cleanText(current.details, MAX_HIGHLIGHT_LENGTH);
    if (current.degree || current.school) entries.push(current);
    current = null;
  };

  const createEducation = (line: string, date: DateRange | null = null): ResumeEducation => {
    const parts = splitEntryHeader(line, date);
    return {
      id: makeId("education", entries.length),
      degree: parts[0] || cleanText(line, MAX_SHORT_FIELD_LENGTH),
      school: parts[1] || "",
      location: parts.slice(2).join(", "),
      startDate: date?.startDate ?? "",
      endDate: date?.endDate ?? "",
      details: "",
    };
  };

  for (const originalLine of lines) {
    const line = cleanText(originalLine);
    if (isNoiseLine(line)) continue;
    const date = parseDateRange(line);

    if (!current) {
      current = createEducation(line, date);
      continue;
    }

    if (date && (DEGREE_REGEX.test(line) || splitEntryHeader(line, date).length > 1)) {
      commit();
      current = createEducation(line, date);
    } else if (date) {
      current.startDate = date.startDate;
      current.endDate = date.endDate;
    } else if (SCHOOL_REGEX.test(line) && !current.school) {
      const [schoolAndLocation, ...detailParts] = line.split(/\s+\|\s+/);
      const schoolParts = schoolAndLocation.split(/,\s*/);
      current.school = cleanText(schoolParts[0] ?? line, MAX_SHORT_FIELD_LENGTH);
      current.location = cleanText(schoolParts.slice(1).join(", "), 100);
      if (detailParts.length) {
        current.details = cleanText(detailParts.join(" · "), MAX_HIGHLIGHT_LENGTH);
      }
    } else if (LOCATION_REGEX.test(line) && !current.location) {
      current.location = line;
    } else if (DEGREE_REGEX.test(line) && (current.school || current.details)) {
      commit();
      current = createEducation(line, date);
    } else {
      current.details = cleanText(
        [current.details, stripBullet(line)].filter(Boolean).join(" · "),
        MAX_HIGHLIGHT_LENGTH
      );
    }
  }

  commit();
  return entries.slice(0, MAX_EDUCATION);
}

export function parseSkills(lines: string[], defaultName = "Core Skills") {
  const groups = new Map<string, ResumeSkillGroup>();

  const addSkills = (name: string, values: string[]) => {
    const cleanName = cleanText(name || defaultName, 80);
    const skills = uniqueText(
      values
        .flatMap((value) => value.split(/[,;|\u00b7\u2022]/))
        .map((value) => cleanText(value, 80))
        .filter((value) => value && !looksLikeSentence(value) && !isNoiseLine(value))
    ).slice(0, MAX_SKILLS_PER_GROUP);
    if (!skills.length) return;

    const key = cleanName.toLowerCase();
    const existing = groups.get(key);
    if (existing) {
      existing.skills = uniqueText([...existing.skills, ...skills]).slice(
        0,
        MAX_SKILLS_PER_GROUP
      );
    } else if (groups.size < MAX_SKILL_GROUPS) {
      groups.set(key, {
        id: makeId("skills", groups.size),
        name: cleanName,
        skills,
      });
    }
  };

  for (const originalLine of lines) {
    const line = stripBullet(originalLine);
    if (!line || isNoiseLine(line)) continue;
    const separator = line.indexOf(":");
    if (separator > 0 && separator < 80) {
      addSkills(line.slice(0, separator), [line.slice(separator + 1)]);
    } else {
      addSkills(defaultName, [line]);
    }
  }

  return [...groups.values()];
}

export function parseCertifications(lines: string[]) {
  const entries: ResumeCertification[] = [];

  for (const originalLine of lines) {
    const line = stripBullet(originalLine);
    if (!line || isNoiseLine(line)) continue;
    const year = line.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? "";
    const withoutDate = cleanText(
      line.replace(year, "").replace(/\(\s*\)/g, ""),
      MAX_HIGHLIGHT_LENGTH
    );
    const isStructuredEntry = Boolean(year) && /\s[\u2013\u2014-]\s|:\s/.test(line);
    if (!isStructuredEntry && looksLikeSentence(line) && entries.length) {
      const previous = entries[entries.length - 1];
      previous.description = cleanText(
        [previous.description, line].filter(Boolean).join(" "),
        MAX_HIGHLIGHT_LENGTH
      );
      continue;
    }

    const colonIndex = withoutDate.indexOf(":");
    const dashSegments = withoutDate
      .split(/\s*(?:[\u2013\u2014-]|\s\|\s)\s*/)
      .map((part) => cleanText(part, MAX_SHORT_FIELD_LENGTH))
      .filter(Boolean);

    let title = "";
    let issuer = "";
    let description = "";

    if (dashSegments.length >= 2) {
      issuer = dashSegments[dashSegments.length - 1] ?? "";
      title = dashSegments.slice(0, -1).join(" — ");
    } else if (colonIndex > 0) {
      title = cleanText(withoutDate.slice(0, colonIndex), MAX_SHORT_FIELD_LENGTH);
      description = cleanText(withoutDate.slice(colonIndex + 1), MAX_HIGHLIGHT_LENGTH);
    } else {
      title = cleanText(withoutDate, MAX_SHORT_FIELD_LENGTH);
    }

    if (!title) continue;

    entries.push({
      id: makeId("certification", entries.length),
      title,
      issuer,
      date: year,
      description,
    });
  }

  return entries.slice(0, MAX_CERTIFICATIONS);
}
