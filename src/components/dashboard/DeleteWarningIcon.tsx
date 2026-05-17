"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function DeleteWarningIcon() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex h-14 w-14 items-center justify-center rounded-full border border-dracula-red/30 bg-dracula-red/10"
    >
      <AlertTriangle className="h-7 w-7 text-dracula-red" />
    </motion.div>
  );
}
