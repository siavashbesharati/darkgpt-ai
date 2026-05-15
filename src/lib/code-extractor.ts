export interface ExtractedCode {
  code: string;
  language: string;
}
export function extractLatestCodeBlock(markdown: string): ExtractedCode | null {
  if (!markdown) return null;
  // Regex to find markdown code blocks: ```language [code] ```
  // We use a global match and take the last one
  const regex = /```(\w*)\n([\s\S]*?)(?:```|$)/g;
  let match;
  let lastMatch: ExtractedCode | null = null;
  while ((match = regex.exec(markdown)) !== null) {
    lastMatch = {
      language: match[1] || 'typescript',
      code: match[2].trim(),
    };
  }
  return lastMatch;
}