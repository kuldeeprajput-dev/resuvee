export type CoverLetterTheme = "linen" | "signal" | "ledger";

export interface CoverLetterData {
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
