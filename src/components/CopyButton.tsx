"use client";

import { Copy } from "lucide-react";
import ClipboardIconButton from "@/src/components/ClipboardIconButton";
import { useLanguage } from "@/src/context/LanguageContext";
import { useClipboardAction } from "@/src/hooks/use-clipboard-action";

interface CopyButtonProps {
  content: string;
  className?: string;
  iconSize?: number;
  label?: string;
}

export default function CopyButton({ content, className, iconSize = 14, label }: CopyButtonProps) {
  const { t } = useLanguage();
  const { copied, copy } = useClipboardAction({
    getText: () => content,
    success: {
      title: t.toasts.codeCopied,
      description: t.toasts.codeCopiedDescription,
    },
    error: {
      title: t.toasts.copyCodeError,
    },
  });

  return (
    <ClipboardIconButton
      activeClassName="border border-dracula-green/20 bg-dracula-green/10 text-dracula-green"
      className={className}
      copied={copied}
      icon={Copy}
      iconSize={iconSize}
      idleClassName="border border-transparent text-dracula-comment hover:bg-dracula-card hover:text-dracula-fg"
      label={label}
      onClick={copy}
      title={copied ? t.common.copied : t.common.copyCode}
    />
  );
}
