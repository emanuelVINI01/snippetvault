export default function MockBrowserChrome() {
  return (
    <div className="flex items-center gap-2 border-b border-dracula-card/60 bg-dracula-card/70 px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-dracula-red/80" />
      <span className="h-3 w-3 rounded-full bg-dracula-green/60" />
      <span className="h-3 w-3 rounded-full bg-dracula-comment/50" />
      <div className="mx-2 flex h-6 min-w-0 flex-1 items-center rounded-md border border-dracula-card bg-dracula-bg/60 px-3 sm:mx-4">
        <span className="truncate text-[10px] text-dracula-comment sm:text-xs">
          snippetvault.emanuelvini.dev/minha-area
        </span>
      </div>
    </div>
  );
}
