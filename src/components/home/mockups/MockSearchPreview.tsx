import { Search } from "lucide-react";

interface MockSearchPreviewProps {
  label: string;
}

export default function MockSearchPreview({ label }: MockSearchPreviewProps) {
  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl border border-dracula-card bg-dracula-card/50 px-4 py-3 text-sm text-dracula-comment">
      <Search className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="rounded border border-dracula-comment/30 px-2 py-0.5 font-mono text-[10px]">⌘ K</span>
    </div>
  );
}
