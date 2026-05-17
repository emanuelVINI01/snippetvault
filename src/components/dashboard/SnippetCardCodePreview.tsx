"use client";

import { dracula, normalizeSnippetLanguage, SyntaxHighlighter } from "@/src/lib/syntax-highlighting";
import { getSnippetCodePreview } from "@/src/utils/snippet-preview";

interface SnippetCardCodePreviewProps {
  code: string;
  language: string;
}

export default function SnippetCardCodePreview({ code, language }: SnippetCardCodePreviewProps) {
  return (
    <div className="mx-4 mb-3 max-w-full overflow-hidden rounded-xl border border-dracula-card text-xs">
      <SyntaxHighlighter
        language={normalizeSnippetLanguage(language)}
        style={dracula}
        customStyle={{
          margin: 0,
          padding: "12px 14px",
          fontSize: "0.72rem",
          maxHeight: "180px",
          background: "transparent",
        }}
        showLineNumbers={false}
        wrapLines
      >
        {getSnippetCodePreview(code)}
      </SyntaxHighlighter>
    </div>
  );
}
