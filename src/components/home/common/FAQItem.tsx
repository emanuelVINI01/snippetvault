"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  question: string;
}

export default function FAQItem({ answer, index, isOpen, onToggle, question }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.045, duration: 0.28 }}
      className={`overflow-hidden rounded-xl border transition-colors duration-200 ${getFaqItemClass(isOpen)}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left outline-none"
      >
        <span className="font-medium text-dracula-fg">{question}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-dracula-comment transition-transform duration-300 ${getIconClass(isOpen)}`} />
      </button>
      <FAQAnswer answer={answer} isOpen={isOpen} />
    </motion.div>
  );
}

function FAQAnswer({ answer, isOpen }: { answer: string; isOpen: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <p className="px-5 pb-5 text-sm leading-relaxed text-dracula-comment">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function getFaqItemClass(isOpen: boolean): string {
  return isOpen
    ? "border-dracula-purple/30 bg-dracula-surface/70"
    : "border-dracula-card/60 bg-dracula-bg/55 hover:border-dracula-card";
}

function getIconClass(isOpen: boolean): string {
  return isOpen ? "rotate-180 text-dracula-purple" : "";
}
