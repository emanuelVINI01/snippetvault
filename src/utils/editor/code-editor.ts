export const CODE_LINE_HEIGHT = "1.625";
export const CODE_FONT_FAMILY =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export function getLineNumbers(code: string): string {
  const lines = Math.max(code.split("\n").length, 1);
  return Array.from({ length: lines }, (_, index) => index + 1).join("\n");
}

export function insertSoftTab(value: string, start: number, end: number) {
  return {
    nextCursor: start + 2,
    value: `${value.substring(0, start)}  ${value.substring(end)}`,
  };
}
