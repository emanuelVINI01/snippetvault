"use client";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ChangeEvent, KeyboardEvent, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  minHeight?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  minHeight = "160px",
}: CodeEditorProps) {
  const preRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Need to set selection after state update
      const target = e.currentTarget;
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Synchronize scrolling
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const lang = language.toLowerCase();

  return (
    <div className="relative group rounded-xl bg-[#282a36] border border-dracula-card/60 overflow-hidden transition-all duration-150 focus-within:border-dracula-purple focus-within:ring-2 focus-within:ring-dracula-purple/20">
      {/* Highlighting Layer */}
      <div 
        ref={preRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <SyntaxHighlighter
          language={lang}
          style={dracula}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.625", // Match leading-relaxed or similar
            background: "transparent",
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            minHeight: "100%",
            width: "100%",
            overflow: "hidden", // We sync scroll with textarea
          }}
          codeTagProps={{
            style: {
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            }
          }}
        >
          {value || " "}
        </SyntaxHighlighter>
      </div>

      {/* Input Layer */}
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        placeholder={placeholder}
        spellCheck={false}
        className="relative w-full bg-transparent text-transparent caret-dracula-fg font-mono text-sm p-4 outline-none resize-y min-h-[160px] block overflow-auto"
        style={{
          minHeight,
          lineHeight: "1.625",
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          whiteSpace: "pre", // Crucial to match SyntaxHighlighter behavior
          wordWrap: "normal",
        }}
      />
    </div>
  );
}
