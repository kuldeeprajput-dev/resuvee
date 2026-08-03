import type { AnalysisCategoryScore } from "../types";

export interface ResumeEvidenceAudit {
  contentScore: number;
  structureScore: number;
  atsScore: number;
  writingScore: number;
  metricCount: number;
  bulletCount: number;
  standardSectionCount: number;
  hasExperience: boolean;
  hasProjects: boolean;
  overclaimsExperience: boolean;
  issues: string[];
  strengths: string[];
  facts: Record<string, number | boolean>;
}

const clamp = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

const HEADING_GROUPS = {
  summary: ["summary", "professional summary", "profile", "professional profile", "objective"],
  skills: ["skills", "technical skills", "core skills", "core competencies", "areas of expertise"],
  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment",
    "employment history",
    "work history",
  ],
  projects: ["projects", "selected projects", "personal projects", "academic projects"],
  education: ["education", "academic background", "education and training"],
  certifications: ["certifications", "awards and certifications", "licenses and certifications"],
};

const ACTION_VERBS = new Set([
  "achieved",
  "analyzed",
  "architected",
  "automated",
  "built",
  "collaborated",
  "created",
  "delivered",
  "designed",
  "developed",
  "drove",
  "engineered",
  "established",
  "generated",
  "implemented",
  "improved",
  "increased",
  "integrated",
  "launched",
  "led",
  "managed",
  "optimized",
  "orchestrated",
  "processed",
  "reduced",
  "resolved",
  "scaled",
  "streamlined",
  "transformed",
]);

function normalizedHeading(line: string) {
  return line
    .toLowerCase()
    .replace(/[|:•●▪◦–—-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasHeading(lines: string[], aliases: string[]) {
  return lines.some((line) => aliases.includes(normalizedHeading(line)));
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

export function auditResumeText(text: string): ResumeEvidenceAudit {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const lowerText = text.toLowerCase();
  const words = text.match(/[a-zA-Z][a-zA-Z'+.-]*/g) ?? [];
  const bulletLines = lines.filter((line) => /^[•●▪◦–—-]\s+/.test(line));
  const metricMatches =
    text.match(
      /(?:\b\d+(?:\.\d+)?%|[$€£]\s?\d[\d,.]*|\b\d+[kKmMbB]?\+?\s+(?:users|clients|customers|projects|applications|transactions|requests|teams|employees|hours|days|months|years|rows|records|regions|departments|visualizations|tables|entities|kpis))/gi
    ) ?? [];
  const sectionFlags = {
    summary: hasHeading(lines, HEADING_GROUPS.summary),
    skills: hasHeading(lines, HEADING_GROUPS.skills),
    experience: hasHeading(lines, HEADING_GROUPS.experience),
    projects: hasHeading(lines, HEADING_GROUPS.projects),
    education: hasHeading(lines, HEADING_GROUPS.education),
    certifications: hasHeading(lines, HEADING_GROUPS.certifications),
  };
  const standardSectionCount = Object.values(sectionFlags).filter(Boolean).length;
  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text);
  const hasPhone = /(?:\+?\d[\d\s().-]{7,}\d)/.test(text);
  const hasLink = /(?:https?:\/\/|linkedin\.com|github\.com|portfolio)/i.test(text);
  const hasDates =
    /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{4}\b/i.test(
      text
    ) || /\b(?:19|20)\d{2}\s*[–—-]\s*(?:present|(?:19|20)\d{2})\b/i.test(text);
  const weakPhraseCount = (
    lowerText.match(
      /\b(?:responsible for|helped with|worked on|involved in|tasked with|duties included)\b/g
    ) ?? []
  ).length;
  const bulletWordCounts = bulletLines.map(
    (line) =>
      line
        .replace(/^[•●▪◦–—-]\s+/, "")
        .split(/\s+/)
        .filter(Boolean).length
  );
  const averageBulletWords = bulletWordCounts.length
    ? bulletWordCounts.reduce((sum, count) => sum + count, 0) / bulletWordCounts.length
    : 0;
  const actionStarts = bulletLines.filter((line) => {
    const firstWord = line
      .replace(/^[•●▪◦–—-]\s+/, "")
      .toLowerCase()
      .match(/^[a-z]+/)?.[0];
    return firstWord ? ACTION_VERBS.has(firstWord) : false;
  }).length;
  const actionRatio = bulletLines.length ? actionStarts / bulletLines.length : 0;
  const repeatedStarts = bulletLines.reduce<Record<string, number>>((counts, line) => {
    const firstWord = line
      .replace(/^[•●▪◦–—-]\s+/, "")
      .toLowerCase()
      .match(/^[a-z]+/)?.[0];
    if (firstWord) counts[firstWord] = (counts[firstWord] ?? 0) + 1;
    return counts;
  }, {});
  const repeatedVerbCount = Object.values(repeatedStarts).filter((count) => count >= 4).length;
  const overclaimsExperience =
    !sectionFlags.experience &&
    /\b(?:strong track record|highly skilled|seasoned|senior|extensive experience|years of experience)\b/i.test(
      text
    );

  const impactPoints =
    metricMatches.length >= 6
      ? 32
      : metricMatches.length >= 4
        ? 26
        : metricMatches.length >= 2
          ? 18
          : metricMatches.length === 1
            ? 10
            : 0;
  const actionPoints =
    actionRatio >= 0.8 ? 22 : actionRatio >= 0.6 ? 17 : actionRatio >= 0.4 ? 10 : 4;
  const depthPoints =
    bulletLines.length >= 10 ? 16 : bulletLines.length >= 6 ? 12 : bulletLines.length >= 3 ? 7 : 2;
  const evidencePoints = sectionFlags.experience ? 20 : sectionFlags.projects ? 8 : 0;
  const clarityPoints = Math.max(0, 10 - weakPhraseCount * 3);
  const contentScore = clamp(
    impactPoints +
      actionPoints +
      depthPoints +
      evidencePoints +
      clarityPoints -
      (overclaimsExperience ? 20 : 0)
  );

  const structureScore = clamp(
    (hasEmail ? 12 : 0) +
      (hasPhone ? 8 : 0) +
      (hasLink ? 5 : 0) +
      (sectionFlags.summary ? 15 : 0) +
      (sectionFlags.skills ? 15 : 0) +
      (sectionFlags.education ? 15 : 0) +
      (sectionFlags.experience ? 20 : sectionFlags.projects ? 10 : 0) +
      (sectionFlags.projects ? 5 : 0) +
      (sectionFlags.certifications ? 5 : 0)
  );

  const atsScore = clamp(
    (text.trim().length >= 500 ? 10 : 4) +
      (words.length >= 300 && words.length <= 900 ? 20 : words.length >= 180 ? 12 : 5) +
      (standardSectionCount >= 5 ? 25 : standardSectionCount >= 3 ? 18 : 8) +
      (hasDates ? 15 : 4) +
      (hasEmail ? 7 : 0) +
      (hasPhone ? 3 : 0) +
      (bulletLines.length >= 5 ? 15 : bulletLines.length >= 2 ? 9 : 3) +
      (hasLink ? 5 : 0)
  );

  const writingScore = clamp(
    (words.length >= 300 && words.length <= 900 ? 15 : 8) +
      (averageBulletWords >= 8 && averageBulletWords <= 32 ? 25 : averageBulletWords > 0 ? 14 : 5) +
      (actionRatio >= 0.8 ? 30 : actionRatio >= 0.6 ? 23 : actionRatio >= 0.4 ? 15 : 7) +
      Math.max(0, 20 - weakPhraseCount * 5) +
      Math.max(0, 10 - repeatedVerbCount * 4)
  );

  const issues = unique([
    ...(!hasPhone ? ["Contact details: add a recruiter-ready phone number."] : []),
    ...(!sectionFlags.experience && sectionFlags.projects
      ? [
          "Experience evidence: the resume relies on projects and has no standard work-experience section.",
        ]
      : []),
    ...(overclaimsExperience
      ? [
          "Positioning mismatch: senior-sounding claims are not supported by a work-experience section.",
        ]
      : []),
    ...(metricMatches.length === 0
      ? ["Impact evidence: no measurable outcomes were detected in the achievement bullets."]
      : []),
    ...(standardSectionCount < 4
      ? ["Section structure: use standard headings so an ATS can classify the content reliably."]
      : []),
    ...(weakPhraseCount > 0
      ? ["Writing quality: replace duty phrases with direct action and outcome language."]
      : []),
  ]).slice(0, 5);

  const strengths = unique([
    ...(metricMatches.length >= 5
      ? [`Impact evidence: ${metricMatches.length} quantified outcomes were detected.`]
      : []),
    ...(actionRatio >= 0.7
      ? ["Bullet quality: most achievement bullets begin with clear action verbs."]
      : []),
    ...(standardSectionCount >= 5
      ? ["Structure: standard resume sections are clearly represented."]
      : []),
    ...(hasEmail && hasPhone && hasLink
      ? ["Contact readiness: email, phone, and professional link are present."]
      : []),
  ]).slice(0, 4);

  return {
    contentScore,
    structureScore,
    atsScore,
    writingScore,
    metricCount: metricMatches.length,
    bulletCount: bulletLines.length,
    standardSectionCount,
    hasExperience: sectionFlags.experience,
    hasProjects: sectionFlags.projects,
    overclaimsExperience,
    issues,
    strengths,
    facts: {
      words: words.length,
      bullets: bulletLines.length,
      quantifiedOutcomes: metricMatches.length,
      standardSections: standardSectionCount,
      hasExperience: sectionFlags.experience,
      hasProjects: sectionFlags.projects,
      hasEmail,
      hasPhone,
      hasProfessionalLink: hasLink,
      weakPhrases: weakPhraseCount,
    },
  };
}

export function calibratedResumeScore(audit: ResumeEvidenceAudit, roleLanguageScore: number) {
  const roleScore = clamp(roleLanguageScore);
  let score = Math.round(
    audit.contentScore * 0.65 +
      audit.structureScore * 0.1 +
      audit.atsScore * 0.1 +
      audit.writingScore * 0.075 +
      roleScore * 0.075
  );

  if (audit.overclaimsExperience) score = Math.min(score, 72);
  if (audit.standardSectionCount < 3) score = Math.min(score, 59);
  if (
    audit.hasExperience &&
    audit.metricCount >= 8 &&
    audit.standardSectionCount >= 5 &&
    audit.contentScore >= 95 &&
    audit.atsScore >= 95 &&
    audit.writingScore >= 90
  ) {
    score = Math.max(score, 98);
  }

  return clamp(score);
}

export function auditCategoryScores(audit: ResumeEvidenceAudit): AnalysisCategoryScore[] {
  const category = (name: string, score: number, weight: number): AnalysisCategoryScore => ({
    name,
    score,
    weight,
    status:
      score >= 90 ? "excellent" : score >= 75 ? "good" : score >= 60 ? "needs-work" : "critical",
    feedback: [],
  });

  return [
    category("Content & impact", audit.contentScore, 65),
    category("Section structure", audit.structureScore, 10),
    category("ATS essentials", audit.atsScore, 10),
    category("Writing quality", audit.writingScore, 7.5),
  ];
}
