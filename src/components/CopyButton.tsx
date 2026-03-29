"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyButtonProps {
  content: string;
  className?: string;
  iconSize?: number;
  label?: string;
}

export default function CopyButton({ content, className, iconSize = 14, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Código copiado!", {
        description: "O conteúdo do snippet agora está na sua área de transferência.",
        duration: 2500,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar o código.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 p-1.5 rounded-lg transition-all duration-200 ${
        copied 
          ? "text-dracula-green bg-dracula-green/10 border border-dracula-green/20" 
          : "text-dracula-comment hover:text-dracula-fg hover:bg-dracula-card border border-transparent"
      } ${className}`}
      title={copied ? "Copiado!" : "Copiar código"}
    >
      {copied ? (
        <Check size={iconSize} className="animate-in fade-in zoom-in duration-200" />
      ) : (
        <Copy size={iconSize} />
      )}
      {label && <span className="text-xs font-medium">{label}</span>}
    </button>
  );
}
