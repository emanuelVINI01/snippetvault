"use client";

import { motion } from "framer-motion";
import { Code2, Terminal } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

export default function CodePreview() {
  const { t } = useLanguage();

  return (
    <section className="border-y border-dracula-card/30 bg-dracula-card/10 px-4 py-24 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row">
        <motion.div
          initial={{ opacity: 0, x: -26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex-1 space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-dracula-cyan/20 bg-dracula-cyan/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-dracula-cyan">
            <Terminal className="h-3.5 w-3.5" />
            {t.home.codePreview.badge}
          </div>
          <h2 className="text-3xl font-bold leading-tight text-dracula-fg sm:text-4xl">
            {t.home.codePreview.title}
          </h2>
          <p className="text-base leading-relaxed text-dracula-comment sm:text-lg">
            {t.home.codePreview.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 26, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-2xl flex-1"
        >
          <div className="overflow-hidden rounded-xl border border-dracula-card/70 bg-[#282a36] shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-dracula-card/60 bg-[#21222c] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-dracula-red" />
              <span className="h-3 w-3 rounded-full bg-dracula-yellow" />
              <span className="h-3 w-3 rounded-full bg-dracula-green" />
              <div className="ml-4 flex items-center gap-2 font-mono text-xs text-dracula-comment">
                <Code2 className="h-3.5 w-3.5" /> utils.ts
              </div>
            </div>

            <div className="overflow-x-auto p-5 font-mono text-sm leading-loose">
              <pre>
                <code className="text-[#f8f8f2]">
                  <span className="text-[#ff79c6]">export const</span> <span className="text-[#50fa7b]">debounce</span> <span className="text-[#ff79c6]">=</span> ({"\n"}
                  {"  "}<span className="text-[#ffb86c]">func</span>: (...args: <span className="text-[#8be9fd]">any</span>[]) {"=>"} <span className="text-[#8be9fd]">void</span>,{"\n"}
                  {"  "}<span className="text-[#ffb86c]">wait</span>: <span className="text-[#8be9fd]">number</span>{"\n"}
                  ) {"=>"} {"{"}{"\n"}
                  {"  "}<span className="text-[#ff79c6]">let</span> timeout: <span className="text-[#8be9fd]">NodeJS.Timeout</span>;{"\n"}
                  {"  "}<span className="text-[#ff79c6]">return</span> (...<span className="text-[#ffb86c]">args</span>: <span className="text-[#8be9fd]">any</span>[]) {"=>"} {"{"}{"\n"}
                  {"    "}<span className="text-[#50fa7b]">clearTimeout</span>(timeout);{"\n"}
                  {"    "}timeout <span className="text-[#ff79c6]">=</span> <span className="text-[#50fa7b]">setTimeout</span>(() {"=>"} <span className="text-[#50fa7b]">func</span>(...args), wait);{"\n"}
                  {"  "}{"}"};{"\n"}
                  {"}"};
                </code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
