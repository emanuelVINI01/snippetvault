"use client";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeViewerClientProps {
  code: string;
  language: string;
}

export default function CodeViewerClient({ code, language }: CodeViewerClientProps) {
  const lang = language.toLowerCase();

  return (
    <div className="overflow-x-auto text-sm font-mono leading-loose relative">
      <SyntaxHighlighter
        language={lang}
        style={dracula}
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          fontSize: "0.875rem",
          lineHeight: "1.625",
          background: "transparent",
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
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
