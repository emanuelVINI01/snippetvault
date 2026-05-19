"use client";

import { useCodeEditor } from "@/src/hooks/snippets/use-code-editor";
import { normalizeSnippetLanguage } from "@/src/lib/syntax-highlighting";
import CodeEditorChrome from "./CodeEditorChrome";
import CodeEditorLineNumbers from "./CodeEditorLineNumbers";
import CodeHighlightLayer from "./CodeHighlightLayer";
import CodeTextArea from "./CodeTextArea";

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
  ariaLabel,
  className = "",
  language,
  minHeight = "160px",
  onChange,
  placeholder,
  value,
}: CodeEditorProps) {
  const normalizedLanguage = normalizeSnippetLanguage(language);
  const editor = useCodeEditor({ onChange, value });

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-xl border border-dracula-card/70 bg-[#282a36] shadow-inner shadow-black/20 transition-all duration-150 focus-within:border-dracula-purple focus-within:ring-2 focus-within:ring-dracula-purple/20 ${className}`}
    >
      <CodeEditorChrome language={language || normalizedLanguage} />
      <div className="relative min-h-[160px] flex-1" style={{ minHeight }}>
        <CodeEditorLineNumbers lineNumbers={editor.lineNumbers} lineNumbersRef={editor.lineNumbersRef} />
        <CodeHighlightLayer
          code={value}
          highlightRef={editor.highlightRef}
          language={normalizedLanguage}
        />
        <CodeTextArea
          ariaLabel={ariaLabel}
          minHeight={minHeight}
          onChange={editor.onTextChange}
          onKeyDown={editor.onKeyDown}
          onScroll={editor.onScroll}
          placeholder={placeholder}
          value={value}
        />
      </div>
    </div>
  );
}
