"use client";

import { RefObject, useEffect } from "react";

export function useFocusShortcut(ref: RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const focusTarget = (event: KeyboardEvent) => {
      if (!isShortcut(event, key)) return;

      event.preventDefault();
      ref.current?.querySelector("input")?.focus();
    };

    window.addEventListener("keydown", focusTarget);
    return () => window.removeEventListener("keydown", focusTarget);
  }, [key, ref]);
}

function isShortcut(event: KeyboardEvent, key: string): boolean {
  return (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === key.toLowerCase();
}
