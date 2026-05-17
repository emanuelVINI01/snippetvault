import type { RefObject } from "react";
import { CODE_FONT_FAMILY, CODE_LINE_HEIGHT } from "@/src/utils/code-editor";

interface CodeEditorLineNumbersProps {
  lineNumbers: string;
  lineNumbersRef: RefObject<HTMLDivElement | null>;
}

export default function CodeEditorLineNumbers({
  lineNumbers,
  lineNumbersRef,
}: CodeEditorLineNumbersProps) {
  return (
    <div
      ref={lineNumbersRef}
      className="absolute inset-y-0 left-0 z-[1] w-12 overflow-hidden border-r border-dracula-card/60 bg-[#21222c]/70"
      aria-hidden="true"
    >
      <pre
        className="select-none px-3 py-4 text-right font-mono text-sm text-dracula-comment/45"
        style={{ lineHeight: CODE_LINE_HEIGHT, fontFamily: CODE_FONT_FAMILY }}
      >
        {lineNumbers}
      </pre>
    </div>
  );
}
