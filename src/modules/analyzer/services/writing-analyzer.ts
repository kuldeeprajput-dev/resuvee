import OpenAI from "openai";
import type {
  WritingCheckResponse,
  WritingIssue,
  WritingIssueType,
  WritingTarget,
} from "@/modules/resume";

const SYSTEM_PROMPT = `You are a strict, thorough resume copy editor and spell checker.
Return ONLY valid JSON with this exact shape:
{"issues":[{"targetId":"exact supplied id","type":"spelling|grammar|clarity","original":"exact substring from supplied text","replacement":"corrected substring or clean text","explanation":"one concise sentence"}]}

CRITICAL RULES:
1. Inspect EVERY SINGLE WORD in the text.
2. If you find ANY misspelled word, typo, or keyboard-mashed gibberish (e.g. "wkdjj", "kjnow", "hwoeiurty", "ysodfu", "syoduify", "wioeur", "sdfsdfsdf"), you MUST flag it as a "spelling" issue.
3. For typos (e.g. "kjnow"), set replacement to the correct word (e.g. "know").
4. For gibberish words (e.g. "wkdjj", "sdfsdfsdf"), set replacement to clean text without the gibberish.
5. "original" MUST be an exact, case-sensitive substring of the supplied target text.
6. Flag weak phrases like "worked on", "responsible for", "helped with", "handled" and suggest strong action verbs like "spearheaded", "developed", "orchestrated".
7. Return up to 25 issues. If clean, return {"issues":[]}.`;

let writingClient: OpenAI | null = null;

function getWritingClient() {
  if (writingClient) return writingClient;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not configured");
  }

  writingClient = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
    timeout: 120000,
    maxRetries: 2,
  });
  return writingClient;
}

function extractJsonObject(value: string) {
  const cleaned = value
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) {
    throw new Error("The AI response did not contain valid JSON.");
  }
  return cleaned.slice(start, end + 1);
}

function isIssueType(value: unknown): value is WritingIssueType {
  return value === "spelling" || value === "grammar" || value === "clarity";
}

function validateIssues(rawIssues: unknown, targets: WritingTarget[]): WritingIssue[] {
  if (!Array.isArray(rawIssues)) return [];
  const targetMap = new Map(targets.map((target) => [target.id, target]));

  return rawIssues.slice(0, 25).flatMap((rawIssue, index) => {
    if (!rawIssue || typeof rawIssue !== "object") return [];
    const candidate = rawIssue as Record<string, unknown>;
    const targetId = typeof candidate.targetId === "string" ? candidate.targetId : "";
    const original = typeof candidate.original === "string" ? candidate.original.trim() : "";
    const replacement =
      typeof candidate.replacement === "string" ? candidate.replacement.trim() : "";
    const explanation =
      typeof candidate.explanation === "string" ? candidate.explanation.trim() : "";
    const target = targetMap.get(targetId);

    if (!target || !isIssueType(candidate.type) || !original || !target.text.includes(original)) {
      return [];
    }

    const issue: WritingIssue = {
      id: `${targetId}-${index}`,
      targetId,
      label: target.label,
      type: candidate.type,
      original,
      replacement,
      explanation: explanation || `Corrects "${original}" in this section.`,
    };
    return [issue];
  });
}

// Built-in English & Professional Resume Dictionary
const VALID_VOCABULARY = new Set([
  // Common Resume Vocabulary & Tech terms
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "if",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "by",
  "from",
  "up",
  "of",
  "about",
  "into",
  "over",
  "after",
  "through",
  "during",
  "before",
  "under",
  "between",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "can",
  "could",
  "will",
  "would",
  "shall",
  "should",
  "may",
  "might",
  "must",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "my",
  "your",
  "his",
  "her",
  "its",
  "our",
  "their",
  "this",
  "that",
  "these",
  "those",
  "who",
  "whom",
  "whose",
  "which",
  "what",
  "where",
  "when",
  "how",
  "senior",
  "junior",
  "lead",
  "principal",
  "manager",
  "director",
  "vice",
  "president",
  "head",
  "engineer",
  "developer",
  "architect",
  "designer",
  "consultant",
  "analyst",
  "administrator",
  "specialist",
  "coordinator",
  "executive",
  "officer",
  "associate",
  "intern",
  "trainee",
  "fellow",
  "program",
  "project",
  "product",
  "team",
  "group",
  "department",
  "organization",
  "company",
  "years",
  "year",
  "month",
  "months",
  "experience",
  "background",
  "track",
  "record",
  "history",
  "delivering",
  "delivered",
  "deliver",
  "delivers",
  "development",
  "developing",
  "developed",
  "management",
  "managing",
  "managed",
  "business",
  "critical",
  "initiatives",
  "across",
  "technology",
  "operations",
  "customer",
  "experience",
  "service",
  "support",
  "sales",
  "marketing",
  "strategy",
  "strategic",
  "planning",
  "execution",
  "performance",
  "growth",
  "revenue",
  "profit",
  "data",
  "analytics",
  "analysis",
  "system",
  "systems",
  "platform",
  "platforms",
  "solution",
  "solutions",
  "architecture",
  "design",
  "implementation",
  "integration",
  "automation",
  "process",
  "processes",
  "quality",
  "assurance",
  "testing",
  "security",
  "cloud",
  "infrastructure",
  "devops",
  "software",
  "web",
  "mobile",
  "frontend",
  "backend",
  "fullstack",
  "full-stack",
  "database",
  "code",
  "coding",
  "technical",
  "agile",
  "scrum",
  "kanban",
  "leadership",
  "mentorship",
  "collaboration",
  "cross-functional",
  "communication",
  "stakeholder",
  "client",
  "customer",
  "results",
  "impact",
  "driven",
  "focused",
  "proven",
  "successful",
  "key",
  "core",
  "primary",
  "main",
  "major",
  "scale",
  "scaled",
  "scaling",
  "scalable",
  "optimize",
  "optimized",
  "optimizing",
  "improved",
  "improving",
  "improvement",
  "increased",
  "increasing",
  "increase",
  "reduced",
  "reducing",
  "reduction",
  "saved",
  "saving",
  "built",
  "building",
  "created",
  "creating",
  "launched",
  "launching",
  "spearheaded",
  "orchestrated",
  "led",
  "leading",
  "directed",
  "established",
  "implemented",
  "transformed",
  "designed",
  "engineered",
  "crafted",
  "know",
  "knew",
  "known",
  "work",
  "worked",
  "working",
  "duty",
  "duties",
  "task",
  "tasks",
  "role",
  "roles",
  "title",
  "job",
  "career",
  "professional",
  "summary",
  "skills",
  "tools",
  "education",
  "certifications",
  "degree",
  "bachelor",
  "master",
  "doctorate",
  "phd",
  "university",
  "college",
  "institute",
  "school",
  "science",
  "arts",
  "business",
  "computer",
  "information",
  "boston",
  "new",
  "york",
  "san",
  "francisco",
  "chicago",
  "london",
  "redwood",
  "atlas",
  "group",
  "services",
  "tech",
  "corp",
  "inc",
  "ltd",
  "llc",
  "co",
  "member",
  "society",
  "award",
  "honors",
]);

// Common Typo Dictionary & Quick Fixes
const TYPO_MAP: Record<string, string> = {
  teh: "the",
  kjnow: "know",
  knwo: "know",
  konw: "know",
  recieve: "receive",
  recieved: "received",
  recieveing: "receiving",
  managment: "management",
  seperate: "separate",
  responsable: "responsible",
  devlopment: "development",
  devolopment: "development",
  enginner: "engineer",
  enginere: "engineer",
  implment: "implement",
  implmented: "implemented",
  achivment: "achievement",
  achived: "achieved",
  softare: "software",
  manger: "manager",
  coordinatd: "coordinated",
  sucessful: "successful",
  sucessfully: "successfully",
  profesional: "professional",
  commited: "committed",
  communcation: "communication",
  performence: "performance",
  dificult: "difficult",
  oppurtunity: "opportunity",
  experiance: "experience",
  exprience: "experience",
  leadred: "led",
  maintainence: "maintenance",
  technolgy: "technology",
  analysys: "analysis",
  databse: "database",
  requriment: "requirement",
  integretion: "integration",
  arcitecture: "architecture",
};

function LevenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function findBestWordCorrection(word: string): string | null {
  const lower = word.toLowerCase();
  if (TYPO_MAP[lower]) return TYPO_MAP[lower];

  // Try edit distance 1 or 2 against vocabulary
  if (lower.length >= 4 && lower.length <= 14) {
    for (const valid of VALID_VOCABULARY) {
      if (Math.abs(valid.length - lower.length) <= 2) {
        const dist = LevenshteinDistance(lower, valid);
        if (dist === 1 || (dist === 2 && lower.length >= 6)) {
          return valid;
        }
      }
    }
  }
  return null;
}

function isGibberishWord(word: string): boolean {
  const lower = word.toLowerCase();
  if (lower.length < 4) return false;
  if (VALID_VOCABULARY.has(lower)) return false;

  // Check for repeated random keyboard mash patterns e.g. sdfsdf, wkdjj, hwoeiurty, ysodfu, syoduify, wioeur
  if (/([a-z]{3,})\1+/i.test(lower)) return true;
  if (/sdf|dfg|fgh|ghj|hjk|jkl|qwerty|wkd|oiu|eiu|ysod/i.test(lower)) return true;

  // Check consonant/vowel ratio or lack of vowels in longer words
  const vowels = (lower.match(/[aeiou]/g) || []).length;
  const consonants = (lower.match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length;

  if (lower.length >= 6 && vowels === 0) return true;
  if (lower.length >= 8 && consonants / Math.max(vowels, 1) > 4) return true;

  return false;
}

export function analyzeLocalWritingFallback(targets: WritingTarget[]): WritingCheckResponse {
  const issues: WritingIssue[] = [];
  let issueId = 1;

  const COMMON_RULES: [RegExp, string, WritingIssueType, string][] = [
    // Grammar & First-person Pronoun Rules
    [/\bI am\b/gi, "", "grammar", "Resumes should avoid first-person pronouns."],
    [/\bI was\b/gi, "", "grammar", "Resumes should avoid first-person pronouns."],
    [/\bI have\b/gi, "", "grammar", "Resumes should avoid first-person pronouns."],
    [/\bmy\b/gi, "the", "grammar", "Resumes should avoid possessive first-person pronouns."],
    [/\b(\w+)\s+\1\b/gi, "$1", "grammar", "Removes duplicate word."],

    // Clarity & Impactful Action Verbs
    [
      /\bresponsible for\b/i,
      "spearheaded",
      "clarity",
      "Replaces passive duty phrasing with an impactful action verb.",
    ],
    [
      /\bwas responsible for\b/i,
      "directed",
      "clarity",
      "Replaces passive phrasing with an executive action verb.",
    ],
    [
      /\bworked on\b/i,
      "developed and delivered",
      "clarity",
      "Replaces weak phrasing with a result-oriented action verb.",
    ],
    [
      /\bhelped with\b/i,
      "collaborated to execute",
      "clarity",
      "Strengthens bullet point impact with active phrasing.",
    ],
    [/\bhandled\b/i, "orchestrated", "clarity", "Uses a concise, proactive action verb."],
    [
      /\bin charge of\b/i,
      "managed and directed",
      "clarity",
      "Replaces informal phrasing with an executive action verb.",
    ],
    [
      /\btasked with\b/i,
      "commissioned to lead",
      "clarity",
      "Replaces passive assignment phrasing with active leadership.",
    ],
    [
      /\bduty was to\b/i,
      "driven to achieve",
      "clarity",
      "Replaces job-duty language with impact-focused action.",
    ],
    [/\bassisted in\b/i, "contributed to", "clarity", "Strengthens bullet point phrasing."],
    [/\bmade sure\b/i, "ensured", "clarity", "Uses precise, professional terminology."],
    [/\blooked after\b/i, "supervised", "clarity", "Uses standard professional terminology."],
  ];

  targets.forEach((target) => {
    // 1. Check Typo and Gibberish words in target text
    const words = target.text.match(/\b[a-zA-Z]{3,}\b/g) || [];
    words.forEach((w) => {
      const lower = w.toLowerCase();

      // Skip numbers, emails, known valid words
      if (VALID_VOCABULARY.has(lower)) return;
      if (w === w.toUpperCase() && w.length <= 5) return; // tech acronyms e.g. SQL, AWS

      // Check if it's a known typo or close edit distance
      const correction = findBestWordCorrection(w);
      if (correction) {
        if (!issues.some((i) => i.targetId === target.id && i.original === w)) {
          issues.push({
            id: `${target.id}-spelling-${issueId++}`,
            targetId: target.id,
            label: target.label,
            type: "spelling",
            original: w,
            replacement: correction,
            explanation: `Fixes spelling typo "${w}" to "${correction}".`,
          });
        }
        return;
      }

      // Check if it's a gibberish word
      if (isGibberishWord(w)) {
        if (!issues.some((i) => i.targetId === target.id && i.original === w)) {
          issues.push({
            id: `${target.id}-gibberish-${issueId++}`,
            targetId: target.id,
            label: target.label,
            type: "spelling",
            original: w,
            replacement: "",
            explanation: `Removes unrecognized gibberish text "${w}".`,
          });
        }
      }
    });

    // 2. Check Grammar & Clarity rules
    COMMON_RULES.forEach(([pattern, replacement, type, explanation]) => {
      const match = target.text.match(pattern);
      if (match && match[0]) {
        const original = match[0];
        if (!issues.some((i) => i.targetId === target.id && i.original === original)) {
          issues.push({
            id: `${target.id}-rule-${issueId++}`,
            targetId: target.id,
            label: target.label,
            type,
            original,
            replacement,
            explanation,
          });
        }
      }
    });
  });

  return { issues: issues.slice(0, 25) };
}

export async function analyzeResumeWriting(
  targets: WritingTarget[]
): Promise<WritingCheckResponse> {
  // Always run local spell & gibberish detector first to guarantee catching non-words
  const localIssues = analyzeLocalWritingFallback(targets).issues;

  try {
    const completion = await getWritingClient().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Review these resume writing targets:\n${JSON.stringify(targets)}`,
        },
      ],
      temperature: 0.1,
      top_p: 0.9,
      max_tokens: 3000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return { issues: localIssues };
    }

    const parsed = JSON.parse(extractJsonObject(responseText)) as {
      issues?: unknown;
    };
    const validated = validateIssues(parsed.issues, targets);

    // Merge AI issues with local spell check issues (eliminating duplicates)
    const combined = [...validated];
    localIssues.forEach((localItem) => {
      if (
        !combined.some(
          (c) => c.targetId === localItem.targetId && c.original === localItem.original
        )
      ) {
        combined.push(localItem);
      }
    });

    return { issues: combined.slice(0, 25) };
  } catch (error) {
    console.warn("AI writing check error, using local detector:", error);
    return { issues: localIssues };
  }
}
