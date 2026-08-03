import type { ResumeData } from "../types/resume";
import type { SelectedCanvasElement } from "../ui/components/interactive-canvas";

export function findSelectedCanvasElement(
  clickedText: string,
  elem: HTMLElement,
  data: ResumeData
): { found: SelectedCanvasElement; inlineText: string } {
  let found: SelectedCanvasElement | null = null;
  let inlineText = "";

  // Basics fields
  if (clickedText === data.basics.fullName || elem.tagName.toLowerCase() === "h1") {
    found = { section: "basics", field: "fullName", title: "Full Name" };
    inlineText = data.basics.fullName;
  } else if (clickedText === data.basics.headline) {
    found = { section: "basics", field: "headline", title: "Headline" };
    inlineText = data.basics.headline;
  } else if (clickedText === data.basics.summary) {
    found = { section: "basics", field: "summary", title: "Summary" };
    inlineText = data.basics.summary;
  } else if (clickedText === data.basics.email) {
    found = { section: "basics", field: "email", title: "Email" };
    inlineText = data.basics.email;
  } else if (clickedText === data.basics.phone) {
    found = { section: "basics", field: "phone", title: "Phone" };
    inlineText = data.basics.phone;
  } else if (clickedText === data.basics.location) {
    found = { section: "basics", field: "location", title: "Location" };
    inlineText = data.basics.location;
  }

  // Experience
  if (!found) {
    for (const item of data.experience) {
      if (clickedText === item.role) {
        found = {
          section: "experience",
          id: item.id,
          field: "role",
          title: "Job Role",
          subtitle: item.company,
        };
        inlineText = item.role;
        break;
      } else if (clickedText.includes(item.company)) {
        found = {
          section: "experience",
          id: item.id,
          field: "company",
          title: "Company",
          subtitle: item.role,
        };
        inlineText = item.company;
        break;
      } else {
        const hIndex = item.highlights.findIndex(
          (hl) => clickedText.includes(hl) || hl.includes(clickedText)
        );
        if (hIndex !== -1) {
          found = {
            section: "experience",
            id: item.id,
            field: "highlight",
            highlightIndex: hIndex,
            title: "Highlight",
          };
          inlineText = item.highlights[hIndex];
          break;
        }
      }
    }
  }

  // Education
  if (!found) {
    for (const item of data.education) {
      if (clickedText === item.degree) {
        found = {
          section: "education",
          id: item.id,
          field: "degree",
          title: "Degree",
          subtitle: item.school,
        };
        inlineText = item.degree;
        break;
      } else if (clickedText === item.school) {
        found = {
          section: "education",
          id: item.id,
          field: "school",
          title: "School",
          subtitle: item.degree,
        };
        inlineText = item.school;
        break;
      } else if (item.details && clickedText.includes(item.details)) {
        found = {
          section: "education",
          id: item.id,
          field: "details",
          title: "Education Details",
        };
        inlineText = item.details;
        break;
      }
    }
  }

  // Projects
  if (!found) {
    for (const item of data.projects) {
      if (clickedText === item.name) {
        found = { section: "projects", id: item.id, field: "name", title: "Project Name" };
        inlineText = item.name;
        break;
      } else if (clickedText === item.description) {
        found = {
          section: "projects",
          id: item.id,
          field: "description",
          title: "Project Description",
        };
        inlineText = item.description;
        break;
      }
    }
  }

  // Skills
  if (!found) {
    for (const group of data.skillGroups) {
      if (clickedText === group.name) {
        found = { section: "skills", id: group.id, field: "name", title: "Skill Category" };
        inlineText = group.name;
        break;
      } else if (group.skills.some((s) => clickedText.includes(s))) {
        found = { section: "skills", id: group.id, field: "skills", title: "Skills List" };
        inlineText = group.skills.join(", ");
        break;
      }
    }
  }

  // Awards and certifications
  if (!found) {
    for (const item of data.certifications ?? []) {
      if (clickedText === item.title) {
        found = {
          section: "certifications",
          id: item.id,
          field: "title",
          title: "Award or certification",
          subtitle: item.issuer,
        };
        inlineText = item.title;
        break;
      } else if (clickedText === item.issuer) {
        found = {
          section: "certifications",
          id: item.id,
          field: "issuer",
          title: "Issuer",
          subtitle: item.title,
        };
        inlineText = item.issuer;
        break;
      } else if (clickedText === item.description) {
        found = {
          section: "certifications",
          id: item.id,
          field: "description",
          title: "Credential detail",
          subtitle: item.title,
        };
        inlineText = item.description;
        break;
      }
    }
  }

  // Fallback
  if (!found) {
    found = {
      section: "basics",
      field: "fullName",
      title: "Selected Text",
    };
    inlineText = clickedText;
  }

  return { found, inlineText };
}
