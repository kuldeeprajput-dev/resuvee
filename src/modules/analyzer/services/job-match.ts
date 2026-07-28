import type { ResumeData } from "@/modules/resume";

const STOP_WORDS = new Set([
  "about",
  "after",
  "also",
  "been",
  "being",
  "both",
  "can",
  "company",
  "could",
  "each",
  "from",
  "have",
  "into",
  "more",
  "must",
  "other",
  "our",
  "role",
  "should",
  "than",
  "that",
  "their",
  "them",
  "these",
  "they",
  "this",
  "through",
  "using",
  "will",
  "with",
  "work",
  "you",
  "your",
]);

const RECOGNIZED_PHRASES = [
  "account management",
  "agile development",
  "artificial intelligence",
  "business intelligence",
  "change management",
  "cloud computing",
  "content strategy",
  "continuous integration",
  "cross functional",
  "customer experience",
  "customer success",
  "data analysis",
  "data visualization",
  "design systems",
  "digital marketing",
  "go to market",
  "machine learning",
  "market research",
  "people management",
  "product discovery",
  "product management",
  "product strategy",
  "project management",
  "quality assurance",
  "search engine optimization",
  "software development",
  "stakeholder management",
  "strategic planning",
  "team leadership",
  "user experience",
  "user research",
];

export interface JobMatchResult {
  score: number;
  matched: string[];
  missing: string[];
  keywordCount: number;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+#.\s-]/gu, " ")
    .replace(/[-/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resumeToText(data: ResumeData) {
  return normalize(
    [
      data.basics.headline,
      data.basics.summary,
      ...data.experience.flatMap((item) => [
        item.role,
        item.company,
        ...item.highlights,
      ]),
      ...data.education.flatMap((item) => [
        item.degree,
        item.school,
        item.details,
      ]),
      ...data.projects.flatMap((item) => [
        item.name,
        item.description,
        ...item.highlights,
      ]),
      ...data.skillGroups.flatMap((group) => [
        group.name,
        ...group.skills,
      ]),
    ].join(" "),
  );
}

function extractKeywords(description: string) {
  const normalized = normalize(description);
  if (!normalized) return [];

  const phraseMatches = RECOGNIZED_PHRASES.filter((phrase) =>
    normalized.includes(phrase),
  );
  const frequencies = new Map<string, number>();

  normalized.split(" ").forEach((word) => {
    if (
      word.length < 3 ||
      STOP_WORDS.has(word) ||
      /^\d+$/.test(word)
    ) {
      return;
    }
    frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
  });

  const words = [...frequencies.entries()]
    .sort((first, second) => {
      if (second[1] !== first[1]) return second[1] - first[1];
      return second[0].length - first[0].length;
    })
    .map(([word]) => word);

  return [...new Set([...phraseMatches, ...words])].slice(0, 24);
}

function hasKeyword(resumeText: string, keyword: string) {
  if (resumeText.includes(keyword)) return true;
  const parts = keyword.split(" ");
  return parts.length > 1 && parts.every((part) => resumeText.includes(part));
}

export function analyzeJobMatch(
  data: ResumeData,
  description: string,
): JobMatchResult {
  const keywords = extractKeywords(description);
  if (!keywords.length) {
    return { score: 0, matched: [], missing: [], keywordCount: 0 };
  }

  const resumeText = resumeToText(data);
  const matched = keywords.filter((keyword) =>
    hasKeyword(resumeText, keyword),
  );
  const missing = keywords.filter(
    (keyword) => !hasKeyword(resumeText, keyword),
  );

  return {
    score: Math.round((matched.length / keywords.length) * 100),
    matched,
    missing,
    keywordCount: keywords.length,
  };
}
