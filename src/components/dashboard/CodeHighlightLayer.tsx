import type { RefObject } from "react";
import { CODE_FONT_FAMILY, CODE_LINE_HEIGHT } from "@/src/utils/code-editor";
import { dracula, SyntaxHighlighter } from "@/src/lib/syntax-highlighting";

interface CodeHighlightLayerProps {
  code: string;
  highlightRef: RefObject<HTMLDivElement | null>;
  language: string;
}

export default function CodeHighlightLayer({
  code,
  highlightRef,
  language,
}: CodeHighlightLayerProps) {
  return (
    <div
      ref={highlightRef}
      className="pointer-events-none absolute inset-y-0 left-12 right-0 overflow-hidden"
      aria-hidden="true"
    >
      <SyntaxHighlighter
        language={language}
        style={dracula}
        wrapLongLines={false}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: CODE_LINE_HEIGHT,
          background: "transparent",
          fontFamily: CODE_FONT_FAMILY,
          minHeight: "100%",
          minWidth: "100%",
          width: "max-content",
          overflow: "visible",
        }}
        codeTagProps={{
          style: {
            fontFamily: "inherit",
            lineHeight: "inherit",
          },
        }}
      >
        {code || " "}
      </SyntaxHighlighter>
    </div>
  );
}
