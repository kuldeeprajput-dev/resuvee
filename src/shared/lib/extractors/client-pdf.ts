export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.6.205/legacy/build/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const items = content.items
      .filter((item) => "str" in item && item.str.trim())
      .map((item) => ({
        text: "str" in item ? item.str.trim() : "",
        x: "transform" in item ? item.transform[4] : 0,
        y: "transform" in item ? item.transform[5] : 0,
      }))
      .sort((left, right) =>
        Math.abs(right.y - left.y) > 2 ? right.y - left.y : left.x - right.x
      );

    const rows: Array<{ y: number; parts: Array<{ x: number; text: string }> }> = [];
    for (const item of items) {
      const row = rows.find((candidate) => Math.abs(candidate.y - item.y) <= 2);
      if (row) row.parts.push({ x: item.x, text: item.text });
      else rows.push({ y: item.y, parts: [{ x: item.x, text: item.text }] });
    }

    pages.push(
      rows
        .sort((left, right) => right.y - left.y)
        .map((row) =>
          row.parts
            .sort((left, right) => left.x - right.x)
            .map((part) => part.text)
            .join(" ")
        )
        .join("\n")
    );
  }

  return pages.join("\n\n");
}
