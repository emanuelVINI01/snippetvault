import React, { useMemo, useState } from "react";
import { Copy, SlidersHorizontal } from "lucide-react";
import ClipboardIconButton from "@/src/components/shared/actions/ClipboardIconButton";
import { useLanguage } from "@/src/context/LanguageContext";
import { useClipboardAction } from "@/src/hooks/shared/use-clipboard-action";
import CopyVariablesModal from "@/src/components/dashboard/modals/CopyVariablesModal";

interface CopyButtonProps {
  content: string;
  className?: string;
  iconSize?: number;
  label?: string;
}

export default function CopyButton({ content, className, iconSize = 14, label }: CopyButtonProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const { copied, copy } = useClipboardAction({
    getText: () => content,
  });

  const variables = useMemo(() => {
    if (!content) return [];
    const matches = Array.from(content.matchAll(/{{\s*([A-Za-z0-9_-]+)\s*}}/g));
    const set = new Set<string>();
    for (const m of matches) set.add(m[1]);
    return Array.from(set);
  }, [content]);

  return (
    <div className={`flex items-center gap-1 ${className || ""}`}>
      <ClipboardIconButton
        activeClassName="border border-dracula-green/20 bg-dracula-green/10 text-dracula-green"
        copied={copied}
        icon={Copy}
        iconSize={iconSize}
        idleClassName="border border-transparent text-dracula-comment hover:bg-dracula-card hover:text-dracula-fg"
        label={label}
        onClick={copy}
        title={copied ? t.common.copied : t.common.copyCode}
      />
      {variables.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-lg p-1.5 border border-transparent text-dracula-comment hover:bg-dracula-card hover:text-dracula-purple transition-all"
            title="Copiar com variáveis"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" style={{ width: iconSize, height: iconSize }} />
          </button>
          <CopyVariablesModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            code={content}
            variables={variables}
          />
        </>
      )}
    </div>
  );
}
