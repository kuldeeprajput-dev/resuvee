import type { ResumeData } from "../types/resume";
import type { WritingIssue, WritingTarget } from "../types/writing";

export function getResumeWritingTargets(data: ResumeData): WritingTarget[] {
  const targets: WritingTarget[] = [
    {
      id: "basics.headline",
      label: "Professional headline",
      text: data.basics.headline,
    },
    {
      id: "basics.summary",
      label: "Professional summary",
      text: data.basics.summary,
    },
  ];

  data.experience.forEach((item) => {
    targets.push({
      id: `experience.${item.id}.role`,
      label: `${item.company || "Experience"} job title`,
      text: item.role,
    });
    item.highlights.forEach((highlight, index) => {
      targets.push({
        id: `experience.${item.id}.highlight.${index}`,
        label: `${item.role || "Experience"} bullet ${index + 1}`,
        text: highlight,
      });
    });
  });

  data.education.forEach((item) => {
    targets.push({
      id: `education.${item.id}.degree`,
      label: `${item.school || "Education"} qualification`,
      text: item.degree,
    });
    targets.push({
      id: `education.${item.id}.details`,
      label: `${item.school || "Education"} details`,
      text: item.details,
    });
  });

  data.projects.forEach((item) => {
    targets.push({
      id: `project.${item.id}.name`,
      label: "Project name",
      text: item.name,
    });
    targets.push({
      id: `project.${item.id}.description`,
      label: `${item.name || "Project"} description`,
      text: item.description,
    });
    item.highlights.forEach((highlight, index) => {
      targets.push({
        id: `project.${item.id}.highlight.${index}`,
        label: `${item.name || "Project"} outcome ${index + 1}`,
        text: highlight,
      });
    });
  });

  return targets.filter((target) => target.text.trim().length >= 3);
}

function replaceIssueText(text: string, issue: WritingIssue) {
  if (!text.includes(issue.original)) return text;
  return text.replace(issue.original, issue.replacement);
}

export function applyWritingIssue(data: ResumeData, issue: WritingIssue): ResumeData {
  if (issue.targetId === "basics.headline") {
    return {
      ...data,
      basics: {
        ...data.basics,
        headline: replaceIssueText(data.basics.headline, issue),
      },
    };
  }
  if (issue.targetId === "basics.summary") {
    return {
      ...data,
      basics: {
        ...data.basics,
        summary: replaceIssueText(data.basics.summary, issue),
      },
    };
  }

  const parts = issue.targetId.split(".");
  const [section, id, field, indexValue] = parts;

  if (section === "experience") {
    return {
      ...data,
      experience: data.experience.map((item) => {
        if (item.id !== id) return item;
        if (field === "role") {
          return {
            ...item,
            role: replaceIssueText(item.role, issue),
          };
        }
        if (field === "highlight") {
          const index = Number(indexValue);
          return {
            ...item,
            highlights: item.highlights.map((highlight, itemIndex) =>
              itemIndex === index ? replaceIssueText(highlight, issue) : highlight
            ),
          };
        }
        return item;
      }),
    };
  }

  if (section === "education") {
    return {
      ...data,
      education: data.education.map((item) => {
        if (item.id !== id) return item;
        if (field === "degree") {
          return {
            ...item,
            degree: replaceIssueText(item.degree, issue),
          };
        }
        if (field === "details") {
          return {
            ...item,
            details: replaceIssueText(item.details, issue),
          };
        }
        return item;
      }),
    };
  }

  if (section === "project") {
    return {
      ...data,
      projects: data.projects.map((item) => {
        if (item.id !== id) return item;
        if (field === "name") {
          return {
            ...item,
            name: replaceIssueText(item.name, issue),
          };
        }
        if (field === "description") {
          return {
            ...item,
            description: replaceIssueText(item.description, issue),
          };
        }
        if (field === "highlight") {
          const index = Number(indexValue);
          return {
            ...item,
            highlights: item.highlights.map((highlight, itemIndex) =>
              itemIndex === index ? replaceIssueText(highlight, issue) : highlight
            ),
          };
        }
        return item;
      }),
    };
  }

  return data;
}

export function applyWritingIssues(data: ResumeData, issues: WritingIssue[]) {
  return issues.reduce((current, issue) => applyWritingIssue(current, issue), data);
}
