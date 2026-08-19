import type { ResumeExperience, ResumeProject } from "../types/resume";
import {
  ACTION_VERB_REGEX,
  BULLET_START_REGEX,
  cleanText,
  DATE_RANGE_REGEX,
  EMAIL_REGEX,
  isNoiseLine,
  LOCATION_REGEX,
  MAX_EXPERIENCES,
  MAX_HIGHLIGHT_LENGTH,
  MAX_PROJECTS,
  MAX_SHORT_FIELD_LENGTH,
  uniqueText,
  URL_REGEX,
  type DateRange,
} from "./resume-parser-patterns";

export function stripBullet(value: string) {
  return cleanText(value.replace(BULLET_START_REGEX, ""), MAX_HIGHLIGHT_LENGTH);
}

export function isBullet(value: string) {
  return BULLET_START_REGEX.test(value);
}

export function looksLikeSentence(value: string) {
  const line = stripBullet(value);
  const wordCount = line.split(/\s+/).filter((word) => /[a-z0-9]/i.test(word)).length;
  return ACTION_VERB_REGEX.test(line) || wordCount >= 9 || /[.!?]$/.test(line);
}

export function looksLikeTitle(value: string) {
  const line = cleanText(value, MAX_SHORT_FIELD_LENGTH);
  const words = line.split(/\s+/);
  return (
    line.length <= MAX_SHORT_FIELD_LENGTH &&
    words.length <= 14 &&
    !looksLikeSentence(line) &&
    !EMAIL_REGEX.test(line) &&
    !URL_REGEX.test(line) &&
    !LOCATION_REGEX.test(line)
  );
}

export function parseDateRange(value: string): DateRange | null {
  const match = value.match(DATE_RANGE_REGEX);
  if (!match) return null;
  const parts = match[0].split(/\s*(?:[\u2013\u2014-]|to)\s*/i);
  const endDate = cleanText(parts[1] ?? "", 40);
  return {
    raw: match[0],
    startDate: cleanText(parts[0] ?? "", 40),
    endDate,
    current: /present|current|now/i.test(endDate),
  };
}

export function splitEntryHeader(value: string, date?: DateRange | null) {
  const withoutDate = cleanText(
    value
      .replace(date?.raw ?? "", "")
      .replace(/[()[\]]/g, " ")
      .replace(/\s*[|\u00b7]\s*$/, ""),
    MAX_SHORT_FIELD_LENGTH * 2
  );
  return withoutDate
    .split(/\s+(?:\||\u00b7|@)\s+/)
    .map((part) => cleanText(part, MAX_SHORT_FIELD_LENGTH))
    .filter(Boolean);
}

export function splitProjectHeader(value: string, date?: DateRange | null) {
  const url = value.match(URL_REGEX)?.[0] ?? "";
  const withoutDate = cleanText(
    value
      .replace(date?.raw ?? "", "")
      .replace(url, "")
      .replace(/[()[\]]/g, " "),
    MAX_SHORT_FIELD_LENGTH * 2
  );
  return withoutDate
    .split(/\s+(?:\||\u00b7|\u2013|\u2014)\s+/)
    .map((part, index) =>
      cleanText(part, index === 0 ? MAX_SHORT_FIELD_LENGTH : MAX_HIGHLIGHT_LENGTH)
    )
    .filter(Boolean);
}

export function addHighlight(target: string[], value: string) {
  const text = stripBullet(value);
  if (!text || isNoiseLine(text)) return;
  if (target.some((item) => item.toLowerCase() === text.toLowerCase())) return;
  target.push(text);
}

export function mergeWrappedHighlights(values: string[]) {
  const merged: string[] = [];
  for (const value of values) {
    const startsNewBullet = isBullet(value);
    const text = stripBullet(value);
    const previousIndex = merged.length - 1;
    const isContinuation =
      !startsNewBullet &&
      previousIndex >= 0 &&
      (/^[a-z]/.test(text) ||
        (!ACTION_VERB_REGEX.test(text) && text.split(/\s+/).length <= 4));
    if (isContinuation) {
      merged[previousIndex] = cleanText(
        `${merged[previousIndex]} ${text}`,
        MAX_HIGHLIGHT_LENGTH
      );
    } else if (text) {
      merged.push(text);
    }
  }
  return merged;
}

export function addProjectHighlight(project: ResumeProject, value: string) {
  const text = stripBullet(value);
  const fingerprint = (candidate: string) =>
    candidate.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const tokens = (candidate: string) =>
    new Set(fingerprint(candidate).split(" ").filter((token) => token.length > 2));
  const nearDuplicate = (left: string, right: string) => {
    const leftTokens = tokens(left);
    const rightTokens = tokens(right);
    const smallerSize = Math.min(leftTokens.size, rightTokens.size);
    if (smallerSize < 6) return false;
    const overlap = [...leftTokens].filter((token) => rightTokens.has(token)).length;
    return overlap / smallerSize >= 0.8;
  };
  const existingContent = [project.description, ...project.highlights].filter(Boolean);
  if (
    !text ||
    fingerprint(text) === fingerprint(project.description) ||
    existingContent.some((existing) => nearDuplicate(existing, text)) ||
    isNoiseLine(text)
  ) {
    return;
  }
  addHighlight(project.highlights, text);
}

export function makeId(prefix: string, index: number) {
  return `imported-${prefix}-${Date.now()}-${index}`;
}

export function parseExperience(lines: string[]) {
  const entries: ResumeExperience[] = [];
  let current: ResumeExperience | null = null;
  let pendingDate: DateRange | null = null;

  const commit = () => {
    if (!current) return;
    current.role = cleanText(current.role || "Position", MAX_SHORT_FIELD_LENGTH);
    current.company = cleanText(current.company, MAX_SHORT_FIELD_LENGTH);
    current.location = cleanText(current.location, 100);
    current.highlights = uniqueText(mergeWrappedHighlights(current.highlights)).slice(0, 10);
    if (current.role || current.company || current.highlights.length) entries.push(current);
    current = null;
  };

  for (const originalLine of lines) {
    const line = cleanText(originalLine);
    if (isNoiseLine(line)) continue;
    const date = parseDateRange(line);

    if (isBullet(line) || (current && ACTION_VERB_REGEX.test(stripBullet(line)))) {
      if (current) addHighlight(current.highlights, line);
      continue;
    }

    if (date) {
      const parts = splitEntryHeader(line, date);
      if (parts.length) {
        commit();
        current = {
          id: makeId("experience", entries.length),
          role: parts[0] || "Position",
          company: parts[1] || "",
          location: parts.slice(2).join(" · "),
          startDate: date.startDate,
          endDate: date.endDate,
          current: date.current,
          highlights: [],
        };
      } else if (current) {
        current.startDate = date.startDate;
        current.endDate = date.endDate;
        current.current = date.current;
      } else {
        pendingDate = date;
      }
      continue;
    }

    if (current && LOCATION_REGEX.test(line) && !current.location) {
      current.location = line;
      continue;
    }

    if (current && looksLikeSentence(line)) {
      addHighlight(current.highlights, line);
      continue;
    }

    if (!current) {
      current = {
        id: makeId("experience", entries.length),
        role: cleanText(line, MAX_SHORT_FIELD_LENGTH),
        company: "",
        location: "",
        startDate: "",
        endDate: pendingDate?.endDate ?? "",
        current: pendingDate?.current ?? false,
        highlights: [],
      };
      current.startDate = pendingDate?.startDate ?? "";
      pendingDate = null;
    } else if (!current.company && looksLikeTitle(line)) {
      const parts = splitEntryHeader(line);
      current.company = parts[0] ?? line;
      current.location = parts.slice(1).join(" · ");
    } else if (looksLikeTitle(line)) {
      commit();
      current = {
        id: makeId("experience", entries.length),
        role: cleanText(line, MAX_SHORT_FIELD_LENGTH),
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        highlights: [],
      };
    } else {
      addHighlight(current.highlights, line);
    }
  }

  commit();
  return entries.slice(0, MAX_EXPERIENCES);
}

export function parseProjects(lines: string[]) {
  const entries: ResumeProject[] = [];
  let current: ResumeProject | null = null;

  const commit = () => {
    if (!current) return;
    current.name = cleanText(current.name || "Project", MAX_SHORT_FIELD_LENGTH);
    current.description = cleanText(current.description, MAX_HIGHLIGHT_LENGTH);
    current.highlights = mergeWrappedHighlights(current.highlights).slice(0, 10);
    if (current.name || current.description || current.highlights.length) entries.push(current);
    current = null;
  };

  const createProject = (line: string, date: DateRange | null = null): ResumeProject => {
    const parts = splitProjectHeader(line, date);
    const link = line.match(URL_REGEX)?.[0] ?? "";
    return {
      id: makeId("project", entries.length),
      name: parts[0] || "Project",
      description: parts.slice(1).join(" · "),
      link: cleanText(link, 220).replace(/^https?:\/\/(?:www\.)?/i, ""),
      date: date?.raw ?? "",
      highlights: [],
    };
  };

  for (const originalLine of lines) {
    const line = cleanText(originalLine);
    if (isNoiseLine(line)) continue;
    const date = parseDateRange(line);

    if (isBullet(line)) {
      const highlight = stripBullet(line);
      if (current && highlight) current.highlights.push(line);
      continue;
    }

    if (current && ACTION_VERB_REGEX.test(stripBullet(line))) {
      addProjectHighlight(current, line);
      continue;
    }

    const url = line.match(URL_REGEX)?.[0];
    if (url && line.replace(url, "").trim().length < 8 && current) {
      current.link = cleanText(url, 220);
      continue;
    }

    if (!current) {
      current =
        !date && looksLikeSentence(line)
          ? {
              id: makeId("project", entries.length),
              name: "Imported project",
              description: stripBullet(line),
              link: "",
              date: "",
              highlights: [],
            }
          : createProject(line, date);
      continue;
    }

    if (date) {
      commit();
      current = createProject(line, date);
      continue;
    }

    const inlineHeaderParts = splitProjectHeader(line);
    if (
      current.highlights.length > 0 &&
      /\s[|\u00b7]\s/.test(line) &&
      inlineHeaderParts.length >= 2 &&
      inlineHeaderParts[0].split(/\s+/).length <= 8
    ) {
      commit();
      current = createProject(line);
      continue;
    }

    const strippedLine = stripBullet(line);
    const startsNewThought = isBullet(line) || ACTION_VERB_REGEX.test(strippedLine);
    const lastHighlightIndex = current.highlights.length - 1;
    if (
      !startsNewThought &&
      lastHighlightIndex >= 0 &&
      !/[.!?]$/.test(current.highlights[lastHighlightIndex])
    ) {
      current.highlights[lastHighlightIndex] = cleanText(
        `${current.highlights[lastHighlightIndex]} ${strippedLine}`,
        MAX_HIGHLIGHT_LENGTH
      );
      continue;
    }

    if (
      !startsNewThought &&
      current.description &&
      !/[.!?]$/.test(current.description)
    ) {
      current.description = cleanText(
        `${current.description} ${strippedLine}`,
        MAX_HIGHLIGHT_LENGTH
      );
      continue;
    }

    if (looksLikeSentence(line)) {
      if (!current.description) current.description = stripBullet(line);
      else addProjectHighlight(current, line);
      continue;
    }

    if (looksLikeTitle(line) && /^[A-Z0-9]/.test(line)) {
      commit();
      current = createProject(line, date);
      continue;
    }

    addProjectHighlight(current, line);
  }

  commit();
  return entries.slice(0, MAX_PROJECTS);
}
