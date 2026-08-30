"use client";

import { Link } from "lucide-react";
import ClipboardIconButton from "@/src/components/shared/actions/ClipboardIconButton";
import { useLanguage } from "@/src/context/LanguageContext";
import { useClipboardAction } from "@/src/hooks/shared/use-clipboard-action";
import { getSnippetUrl } from "@/src/utils/snippets/routes";

interface ShareButtonProps {
  snippetId: string;
  visibility?: "private" | "unlisted" | "public";
  className?: string;
  iconSize?: number;
}

export default function ShareButton({ snippetId, visibility = "public", className, iconSize = 14 }: ShareButtonProps) {
  const { t } = useLanguage();
  const { copied, copy } = useClipboardAction({
    getText: async () => {
      const baseUrl = getSnippetUrl(snippetId, window.location.origin);

      if (visibility !== "private") return baseUrl;

      // Private snippets have no public route — mint/reuse a share token so the
      // link itself carries the authorization to view it.
      const res = await fetch(`/api/snippets/${snippetId}/share-token`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate share token");
      const { shareToken } = await res.json();
      return `${baseUrl}?token=${shareToken}`;
    },
  });

  return (
    <ClipboardIconButton
      activeClassName="bg-dracula-green/10 text-dracula-green"
      className={className}
      copied={copied}
      icon={Link}
      iconSize={iconSize}
      idleClassName="text-dracula-comment hover:bg-dracula-purple/10 hover:text-dracula-purple"
      onClick={copy}
      title={copied ? t.common.copied : t.common.shareSnippet}
    />
  );
}
