export type LetterTheme = "linen" | "signal" | "ledger";
export type CanvasTheme = "dots" | "grid" | "studio" | "clean";
export type TypographyFont = "template" | "sans" | "serif" | "mono";
export type PageSpacing = "compact" | "normal" | "spacious";

export interface LetterData {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  recipient: string;
  company: string;
  role: string;
  date: string;
  greeting: string;
  opening: string;
  evidence: string;
  closing: string;
  signoff: string;
}

export interface ThemeOption {
  id: LetterTheme;
  name: string;
  description: string;
  accent: string;
}

export interface ColorSwatch {
  name: string;
  value: string;
}
