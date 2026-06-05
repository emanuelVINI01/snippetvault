"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Bug, Code2, FileText, Lightbulb, Sparkles, Wand2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import CopyButton from "@/src/components/shared/actions/CopyButton";
import { useLanguage } from "@/src/context/LanguageContext";
import { aiApiClient, AiApiError } from "@/src/services/ai/ai-api-client";
import type { AiSnippetAssistantResponse } from "@/src/types/ai";
import type { Snippet } from "@/src/types/snippet";
import Modal from "./Modal";
import { dracula, normalizeSnippetLanguage, SyntaxHighlighter } from "@/src/lib/syntax-highlighting";

interface AiSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  snippet: Snippet | null;
}

export default function AiSnippetModal({ isOpen, onClose, snippet }: AiSnippetModalProps) {
  const { language, t } = useLanguage();
  const [response, setResponse] = useState<AiSnippetAssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && snippet) {
      const checkPreExisting = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await aiApiClient.analyzeSnippet(snippet.id, language, true);
          if (res.analysis) {
            setResponse(res);
          }
        } catch (requestError) {
          // Silent fallback on checking error, user can still run manually
        } finally {
          setLoading(false);
        }
      };
      checkPreExisting();
    } else {
      setResponse(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen, snippet, language]);

  const runAssistant = async () => {
    if (!snippet) return;

    setLoading(true);
    setError(null);
    try {
      const forceRefresh = !!response;
      setResponse(await aiApiClient.analyzeSnippet(snippet.id, language, false, forceRefresh));
    } catch (requestError) {
      setError(getAiErrorMessage(requestError, t.ai));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.ai.title} maxWidth="max-w-6xl">
      {snippet && (
        <div className="relative overflow-hidden rounded-2xl border border-dracula-purple/20 bg-dracula-surface/30 p-2 sm:p-5">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dracula-pink to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative flex flex-col gap-5">
            <AiIntro
              cacheHit={response?.cacheHit}
              loading={loading}
              model={response?.model}
              snippet={snippet}
              usage={response?.usage}
              onRun={runAssistant}
              showRunButton={!response}
            />
            {error && (
              <p className="rounded-xl border border-dracula-red/30 bg-dracula-red/10 px-3 py-2 text-sm text-dracula-red">
                {error}
              </p>
            )}
            <AnimatePresence mode="wait">
              {response ? (
                <AiResult key="result" response={response} />
              ) : (
                <AiEmptyState key="empty" loading={loading} />
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </Modal>
  );
}

function AiIntro({
  cacheHit,
  loading,
  model,
  snippet,
  usage,
  onRun,
  showRunButton,
}: {
  cacheHit?: boolean;
  loading: boolean;
  model?: string;
  snippet: Snippet;
  usage?: AiSnippetAssistantResponse["usage"];
  onRun: () => void;
  showRunButton: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-dracula-pink/25 bg-dracula-pink/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-dracula-pink">
            <Sparkles className="h-3.5 w-3.5" />
            {t.ai.badge}
          </span>
          {cacheHit !== undefined && (
            <span className="rounded-full border border-dracula-green/25 bg-dracula-green/10 px-3 py-1 text-xs text-dracula-green">
              {cacheHit ? t.ai.cacheHit : t.ai.freshCall}
            </span>
          )}
        </div>
        <h2 className="line-clamp-2 text-xl font-bold text-dracula-fg">{snippet.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-dracula-comment">
          {model ? `${t.ai.model}: ${model}` : t.ai.intro}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
        {usage && (
          <div className="rounded-xl border border-dracula-card/70 bg-dracula-bg/55 px-3 py-2 text-xs text-dracula-comment">
            {usage.used}/{usage.limit} {t.ai.usedToday} · {usage.cacheHits} {t.ai.savedCalls}
          </div>
        )}
        {showRunButton && (
          <button
            onClick={onRun}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-dracula-pink px-4 py-3 text-sm font-bold text-dracula-bg shadow-lg shadow-dracula-pink/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            <Wand2 className="h-4 w-4" />
            {loading ? t.ai.running : t.ai.run}
          </button>
        )}
      </div>
    </div>
  );
}

function AiEmptyState({ loading }: { loading: boolean }) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="grid gap-3 sm:grid-cols-3"
    >
      {[t.ai.emptyExplain, t.ai.emptyImprove, t.ai.emptyExample].map((label, index) => (
        <motion.div
          key={label}
          animate={loading ? { y: [0, -6, 0] } : undefined}
          transition={{ delay: index * 0.12, duration: 1.2, repeat: loading ? Infinity : 0 }}
          className="rounded-2xl border border-dracula-card/70 bg-dracula-bg/45 p-4 text-sm text-dracula-comment"
        >
          <Sparkles className="mb-3 h-5 w-5 text-dracula-purple" />
          {label}
        </motion.div>
      ))}
    </motion.div>
  );
}

function AiResult({ response }: { response: AiSnippetAssistantResponse }) {
  const { t } = useLanguage();
  const analysis = response.analysis;
  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
    >
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
    </motion.div>
  );
}

function AiCard({
  children,
  icon: Icon,
  title,
}: {
  children: ReactNode;
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
  children: ReactNode;
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

function getAiErrorMessage(error: unknown, copy: { limitReached: string; notConfigured: string; failed: string }) {
  if (error instanceof AiApiError) {
    if (error.status === 429) return copy.limitReached;
    if (error.status === 503) return copy.notConfigured;
  }

  return copy.failed;
}
