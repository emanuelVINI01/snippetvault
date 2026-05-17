"use client";

import { ChangeEvent, KeyboardEvent, UIEvent, useMemo, useRef } from "react";
import { getLineNumbers, insertSoftTab } from "@/src/utils/code-editor";

interface UseCodeEditorOptions {
  onChange: (value: string) => void;
  value: string;
}

export function useCodeEditor({ onChange, value }: UseCodeEditorOptions) {
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const lineNumbers = useMemo(() => getLineNumbers(value), [value]);

  return {
    highlightRef,
    lineNumbers,
    lineNumbersRef,
    onTextChange: (event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value),
    onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => handleKeyDown(event, value, onChange),
    onScroll: (event: UIEvent<HTMLTextAreaElement>) => {
      syncScroll(highlightRef.current, lineNumbersRef.current, event.currentTarget);
    },
  };
}

function handleKeyDown(
  event: KeyboardEvent<HTMLTextAreaElement>,
  value: string,
  onChange: (value: string) => void,
) {
  if (event.key !== "Tab") return;

  event.preventDefault();
  const { nextCursor, value: nextValue } = insertSoftTab(
    value,
    event.currentTarget.selectionStart,
    event.currentTarget.selectionEnd,
  );
  const target = event.currentTarget;

  onChange(nextValue);
  window.setTimeout(() => {
    target.selectionStart = nextCursor;
    target.selectionEnd = nextCursor;
  });
}

function syncScroll(
  highlight: HTMLDivElement | null,
  lineNumbers: HTMLDivElement | null,
  textarea: HTMLTextAreaElement,
) {
  if (highlight) {
    highlight.scrollTop = textarea.scrollTop;
    highlight.scrollLeft = textarea.scrollLeft;
  }

  if (lineNumbers) lineNumbers.scrollTop = textarea.scrollTop;
}
