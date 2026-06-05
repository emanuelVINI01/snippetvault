"use client";

import { useLanguage } from "@/src/context/LanguageContext";
import { useSnippetForm } from "@/src/hooks/snippets/use-snippet-form";
import { useSnippetFormSubmit } from "@/src/hooks/snippets/use-snippet-form-submit";
import { useSnippetMutations } from "@/src/hooks/snippets/use-snippet-mutations";
import type { Snippet } from "@/src/types/snippet";
import Modal from "./Modal";
import SnippetFormFields from "../forms/SnippetFormFields";
import SnippetModalActions from "./SnippetModalActions";

interface EditSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  snippet: Snippet | null;
}

export default function EditSnippetModal({ isOpen, onClose, onUpdated, snippet }: EditSnippetModalProps) {
  const { t } = useLanguage();

  const close = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title={t.form.editTitle} maxWidth="max-w-6xl">
      {snippet && (
        <EditSnippetModalContent
          key={snippet.id}
          onClose={close}
          onUpdated={onUpdated}
          snippet={snippet}
        />
      )}
    </Modal>
  );
}

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CodeDiffViewer from "../editor/CodeDiffViewer";
import { Eye, Copy } from "lucide-react";

function EditSnippetModalContent({
  onClose,
  onUpdated,
  snippet,
}: {
  onClose: () => void;
  onUpdated: () => void;
  snippet: Snippet;
}) {
  const { t } = useLanguage();
  const form = useSnippetForm(snippet);
  const { updateSnippet } = useSnippetMutations();
  const [activeTab, setActiveTab] = useState<"editor" | "versions" | "notes">("editor");

  // Versions state
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<any | null>(null);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const fetchVersions = async () => {
    setLoadingVersions(true);
    try {
      const res = await fetch(`/api/snippets/${snippet.id}/versions`);
      if (res.ok) {
        const data = await res.json();
        setVersions(data);
        if (data.length > 0) {
          setSelectedVersion(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    setRestoring(true);
    try {
      const res = await fetch(`/api/snippets/${snippet.id}/versions/${versionId}/restore`, {
        method: "POST",
      });
      if (res.ok) {
        onUpdated();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRestoring(false);
    }
  };

  const submit = useSnippetFormSubmit({
    form,
    requiredError: t.form.requiredError,
    unexpectedError: t.form.unexpectedError,
    submit: (payload) => updateSnippet(snippet.id, payload),
    onSuccess: () => {
      onUpdated();
      onClose();
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Custom Tabs */}
      <div className="flex gap-2 border-b border-dracula-card pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("editor")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "editor"
              ? "bg-dracula-purple/20 text-dracula-purple border border-dracula-purple/30"
              : "text-dracula-comment hover:text-dracula-fg"
          }`}
        >
          Editor
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("versions");
            fetchVersions();
          }}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "versions"
              ? "bg-dracula-purple/20 text-dracula-purple border border-dracula-purple/30"
              : "text-dracula-comment hover:text-dracula-fg"
          }`}
        >
          Versões
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "notes"
              ? "bg-dracula-purple/20 text-dracula-purple border border-dracula-purple/30"
              : "text-dracula-comment hover:text-dracula-fg"
          }`}
        >
          Notas & Estatísticas
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "editor" && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-4 min-w-0 w-full"
          >
            <SnippetFormFields
              descriptionPlaceholder={t.form.editDescriptionPlaceholder}
              form={form}
              languageListId="edit-lang-list"
            />
            {submit.error && <p className="text-sm text-dracula-red">{submit.error}</p>}
            <SnippetModalActions
              loading={submit.loading}
              loadingLabel={t.form.saving}
              submitLabel={t.form.save}
              onCancel={onClose}
              onSubmit={submit.submit}
            />
          </motion.div>
        )}

        {activeTab === "versions" && (
          <motion.div
            key="versions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="grid gap-5 lg:grid-cols-[250px_1fr] min-w-0 w-full"
          >
            {/* Versions Sidebar */}
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
              <span className="text-xs font-semibold text-dracula-comment">Histórico</span>
              {loadingVersions ? (
                <span className="text-xs text-dracula-comment">Carregando versões...</span>
              ) : versions.length === 0 ? (
                <span className="text-xs text-dracula-comment">Nenhuma versão encontrada.</span>
              ) : (
                versions.map((ver) => (
                  <button
                    key={ver.id}
                    type="button"
                    onClick={() => setSelectedVersion(ver)}
                    className={`flex flex-col text-left w-full p-2.5 rounded-lg border text-xs transition-all ${
                      selectedVersion?.id === ver.id
                        ? "border-dracula-purple bg-dracula-purple/10 text-dracula-fg"
                        : "border-dracula-card bg-dracula-card/10 text-dracula-comment hover:border-dracula-comment/30"
                    }`}
                  >
                    <div className="flex justify-between w-full font-bold">
                      <span>Versão {ver.version}</span>
                      <span className="font-normal opacity-60">
                        {new Date(ver.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {ver.changeNote && (
                      <span className="mt-1 opacity-80 truncate">{ver.changeNote}</span>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Diff Viewer Area */}
            <div className="flex flex-col gap-3 min-w-0">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-dracula-comment">
                  Diferença: Versão {selectedVersion?.version || ""} vs Atual
                </span>
                {selectedVersion && (
                  <button
                    type="button"
                    disabled={restoring}
                    onClick={() => handleRestore(selectedVersion.id)}
                    className="px-3 py-1 bg-dracula-purple hover:bg-dracula-purple/80 text-dracula-bg font-semibold text-xs rounded-md transition-colors disabled:opacity-50"
                  >
                    {restoring ? "Restaurando..." : "Restaurar esta versão"}
                  </button>
                )}
              </div>
              {selectedVersion ? (
                <CodeDiffViewer oldCode={selectedVersion.code} newCode={snippet.code} />
              ) : (
                <div className="flex items-center justify-center border border-dashed border-dracula-card/50 rounded-lg p-10 text-xs text-dracula-comment">
                  Selecione uma versão para comparar
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "notes" && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr] min-w-0 w-full"
          >
            {/* Notes Editor */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-dracula-comment">Anotações Privadas</label>
              <textarea
                value={form.form.privateNotes}
                onChange={(e) => form.setPrivateNotes(e.target.value)}
                placeholder="Adicione anotações sobre esse snippet (ex: bugs conhecidos, flags extras). Apenas você verá isso."
                className="w-full flex-1 min-h-[200px] bg-dracula-bg/50 border border-dracula-card rounded-lg p-3 text-sm text-dracula-fg placeholder-dracula-comment/40 focus:border-dracula-purple/60 focus:outline-none focus:ring-1 focus:ring-dracula-purple/60"
              />
              {submit.error && <p className="text-sm text-dracula-red">{submit.error}</p>}
              <SnippetModalActions
                loading={submit.loading}
                loadingLabel={t.form.saving}
                submitLabel={t.form.save}
                onCancel={onClose}
                onSubmit={submit.submit}
              />
            </div>

            {/* Statistics Display */}
            <div className="flex flex-col gap-4 bg-dracula-card/10 border border-dracula-card/30 rounded-xl p-4">
              <span className="text-xs font-semibold text-dracula-comment uppercase tracking-wider">
                Métricas de Uso
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-dracula-bg/30 border border-dracula-card/20 rounded-lg p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-dracula-comment">
                    <Eye className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-semibold">Visualizações</span>
                  </div>
                  <span className="text-lg font-bold text-dracula-fg">{snippet.viewCount || 0}</span>
                </div>
                <div className="bg-dracula-bg/30 border border-dracula-card/20 rounded-lg p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-dracula-comment">
                    <Copy className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-semibold">Cópias</span>
                  </div>
                  <span className="text-lg font-bold text-dracula-fg">{snippet.copyCount || 0}</span>
                </div>
              </div>

              <div className="border-t border-dracula-card/30 pt-4 flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-dracula-comment">Criado em:</span>
                  <span className="text-dracula-fg">{new Date(snippet.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dracula-comment">Última alteração:</span>
                  <span className="text-dracula-fg">{new Date(snippet.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
