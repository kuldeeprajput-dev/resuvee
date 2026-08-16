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
import type { CoverLetterData, CoverLetterTheme, TypographyFont, PageSpacing } from "../types/cover-letter";

export async function exportCoverLetterDocx(
  data: CoverLetterData,
  accent = "#28785b",
  font: TypographyFont = "template",
  pageSpacing: PageSpacing = "normal",
  theme: CoverLetterTheme = "linen"
) {
  const accentHex = accent.replace("#", "").toUpperCase() || "28785B";

  const docFont =
    font === "sans"
      ? "Segoe UI"
      : font === "serif"
        ? "Calibri"
        : font === "mono"
          ? "Consolas"
          : "Georgia";

  const title = data.fullName
    ? `${data.fullName}'s Cover Letter`
    : data.company
      ? `${data.company} — Cover Letter`
      : "Cover Letter";

  const fileName = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}.docx`;

  // Margins match canvas padding classes:
  // compact  → px-9  py-7  (36px H / 28px V) → 544 / 423 twips
  // normal   → px-11 py-9  (44px H / 36px V) → 665 / 544 twips
  // spacious → px-14 py-12 (56px H / 48px V) → 847 / 726 twips
  const margins =
    pageSpacing === "compact"
      ? { top: 423, right: 544, bottom: 423, left: 544 }
      : pageSpacing === "spacious"
        ? { top: 726, right: 847, bottom: 726, left: 847 }
        : { top: 544, right: 665, bottom: 544, left: 665 };

  const bodyLineSpacing = pageSpacing === "compact" ? 240 : pageSpacing === "spacious" ? 276 : 252;

  const bodyParagraphAfter =
    pageSpacing === "compact" ? 80 : pageSpacing === "spacious" ? 180 : 120;

  const topParagraphs: Paragraph[] = [];

  // 1. Applicant Name (Header Title)
  topParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 60, before: 0 },
      children: [
        new TextRun({
          text: data.fullName || "Applicant Name",
          bold: true,
          size: 38, // 19pt
          color: accentHex,
          font: docFont,
        }),
      ],
    })
  );

  // 2. Applicant Headline / Subtitle
  if (data.headline) {
    const formattedHeadline = (data.headline || "")
      .replace(/SENIORPRODUCTSPECIALIST/i, "SENIOR PRODUCT SPECIALIST")
      .replace(/PRODUCTMANAGER/i, "PRODUCT MANAGER")
      .replace(/SOFTWAREENGINEER/i, "SOFTWARE ENGINEER")
      .replace(/([a-z])([A-Z])/g, "$1 $2");

    topParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: formattedHeadline.toUpperCase(),
            bold: true,
            size: 18, // 9pt
            color: "555555",
            characterSpacing: 20,
            font: docFont,
          }),
        ],
      })
    );
  }

  // 3. Recipient, Role, Company & Date Layout Table
  const recipientCellChildren: Paragraph[] = [];
  if (data.recipient) {
    recipientCellChildren.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: data.recipient,
            bold: true,
            size: 21,
            color: "1E2320",
            font: docFont,
          }),
        ],
      })
    );
  }
  if (data.company) {
    recipientCellChildren.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: data.company,
            size: 21,
            color: "444444",
            font: docFont,
          }),
        ],
      })
    );
  }
  if (data.role) {
    recipientCellChildren.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: data.role,
            size: 21,
            color: "666666",
            font: docFont,
          }),
        ],
      })
    );
  }
  if (recipientCellChildren.length === 0) {
    recipientCellChildren.push(new Paragraph({}));
  }

  const dateCellChildren: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: data.date || "",
          size: 20,
          color: "666666",
          font: docFont,
        }),
      ],
    }),
  ];

  const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: noBorder,
      bottom: noBorder,
      left: noBorder,
      right: noBorder,
      insideHorizontal: noBorder,
      insideVertical: noBorder,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            children: recipientCellChildren,
            borders: {
              top: noBorder,
              bottom: noBorder,
              left: noBorder,
              right: noBorder,
            },
          }),
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            children: dateCellChildren,
            borders: {
              top: noBorder,
              bottom: noBorder,
              left: noBorder,
              right: noBorder,
            },
          }),
        ],
      }),
    ],
  });

  const bodyParagraphs: Paragraph[] = [];

  // 4. Greeting
  if (data.greeting) {
    bodyParagraphs.push(
      new Paragraph({
        spacing: { before: 200, after: 160 },
        children: [
          new TextRun({
            text: data.greeting,
            bold: true,
            size: 22, // 11pt
            color: "1E2320",
            font: docFont,
          }),
        ],
      })
    );
  }

  // Helper to split section into clean body paragraphs
  const addBodySection = (text: string) => {
    if (!text) return;
    const blocks = text.split(/\n\n+/);
    for (const block of blocks) {
      if (!block.trim()) continue;
      bodyParagraphs.push(
        new Paragraph({
          spacing: { after: bodyParagraphAfter, line: bodyLineSpacing },
          children: [
            new TextRun({
              text: block.trim().replace(/\n/g, " "),
              size: 21, // 10.5pt
              color: "2D342F",
              font: docFont,
            }),
          ],
        })
      );
    }
  };

  addBodySection(data.opening);
  addBodySection(data.evidence);
  addBodySection(data.closing);

  // 5. Signoff
  if (data.signoff || data.fullName) {
    bodyParagraphs.push(
      new Paragraph({
        spacing: { before: 180, after: 60 },
        children: [
          new TextRun({
            text: data.signoff || "Sincerely,",
            size: 21,
            color: "1E2320",
            font: docFont,
          }),
        ],
      })
    );
    bodyParagraphs.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: data.fullName || "",
            bold: true,
            size: 21,
            color: "1E2320",
            font: docFont,
          }),
        ],
      })
    );
  }

  // 6. Footer Contact Info
  const contactText = [data.email, data.phone, data.location, data.website]
    .filter(Boolean)
    .join("   ·   ");

  if (contactText) {
    bodyParagraphs.push(
      new Paragraph({
        spacing: { before: 1800 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: contactText,
            size: 18, // 9pt
            color: "666666",
            font: docFont,
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: margins,
          },
        },
        children: [...topParagraphs, metaTable as any, ...bodyParagraphs],
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
