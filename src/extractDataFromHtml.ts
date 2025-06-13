export function extractInputsFromHTML(html: string): Record<string, string> {
  const regex = /<input[^>]*id="([^"]*)"[^>]*value="([^"]*)"[^>]*>/g;

  const extractedData: Record<string, string> = {};
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const [, id, value] = match;
    extractedData[id] = value;
  }

  return extractedData;
}
