import OpenAI from "openai";
import type {
  WritingCheckResponse,
  WritingIssue,
  WritingIssueType,
  WritingTarget,
} from "@/types/writing";

const SYSTEM_PROMPT = `You are a careful resume copy editor. Return ONLY valid JSON with this exact shape:
{"issues":[{"targetId":"exact supplied id","type":"spelling|grammar|clarity","original":"exact substring from supplied text","replacement":"corrected substring","explanation":"one concise sentence"}]}

RULES:
- Find genuine spelling, grammar, punctuation, or serious clarity problems.
- "original" MUST be a verbatim, case-sensitive substring of the supplied target text.
- Make the smallest correction that solves the issue.
- Preserve facts, meaning, tense, tone, names, numbers, technologies, and metrics.
- Never invent employers, experience, achievements, numbers, skills, or keywords.
- Do not rewrite text merely to make it sound more impressive.
- Do not flag fragments that are normal resume headings or concise bullets.
- Return at most 15 high-confidence issues.
- If the writing is clean, return {"issues":[]}.`;

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
  return (
    value === "spelling" ||
    value === "grammar" ||
    value === "clarity"
  );
}

function validateIssues(
  rawIssues: unknown,
  targets: WritingTarget[],
): WritingIssue[] {
  if (!Array.isArray(rawIssues)) return [];
  const targetMap = new Map(targets.map((target) => [target.id, target]));

  return rawIssues
    .slice(0, 15)
    .flatMap((rawIssue, index) => {
      if (!rawIssue || typeof rawIssue !== "object") return [];
      const candidate = rawIssue as Record<string, unknown>;
      const targetId =
        typeof candidate.targetId === "string"
          ? candidate.targetId
          : "";
      const original =
        typeof candidate.original === "string"
          ? candidate.original.trim()
          : "";
      const replacement =
        typeof candidate.replacement === "string"
          ? candidate.replacement.trim()
          : "";
      const explanation =
        typeof candidate.explanation === "string"
          ? candidate.explanation.trim()
          : "";
      const target = targetMap.get(targetId);

      if (
        !target ||
        !isIssueType(candidate.type) ||
        !original ||
        !replacement ||
        original === replacement ||
        !target.text.includes(original)
      ) {
        return [];
      }

      const issue: WritingIssue = {
        id: `${targetId}-${index}`,
        targetId,
        label: target.label,
        type: candidate.type,
        original,
        replacement,
        explanation:
          explanation || "Corrects a writing issue in this section.",
      };
      return [issue];
    });
}

export async function analyzeResumeWriting(
  targets: WritingTarget[],
): Promise<WritingCheckResponse> {
  const completion = await getWritingClient().chat.completions.create({
    model: "openai/gpt-oss-120b",
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
    throw new Error("No response received from the AI writing checker.");
  }

  const parsed = JSON.parse(extractJsonObject(responseText)) as {
    issues?: unknown;
  };
  return { issues: validateIssues(parsed.issues, targets) };
}
