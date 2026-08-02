export interface AnalysisCategoryScore {
  name: string;
  score: number;
  weight: number;
  status: "excellent" | "good" | "needs-work" | "critical";
  feedback: string[];
}

export interface AnalysisInsight {
  type: "strength" | "weakness" | "improvement";
  category: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

export interface ResumeAnalysis {
  role: string;
  level: string;
  score: number;
  summary?: string;
  advice?: string;
  strengths: string[];
  weaknesses: string[];
  improvements?: string[];
  suggestions?: string[];
  categoryScores?: AnalysisCategoryScore[];
  insights?: AnalysisInsight[];
  skillsFound?: string[];
  skillsMissing?: string[];
  missingKeywords: string[];
  techStack: string[];
  atsCompatibility?: {
    formattingScore: number;
    parseabilityScore: number;
    keywordMatchScore: number;
    issues: string[];
  };
}

export interface AnalyzeSuccessResponse {
  success: true;
  data: ResumeAnalysis;
}

export interface AnalyzeErrorResponse {
  success: false;
  error: string;
}

export type AnalyzeResponse = AnalyzeSuccessResponse | AnalyzeErrorResponse;
