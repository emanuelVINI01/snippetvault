"use client";

import { ChangeEvent, KeyboardEvent, UIEvent, useMemo, useRef } from "react";
import { dracula, normalizeSnippetLanguage, SyntaxHighlighter } from "@/src/lib/syntax-highlighting";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  minHeight?: string;
  ariaLabel?: string;
  className?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  minHeight = "160px",
  ariaLabel,
  className = "",
}: CodeEditorProps) {
  const preRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const lang = normalizeSnippetLanguage(language);
  const lineNumbers = useMemo(() => {
    const lines = Math.max(value.split("\n").length, 1);
    return Array.from({ length: lines }, (_, index) => index + 1).join("\n");
  }, [value]);

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
  const handleScroll = (e: UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-xl border border-dracula-card/70 bg-[#282a36] shadow-inner shadow-black/20 transition-all duration-150 focus-within:border-dracula-purple focus-within:ring-2 focus-within:ring-dracula-purple/20 ${className}`}
    >
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-dracula-card/60 bg-[#21222c] px-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-dracula-red" />
          <span className="h-2.5 w-2.5 rounded-full bg-dracula-yellow" />
          <span className="h-2.5 w-2.5 rounded-full bg-dracula-green" />
        </div>
        <span className="max-w-[45%] truncate font-mono text-[11px] uppercase tracking-wide text-dracula-comment">
          {language || lang}
        </span>
      </div>

      <div className="relative min-h-[160px] flex-1" style={{ minHeight }}>
        <div
          ref={lineNumbersRef}
          className="absolute inset-y-0 left-0 z-[1] w-12 overflow-hidden border-r border-dracula-card/60 bg-[#21222c]/70"
          aria-hidden="true"
        >
          <pre
            className="select-none px-3 py-4 text-right font-mono text-sm text-dracula-comment/45"
            style={{
              lineHeight: "1.625",
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
          >
            {lineNumbers}
          </pre>
        </div>

        {/* Highlighting layer */}
        <div
          ref={preRef}
          className="absolute inset-y-0 left-12 right-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <SyntaxHighlighter
            language={lang}
            style={dracula}
            wrapLongLines={false}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
              lineHeight: "1.625",
              background: "transparent",
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
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
            {value || " "}
          </SyntaxHighlighter>
        </div>

        {/* Input layer */}
        <textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          placeholder={placeholder}
          spellCheck={false}
          wrap="off"
          aria-label={ariaLabel ?? placeholder}
          className="relative z-10 block h-full w-full min-h-[160px] resize-none overflow-auto bg-transparent py-4 pl-16 pr-4 font-mono text-sm text-transparent caret-dracula-fg outline-none placeholder:text-dracula-comment/55"
          style={{
            minHeight,
            lineHeight: "1.625",
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            whiteSpace: "pre",
            wordWrap: "normal",
          }}
        />
      </div>
    </div>
  );
}
