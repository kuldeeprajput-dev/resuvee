import type { ResumeData, ResumeTemplateId } from "../types/resume";
import {
  meridianData,
  editorialData,
  summitData,
  columnData,
  horizonData,
  blueprintData,
  standardData,
  compactData,
  bridgeData,
  financeData,
  healthcareData,
  salesData,
  analystData,
  launchpadData,
  firstStepData,
  pivotData,
} from "./resume-preset-data";

/**
 * Maps each ResumeTemplateId to its starter ResumeData.
 * Template IDs are the public "slug" (e.g. "nova"), while data vars use
 * the renderer name (e.g. meridianData).
 */
export const templateStarterData: Record<ResumeTemplateId, ResumeData> = {
  nova: meridianData,
  classic: editorialData,
  executive: summitData,
  minimal: columnData,
  studio: horizonData,
  terminal: blueprintData,
  standard: standardData,
  compact: compactData,
  hybrid: bridgeData,
  finance: financeData,
  healthcare: healthcareData,
  sales: salesData,
  analyst: analystData,
  fresher: launchpadData,
  internship: firstStepData,
  "career-change": pivotData,
};
