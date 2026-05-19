interface CodeEditorChromeProps {
  language: string;
}

export default function CodeEditorChrome({ language }: CodeEditorChromeProps) {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between border-b border-dracula-card/60 bg-[#21222c] px-3">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-dracula-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-dracula-yellow" />
        <span className="h-2.5 w-2.5 rounded-full bg-dracula-green" />
      </div>
      <span className="max-w-[45%] truncate font-mono text-[11px] uppercase tracking-wide text-dracula-comment">
        {language}
      </span>
    </div>
  );
}
