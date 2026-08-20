import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getGroqModel } from "@/shared/lib/groq-model";
import { createClient, getAuthUser } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let openaiInstance: OpenAI | null = null;

function getGroqClient(): OpenAI {
  if (openaiInstance) return openaiInstance;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  openaiInstance = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
    timeout: 15000,
    maxRetries: 2,
  });

  return openaiInstance;
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to use AI refine." },
        { status: 401 }
      );
    }

    const { text, fieldName } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 15) {
      return NextResponse.json(
        { error: "Text must be at least 15 characters to refine." },
        { status: 400 }
      );
    }

    const client = getGroqClient();

    // Ultra-optimized short system prompt to minimize token consumption
    const systemPrompt =
      "You are an expert resume and document copy editor. Polish the text to sound professional, impactful, clear, and ATS-friendly. Return ONLY the refined text without intro or quotation marks.";

    const userPrompt = `Field: ${fieldName || "cover letter section"}\nText: ${text.trim()}`;

    const completion = await client.chat.completions.create({
      model: getGroqModel(),
      reasoning_effort: "low",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    const refinedText =
      completion.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g, "") || text;

    return NextResponse.json({ refinedText });
  } catch (error: unknown) {
    console.error("AI Refine Text error:", error);
    return NextResponse.json(
      { error: "Failed to refine text. Please try again." },
      { status: 500 }
    );
  }
}
