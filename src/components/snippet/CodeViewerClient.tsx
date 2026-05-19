"use client";

import { motion } from "framer-motion";
import CopyButton from "@/src/components/shared/actions/CopyButton";
import { useLanguage } from "@/src/context/LanguageContext";
import { dracula, normalizeSnippetLanguage, SyntaxHighlighter } from "@/src/lib/syntax-highlighting";

interface CodeViewerClientProps {
  code: string;
  language: string;
}

export default function CodeViewerClient({ code, language }: CodeViewerClientProps) {
  const lang = normalizeSnippetLanguage(language);
  const { t } = useLanguage();

  return (
    <div className="group relative">
      <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton 
          content={code} 
          iconSize={14} 
          label={t.common.copy}
          className="bg-dracula-bg/80 backdrop-blur-sm border-dracula-card/60 px-3 py-1.5" 
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08, duration: 0.22 }}
        className="overflow-x-auto text-sm font-mono leading-loose relative"
      >
      <SyntaxHighlighter
        language={lang}
        style={dracula}
        showLineNumbers
        wrapLongLines={false}
        lineNumberStyle={{
          color: "rgba(167, 176, 200, 0.45)",
          minWidth: "2.5em",
          paddingRight: "1em",
          textAlign: "right",
          userSelect: "none",
        }}
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          fontSize: "0.875rem",
          lineHeight: "1.625",
          background: "transparent",
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
        codeTagProps={{
          style: {
            fontFamily: "inherit",
            lineHeight: "inherit",
          },
        }}
      >
        {code || " "}
      </SyntaxHighlighter>
    </motion.div>
  </div>
  );
}
