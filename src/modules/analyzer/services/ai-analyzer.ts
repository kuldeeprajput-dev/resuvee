import OpenAI from "openai";
import { createHash } from "crypto";
import type { ResumeAnalysis } from "../index";

const SYSTEM_PROMPT =
  'You are a precise resume ATS reviewer. Return only valid JSON, no markdown. Use only evidence in the resume; never invent skills, metrics, dates, employers, or achievements. Score 0-100 as resume health, not a hiring guarantee: start at 50, reward quantified impact, relevant skills used in context, complete sections, clarity and parseability; deduct missing evidence, parser risk and missing role terms. Be concise. Return at most 3 strengths, 4 weaknesses, 6 missing keywords, 4 suggestions, 12 technologies, 4 parser issues and 3 caps. Use this exact shape: {"role":"","level":"","score":0,"summary":"","scoreBreakdown":{"baseScore":50,"earned":0,"deducted":0,"capsApplied":[]},"techStack":[],"skillsFound":[],"skillsMissing":[],"strengths":[],"weaknesses":[],"missingKeywords":[],"suggestions":[],"advice":"","atsCompatibility":{"formattingScore":0,"parseabilityScore":0,"keywordMatchScore":0,"issues":[]}}';

// Simple in-memory cache to store analysis results by text hash
const analysisCache = new Map<string, ResumeAnalysis>();

function getHash(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

let openaiInstance: OpenAI | null = null;

function getClient(): OpenAI {
  if (openaiInstance) return openaiInstance;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not configured");
  }

  openaiInstance = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
    timeout: 180000,
    maxRetries: 3,
  });

  return openaiInstance;
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  const hash = getHash(resumeText);

  // Check cache first
  if (analysisCache.has(hash)) {
    console.log("Returning cached analysis result");
    return analysisCache.get(hash)!;
  }

  const client = getClient();
  let responseText = "";

  try {
    // Keep both the header and closing skills or education sections while staying compact.
    const normalizedResume = resumeText.replace(/\s+/g, " ").trim();
    const trimmedResume =
      normalizedResume.length > 4800
        ? normalizedResume.slice(0, 3200) + "\n[Middle omitted]\n" + normalizedResume.slice(-1600)
        : normalizedResume;

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Analyze this resume and return ONLY JSON:\n\n${trimmedResume}`,
        },
      ],
      temperature: 0.1,
      top_p: 0.9,
      max_tokens: 1600,
    });

    responseText = completion.choices[0]?.message?.content || "";

    if (!responseText) {
      throw new Error("No response received from AI model");
    }

    // Step 1: Strip <think>...</think> blocks (reasoning models emit these)
    let cleaned = responseText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    // Step 2: Remove markdown code fences
    cleaned = cleaned
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    // Step 3: Find the correct outermost JSON object using bracket matching
    let jsonString = "";
    let braceDepth = 0;
    let jsonStartIdx = -1;

    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === "{") {
        if (braceDepth === 0) jsonStartIdx = i;
        braceDepth++;
      } else if (cleaned[i] === "}") {
        braceDepth--;
        if (braceDepth === 0 && jsonStartIdx !== -1) {
          const candidate = cleaned.substring(jsonStartIdx, i + 1);
          if (candidate.length > jsonString.length) {
            jsonString = candidate;
          }
          jsonStartIdx = -1;
        }
      }
    }

    // If no complete JSON found, try to repair truncated JSON
    if (!jsonString && jsonStartIdx !== -1 && braceDepth > 0) {
      // The JSON was started but never closed (model ran out of tokens)
      let truncated = cleaned.substring(jsonStartIdx);
      // Close any open braces/brackets
      while (braceDepth > 0) {
        truncated += "}";
        braceDepth--;
      }
      jsonString = truncated;
    }

    if (!jsonString) {
      console.error("No JSON found. Response:", cleaned.substring(0, 500));
      throw new Error("No valid JSON found in AI response");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawAnalysis = JSON.parse(jsonString) as any;

    // Map the AI output to the ResumeAnalysis type
    const toScore = (value: unknown, fallback = 50) => {
      const score = Number(value);
      return Number.isFinite(score) ? Math.min(100, Math.max(0, Math.round(score))) : fallback;
    };

    const toList = (value: unknown, limit: number) =>
      Array.isArray(value)
        ? value
            .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
            .slice(0, limit)
        : [];

    const analysis: ResumeAnalysis = {
      role: typeof rawAnalysis.role === "string" ? rawAnalysis.role : "Unknown Role",
      level: typeof rawAnalysis.level === "string" ? rawAnalysis.level : "Unknown",
      summary: typeof rawAnalysis.summary === "string" ? rawAnalysis.summary : undefined,
      score: toScore(rawAnalysis.scoreBreakdown?.finalScore ?? rawAnalysis.score),
      techStack: toList(rawAnalysis.techStack, 12),
      skillsFound: toList(rawAnalysis.skillsFound, 12),
      skillsMissing: toList(rawAnalysis.skillsMissing, 12),
      strengths: toList(rawAnalysis.strengths, 3),
      weaknesses: toList(rawAnalysis.weaknesses, 4),
      missingKeywords: toList(
        rawAnalysis.missingKeywords ?? rawAnalysis.keywordAnalysis?.missingKeywords,
        6
      ),
      suggestions: toList(rawAnalysis.suggestions, 4),
      advice: typeof rawAnalysis.advice === "string" ? rawAnalysis.advice : "No advice provided.",
      scoreBreakdown: {
        baseScore: toScore(rawAnalysis.scoreBreakdown?.baseScore, 50),
        earned: toScore(rawAnalysis.scoreBreakdown?.earned, 0),
        deducted: toScore(rawAnalysis.scoreBreakdown?.deducted, 0),
        capsApplied: toList(rawAnalysis.scoreBreakdown?.capsApplied, 3),
      },
      atsCompatibility: {
        formattingScore: toScore(
          rawAnalysis.atsCompatibility?.formattingScore ?? rawAnalysis.score
        ),
        parseabilityScore: toScore(
          rawAnalysis.atsCompatibility?.parseabilityScore ?? rawAnalysis.score
        ),
        keywordMatchScore: toScore(
          rawAnalysis.atsCompatibility?.keywordMatchScore ?? rawAnalysis.score
        ),
        issues: toList(rawAnalysis.atsCompatibility?.issues, 4),
      },
    };

    // Save to cache
    analysisCache.set(hash, analysis);

    return analysis;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("JSON parse failed. Raw response:", responseText.substring(0, 800));
      throw new Error("Failed to parse AI response as JSON. The response may have been truncated.");
    }
    throw error;
  }
}
