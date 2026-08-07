import type { CoverLetterData, CanvasTheme, ThemeOption, ColorSwatch } from "../types/cover-letter";

export const STORAGE_KEY = "resuvee_cover_letter";
export const RESUME_KEY = "resuvee_builder_draft";

export const emptyLetter: CoverLetterData = {
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  recipient: "",
  company: "",
  role: "",
  date: "",
  greeting: "",
  opening: "",
  evidence: "",
  closing: "",
  signoff: "",
};

export const themes: ThemeOption[] = [
  {
    id: "linen",
    name: "Linen",
    description: "Warm and editorial",
    accent: "#537c45",
  },
  {
    id: "signal",
    name: "Signal",
    description: "Modern color rail",
    accent: "#1e3a8a",
  },
  {
    id: "ledger",
    name: "Ledger",
    description: "Crisp and traditional",
    accent: "#1c1917",
  },
];

export const COLOR_SWATCHES: ColorSwatch[] = [
  { name: "Black", value: "#000000" },
  { name: "Forest", value: "#28785b" },
  { name: "Charcoal", value: "#1e2320" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Deep Blue", value: "#203b57" },
  { name: "Plum", value: "#581c87" },
];

export const themeStyles: Record<CanvasTheme, string> = {
  dots: "bg-[#e5e7e2] bg-[radial-gradient(#b8beb5_1.2px,transparent_1.2px)] bg-size-[20px_20px]",
  grid: "bg-[#e8e9e4] bg-[linear-gradient(to_right,#d2d6cd_1px,transparent_1px),linear-gradient(to_bottom,#d2d6cd_1px,transparent_1px)] bg-size-[24px_24px]",
  studio: "bg-[#1e2320] bg-[radial-gradient(#3a453f_1.5px,transparent_1.5px)] bg-size-[24px_24px]",
  clean: "bg-[#dfe2dc]",
};

export function getStarterCopy(data: CoverLetterData) {
  const role = data.role || "this role";
  const company = data.company || "your team";
  return {
    greeting: data.greeting || "Dear hiring team,",
    opening: `I am excited to apply for ${role} at ${company}. My background in ${data.headline || "building thoughtful, measurable work"} has taught me how to turn complex goals into focused action while keeping customers and collaborators at the center.`,
    evidence:
      "In my recent work, I have led cross-functional projects from early discovery through delivery, created practical systems that improved team performance, and communicated decisions clearly across technical and business groups. I would bring that same combination of curiosity, ownership, and steady execution to this opportunity.",
    closing: `I would welcome the chance to learn more about ${company} and discuss how my experience could support the team's priorities. Thank you for your time and consideration.`,
    signoff: data.signoff || "Sincerely,",
  };
}
