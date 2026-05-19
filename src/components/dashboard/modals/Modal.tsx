"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useBodyScrollLock } from "@/src/hooks/shared/use-body-scroll-lock";
import { useEscapeKey } from "@/src/hooks/shared/use-escape-key";
import ModalHeader from "./ModalHeader";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ children, isOpen, maxWidth = "max-w-lg", onClose, title }: ModalProps) {
  useEscapeKey(isOpen, onClose);
  useBodyScrollLock(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <ModalOverlay onClose={onClose} />
          <ModalPanel maxWidth={maxWidth}>
            <ModalHeader onClose={onClose} title={title} />
            <div className="max-h-[calc(100dvh-6rem)] min-w-0 overflow-y-auto px-4 py-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] sm:px-6 sm:pb-5">
              {children}
            </div>
          </ModalPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      aria-hidden="true"
    />
  );
}

function ModalPanel({ children, maxWidth }: { children: ReactNode; maxWidth: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`relative max-h-[calc(100dvh-0.75rem)] w-full min-w-0 ${maxWidth} overflow-hidden rounded-t-3xl border border-dracula-card bg-dracula-bg shadow-2xl shadow-black/50 sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {children}
    </motion.div>
  );
}
