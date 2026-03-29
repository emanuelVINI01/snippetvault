"use client";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import CopyButton from "../CopyButton";

interface CodeViewerClientProps {
  code: string;
  language: string;
}

export default function CodeViewerClient({ code, language }: CodeViewerClientProps) {
  const lang = language.toLowerCase();

  return (
    <div className="group relative">
      <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton 
          content={code} 
          iconSize={14} 
          label="Copiar"
          className="bg-dracula-bg/80 backdrop-blur-sm border-dracula-card/60 px-3 py-1.5" 
        />
      </div>
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
  </div>
  );
}
