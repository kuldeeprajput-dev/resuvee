import type { Metadata } from "next";
import { JobTracker } from "@/modules/job-tracker";

export const metadata: Metadata = {
  title: "Job Application Tracker | Resulyra",
  description:
    "Track saved roles, applications, interviews, offers, notes, and next steps locally.",
};

export default function JobTrackerPage() {
  return <JobTracker />;
}
