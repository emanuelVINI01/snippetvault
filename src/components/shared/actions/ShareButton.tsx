"use client";

import { Link } from "lucide-react";
import ClipboardIconButton from "@/src/components/shared/actions/ClipboardIconButton";
import { useLanguage } from "@/src/context/LanguageContext";
import { useClipboardAction } from "@/src/hooks/shared/use-clipboard-action";
import { getSnippetUrl } from "@/src/utils/snippets/routes";

interface ShareButtonProps {
  snippetId: string;
  className?: string;
  iconSize?: number;
}

export default function ShareButton({ snippetId, className, iconSize = 14 }: ShareButtonProps) {
  const { t } = useLanguage();
  const { copied, copy } = useClipboardAction({
    getText: () => getSnippetUrl(snippetId, window.location.origin),
    success: {
      title: t.toasts.linkCopied,
      description: t.toasts.linkCopiedDescription,
    },
    error: {
      title: t.toasts.copyLinkError,
      description: t.toasts.copyLinkErrorDescription,
    },
  });

  return (
    <ClipboardIconButton
      activeClassName="bg-dracula-green/10 text-dracula-green"
      className={className}
      copied={copied}
      icon={Link}
      iconSize={iconSize}
      idleClassName="text-dracula-comment hover:bg-dracula-cyan/10 hover:text-dracula-cyan"
      onClick={copy}
      title={copied ? t.common.copied : t.common.shareSnippet}
    />
  );
}
