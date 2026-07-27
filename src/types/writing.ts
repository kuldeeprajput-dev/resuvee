export interface WritingTarget {
  id: string;
  label: string;
  text: string;
}

export type WritingIssueType = "spelling" | "grammar" | "clarity";

export interface WritingIssue {
  id: string;
  targetId: string;
  label: string;
  type: WritingIssueType;
  original: string;
  replacement: string;
  explanation: string;
}

export interface WritingCheckResponse {
  issues: WritingIssue[];
}
