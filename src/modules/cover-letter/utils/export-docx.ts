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
import type { CoverLetterData } from "../types/cover-letter";

export async function exportCoverLetterDocx(data: CoverLetterData, accent = "#28785b") {
  const accentHex = accent.replace("#", "").toUpperCase() || "28785B";

  const title = data.fullName
    ? `${data.fullName}'s Cover Letter`
    : data.company
      ? `${data.company} — Cover Letter`
      : "Cover Letter";

  const fileName = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}.docx`;

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
          font: "Calibri",
        }),
      ],
    })
  );

  // 2. Applicant Headline / Subtitle
  if (data.headline) {
    topParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: data.headline.toUpperCase(),
            bold: true,
            size: 18, // 9pt
            color: "555555",
            characterSpacing: 20,
            font: "Calibri",
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
            font: "Calibri",
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
            font: "Calibri",
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
            font: "Calibri",
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
          font: "Calibri",
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
            font: "Calibri",
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
          spacing: { after: 180, line: 276 },
          children: [
            new TextRun({
              text: block.trim().replace(/\n/g, " "),
              size: 22, // 11pt
              color: "2D342F",
              font: "Calibri",
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
        spacing: { before: 240, after: 80 },
        children: [
          new TextRun({
            text: data.signoff || "Sincerely,",
            size: 22,
            color: "1E2320",
            font: "Calibri",
          }),
        ],
      })
    );
    bodyParagraphs.push(
      new Paragraph({
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: data.fullName || "",
            bold: true,
            size: 22,
            color: "1E2320",
            font: "Calibri",
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
        spacing: { before: 360 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: contactText,
            size: 18, // 9pt
            color: "666666",
            font: "Calibri",
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
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          ...topParagraphs,
          metaTable as any,
          ...bodyParagraphs,
        ],
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
