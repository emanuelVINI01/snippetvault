"use client";

import { useEffect, useState } from "react";
import type { PublicSnippetView } from "@/src/types/public-snippet";
import PublicSnippetCodePanel from "./PublicSnippetCodePanel";
import PublicSnippetHeader from "./PublicSnippetHeader";
import PublicSnippetHero from "./PublicSnippetHero";
import type { AiSnippetAnalysis } from "@/src/lib/validations/ai";
import { Lightbulb, FileText, Sparkles, Bug, Code2, AlertTriangle, Wand2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CopyButton from "@/src/components/shared/actions/CopyButton";
import Link from "next/link";
import { useLanguage } from "@/src/context/LanguageContext";
import { dracula, normalizeSnippetLanguage, SyntaxHighlighter } from "@/src/lib/syntax-highlighting";

interface PublicSnippetClientProps {
  snippet: PublicSnippetView;
  analysis: AiSnippetAnalysis | null;
}

export default function PublicSnippetClient({ snippet, analysis }: PublicSnippetClientProps) {
  const { language, t } = useLanguage();
  const [related, setRelated] = useState<any[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    if (snippet?.id) {
      setRelatedLoading(true);
      fetch(`/api/snippets/${snippet.id}/related`)
        .then((res) => {
          if (res.ok) return res.json();
          return [];
        })
        .then((data) => setRelated(data))
        .catch((err) => console.error("Error fetching related snippets:", err))
        .finally(() => setRelatedLoading(false));
    }
  }, [snippet?.id]);

  return (
    <div className="min-h-screen text-dracula-fg">
      <PublicSnippetHeader />
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-3 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <PublicSnippetHero snippet={snippet} />
        </div>
        <PublicSnippetCodePanel snippet={snippet} />

        {/* AI Analysis Section */}
        <div className="mx-auto w-full max-w-[min(100%,96rem)] mt-6 sm:mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-dracula-fg">
            <Sparkles className="h-5 w-5 text-dracula-purple" />
            {language === "pt" ? "Análise de Inteligência Artificial" : "AI Intelligence Analysis"}
          </h2>
          {analysis ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="flex min-w-0 flex-col gap-4">
                <AiCard icon={Lightbulb} title={t.ai.summary}>
                  <p className="whitespace-pre-line">{analysis.summary}</p>
                </AiCard>
                <AiCard icon={FileText} title={t.ai.generatedDescription}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="whitespace-pre-line">{analysis.description}</p>
                    <CopyButton content={analysis.description} iconSize={14} />
                  </div>
                </AiCard>
                <AiCard icon={Sparkles} title={t.ai.suggestions}>
                  <p className="text-dracula-fg">{analysis.language}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysis.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-dracula-cyan/20 bg-dracula-cyan/10 px-2 py-1 text-xs text-dracula-cyan"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </AiCard>
                {analysis.bugs.length > 0 && (
                  <AiCard icon={Bug} title={t.ai.findings}>
                    <div className="space-y-3">
                      {analysis.bugs.map((bug) => (
                        <div key={`${bug.title}-${bug.detail}`} className="rounded-xl bg-dracula-bg/45 p-3">
                          <div className="flex items-center gap-2 text-dracula-fg">
                            <AlertTriangle className="h-4 w-4 text-dracula-orange" />
                            <span className="font-semibold">{bug.title}</span>
                            <span className="text-xs uppercase text-dracula-comment">{bug.severity}</span>
                          </div>
                          <p className="mt-1 text-sm">{bug.detail}</p>
                        </div>
                      ))}
                    </div>
                  </AiCard>
                )}
              </div>
              <div className="flex min-w-0 flex-col gap-4">
                <AiCodeCard code={analysis.refactor.code} language={analysis.language} title={t.ai.refactor}>
                  <ul className="mb-3 space-y-2 text-sm text-dracula-comment">
                    {analysis.refactor.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </AiCodeCard>
                <AiCodeCard code={analysis.example.code} language={analysis.language} title={analysis.example.title || t.ai.example}>
                  <p className="mb-3 text-sm text-dracula-comment">{analysis.example.notes}</p>
                </AiCodeCard>
              </div>
            </div>
          ) : (
            /* Premium Glassmorphic CTA Card */
            <div className="relative overflow-hidden rounded-2xl border border-dracula-purple/20 bg-dracula-surface/30 p-6 shadow-xl sm:p-10">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-dracula-purple/10 blur-3xl" />
              <div className="absolute left-0 bottom-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-dracula-pink/10 blur-3xl" />
              <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dracula-purple/35 bg-dracula-purple/10 text-dracula-purple shadow-lg shadow-dracula-purple/10">
                  <Wand2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-extrabold text-dracula-fg sm:text-2xl tracking-tight">
                  {language === "pt"
                    ? "Quer uma revisão completa de IA para este código?"
                    : "Want a complete AI review for this code?"}
                </h3>
                <p className="text-sm leading-relaxed text-dracula-comment sm:text-base">
                  {language === "pt"
                    ? "Faça login ou cadastre-se gratuitamente no SnippetVault para acessar análises inteligentes de IA, sugestões de refatoração, exemplos de uso prático e correções de bugs."
                    : "Log in or sign up for free on SnippetVault to access smart AI analysis, refactoring suggestions, practical usage examples, and bug fixes."}
                </p>
                <Link
                  href="/login"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-dracula-purple to-dracula-pink px-6 py-3.5 text-sm font-bold text-dracula-bg shadow-lg shadow-dracula-purple/20 transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  {language === "pt" ? "Criar conta e analisar snippet" : "Create account and analyze snippet"}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Related Snippets Section */}
        {related.length > 0 && (
          <div className="mx-auto w-full max-w-[min(100%,96rem)] mt-12 border-t border-dracula-card/30 pt-8">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-dracula-fg">
              <Code2 className="h-5 w-5 text-dracula-cyan" />
              {language === "pt" ? "Snippets Relacionados" : "Related Snippets"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/snippet/${item.id}`}
                  className="group flex flex-col justify-between p-4 rounded-2xl border border-dracula-card/75 bg-dracula-card/15 hover:border-dracula-cyan/40 hover:bg-dracula-card/25 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-dracula-cyan bg-dracula-cyan/10 px-2 py-0.5 rounded-md">
                        {item.language}
                      </span>
                      <span className="text-[10px] text-dracula-comment">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-dracula-fg group-hover:text-dracula-cyan transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-1 text-xs text-dracula-comment line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[10px] text-dracula-comment mr-2">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function AiCard({
  children,
  icon: Icon,
  title,
}: {
  children: React.ReactNode;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-dracula-card/70 bg-dracula-bg/45 p-3 sm:p-4 text-sm leading-relaxed text-dracula-comment">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-dracula-fg">
        <Icon className="h-4 w-4 text-dracula-purple" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function AiCodeCard({
  children,
  code,
  language,
  title,
}: {
  children: React.ReactNode;
  code: string;
  language: string;
  title: string;
}) {
  const lang = normalizeSnippetLanguage(language);
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-dracula-card/70 bg-[#282a36]">
      <div className="flex items-center justify-between gap-3 border-b border-dracula-card/60 bg-[#21222c] px-4 py-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-dracula-fg">
          <Code2 className="h-4 w-4 text-dracula-cyan" />
          {title}
        </h3>
        <CopyButton content={code} iconSize={14} />
      </div>
      <div className="p-3 sm:p-4">
        {children}
        <div className="max-h-80 overflow-auto rounded-xl border border-dracula-card/50 bg-[#1e1f29]">
          <SyntaxHighlighter
            language={lang}
            style={dracula}
            customStyle={{
              margin: 0,
              padding: "0.75rem",
              fontSize: "0.75rem",
              background: "transparent",
              lineHeight: "1.5",
              whiteSpace: "pre-wrap",
            }}
            codeTagProps={{
              style: {
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  );
}
