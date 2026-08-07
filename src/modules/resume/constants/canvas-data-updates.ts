import type { ResumeData } from "../types/resume";
import type { SelectedCanvasElement } from "../ui/components/interactive-canvas";

export function updateDataForFieldChange(
  data: ResumeData,
  selectedElement: SelectedCanvasElement,
  newText: string
): ResumeData {
  const { section, id, field, highlightIndex } = selectedElement;

  if (section === "basics") {
    const fieldKey = (field || "fullName") as keyof ResumeData["basics"];
    return {
      ...data,
      basics: { ...data.basics, [fieldKey]: newText },
    };
  } else if (section === "experience" && id) {
    return {
      ...data,
      experience: data.experience.map((item) => {
        if (item.id !== id) return item;
        if (field === "company") return { ...item, company: newText };
        if (field === "highlight" && highlightIndex !== undefined) {
          const nextH = [...item.highlights];
          nextH[highlightIndex] = newText;
          return { ...item, highlights: nextH };
        }
        return { ...item, role: newText };
      }),
    };
  } else if (section === "education" && id) {
    return {
      ...data,
      education: data.education.map((item) => {
        if (item.id !== id) return item;
        if (field === "school") return { ...item, school: newText };
        if (field === "details") return { ...item, details: newText };
        return { ...item, degree: newText };
      }),
    };
  } else if (section === "projects" && id) {
    return {
      ...data,
      projects: data.projects.map((item) => {
        if (item.id !== id) return item;
        if (field === "description") return { ...item, description: newText };
        return { ...item, name: newText };
      }),
    };
  } else if (section === "skills" && id) {
    return {
      ...data,
      skillGroups: data.skillGroups.map((group) => {
        if (group.id !== id) return group;
        if (field === "skills") {
          return {
            ...group,
            skills: newText
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          };
        }
        return { ...group, name: newText };
      }),
    };
  } else if (section === "certifications" && id) {
    return {
      ...data,
      certifications: (data.certifications ?? []).map((item) => {
        if (item.id !== id) return item;
        if (field === "issuer") return { ...item, issuer: newText };
        if (field === "description") {
          return { ...item, description: newText };
        }
        if (field === "date") return { ...item, date: newText };
        return { ...item, title: newText };
      }),
    };
  }

  return data;
}

export function duplicateSelectedItem(
  data: ResumeData,
  selectedElement: SelectedCanvasElement
): ResumeData | null {
  if (selectedElement.section === "experience" && selectedElement.id) {
    const target = data.experience.find((i) => i.id === selectedElement.id);
    if (target) {
      return {
        ...data,
        experience: [
          ...data.experience,
          { ...target, id: `exp-${Date.now()}`, role: `${target.role} (Copy)` },
        ],
      };
    }
  } else if (selectedElement.section === "education" && selectedElement.id) {
    const target = data.education.find((i) => i.id === selectedElement.id);
    if (target) {
      return {
        ...data,
        education: [
          ...data.education,
          { ...target, id: `edu-${Date.now()}`, degree: `${target.degree} (Copy)` },
        ],
      };
    }
  } else if (selectedElement.section === "projects" && selectedElement.id) {
    const target = data.projects.find((i) => i.id === selectedElement.id);
    if (target) {
      return {
        ...data,
        projects: [
          ...data.projects,
          { ...target, id: `proj-${Date.now()}`, name: `${target.name} (Copy)` },
        ],
      };
    }
  } else if (selectedElement.section === "certifications" && selectedElement.id) {
    const certifications = data.certifications ?? [];
    const target = certifications.find((item) => item.id === selectedElement.id);
    if (target) {
      return {
        ...data,
        certifications: [
          ...certifications,
          {
            ...target,
            id: `cert-${Date.now()}`,
            title: `${target.title} (Copy)`,
          },
        ],
      };
    }
  }

  return null;
}

export function deleteSelectedItem(
  data: ResumeData,
  selectedElement: SelectedCanvasElement
): ResumeData {
  if (selectedElement.section === "experience" && selectedElement.id) {
    return {
      ...data,
      experience: data.experience.filter((i) => i.id !== selectedElement.id),
    };
  } else if (selectedElement.section === "education" && selectedElement.id) {
    return {
      ...data,
      education: data.education.filter((i) => i.id !== selectedElement.id),
    };
  } else if (selectedElement.section === "projects" && selectedElement.id) {
    return {
      ...data,
      projects: data.projects.filter((i) => i.id !== selectedElement.id),
    };
  } else if (selectedElement.section === "certifications" && selectedElement.id) {
    return {
      ...data,
      certifications: (data.certifications ?? []).filter((item) => item.id !== selectedElement.id),
    };
  }

  return data;
}
