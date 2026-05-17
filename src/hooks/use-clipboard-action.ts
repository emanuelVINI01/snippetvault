"use client";

import { MouseEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ClipboardToast {
  title: string;
  description?: string;
}

interface ClipboardActionOptions {
  getText: () => string;
  success: ClipboardToast;
  error: ClipboardToast;
  resetDelayMs?: number;
}

export function useClipboardAction({
  error,
  getText,
  resetDelayMs = 2000,
  success,
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
        toast.success(success.title, { description: success.description, duration: 2500 });
        scheduleReset(resetTimer, resetDelayMs, setCopied);
      } catch {
        toast.error(error.title, { description: error.description });
      }
    },
    [error.description, error.title, getText, resetDelayMs, success.description, success.title],
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
