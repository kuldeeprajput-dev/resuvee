import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getGroqModel } from "@/shared/lib/groq-model";
import { createClient } from "@/shared/lib/supabase/server";

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
    timeout: 30000,
    maxRetries: 2,
  });

  return openaiInstance;
}

const userLastGenMap = new Map<string, number>();
const COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required. Please sign in to generate cover letters with AI.",
        },
        { status: 401 }
      );
    }

    const userId = user.id;
    const now = Date.now();
    const lastGen = userLastGenMap.get(userId);

    if (lastGen && now - lastGen < COOLDOWN_MS) {
      const remainingMs = COOLDOWN_MS - (now - lastGen);
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      const mins = Math.floor(remainingSeconds / 60);
      const secs = remainingSeconds % 60;
      const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${timeStr} before generating another cover letter with AI.`,
          remainingSeconds,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { role, company, headline, keyPoints, tone } = body as {
      role?: string;
      company?: string;
      headline?: string;
      keyPoints?: string;
      tone?: string;
    };

    const targetRole = role?.trim();
    const targetCompany = company?.trim();
    const userHeadline = headline?.trim();
    const extraInfo = keyPoints?.trim();
    const writingTone = tone?.trim() || "Professional";

    if (!targetRole || !targetCompany || !userHeadline || !extraInfo) {
      return NextResponse.json(
        {
          success: false,
          error:
            "All fields (Target Role, Target Company, Title/Specialty, and Key Skills) are required to generate an AI cover letter.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      // Fallback if GROQ_API_KEY is not set
      return NextResponse.json({
        success: true,
        data: {
          greeting: `Dear ${targetCompany} Hiring Team,`,
          opening: `I am thrilled to submit my application for the ${targetRole} role at ${targetCompany}. With a proven background as a ${userHeadline}, I have consistently focused on delivering measurable outcomes, driving strategic alignment, and solving complex challenges.`,
          evidence: `Throughout my career, I have specialized in ${extraInfo}. At my previous roles, I led cross-functional initiatives that directly increased operational efficiency and user engagement. I pride myself on bridging technical craftsmanship with business strategy, ensuring that every project creates lasting value.`,
          closing: `I would welcome the opportunity to discuss how my background in ${userHeadline} aligns with the goals at ${targetCompany}. Thank you for your time and consideration.`,
          signoff: "Sincerely,",
        },
      });
    }

    const client = getGroqClient();

    const systemPrompt = `You are a world-class executive resume and cover letter writer. 
Generate a compelling, highly customized cover letter in JSON format.
Return ONLY valid JSON matching this exact JSON schema:
{
  "greeting": "Dear Hiring Manager,",
  "opening": "Opening paragraph explaining passion for the role...",
  "evidence": "Body paragraph demonstrating proof of impact and relevant skills...",
  "closing": "Closing paragraph with a clear, warm call to action...",
  "signoff": "Sincerely,"
}`;

    const userPrompt = `Role: ${targetRole}
Company: ${targetCompany}
Professional Specialty: ${userHeadline}
Key Focus / Skills: ${extraInfo}
Tone: ${writingTone}

Write an exceptional, impact-driven cover letter. Avoid generic buzzwords; emphasize clear value and ownership.`;

    const response = await client.chat.completions.create({
      model: getGroqModel(),
      reasoning_effort: "low",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "";
    const parsed = JSON.parse(content);

    userLastGenMap.set(userId, Date.now());

    return NextResponse.json({
      success: true,
      data: {
        greeting: parsed.greeting || `Dear ${targetCompany} Hiring Team,`,
        opening: parsed.opening || "",
        evidence: parsed.evidence || "",
        closing: parsed.closing || "",
        signoff: parsed.signoff || "Sincerely,",
      },
    });
  } catch (error) {
    console.error("Groq AI Cover Letter generation error:", error);

    const targetRole = "this position";
    const targetCompany = "your company";

    return NextResponse.json({
      success: true,
      data: {
        greeting: `Dear Hiring Team,`,
        opening: `I am writing to express my strong interest in ${targetRole} at ${targetCompany}. My career has been built on taking ownership, solving complex problems, and delivering tangible results.`,
        evidence: `In my experience, I have focused on executing high-impact initiatives, fostering cross-functional collaboration, and continuously elevating quality standards. I bring a combination of domain knowledge and practical problem-solving to every project.`,
        closing: `I would love to learn more about the team's goals and explore how my experience can contribute to your success. Thank you for reviewing my application.`,
        signoff: "Sincerely,",
      },
    });
  }
}
