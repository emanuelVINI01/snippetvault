interface GutterBackdropProps {
  className?: string;
}

/**
 * Decorative editor-gutter / line-number-rail texture.
 * Drop inside a `relative` container, behind content that should sit on
 * top via `relative z-10`. SnippetVault's per-project visual motif.
 */
export default function GutterBackdrop({ className = "" }: GutterBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={`gutter-rail-bg pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  );
}
