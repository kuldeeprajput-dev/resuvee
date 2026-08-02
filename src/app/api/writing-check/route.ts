import { NextRequest, NextResponse } from "next/server";
import { analyzeLocalWritingFallback, analyzeResumeWriting } from "@/modules/analyzer";
import type { WritingTarget } from "@/modules/resume";

const MAX_TARGETS = 60;
const MAX_TARGET_LENGTH = 1600;
const MAX_TOTAL_LENGTH = 16000;
const TARGET_ID_PATTERN = /^[a-zA-Z0-9-_.]+/;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

function validateTargets(value: unknown): WritingTarget[] {
  if (!Array.isArray(value) || !value.length) {
    throw new Error("No resume writing fields were provided.");
  }
  if (value.length > MAX_TARGETS) {
    throw new Error(`A maximum of ${MAX_TARGETS} writing fields is allowed.`);
  }

  const targets = value.map((item) => {
    if (!item || typeof item !== "object") {
      throw new Error("A writing field is invalid.");
    }
    const candidate = item as Record<string, unknown>;
    const id = typeof candidate.id === "string" ? candidate.id : "";
    const label = typeof candidate.label === "string" ? candidate.label.trim().slice(0, 100) : "";
    const text = typeof candidate.text === "string" ? candidate.text.trim() : "";

    if (!TARGET_ID_PATTERN.test(id) || !label || !text) {
      throw new Error("A writing field is incomplete or unsupported.");
    }
    if (text.length > MAX_TARGET_LENGTH) {
      throw new Error(`Each writing field must be under ${MAX_TARGET_LENGTH} characters.`);
    }
    return { id, label, text };
  });

  const totalLength = targets.reduce((total, target) => total + target.text.length, 0);
  if (totalLength > MAX_TOTAL_LENGTH) {
    throw new Error("The resume is too long for one writing check. Shorten it and try again.");
  }
  return targets;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { targets?: unknown };
    const targets = validateTargets(body.targets);

    if (!process.env.GROQ_API_KEY) {
      const data = analyzeLocalWritingFallback(targets);
      return NextResponse.json({ success: true, data });
    }

    try {
      const data = await analyzeResumeWriting(targets);
      return NextResponse.json({ success: true, data });
    } catch (aiError) {
      console.warn("AI writing check fallback engaged:", aiError);
      const data = analyzeLocalWritingFallback(targets);
      return NextResponse.json({ success: true, data });
    }
  } catch (error) {
    console.error("Writing check error:", error);
    const message =
      error instanceof SyntaxError
        ? "The AI writing response could not be parsed. Please try again."
        : error instanceof Error
          ? error.message
          : "The writing check could not be completed.";
    return errorResponse(message, 500);
  }
}
