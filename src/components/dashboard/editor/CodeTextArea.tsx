import type { ChangeEvent, KeyboardEvent, UIEvent } from "react";
import { CODE_FONT_FAMILY, CODE_LINE_HEIGHT } from "@/src/utils/editor/code-editor";

interface CodeTextAreaProps {
  ariaLabel?: string;
  minHeight: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onScroll: (event: UIEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  value: string;
}

export default function CodeTextArea({
  ariaLabel,
  minHeight,
  onChange,
  onKeyDown,
  onScroll,
  placeholder,
  value,
}: CodeTextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onScroll={onScroll}
      placeholder={placeholder}
      spellCheck={false}
      wrap="off"
      aria-label={ariaLabel ?? placeholder}
      className="relative z-10 block h-full w-full min-h-[160px] resize-none overflow-auto bg-transparent py-4 pl-16 pr-4 font-mono text-sm text-transparent caret-dracula-fg outline-none placeholder:text-dracula-comment/55"
      style={{
        minHeight,
        lineHeight: CODE_LINE_HEIGHT,
        fontFamily: CODE_FONT_FAMILY,
        whiteSpace: "pre",
        wordWrap: "normal",
      }}
    />
  );
}
