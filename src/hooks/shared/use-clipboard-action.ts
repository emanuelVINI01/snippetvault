"use client";

import { MouseEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

interface ClipboardActionOptions {
  getText: () => string;
  resetDelayMs?: number;
}

export function useClipboardAction({
  getText,
  resetDelayMs = 2000,
}: ClipboardActionOptions) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => () => clearResetTimer(resetTimer), []);

  const copy = useCallback(
    async (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      try {
        await navigator.clipboard.writeText(getText());
        setCopied(true);
        scheduleReset(resetTimer, resetDelayMs, setCopied);
      } catch {
        setCopied(false);
      }
    },
    [getText, resetDelayMs],
  );

  return { copied, copy };
}

function scheduleReset(
  timerRef: MutableRefObject<number | null>,
  delayMs: number,
  setCopied: (copied: boolean) => void,
) {
  clearResetTimer(timerRef);
  timerRef.current = window.setTimeout(() => setCopied(false), delayMs);
}

function clearResetTimer(timerRef: MutableRefObject<number | null>) {
  if (timerRef.current) window.clearTimeout(timerRef.current);
}
