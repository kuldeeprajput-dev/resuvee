import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, company, headline, keyPoints, tone } = body as {
      role?: string;
      company?: string;
      headline?: string;
      keyPoints?: string;
      tone?: string;
    };

    const targetRole = role?.trim() || "Product Specialist";
    const targetCompany = company?.trim() || "the hiring team";
    const userHeadline = headline?.trim() || "Professional";
    const extraInfo = keyPoints?.trim() || "building high-performing products, collaborative leadership, and driving user growth";
    const writingTone = tone?.trim() || "Professional";

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
      model: "llama-3.3-70b-versatile",
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
