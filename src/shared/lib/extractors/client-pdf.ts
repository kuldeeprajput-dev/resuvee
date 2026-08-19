interface PositionedTextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  startsBlock: boolean;
}

interface TextRow {
  y: number;
  parts: PositionedTextItem[];
}

function rowsForItems(items: PositionedTextItem[]) {
  const rows: TextRow[] = [];
  for (const item of [...items].sort((left, right) =>
    Math.abs(right.y - left.y) > 2 ? right.y - left.y : left.x - right.x
  )) {
    const row = rows.find((candidate) => Math.abs(candidate.y - item.y) <= 2);
    if (row) row.parts.push(item);
    else rows.push({ y: item.y, parts: [item] });
  }
  return rows.sort((left, right) => right.y - left.y);
}

function textForItems(items: PositionedTextItem[]) {
  const rows = rowsForItems(items);
  const leftPositions = rows
    .map((row) => Math.min(...row.parts.map((part) => part.x)))
    .sort((left, right) => left - right);
  const leftEdge = leftPositions.find(
    (position) => leftPositions.filter((candidate) => Math.abs(candidate - position) <= 2).length >= 2
  ) ?? leftPositions[0] ?? 0;

  return rows
    .map((row) => {
      const parts = row.parts.sort((left, right) => left.x - right.x);
      const rowText = parts
        .map((part, index) => {
          if (index === 0) return part.text;
          const previous = parts[index - 1];
          const gap = part.x - (previous.x + previous.width);
          return `${gap > 20 ? " | " : " "}${part.text}`;
        })
        .join("");
      const rowLeft = parts[0]?.x ?? leftEdge;
      const startsIndentedBlock =
        parts.some((part) => part.startsBlock) &&
        rowLeft >= leftEdge + 8 &&
        rowLeft <= leftEdge + 32 &&
        !/^[\u2022\u25cf\u2013\u2014*+>\u2043\u25aa\u25ab-]/.test(rowText);
      return startsIndentedBlock ? `• ${rowText}` : rowText;
    })
    .join("\n");
}

/**
 * Finds a real content gutter, rather than mistaking right-aligned dates for
 * a second column. Both sides must contain a meaningful share of the text.
 */
function detectColumnSplit(items: PositionedTextItem[], pageWidth: number) {
  const positions = [...new Set(items.map((item) => Math.round(item.x * 2) / 2))].sort(
    (left, right) => left - right
  );
  const totalCharacters = items.reduce((total, item) => total + item.text.length, 0);
  let best: { split: number; score: number } | null = null;

  for (let index = 1; index < positions.length; index += 1) {
    const previous = positions[index - 1];
    const current = positions[index];
    const gap = current - previous;
    const split = (previous + current) / 2;
    if (gap < 42 || split < pageWidth * 0.2 || split > pageWidth * 0.68) continue;

    const left = items.filter((item) => item.x < split);
    const right = items.filter((item) => item.x >= split);
    const leftCharacters = left.reduce((total, item) => total + item.text.length, 0);
    const rightCharacters = right.reduce((total, item) => total + item.text.length, 0);
    const smallerShare = Math.min(leftCharacters, rightCharacters) / Math.max(totalCharacters, 1);
    const crossingCharacters = items
      .filter((item) => item.x < split && item.x + item.width > split + 10)
      .reduce((total, item) => total + item.text.length, 0);
    const crossingShare = crossingCharacters / Math.max(totalCharacters, 1);

    if (
      left.length < 7 ||
      right.length < 7 ||
      smallerShare < 0.12 ||
      crossingShare > 0.08
    ) {
      continue;
    }
    const score = gap * smallerShare;
    if (!best || score > best.score) best = { split, score };
  }

  return best?.split ?? null;
}

function textInReadingOrder(items: PositionedTextItem[], pageWidth: number) {
  const split = detectColumnSplit(items, pageWidth);
  if (split === null) return textForItems(items);

  const left = items.filter((item) => item.x < split);
  const right = items.filter((item) => item.x >= split);
  const characterCount = (column: PositionedTextItem[]) =>
    column.reduce((total, item) => total + item.text.length, 0);

  // Resume sidebars contain supporting details; the denser column is the
  // primary narrative and must be read first for reliable name/section parsing.
  const main = characterCount(left) >= characterCount(right) ? left : right;
  const sidebar = main === left ? right : left;
  return [textForItems(main), textForItems(sidebar)].filter(Boolean).join("\n");
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    let previousWasEmpty = true;
    const items: PositionedTextItem[] = [];
    for (const item of content.items) {
      const text = "str" in item ? item.str.trim() : "";
      if (!text) {
        previousWasEmpty = true;
        continue;
      }
      items.push({
        text,
        x: "transform" in item ? item.transform[4] : 0,
        y: "transform" in item ? item.transform[5] : 0,
        width: "width" in item ? item.width : 0,
        startsBlock: previousWasEmpty,
      });
      previousWasEmpty = false;
    }
    const pageWidth = page.getViewport({ scale: 1 }).width;
    pages.push(textInReadingOrder(items, pageWidth));
  }

  return pages.join("\n\n");
}
