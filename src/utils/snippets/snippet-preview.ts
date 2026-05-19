const MAX_PREVIEW_LINES = 15;

export function getSnippetCodePreview(code: string): string {
  const lines = code.split("\n");
  if (lines.length <= MAX_PREVIEW_LINES) return code;

  return `${lines.slice(0, MAX_PREVIEW_LINES).join("\n")}\n// ...`;
}
