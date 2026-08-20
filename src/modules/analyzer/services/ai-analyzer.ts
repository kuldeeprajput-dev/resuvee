import { createHash } from "crypto";
import OpenAI from "openai";
import { getGroqModel } from "@/shared/lib/groq-model";
import type { ResumeAnalysis } from "../index";
import { auditCategoryScores, auditResumeText, calibratedResumeScore } from "./resume-evidence";

const ANALYSIS_VERSION = "resuvee-calibrated-v1";
const SYSTEM_PROMPT =
  'You are the semantic reviewer in a resume audit. Deterministic document checks are supplied separately and control the final score; do not override them. Return only valid JSON, no markdown. Use only facts in the resume. Never invent skills, metrics, employers, requirements, experience, or career gaps. There is no job description, so keywordMatchScore means inferred role-language coverage, not job match. Strengths must cite concrete evidence. Weaknesses and suggestions must identify an editable line, section, or missing proof—not recommend learning unrelated skills. If the document has no work-experience section, do not label the candidate Mid-level or Senior. Return at most 3 strengths, 4 weaknesses, 6 missing keywords, 4 suggestions, 12 skills, and 3 parser issues. Exact shape: {"role":"","level":"","summary":"","techStack":[],"skillsFound":[],"skillsMissing":[],"strengths":[],"weaknesses":[],"missingKeywords":[],"suggestions":[],"advice":"","atsCompatibility":{"keywordMatchScore":0,"issues":[]}}';

const analysisCache = new Map<string, ResumeAnalysis>();

export function clearAnalysisCache() {
  analysisCache.clear();
}

function getHash(text: string) {
  return createHash("sha256").update(`${ANALYSIS_VERSION}:${text}`).digest("hex");
}

function normalizeResumeText(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/[ \t]+/g, " "))
    .filter(Boolean)
    .join("\n");
}

function extractJson(responseText: string) {
  const cleaned = responseText
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();
  let depth = 0;
  let start = -1;
  let best = "";

  for (let index = 0; index < cleaned.length; index++) {
    if (cleaned[index] === "{") {
      if (depth === 0) start = index;
      depth++;
    } else if (cleaned[index] === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        const candidate = cleaned.slice(start, index + 1);
        if (candidate.length > best.length) best = candidate;
        start = -1;
      }
    }
  }

  if (!best) throw new Error("No valid JSON found in AI response");
  return best;
}

function toScore(value: unknown, fallback = 65) {
  const score = Number(value);
  if (!Number.isFinite(score)) return fallback;
  const normalized = score > 0 && score <= 10 ? score * 10 : score;
  return Math.min(100, Math.max(0, Math.round(normalized)));
}

function toList(value: unknown, limit: number) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        .map((item) => item.trim())
        .slice(0, limit)
    : [];
}

function mergeLists(primary: string[], secondary: string[], limit: number) {
  const seen = new Set<string>();
  return [...primary, ...secondary]
    .filter((item) => {
      const key = item.toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

let openaiInstance: OpenAI | null = null;

function getClient() {
  if (openaiInstance) return openaiInstance;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY environment variable is not configured");

  openaiInstance = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
    timeout: 180000,
    maxRetries: 3,
  });
  return openaiInstance;
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  const normalizedResume = normalizeResumeText(resumeText);
  if (normalizedResume.replace(/\s+/g, " ").trim().length < 80) {
    throw new Error(
      "We could not extract enough readable text. Upload a text-based PDF or DOCX; scanned PDFs need OCR first."
    );
  }

  const hash = getHash(normalizedResume);
  const cached = analysisCache.get(hash);
  if (cached) return cached;

  const audit = auditResumeText(normalizedResume);
  const trimmedResume =
    normalizedResume.length > 6200
      ? `${normalizedResume.slice(0, 3900)}\n[Middle omitted]\n${normalizedResume.slice(-2300)}`
      : normalizedResume;
  const client = getClient();
  let responseText = "";

  try {
    const completion = await client.chat.completions.create({
      model: getGroqModel(),
      reasoning_effort: "low",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Document checks: ${JSON.stringify(audit.facts)}\nReview this resume and return only the requested JSON:\n\n${trimmedResume}`,
        },
      ],
      temperature: 0.05,
      top_p: 0.85,
      max_tokens: 1200,
      response_format: { type: "json_object" },
    });

    responseText = completion.choices[0]?.message?.content ?? "";
    if (!responseText) throw new Error("No response received from AI model");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = JSON.parse(extractJson(responseText)) as any;
    const rawCompatibility = raw.atsCompatibility ?? {};
    const roleLanguageScore = toScore(rawCompatibility.keywordMatchScore ?? 65);
    const score = calibratedResumeScore(audit, roleLanguageScore);
    const rawLevel = typeof raw.level === "string" ? raw.level.trim() : "Unknown";
    const level =
      !audit.hasExperience && /mid|senior|lead|executive/i.test(rawLevel)
        ? "Entry-level"
        : rawLevel || (audit.hasExperience ? "Professional" : "Entry-level");
    const rawStrengths = toList(raw.strengths, 3);
    const rawWeaknesses = toList(raw.weaknesses, 4);
    const parserIssues = mergeLists(audit.issues, toList(rawCompatibility.issues, 3), 5);

    const analysis: ResumeAnalysis = {
      role: typeof raw.role === "string" && raw.role.trim() ? raw.role.trim() : "General applicant",
      level,
      score,
      summary:
        typeof raw.summary === "string" && raw.summary.trim()
          ? raw.summary.trim()
          : "Resume quality review based on document structure, evidence, writing, and inferred role language.",
      techStack: toList(raw.techStack, 12),
      skillsFound: toList(raw.skillsFound, 12),
      skillsMissing: toList(raw.skillsMissing, 8),
      strengths: mergeLists(audit.strengths, rawStrengths, 4),
      weaknesses: mergeLists(audit.issues, rawWeaknesses, 5),
      missingKeywords: toList(raw.missingKeywords, 6),
      suggestions: toList(raw.suggestions, 4),
      advice:
        typeof raw.advice === "string" && raw.advice.trim()
          ? raw.advice.trim()
          : "Fix the highest-impact evidence and structure issues, then scan the revised document again.",
      categoryScores: auditCategoryScores(audit),
      scoreBreakdown: {
        baseScore: 100,
        earned: score,
        deducted: 100 - score,
        capsApplied: audit.overclaimsExperience
          ? ["Positioning claims exceed the documented experience level."]
          : [],
      },
      atsCompatibility: {
        formattingScore: Math.round((audit.structureScore + audit.atsScore) / 2),
        parseabilityScore: audit.atsScore,
        keywordMatchScore: roleLanguageScore,
        issues: parserIssues,
      },
    };

    analysisCache.set(hash, analysis);
    if (analysisCache.size > 50) {
      const oldestKey = analysisCache.keys().next().value;
      if (oldestKey) analysisCache.delete(oldestKey);
    }
    return analysis;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("JSON parse failed. Raw response:", responseText.slice(0, 800));
      throw new Error("The analysis response was incomplete. Please run the scan again.");
    }
    throw error;
  }
}
