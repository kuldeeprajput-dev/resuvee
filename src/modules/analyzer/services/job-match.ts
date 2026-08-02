import type { ResumeData } from "@/modules/resume";

const STOP_WORDS = new Set([
  // Common English conjunctions, prepositions, pronouns, generic verbs & adjectives
  "a", "about", "above", "across", "after", "again", "against", "all", "almost", "alone", "along",
  "already", "also", "always", "am", "among", "an", "and", "another", "any", "anybody", "anyone",
  "anything", "are", "around", "as", "at", "be", "because", "been", "before", "being", "below",
  "between", "both", "but", "by", "can", "cannot", "could", "did", "do", "does", "doing", "done",
  "down", "during", "each", "either", "else", "enough", "etc", "even", "ever", "every", "everyone",
  "everything", "everywhere", "few", "for", "from", "further", "get", "gets", "getting", "give",
  "gives", "given", "giving", "go", "goes", "going", "gone", "good", "got", "great", "had", "has",
  "have", "having", "he", "her", "here", "hers", "herself", "him", "himself", "his", "how", "i",
  "if", "in", "into", "is", "it", "its", "itself", "just", "know", "knows", "known", "knowing",
  "like", "likes", "liked", "liking", "look", "looking", "looks", "made", "make", "makes", "making",
  "many", "may", "me", "might", "more", "most", "much", "must", "my", "myself", "need", "needs",
  "needed", "needing", "no", "nor", "not", "nothing", "now", "of", "off", "on", "once", "one",
  "only", "onto", "or", "other", "others", "our", "ours", "ourselves", "out", "over", "own",
  "please", "preferred", "prefer", "prefers", "preferred", "preferring", "provide", "provides",
  "provided", "providing", "quite", "rather", "really", "required", "require", "requires",
  "requiring", "responsible", "responsibility", "responsibilities", "role", "roles", "said",
  "same", "see", "sees", "seen", "seeing", "should", "since", "so", "some", "someone", "something",
  "still", "such", "take", "takes", "taking", "taken", "than", "that", "the", "their", "theirs",
  "them", "themselves", "then", "there", "these", "they", "this", "those", "through", "to", "too",
  "under", "until", "up", "upon", "us", "use", "uses", "used", "using", "very", "want", "wants",
  "wanted", "wanting", "was", "we", "well", "were", "what", "whatever", "when", "where", "which",
  "while", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without",
  "work", "works", "worked", "working", "would", "yes", "yet", "you", "your", "yours", "yourself",
  "yourselves", "ability", "able", "about", "candidate", "candidates", "applicant", "applicants",
  "looking", "hiring", "join", "joining", "team", "teams", "company", "companies", "opportunity",
  "opportunities", "description", "position", "positions", "job", "jobs", "duty", "duties",
  "task", "tasks", "summary", "overview", "qualification", "qualifications", "requirement",
  "requirements", "ideal", "successful", "environment", "day", "daily", "strong", "excellent",
  "high", "highly", "level", "years", "year", "month", "months", "experience", "experienced",
]);

// Known Multi-word Professional Domains, Technologies & Roles
const RECOGNIZED_PHRASES = [
  // Tech Stack & Engineering
  "software engineering", "software development", "web development", "mobile development",
  "full stack", "front end", "back end", "system design", "microservices architecture",
  "cloud computing", "devops engineering", "continuous integration", "continuous delivery",
  "quality assurance", "test driven development", "agile development", "scrum master",
  "data engineering", "data science", "data analytics", "data visualization", "machine learning",
  "artificial intelligence", "deep learning", "natural language processing", "computer vision",
  "database management", "relational database", "no sql", "rest api", "graphql api",
  "ui ux design", "user experience", "user interface", "design systems", "product management",
  "product design", "project management", "technical leadership", "code review",
  // Business, Product & Operations
  "account management", "business intelligence", "change management", "content strategy",
  "cross functional", "customer experience", "customer success", "go to market",
  "market research", "people management", "product discovery", "product strategy",
  "stakeholder management", "strategic planning", "team leadership", "user research",
  "risk management", "financial modeling", "budget management", "vendor management",
];

// Recognized Professional Tech Stack, Tools & Core Skills Dictionary (lowercase)
const TECH_AND_SKILL_VOCABULARY = new Set([
  // Programming Languages & Web
  "react", "next.js", "nextjs", "vue", "vuejs", "angular", "node", "nodejs", "express", "expressjs",
  "typescript", "javascript", "python", "java", "c++", "c#", "go", "golang", "rust", "ruby",
  "php", "swift", "kotlin", "html", "html5", "css", "css3", "sass", "tailwind", "bootstrap",
  "redux", "zustand", "graphql", "rest", "soap", "json", "xml", "webassembly", "webpack", "vite",
  // Databases & Storage
  "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch", "sqlite", "dynamodb",
  "cassandra", "oracle", "sql", "nosql", "prisma", "sequelize", "typeorm", "firebase", "supabase",
  "snowflake", "bigquery", "redshift", "databricks", "spark", "hadoop", "kafka",
  // Cloud & DevOps
  "aws", "amazon", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s", "terraform",
  "ansible", "jenkins", "github", "gitlab", "bitbucket", "ci/cd", "circleci", "nginx", "apache",
  "linux", "bash", "shell", "powershell", "serverless", "microservices", "datadog", "newrelic",
  // AI, ML & Data
  "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras", "opencv", "llm", "groq",
  "openai", "prompt", "langchain", "tableau", "power bi", "powerbi", "excel", "spark", "airflow",
  // Design, PM & Tools
  "figma", "sketch", "adobe", "photoshop", "illustrator", "jira", "confluence", "trello", "asana",
  "notion", "slack", "salesforce", "hubspot", "zendesk", "google analytics", "postman", "git",
  // Roles & Methodologies
  "agile", "scrum", "kanban", "waterfall", "devops", "sre", "ci", "cd", "qa", "ux", "ui", "seo",
  "b2b", "b2c", "saas", "paas", "iaas", "api", "apis", "etl", "sdk", "sdks", "cli",
]);

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
      ...data.experience.flatMap((item) => [item.role, item.company, ...item.highlights]),
      ...data.education.flatMap((item) => [item.degree, item.school, item.details]),
      ...data.projects.flatMap((item) => [item.name, item.description, ...item.highlights]),
      ...data.skillGroups.flatMap((group) => [group.name, ...group.skills]),
    ].join(" ")
  );
}

function isRelevantJobKeyword(word: string): boolean {
  const lower = word.toLowerCase().trim();
  if (lower.length < 2 || STOP_WORDS.has(lower) || /^\d+$/.test(lower)) {
    return false;
  }
  // Check if it matches tech stack, skill vocabulary, or valid professional terms
  if (TECH_AND_SKILL_VOCABULARY.has(lower)) return true;

  // Accept valid technical or domain terms (capitalized in original, contains +, #, or length >= 4 without generic stop words)
  if (lower.length >= 4 && !STOP_WORDS.has(lower)) {
    return true;
  }

  return false;
}

function extractKeywords(description: string) {
  const normalized = normalize(description);
  if (!normalized) return [];

  // 1. Check recognized multi-word phrases
  const phraseMatches = RECOGNIZED_PHRASES.filter((phrase) => normalized.includes(phrase));

  // 2. Check individual words against professional relevance filter
  const frequencies = new Map<string, number>();

  normalized.split(" ").forEach((word) => {
    if (isRelevantJobKeyword(word)) {
      frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
    }
  });

  const words = [...frequencies.entries()]
    .sort((first, second) => {
      if (second[1] !== first[1]) return second[1] - first[1];
      return second[0].length - first[0].length;
    })
    .map(([word]) => word);

  // Exclude single words that are already covered by an extracted phrase
  const filteredWords = words.filter(
    (w) => !phraseMatches.some((phrase) => phrase.includes(w))
  );

  return [...new Set([...phraseMatches, ...filteredWords])].slice(0, 24);
}

function hasKeyword(resumeText: string, keyword: string) {
  if (resumeText.includes(keyword)) return true;
  const parts = keyword.split(" ");
  return parts.length > 1 && parts.every((part) => resumeText.includes(part));
}

export function analyzeJobMatch(data: ResumeData, description: string): JobMatchResult {
  const keywords = extractKeywords(description);
  if (!keywords.length) {
    return { score: 0, matched: [], missing: [], keywordCount: 0 };
  }

  const resumeText = resumeToText(data);
  const matched = keywords.filter((keyword) => hasKeyword(resumeText, keyword));
  const missing = keywords.filter((keyword) => !hasKeyword(resumeText, keyword));

  return {
    score: Math.round((matched.length / keywords.length) * 100),
    matched,
    missing,
    keywordCount: keywords.length,
  };
}
