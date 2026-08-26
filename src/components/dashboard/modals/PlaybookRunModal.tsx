import React, { useState, useEffect, useCallback } from "react";
import { Play, ChevronDown, ChevronUp } from "lucide-react";
import Modal from "./Modal";
import type { SnippetCollection } from "@/src/types/collection";
import CopyButton from "@/src/components/shared/actions/CopyButton";

interface PlaybookRunItemData {
  id: string;
  snippetId: string;
  status: "pending" | "done" | "skipped";
  notes?: string | null;
}

interface PlaybookRunData {
  id: string;
  title: string;
  status: "active" | "completed" | "abandoned";
  createdAt: string;
  items: PlaybookRunItemData[];
}

interface PlaybookRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: SnippetCollection;
}

export default function PlaybookRunModal({ isOpen, onClose, collection }: PlaybookRunModalProps) {
  const [runs, setRuns] = useState<PlaybookRunData[]>([]);
  const [activeRun, setActiveRun] = useState<PlaybookRunData | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [stepNotes, setStepNotes] = useState<Record<string, string>>({});

  const fetchRuns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/collections/${collection.id}/runs`);
      if (res.ok) {
        const data: PlaybookRunData[] = await res.json();
        setRuns(data);
        // Auto-select the first active run if there is one
        const active = data.find((r) => r.status === "active");
        if (active) {
          setActiveRun(active);
          // Initialize notes
          const notes: Record<string, string> = {};
          active.items.forEach((item) => {
            notes[item.id] = item.notes || "";
          });
          setStepNotes(notes);
        } else {
          setActiveRun(null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [collection.id]);

  useEffect(() => {
    if (isOpen) {
      fetchRuns();
    }
  }, [isOpen, fetchRuns]);

  const startNewRun = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/collections/${collection.id}/runs`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchRuns();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const updateItem = async (itemId: string, status: "pending" | "done" | "skipped") => {
    if (!activeRun) return;
    const notes = stepNotes[itemId] || "";
    try {
      const res = await fetch(`/api/collections/${collection.id}/runs/${activeRun.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: itemId, status, notes }],
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        // Update local items state
        setActiveRun(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveNotes = async (itemId: string) => {
    if (!activeRun) return;
    const notes = stepNotes[itemId] || "";
    try {
      await fetch(`/api/collections/${collection.id}/runs/${activeRun.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: itemId, notes }],
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const endRun = async (status: "completed" | "abandoned") => {
    if (!activeRun) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/collections/${collection.id}/runs/${activeRun.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchRuns();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  // Calculate progress metrics
  const totalSteps = activeRun?.items?.length || 0;
  const completedSteps = activeRun?.items?.filter((i) => i.status === "done").length || 0;
  const skippedSteps = activeRun?.items?.filter((i) => i.status === "skipped").length || 0;
  const progressPercent = totalSteps > 0 ? Math.round(((completedSteps + skippedSteps) / totalSteps) * 100) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Executar Playbook: ${collection.title}`} maxWidth="max-w-4xl">
      <div className="flex flex-col gap-4 py-2">
        {loading ? (
          <div className="text-center py-10 text-xs text-dracula-comment">
            Carregando execuções...
          </div>
        ) : !activeRun ? (
          /* Empty / Start Execution View */
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-dracula-card/40 rounded-2xl bg-dracula-card/5">
            <Play className="h-10 w-10 text-dracula-purple/70 mb-3 animate-pulse" />
            <h3 className="text-sm font-bold text-dracula-fg">Nenhuma execução ativa</h3>
            <p className="text-xs text-dracula-comment max-w-xs mt-1.5 leading-relaxed">
              Você pode iniciar um checklist interativo para executar os scripts deste playbook passo a passo.
            </p>
            <button
              onClick={startNewRun}
              disabled={busy || collection.items.length === 0}
              className="mt-5 px-5 py-2 bg-dracula-purple hover:bg-dracula-purple/80 text-dracula-bg font-bold text-xs rounded-xl transition-all disabled:opacity-50"
            >
              {busy ? "Iniciando..." : "Iniciar Nova Execução"}
            </button>
            {collection.items.length === 0 && (
              <p className="text-[10px] text-dracula-red mt-2">
                Adicione snippets a este playbook antes de executá-lo.
              </p>
            )}

            {runs.length > 0 && (
              <div className="w-full border-t border-dracula-card/30 mt-6 pt-5 flex flex-col text-left">
                <span className="text-[10px] font-bold text-dracula-comment uppercase tracking-wider mb-2">
                  Histórico de Execuções
                </span>
                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                  {runs.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-dracula-bg/30 border border-dracula-card/20 text-xs"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-dracula-fg">{r.title}</span>
                        <span className="text-[10px] text-dracula-comment">
                          {new Date(r.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === "completed"
                            ? "bg-dracula-green/20 text-dracula-green"
                            : r.status === "abandoned"
                            ? "bg-dracula-red/20 text-dracula-red"
                            : "bg-dracula-purple/20 text-dracula-purple"
                        }`}
                      >
                        {r.status === "completed"
                          ? "Concluído"
                          : r.status === "abandoned"
                          ? "Abandonado"
                          : "Ativo"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Active Execution Checklist View */
          <div className="flex flex-col gap-4">
            {/* Header info / Progress */}
            <div className="flex flex-col gap-2 bg-dracula-card/10 border border-dracula-card/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-dracula-fg uppercase tracking-wider">
                    {activeRun.title}
                  </h4>
                  <span className="text-[10px] text-dracula-comment">
                    Iniciado em: {new Date(activeRun.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => endRun("abandoned")}
                    disabled={busy}
                    className="px-2.5 py-1 text-xs border border-dracula-red/35 hover:bg-dracula-red/15 text-dracula-red rounded-lg transition-colors"
                  >
                    Abandonar
                  </button>
                  <button
                    onClick={() => endRun("completed")}
                    disabled={busy}
                    className="px-3 py-1 text-xs bg-dracula-green hover:brightness-110 text-dracula-bg font-bold rounded-lg transition-all"
                  >
                    Concluir Playbook
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold text-dracula-comment">
                  <span>Progresso da Checklist</span>
                  <span>
                    {completedSteps} concluídos, {skippedSteps} pulados ({progressPercent}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-dracula-card/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-dracula-purple transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-dracula-comment">Etapas do Script</span>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {collection.items.map((collItem, idx) => {
                  // Find matching run item
                  const runItem = activeRun.items.find((i) => i.snippetId === collItem.snippet.id);
                  if (!runItem) return null;

                  const isExpanded = expandedStep === idx;
                  const isDone = runItem.status === "done";
                  const isSkipped = runItem.status === "skipped";

                  return (
                    <div
                      key={runItem.id}
                      className={`border rounded-xl transition-all overflow-hidden ${
                        isDone
                          ? "border-dracula-green/35 bg-dracula-green/5"
                          : isSkipped
                          ? "border-dracula-comment/20 bg-dracula-comment/5"
                          : "border-dracula-card/70 bg-dracula-card/10"
                      }`}
                    >
                      {/* Step Header */}
                      <div
                        onClick={() => setExpandedStep(isExpanded ? null : idx)}
                        className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-dracula-card/20 select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex shrink-0 items-center justify-center h-5 w-5 rounded-full bg-dracula-bg border border-dracula-card font-mono text-[10px] text-dracula-comment">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="truncate text-xs font-semibold text-dracula-fg block">
                              {collItem.snippet.title}
                            </span>
                            {collItem.filePath && (
                              <span className="text-[10px] text-dracula-comment block truncate font-mono">
                                {collItem.filePath}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status + Accordion toggle */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              isDone
                                ? "bg-dracula-green/20 text-dracula-green"
                                : isSkipped
                                ? "bg-dracula-comment/20 text-dracula-comment"
                                : "bg-dracula-orange/20 text-dracula-orange"
                            }`}
                          >
                            {isDone ? "Concluído" : isSkipped ? "Pulado" : "Pendente"}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-dracula-comment" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-dracula-comment" />
                          )}
                        </div>
                      </div>

                      {/* Step body */}
                      {isExpanded && (
                        <div className="p-3.5 border-t border-dracula-card/30 bg-dracula-bg/20 space-y-3">
                          {/* Code display with copy button */}
                          <div className="relative rounded-lg overflow-hidden border border-dracula-card/50">
                            <div className="flex items-center justify-between bg-dracula-bg px-3 py-1.5 text-[10px] text-dracula-comment border-b border-dracula-card/30 font-mono">
                              <span>{collItem.snippet.language}</span>
                              <CopyButton content={collItem.snippet.code} iconSize={12} />
                            </div>
                            <pre className="p-3 overflow-x-auto text-[11px] font-mono bg-dracula-bg/40 max-h-[150px] leading-relaxed text-dracula-fg whitespace-pre">
                              {collItem.snippet.code}
                            </pre>
                          </div>

                          {/* Action controls */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Status toggles */}
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] font-semibold text-dracula-comment">
                                Alterar Status
                              </span>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => updateItem(runItem.id, "done")}
                                  className={`flex-1 py-1 rounded text-[10px] font-bold transition-all border ${
                                    isDone
                                      ? "bg-dracula-green/20 text-dracula-green border-dracula-green/50"
                                      : "bg-dracula-bg border-dracula-card/50 text-dracula-comment hover:border-dracula-green/45"
                                  }`}
                                >
                                  Concluído
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateItem(runItem.id, "skipped")}
                                  className={`flex-1 py-1 rounded text-[10px] font-bold transition-all border ${
                                    isSkipped
                                      ? "bg-dracula-comment/20 text-dracula-comment border-dracula-comment/50"
                                      : "bg-dracula-bg border-dracula-card/50 text-dracula-comment hover:border-dracula-comment/45"
                                  }`}
                                >
                                  Pular
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateItem(runItem.id, "pending")}
                                  className={`flex-1 py-1 rounded text-[10px] font-bold transition-all border ${
                                    !isDone && !isSkipped
                                      ? "bg-dracula-orange/20 text-dracula-orange border-dracula-orange/50"
                                      : "bg-dracula-bg border-dracula-card/50 text-dracula-comment hover:border-dracula-orange/45"
                                  }`}
                                >
                                  Pendente
                                </button>
                              </div>
                            </div>

                            {/* Step notes input */}
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] font-semibold text-dracula-comment">
                                Notas da Etapa (Salva ao perder o foco)
                              </span>
                              <input
                                type="text"
                                value={stepNotes[runItem.id] || ""}
                                onChange={(e) =>
                                  setStepNotes((prev) => ({ ...prev, [runItem.id]: e.target.value }))
                                }
                                onBlur={() => saveNotes(runItem.id)}
                                placeholder="Notas de execução (opcional)..."
                                className="w-full bg-dracula-bg/50 border border-dracula-card rounded px-2.5 py-1 text-xs text-dracula-fg placeholder-dracula-comment/30 focus:outline-none focus:border-dracula-purple"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
