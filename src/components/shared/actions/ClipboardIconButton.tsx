"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ComponentType, MouseEventHandler } from "react";

interface ClipboardIconButtonProps {
  activeClassName: string;
  className?: string;
  copied: boolean;
  icon: ComponentType<{ size?: number }>;
  iconSize: number;
  label?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  title: string;
  idleClassName: string;
}

export default function ClipboardIconButton({
  activeClassName,
  className,
  copied,
  icon: Icon,
  iconSize,
  idleClassName,
  label,
  onClick,
  title,
}: ClipboardIconButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className={`flex items-center gap-1.5 rounded-lg p-1.5 transition-all duration-200 ${
        copied ? activeClassName : idleClassName
      } ${className ?? ""}`}
      title={title}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "idle"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.14 }}
        >
          {copied ? <Check size={iconSize} /> : <Icon size={iconSize} />}
        </motion.span>
      </AnimatePresence>
      {label && <span className="text-xs font-medium">{label}</span>}
    </motion.button>
  );
}
