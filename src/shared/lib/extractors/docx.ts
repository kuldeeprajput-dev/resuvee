export async function extractTextFromDOCX(buffer: Buffer): Promise<{ text: string }> {
  const mammoth = (await import("mammoth")).default;
  const result = await mammoth.extractRawText({ buffer });
  return {
    text: result.value,
  };
}
