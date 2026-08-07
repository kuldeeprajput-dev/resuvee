import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  WidthType,
  BorderStyle,
  AlignmentType,
  ExternalHyperlink,
} from "docx";
import type { ResumeData } from "../types/resume";

export interface ExportDocxResult {
  fileName: string;
}

export async function exportResumeDocx(
  data: ResumeData,
  accent = "#28785b"
): Promise<ExportDocxResult> {
  const accentHex = accent.replace("#", "").toUpperCase() || "28785B";
  const docFont = "Calibri";

  const personName = data.basics.fullName?.trim() || "Resume";
  const title = data.basics.fullName ? `${personName}'s Resume` : "Resume";

  const fileName = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}.docx`;

  const paragraphs: Paragraph[] = [];

  // ── 1. Full Name ────────────────────────────────────────────────────────
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

  // ── 2. Headline ─────────────────────────────────────────────────────────
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

  // ── 3. Contact Details Bar ──────────────────────────────────────────────
  const contactTextParts: string[] = [];
  if (data.basics.email) contactTextParts.push(data.basics.email);
  if (data.basics.phone) contactTextParts.push(data.basics.phone);
  if (data.basics.location) contactTextParts.push(data.basics.location);

  const contactChildren: (TextRun | ExternalHyperlink)[] = [];

  if (contactTextParts.length > 0) {
    contactChildren.push(
      new TextRun({
        text: contactTextParts.join("   ·   "),
        size: 18,
        color: "666666",
        font: docFont,
      })
    );
  }

  if (data.basics.website) {
    contactChildren.push(
      new TextRun({ text: "   ·   ", size: 18, color: "666666", font: docFont })
    );
    contactChildren.push(
      new ExternalHyperlink({
        link: data.basics.website,
        children: [
          new TextRun({
            text: data.basics.website.replace(/^https?:\/\//, ""),
            size: 18,
            color: "0066CC",
            font: docFont,
            underline: { type: "single" },
          }),
        ],
      })
    );
  }

  if (contactChildren.length > 0) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 240 },
        children: contactChildren,
      })
    );
  }

  // ── Helper: Section Heading ─────────────────────────────────────────────
  const addSectionHeading = (text: string) => {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 280, after: 140 },
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

  // ── Helper: Bullet ──────────────────────────────────────────────────────
  const addBullet = (text: string) => {
    if (!text.trim()) return;
    paragraphs.push(
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 40, line: 240 },
        children: [
          new TextRun({
            text: text.trim(),
            size: 20,
            color: "333333",
            font: docFont,
          }),
        ],
      })
    );
  };

  // ── 4. Summary ──────────────────────────────────────────────────────────
  if (data.basics.summary?.trim()) {
    addSectionHeading("Professional Summary");
    paragraphs.push(
      new Paragraph({
        spacing: { after: 160, line: 260 },
        children: [
          new TextRun({
            text: data.basics.summary.trim(),
            size: 20,
            color: "333333",
            font: docFont,
          }),
        ],
      })
    );
  }

  // ── 5. Work Experience ──────────────────────────────────────────────────
  if (data.experience && data.experience.length > 0) {
    addSectionHeading("Work Experience");
    for (const exp of data.experience) {
      const dates = [exp.startDate, exp.current ? "Present" : exp.endDate]
        .filter(Boolean)
        .join(" — ");

      // Role | Company (Dates)
      paragraphs.push(
        new Paragraph({
          spacing: { before: 140, after: 40 },
          children: [
            new TextRun({
              text: exp.role || "Role",
              bold: true,
              size: 21,
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

      // Location sub-line
      if (exp.location) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: exp.location,
                size: 18,
                color: "888888",
                italics: true,
                font: docFont,
              }),
            ],
          })
        );
      }

      // Highlights as bullets
      if (exp.highlights && exp.highlights.length > 0) {
        for (const highlight of exp.highlights) {
          addBullet(highlight);
        }
      }
    }
  }

  // ── 6. Education ────────────────────────────────────────────────────────
  if (data.education && data.education.length > 0) {
    addSectionHeading("Education");
    for (const edu of data.education) {
      const dates = [edu.startDate, edu.endDate].filter(Boolean).join(" — ");
      paragraphs.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
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
      if (edu.location) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: edu.location,
                size: 18,
                color: "888888",
                italics: true,
                font: docFont,
              }),
            ],
          })
        );
      }
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

  // ── 7. Projects ─────────────────────────────────────────────────────────
  if (data.projects && data.projects.length > 0) {
    addSectionHeading("Projects");
    for (const proj of data.projects) {
      const projChildren: (TextRun | ExternalHyperlink)[] = [
        new TextRun({
          text: proj.name || "Project",
          bold: true,
          size: 21,
          color: "111111",
          font: docFont,
        }),
      ];

      if (proj.date) {
        projChildren.push(
          new TextRun({
            text: `   (${proj.date})`,
            size: 19,
            color: "666666",
            font: docFont,
          })
        );
      }

      paragraphs.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: projChildren,
        })
      );

      // Link
      if (proj.link?.trim()) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new ExternalHyperlink({
                link: proj.link,
                children: [
                  new TextRun({
                    text: proj.link,
                    size: 18,
                    color: "0066CC",
                    underline: { type: "single" },
                    font: docFont,
                  }),
                ],
              }),
            ],
          })
        );
      }

      if (proj.description?.trim()) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 40 },
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

      // Project highlights as bullets
      if (proj.highlights && proj.highlights.length > 0) {
        for (const highlight of proj.highlights) {
          addBullet(highlight);
        }
      }
    }
  }

  // ── 8. Skills ───────────────────────────────────────────────────────────
  if (data.skillGroups && data.skillGroups.length > 0) {
    addSectionHeading("Skills & Expertise");
    for (const group of data.skillGroups) {
      if (!group.skills || group.skills.length === 0) continue;
      paragraphs.push(
        new Paragraph({
          spacing: { after: 70 },
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

  // ── 9. Certifications ───────────────────────────────────────────────────
  if (data.certifications && data.certifications.length > 0) {
    addSectionHeading("Certifications & Awards");
    for (const cert of data.certifications) {
      const certChildren: TextRun[] = [
        new TextRun({
          text: cert.title || "Certification",
          bold: true,
          size: 21,
          color: "111111",
          font: docFont,
        }),
      ];
      if (cert.issuer) {
        certChildren.push(
          new TextRun({
            text: `  —  ${cert.issuer}`,
            size: 20,
            color: "444444",
            font: docFont,
          })
        );
      }
      if (cert.date) {
        certChildren.push(
          new TextRun({
            text: `   (${cert.date})`,
            size: 19,
            color: "666666",
            font: docFont,
          })
        );
      }
      paragraphs.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: certChildren,
        })
      );
    }
  }

  // ── Build & Download ────────────────────────────────────────────────────
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1080, // 0.75 inch
              bottom: 1440, // 1 inch
              left: 1080, // 0.75 inch
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

  return { fileName };
}
