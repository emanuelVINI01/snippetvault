"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bug,
  Code2,
  FileText,
  Lightbulb,
  Sparkles,
  Wand2,
  ShieldAlert,
  Terminal,
  Activity,
  FileCode,
  Lock,
  ChevronDown
} from "lucide-react";
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

  const formatSetupInstructions = (text: string) => {
    if (!text) return null;
    const cleanText = text.replace(/\\n/g, "\n");
    return cleanText.split("\n").map((line, index) => (
      <p key={index} className="min-h-[1em] mb-1 text-xs text-dracula-fg leading-relaxed">
        {line}
      </p>
    ));
  };

  const cleanCodeString = (code: string) => {
    return code ? code.replace(/\\n/g, "\n") : "";
  };

  // Tabs / Expanded state
  const [activeSection, setActiveSection] = useState<"analysis" | "explain" | "security" | "generators">("analysis");
  const [explainMode, setExplainMode] = useState<"quick" | "technical" | "lineByLine">("quick");
  const [selectedFramework, setSelectedFramework] = useState("Jest");
  const [generatingTests, setGeneratingTests] = useState(false);
  const [testResult, setTestResult] = useState<{ testCode: string; setupInstructions: string } | null>(null);
  const [generatingDocs, setGeneratingDocs] = useState(false);
  const [docResult, setDocResult] = useState<{ readme: string; docBlocks: string } | null>(null);

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
      setActiveSection("analysis");
      setExplainMode("quick");
      setTestResult(null);
      setDocResult(null);
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

  const handleGenerateTests = async () => {
    if (!snippet) return;
    setGeneratingTests(true);
    setError(null);
    try {
      const res = await fetch(`/api/ai/snippets/${snippet.id}/tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ framework: selectedFramework, locale: language }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setTestResult(data.result);
        if (data.usage) {
          setResponse((prev) => prev ? { ...prev, usage: data.usage } : null);
        }
      } else {
        const apiError = new AiApiError(res.status, data.error || "");
        setError(getAiErrorMessage(apiError, t.ai));
      }
    } catch (e) {
      setError(t.ai.failed);
      console.error(e);
    } finally {
      setGeneratingTests(false);
    }
  };

  const handleGenerateDocs = async () => {
    if (!snippet) return;
    setGeneratingDocs(true);
    setError(null);
    try {
      const res = await fetch(`/api/ai/snippets/${snippet.id}/documentation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: language }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDocResult(data.result);
        if (data.usage) {
          setResponse((prev) => prev ? { ...prev, usage: data.usage } : null);
        }
      } else {
        const apiError = new AiApiError(res.status, data.error || "");
        setError(getAiErrorMessage(apiError, t.ai));
      }
    } catch (e) {
      setError(t.ai.failed);
      console.error(e);
    } finally {
      setGeneratingDocs(false);
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

            {response && (
              /* Tab Navigation */
              <div className="flex flex-wrap gap-2 border-b border-dracula-card/40 pb-2.5 my-1">
                <button
                  type="button"
                  onClick={() => setActiveSection("analysis")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeSection === "analysis"
                      ? "bg-dracula-pink/20 text-dracula-pink border border-dracula-pink/30"
                      : "text-dracula-comment hover:text-dracula-fg"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Análise Geral</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("explain")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeSection === "explain"
                      ? "bg-dracula-pink/20 text-dracula-pink border border-dracula-pink/30"
                      : "text-dracula-comment hover:text-dracula-fg"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Explicação Detalhada</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("security")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeSection === "security"
                      ? "bg-dracula-pink/20 text-dracula-pink border border-dracula-pink/30"
                      : "text-dracula-comment hover:text-dracula-fg"
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Métricas & Segurança</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("generators")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeSection === "generators"
                      ? "bg-dracula-pink/20 text-dracula-pink border border-dracula-pink/30"
                      : "text-dracula-comment hover:text-dracula-fg"
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>Geradores de Código</span>
                </button>
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-dracula-red/30 bg-dracula-red/10 px-3 py-2 text-sm text-dracula-red">
                {error}
              </p>
            )}
            
            <AnimatePresence mode="wait">
              {response ? (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="min-w-0 w-full"
                >
                  {activeSection === "analysis" && (
                    <AiResult response={response} />
                  )}

                  {activeSection === "explain" && response.analysis && (
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-2">
                        {(["quick", "technical", "lineByLine"] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setExplainMode(mode)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                              explainMode === mode
                                ? "bg-dracula-cyan/20 text-dracula-cyan border border-dracula-cyan/35"
                                : "text-dracula-comment hover:text-dracula-fg"
                            }`}
                          >
                            {mode === "quick" ? "Explicação Rápida" : mode === "technical" ? "Detalhes Técnicos" : "Linha por Linha"}
                          </button>
                        ))}
                      </div>

                      {explainMode === "quick" && (
                        <AiCard icon={FileText} title="Explicação Rápida">
                          <p className="whitespace-pre-line text-sm leading-relaxed text-dracula-fg">
                            {response.analysis.explanations?.quick || response.analysis.summary}
                          </p>
                        </AiCard>
                      )}

                      {explainMode === "technical" && (
                        <AiCard icon={Code2} title="Explicação Técnica Detalhada">
                          <p className="whitespace-pre-line text-sm leading-relaxed text-dracula-fg">
                            {response.analysis.explanations?.technical || "Não disponível."}
                          </p>
                        </AiCard>
                      )}

                      {explainMode === "lineByLine" && (
                        <div className="w-full overflow-hidden rounded-lg border border-dracula-card bg-[#282a36]">
                          <div className="max-h-[400px] overflow-y-auto font-mono text-xs leading-relaxed">
                            <table className="w-full table-fixed border-collapse select-none">
                              <tbody>
                                {response.analysis.explanations?.lineByLine?.length ? (
                                  response.analysis.explanations.lineByLine.map((lineItem: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-dracula-card/10 text-dracula-fg border-b border-dracula-card/30">
                                      <td className="w-8 text-right pr-2 text-dracula-comment/40 border-r border-dracula-card/30 select-none">
                                        {idx + 1}
                                      </td>
                                      <td className="w-1/3 pl-2 pr-4 py-2 whitespace-pre overflow-x-auto select-text font-mono text-dracula-cyan">
                                        {lineItem.line}
                                      </td>
                                      <td className="pl-4 pr-4 py-2 text-dracula-comment select-text leading-snug">
                                        {lineItem.explanation}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td className="p-10 text-center text-dracula-comment text-xs">
                                      Nenhuma explicação linha por linha disponível para este código.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeSection === "security" && response.analysis && (
                    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-center justify-center p-5 rounded-2xl border border-dracula-card/70 bg-dracula-card/25 text-center">
                          <span className="text-[10px] font-bold text-dracula-comment uppercase tracking-wider mb-3">
                            Quality Score
                          </span>
                          <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-4 border-dracula-card bg-dracula-bg">
                            <div className="flex flex-col items-center justify-center">
                              <span className="text-3xl font-extrabold text-dracula-green">
                                {response.analysis.qualityScore || 80}
                              </span>
                              <span className="text-[9px] text-dracula-comment font-bold">/ 100</span>
                            </div>
                          </div>
                          <span className="mt-3 text-xs text-dracula-comment leading-relaxed">
                            Snippet bem estruturado, limpo e testável.
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 p-4 rounded-2xl border border-dracula-card/70 bg-dracula-card/25">
                          <span className="text-[10px] font-bold text-dracula-comment uppercase tracking-wider border-b border-dracula-card/30 pb-1.5">
                            Dependências / Requisitos
                          </span>
                          {response.analysis.requirements?.length ? (
                            <ul className="list-disc list-inside text-xs text-dracula-fg space-y-1 mt-1 pl-1">
                              {response.analysis.requirements.map((req: string) => (
                                <li key={req} className="truncate" title={req}>{req}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-xs text-dracula-comment">Nenhum requisito especial detectado.</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 border-b border-dracula-card/30 pb-2">
                          <ShieldAlert className="h-4 w-4 text-dracula-red" />
                          <span className="text-xs font-semibold text-dracula-comment uppercase tracking-wider">
                            Relatório de Segurança
                          </span>
                          <span
                            className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              response.analysis.securityReport?.riskLevel === "high"
                                ? "bg-dracula-red/25 text-dracula-red"
                                : response.analysis.securityReport?.riskLevel === "medium"
                                ? "bg-dracula-orange/25 text-dracula-orange"
                                : "bg-dracula-green/25 text-dracula-green"
                            }`}
                          >
                            Risco {response.analysis.securityReport?.riskLevel || "low"}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {response.analysis.securityReport?.findings?.length ? (
                            response.analysis.securityReport.findings.map((finding: any, idx: number) => (
                              <div key={idx} className="rounded-xl border border-dracula-card/65 bg-dracula-card/10 p-3.5">
                                <h4 className="text-xs font-bold text-dracula-fg flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-dracula-red" />
                                  {finding.title}
                                </h4>
                                <p className="mt-1.5 text-xs text-dracula-comment leading-relaxed">
                                  {finding.description}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-dracula-card/40 rounded-xl bg-dracula-green/5">
                              <span className="text-xs font-bold text-dracula-green">Nenhum risco de segurança óbvio</span>
                              <p className="text-[10px] text-dracula-comment mt-1">
                                A IA não encontrou nenhuma vulnerabilidade crítica neste código.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === "generators" && (
                    <div className="grid gap-5 lg:grid-cols-2">
                      {/* Tests Generator Box */}
                      <div className="flex flex-col gap-3 rounded-2xl border border-dracula-card/70 bg-dracula-card/15 p-4">
                        <div className="flex items-center justify-between border-b border-dracula-card/30 pb-2">
                          <span className="text-xs font-bold text-dracula-fg uppercase tracking-wider flex items-center gap-1.5">
                            <Terminal className="h-4 w-4 text-dracula-cyan" />
                            Gerador de Testes Unitários
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <select
                            value={selectedFramework}
                            onChange={(e) => setSelectedFramework(e.target.value)}
                            className="min-w-0 flex-1 rounded-lg border border-dracula-card bg-dracula-bg/65 px-3 py-1.5 text-xs text-dracula-fg outline-none"
                          >
                            <option value="Jest">Jest (JS/TS)</option>
                            <option value="Vitest">Vitest (JS/TS)</option>
                            <option value="PyTest">PyTest (Python)</option>
                            <option value="Go Test">Go Test (Go)</option>
                            <option value="JUnit">JUnit (Java)</option>
                          </select>
                          <button
                            type="button"
                            disabled={generatingTests}
                            onClick={handleGenerateTests}
                            className="px-4 py-1.5 bg-dracula-cyan hover:brightness-110 text-dracula-bg font-bold text-xs rounded-lg transition-all disabled:opacity-50"
                          >
                            {generatingTests ? "Gerando..." : "Gerar"}
                          </button>
                        </div>

                        {/* Test output */}
                        {testResult ? (
                          <div className="flex flex-col gap-2 mt-2">
                            <div className="flex justify-between items-center bg-dracula-bg p-2 rounded-lg text-[10px] text-dracula-comment font-mono border border-dracula-card/45">
                              <span>Arquivo de Teste</span>
                              <CopyButton content={cleanCodeString(testResult.testCode)} iconSize={12} />
                            </div>
                            <div className="max-h-[160px] overflow-auto rounded-xl border border-dracula-card/50 bg-[#1e1f29]">
                              <SyntaxHighlighter
                                language={normalizeSnippetLanguage(snippet.language)}
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
                                {cleanCodeString(testResult.testCode)}
                              </SyntaxHighlighter>
                            </div>
                            <span className="text-[10px] font-bold text-dracula-comment uppercase mt-1">
                              Instruções de Setup
                            </span>
                            <div className="bg-dracula-bg/40 p-2.5 rounded-lg border border-dracula-card/20 leading-relaxed max-h-[120px] overflow-y-auto">
                              {formatSetupInstructions(testResult.setupInstructions)}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center p-12 text-center text-xs text-dracula-comment border border-dashed border-dracula-card/40 rounded-xl">
                            Escolha o framework e clique em gerar para criar a suite de testes.
                          </div>
                        )}
                      </div>

                      {/* README Generator Box */}
                      <div className="flex flex-col gap-3 rounded-2xl border border-dracula-card/70 bg-dracula-card/15 p-4">
                        <div className="flex items-center justify-between border-b border-dracula-card/30 pb-2">
                          <span className="text-xs font-bold text-dracula-fg uppercase tracking-wider flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-dracula-pink" />
                            Gerador de README & Documentação
                          </span>
                          <button
                            type="button"
                            disabled={generatingDocs}
                            onClick={handleGenerateDocs}
                            className="px-4 py-1.5 bg-dracula-pink hover:brightness-110 text-dracula-bg font-bold text-xs rounded-lg transition-all disabled:opacity-50"
                          >
                            {generatingDocs ? "Gerando..." : "Gerar"}
                          </button>
                        </div>

                        {/* README output */}
                        {docResult ? (
                          <div className="flex flex-col gap-2 mt-1">
                            <div className="flex justify-between items-center bg-dracula-bg p-2 rounded-lg text-[10px] text-dracula-comment font-mono border border-dracula-card/45">
                              <span>README.md</span>
                              <CopyButton content={cleanCodeString(docResult.readme)} iconSize={12} />
                            </div>
                            <div className="max-h-[160px] overflow-auto rounded-xl border border-dracula-card/50 bg-[#1e1f29]">
                              <SyntaxHighlighter
                                language="markdown"
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
                                {cleanCodeString(docResult.readme)}
                              </SyntaxHighlighter>
                            </div>
                            <span className="text-[10px] font-bold text-dracula-comment uppercase mt-1">
                              Doc Blocks / Comentários Recomendados
                            </span>
                            <div className="max-h-[120px] overflow-auto rounded-xl border border-dracula-card/50 bg-[#1e1f29]">
                              <SyntaxHighlighter
                                language={normalizeSnippetLanguage(snippet.language)}
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
                                {cleanCodeString(docResult.docBlocks)}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center p-12 text-center text-xs text-dracula-comment border border-dashed border-dracula-card/40 rounded-xl">
                            Clique em gerar para criar o README e comentários estruturados para este snippet.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <AiEmptyState loading={loading} />
                </motion.div>
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

function getAiErrorMessage(
  error: unknown,
  copy: { limitReached: string; notConfigured: string; failed: string; concurrencyError?: string }
) {
  if (error instanceof AiApiError) {
    if (error.status === 429) {
      if (error.message?.includes("progress") || error.message?.includes("concurrency")) {
        return copy.concurrencyError || "Another AI request is already in progress.";
      }
      return copy.limitReached;
    }
    if (error.status === 503) return copy.notConfigured;
  }

  return copy.failed;
}
