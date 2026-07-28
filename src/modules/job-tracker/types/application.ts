export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interview"
  | "offer";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  link: string;
  status: ApplicationStatus;
  nextStep: string;
  dueDate: string;
  notes: string;
  createdAt: string;
}
