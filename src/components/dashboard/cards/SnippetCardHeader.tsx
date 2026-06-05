import { Globe2, Lock, Eye, Pin, Star } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";
import type { Snippet } from "@/src/types/snippet";
import { getLanguageColor } from "../LanguageColors";

interface SnippetCardHeaderProps {
  snippet: Snippet;
  onTogglePin?: () => void;
  onToggleFavorite?: () => void;
}

export default function SnippetCardHeader({
  snippet,
  onTogglePin,
  onToggleFavorite,
}: SnippetCardHeaderProps) {
  const { t } = useLanguage();

  const getVisibilityIcon = () => {
    switch (snippet.visibility) {
      case "public":
        return (
          <span title="Público">
            <Globe2 className="h-3.5 w-3.5 text-dracula-green" />
          </span>
        );
      case "unlisted":
        return (
          <span title="Unlisted (Link secreto)">
            <Eye className="h-3.5 w-3.5 text-dracula-orange" />
          </span>
        );
      case "private":
      default:
        return (
          <span title="Privado">
            <Lock className="h-3.5 w-3.5 text-dracula-comment" />
          </span>
        );
    }
  };

  return (
    <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-sm font-semibold leading-snug text-dracula-fg" title={snippet.title}>
            {snippet.title}
          </h3>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin?.();
              }}
              className={`rounded p-0.5 transition-colors hover:bg-dracula-purple/20 ${
                snippet.pinned ? "text-dracula-purple" : "text-dracula-comment/40 hover:text-dracula-purple"
              }`}
              title={snippet.pinned ? "Desfixar" : "Fixar"}
            >
              <Pin className="h-3.5 w-3.5" fill={snippet.pinned ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.();
              }}
              className={`rounded p-0.5 transition-colors hover:bg-dracula-yellow/20 ${
                snippet.favorite ? "text-dracula-yellow" : "text-dracula-comment/40 hover:text-dracula-yellow"
              }`}
              title={snippet.favorite ? "Remover dos favoritos" : "Favoritar"}
            >
              <Star className="h-3.5 w-3.5" fill={snippet.favorite ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
        {snippet.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-dracula-comment">{snippet.description}</p>
        )}
      </div>
      <div className="flex min-w-0 shrink-0 items-center gap-1.5">
        <span className={`max-w-[7rem] truncate rounded border px-2 py-0.5 font-mono text-xs ${getLanguageColor(snippet.language)}`}>
          {snippet.language}
        </span>
        <div className="flex shrink-0 items-center justify-center p-0.5">
          {getVisibilityIcon()}
        </div>
      </div>
    </div>
  );
}
