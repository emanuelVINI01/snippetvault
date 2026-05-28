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
    <div className="group relative flex min-h-0 flex-1 flex-col">
      <div className="absolute right-3 top-3 z-10 opacity-100 transition-opacity sm:right-4 sm:top-4 sm:opacity-0 sm:group-hover:opacity-100">
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
        className="relative min-h-0 flex-1 overflow-x-auto text-sm font-mono leading-loose"
      >
        <SyntaxHighlighter
          language={lang}
          style={dracula}
          showLineNumbers
          wrapLongLines
          lineNumberStyle={{
            color: "rgba(167, 176, 200, 0.45)",
            minWidth: "2.5em",
            paddingRight: "1em",
            textAlign: "right",
            userSelect: "none",
          }}
          customStyle={{
            margin: 0,
            minHeight: "100%",
            overflowX: "auto",
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.625",
            background: "transparent",
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            whiteSpace: "pre-wrap",
            wordBreak: "normal",
            overflowWrap: "normal",
          }}
          codeTagProps={{
            style: {
              fontFamily: "inherit",
              lineHeight: "inherit",
              whiteSpace: "pre-wrap",
              wordBreak: "normal",
              overflowWrap: "normal",
            },
          }}
        >
          {code || " "}
        </SyntaxHighlighter>
      </motion.div>
    </div>
  );
}
