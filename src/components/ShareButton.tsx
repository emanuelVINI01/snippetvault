"use client";

import { Link, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonProps {
  snippetId: string;
  className?: string;
  iconSize?: number;
}

export default function ShareButton({ snippetId, className, iconSize = 14 }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/snippet/${snippetId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado para a área de transferência!", {
        description: "Agora você pode compartilhar este snippet publicamente.",
        duration: 3000,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar o link.", {
        description: "Tente copiar manualmente da barra de endereços.",
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`p-1.5 rounded-lg transition-all duration-200 ${
        copied 
          ? "text-dracula-green bg-dracula-green/10" 
          : "text-dracula-comment hover:text-dracula-cyan hover:bg-dracula-cyan/10"
      } ${className}`}
      title={copied ? "Copiado!" : "Compartilhar snippet"}
    >
      {copied ? (
        <Check size={iconSize} className="animate-in fade-in zoom-in duration-200" />
      ) : (
        <Link size={iconSize} />
      )}
    </button>
  );
}
