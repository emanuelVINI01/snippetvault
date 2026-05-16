"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Link, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/src/context/LanguageContext";

interface ShareButtonProps {
  snippetId: string;
  className?: string;
  iconSize?: number;
}

export default function ShareButton({ snippetId, className, iconSize = 14 }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/snippet/${snippetId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t.toasts.linkCopied, {
        description: t.toasts.linkCopiedDescription,
        duration: 3000,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.toasts.copyLinkError, {
        description: t.toasts.copyLinkErrorDescription,
      });
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      whileTap={{ scale: 0.94 }}
      className={`p-1.5 rounded-lg transition-all duration-200 ${
        copied 
          ? "text-dracula-green bg-dracula-green/10" 
          : "text-dracula-comment hover:text-dracula-cyan hover:bg-dracula-cyan/10"
      } ${className}`}
      title={copied ? t.common.copied : t.common.shareSnippet}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "link"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.14 }}
        >
          {copied ? <Check size={iconSize} /> : <Link size={iconSize} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
