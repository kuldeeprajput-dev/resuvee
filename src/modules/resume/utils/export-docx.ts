import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from "docx";
import type { ResumeData } from "../types/resume";

export async function exportResumeDocx(data: ResumeData, accent = "#28785b") {
  const accentHex = accent.replace("#", "").toUpperCase() || "28785B";
  const docFont = "Calibri";

  const title = data.basics.fullName
    ? `${data.basics.fullName}'s Resume`
    : "Resume";

  const fileName = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}.docx`;

  const paragraphs: Paragraph[] = [];

  // 1. Full Name
  if (data.basics.fullName) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 60 },
        children: [
          new TextRun({
            text: data.basics.fullName,
            bold: true,
            size: 36, // 18pt
            color: accentHex,
            font: docFont,
          }),
        ],
      })
    );
  }

  // 2. Headline / Target Role
  if (data.basics.headline) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: data.basics.headline.toUpperCase(),
            bold: true,
            size: 18, // 9pt
            color: "555555",
            characterSpacing: 15,
            font: docFont,
          }),
        ],
      })
    );
  }

  // 3. Contact Details Bar
  const contactParts = [
    data.basics.email,
    data.basics.phone,
    data.basics.location,
    data.basics.website,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactParts.join("   ·   "),
            size: 18, // 9pt
            color: "666666",
            font: docFont,
          }),
        ],
      })
    );
  }

  // Helper for Section Heading
  const addSectionHeading = (text: string) => {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 240, after: 120 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: accentHex },
        },
        children: [
          new TextRun({
            text: text.toUpperCase(),
            bold: true,
            size: 22, // 11pt
            color: accentHex,
            font: docFont,
          }),
        ],
      })
    );
  };

  // 4. Summary Section
  if (data.basics.summary?.trim()) {
    addSectionHeading("Professional Summary");
    paragraphs.push(
      new Paragraph({
        spacing: { after: 160, line: 250 },
        children: [
          new TextRun({
            text: data.basics.summary.trim(),
            size: 20, // 10pt
            color: "333333",
            font: docFont,
          }),
        ],
      })
    );
  }

  // 5. Work Experience Section
  if (data.experience && data.experience.length > 0) {
    addSectionHeading("Work Experience");
    for (const exp of data.experience) {
      const dates = [exp.startDate, exp.current ? "Present" : exp.endDate]
        .filter(Boolean)
        .join(" — ");

      paragraphs.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: exp.role || "Role",
              bold: true,
              size: 21, // 10.5pt
              color: "111111",
              font: docFont,
            }),
            new TextRun({
              text: exp.company ? `  |  ${exp.company}` : "",
              bold: true,
              size: 21,
              color: "444444",
              font: docFont,
            }),
            new TextRun({
              text: dates ? `   (${dates})` : "",
              size: 19,
              color: "666666",
              font: docFont,
            }),
          ],
        })
      );

      if (exp.highlights && exp.highlights.length > 0) {
        for (const highlight of exp.highlights) {
          if (!highlight.trim()) continue;
          paragraphs.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40, line: 240 },
              children: [
                new TextRun({
                  text: highlight.trim(),
                  size: 20,
                  color: "333333",
                  font: docFont,
                }),
              ],
            })
          );
        }
      }
    }
  }

  // 6. Education Section
  if (data.education && data.education.length > 0) {
    addSectionHeading("Education");
    for (const edu of data.education) {
      const dates = [edu.startDate, edu.endDate].filter(Boolean).join(" — ");
      paragraphs.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: edu.degree || "Degree",
              bold: true,
              size: 21,
              color: "111111",
              font: docFont,
            }),
            new TextRun({
              text: edu.school ? `  |  ${edu.school}` : "",
              size: 21,
              color: "444444",
              font: docFont,
            }),
            new TextRun({
              text: dates ? `   (${dates})` : "",
              size: 19,
              color: "666666",
              font: docFont,
            }),
          ],
        })
      );
      if (edu.details?.trim()) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: edu.details.trim(),
                size: 20,
                color: "555555",
                font: docFont,
              }),
            ],
          })
        );
      }
    }
  }

  // 7. Projects Section
  if (data.projects && data.projects.length > 0) {
    addSectionHeading("Projects");
    for (const proj of data.projects) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: proj.name || "Project",
              bold: true,
              size: 21,
              color: "111111",
              font: docFont,
            }),
            new TextRun({
              text: proj.link ? `  (${proj.link})` : "",
              size: 19,
              color: "0066CC",
              font: docFont,
            }),
          ],
        })
      );
      if (proj.description?.trim()) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: proj.description.trim(),
                size: 20,
                color: "444444",
                font: docFont,
              }),
            ],
          })
        );
      }
    }
  }

  // 8. Skills Section
  if (data.skillGroups && data.skillGroups.length > 0) {
    addSectionHeading("Skills & Expertise");
    for (const group of data.skillGroups) {
      if (!group.skills || group.skills.length === 0) continue;
      paragraphs.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: group.name ? `${group.name}: ` : "",
              bold: true,
              size: 20,
              color: "111111",
              font: docFont,
            }),
            new TextRun({
              text: group.skills.join(", "),
              size: 20,
              color: "333333",
              font: docFont,
            }),
          ],
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
