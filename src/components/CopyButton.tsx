"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/src/context/LanguageContext";

interface CopyButtonProps {
  content: string;
  className?: string;
  iconSize?: number;
  label?: string;
}

export default function CopyButton({ content, className, iconSize = 14, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success(t.toasts.codeCopied, {
        description: t.toasts.codeCopiedDescription,
        duration: 2500,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.toasts.copyCodeError);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.94 }}
      className={`flex items-center gap-1.5 p-1.5 rounded-lg transition-all duration-200 ${
        copied 
          ? "text-dracula-green bg-dracula-green/10 border border-dracula-green/20" 
          : "text-dracula-comment hover:text-dracula-fg hover:bg-dracula-card border border-transparent"
      } ${className}`}
      title={copied ? t.common.copied : t.common.copyCode}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "copy"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.14 }}
        >
          {copied ? <Check size={iconSize} /> : <Copy size={iconSize} />}
        </motion.span>
      </AnimatePresence>
      {label && <span className="text-xs font-medium">{label}</span>}
    </motion.button>
  );
}
