import { createBlankResumeData } from "../constants/resume-seed-data";
import type { ResumeData } from "../types/resume";

export const DOCX_RESUME_DATA_PROPERTY = "ResulyraResumeData";
export const DOCX_RESUME_SCHEMA_PROPERTY = "ResulyraResumeSchema";
export const DOCX_RESUME_SCHEMA_VERSION = 1;

const MAX_EMBEDDED_PAYLOAD_LENGTH = 2_000_000;

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function text(value: unknown, maxLength = 10_000) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

function boolean(value: unknown) {
  return value === true;
}

function textArray(value: unknown, maxItems = 30) {
  return Array.isArray(value)
    ? value
        .slice(0, maxItems)
        .map((item) => text(item))
        .filter(Boolean)
    : [];
}

function stringRecord(value: unknown) {
  return Object.fromEntries(
    Object.entries(record(value))
      .slice(0, 40)
      .map(([key, item]) => [text(key, 100), text(item, 500)])
      .filter(([key]) => Boolean(key))
  );
}

export function createDocxResumePayload(data: ResumeData) {
  return JSON.stringify({ version: DOCX_RESUME_SCHEMA_VERSION, data });
}

export function parseDocxResumePayload(payload: string): ResumeData | null {
  if (!payload || payload.length > MAX_EMBEDDED_PAYLOAD_LENGTH) return null;

  try {
    const envelope = record(JSON.parse(payload));
    if (envelope.version !== DOCX_RESUME_SCHEMA_VERSION) return null;
    const source = record(envelope.data);
    const sourceBasics = record(source.basics);
    if (!Object.keys(sourceBasics).length) return null;

    const blank = createBlankResumeData();
    const customLinks = Array.isArray(sourceBasics.customLinks)
      ? sourceBasics.customLinks.slice(0, 30).map((item, index) => {
          const link = record(item);
          return {
            id: text(link.id, 120) || `docx-link-${index}`,
            icon: text(link.icon, 80),
            label: text(link.label, 300),
            url: text(link.url, 1_000),
          };
        })
      : [];

    const experience = Array.isArray(source.experience)
      ? source.experience.slice(0, 30).map((item, index) => {
          const entry = record(item);
          return {
            id: text(entry.id, 120) || `docx-experience-${index}`,
            role: text(entry.role, 500),
            company: text(entry.company, 500),
            location: text(entry.location, 500),
            startDate: text(entry.startDate, 100),
            endDate: text(entry.endDate, 100),
            current: boolean(entry.current),
            highlights: textArray(entry.highlights),
          };
        })
      : [];

    const education = Array.isArray(source.education)
      ? source.education.slice(0, 20).map((item, index) => {
          const entry = record(item);
          return {
            id: text(entry.id, 120) || `docx-education-${index}`,
            degree: text(entry.degree, 500),
            school: text(entry.school, 500),
            location: text(entry.location, 500),
            startDate: text(entry.startDate, 100),
            endDate: text(entry.endDate, 100),
            details: text(entry.details),
          };
        })
      : [];

    const projects = Array.isArray(source.projects)
      ? source.projects.slice(0, 30).map((item, index) => {
          const entry = record(item);
          return {
            id: text(entry.id, 120) || `docx-project-${index}`,
            name: text(entry.name, 500),
            description: text(entry.description),
            link: text(entry.link, 1_000),
            githubUrl: text(entry.githubUrl, 1_000),
            linkLabel: text(entry.linkLabel, 500),
            githubLabel: text(entry.githubLabel, 500),
            date: text(entry.date, 100),
            highlights: textArray(entry.highlights),
          };
        })
      : [];

    const skillGroups = Array.isArray(source.skillGroups)
      ? source.skillGroups.slice(0, 20).map((item, index) => {
          const group = record(item);
          return {
            id: text(group.id, 120) || `docx-skills-${index}`,
            name: text(group.name, 500),
            skills: textArray(group.skills, 60),
          };
        })
      : [];

    const certifications = Array.isArray(source.certifications)
      ? source.certifications.slice(0, 30).map((item, index) => {
          const entry = record(item);
          return {
            id: text(entry.id, 120) || `docx-certification-${index}`,
            title: text(entry.title, 500),
            issuer: text(entry.issuer, 500),
            date: text(entry.date, 100),
            description: text(entry.description),
          };
        })
      : [];

    return {
      basics: {
        ...blank.basics,
        fullName: text(sourceBasics.fullName, 500),
        headline: text(sourceBasics.headline, 500),
        photo: text(sourceBasics.photo, 2_000_000),
        email: text(sourceBasics.email, 500),
        phone: text(sourceBasics.phone, 200),
        location: text(sourceBasics.location, 500),
        website: text(sourceBasics.website, 1_000),
        linkedin: text(sourceBasics.linkedin, 1_000),
        github: text(sourceBasics.github, 1_000),
        summary: text(sourceBasics.summary),
        textOnlyLinks: Object.fromEntries(
          Object.entries(record(sourceBasics.textOnlyLinks)).map(([key, value]) => [
            key,
            boolean(value),
          ])
        ),
        customLabels: stringRecord(sourceBasics.customLabels),
        contactOrder: textArray(sourceBasics.contactOrder, 40),
        customLinks,
      },
      experience,
      education,
      projects,
      skillGroups,
      certifications,
    };
  } catch {
    return null;
  }
}
