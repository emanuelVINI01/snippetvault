"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import Modal from "./Modal";
import { X } from "lucide-react";
import CodeEditor from "./CodeEditor";
import { COMMON_LANGUAGES } from "./LanguageColors";
import type { Snippet } from "./SnippetCard";
import { useSnippets } from "@/src/hook/use-snippets-hook";

interface EditSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  snippet: Snippet | null;
}



const INPUT_CLASS =
  "w-full rounded-xl bg-dracula-card/40 border border-dracula-card text-dracula-fg text-sm px-3.5 py-2.5 placeholder:text-dracula-comment/60 outline-none focus:border-dracula-purple focus:ring-2 focus:ring-dracula-purple/20 transition-all duration-150";

export default function EditSnippetModal({ isOpen, onClose, onUpdated, snippet }: EditSnippetModalProps) {
  const [title,       setTitle]       = useState("");
  const [language,    setLanguage]    = useState("TypeScript");
  const [description, setDescription] = useState("");
  const [code,        setCode]        = useState("");
  const [isPublic,    setIsPublic]    = useState(false);
  const [tags,        setTags]        = useState<string[]>([]);
  const [tagInput,    setTagInput]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const { updateSnippet } = useSnippets();

  // Populate form when snippet changes
  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setLanguage(snippet.language);
      setDescription(snippet.description ?? "");
      setCode(snippet.code);
      setIsPublic(snippet.public);
      setTags(snippet.tags);
      setTagInput("");
      setError(null);
    }
  }, [snippet]);

  const addTag = (raw: string) => {
    const value = raw.trim().toLowerCase().replace(/,+$/, "");
    if (value && !tags.includes(value)) setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = async () => {
    if (!snippet) return;
    if (!title.trim() || !code.trim()) {
      setError("Título e código são obrigatórios.");
      return;
    }
    setLoading(true); setError(null);
    try {
      await updateSnippet(snippet.id, { title, language, description, code, public: isPublic, tags });
      onUpdated();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Snippet" maxWidth="max-w-2xl">
      <div className="flex flex-col gap-4">
        {/* Title + Language */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-dracula-comment">Título *</label>
            <input className={INPUT_CLASS} placeholder="ex: useDebounce hook" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-dracula-comment">Linguagem *</label>
            <input className={INPUT_CLASS} list="edit-lang-list" placeholder="TypeScript" value={language} onChange={(e) => setLanguage(e.target.value)} />
            <datalist id="edit-lang-list">
              {COMMON_LANGUAGES.map((l) => <option key={l} value={l} />)}
            </datalist>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-dracula-comment">Descrição</label>
          <input className={INPUT_CLASS} placeholder="Uma breve descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-dracula-comment">Código *</label>
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            placeholder="Cole ou escreva seu código aqui..."
          />
        </div>


        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-dracula-comment">Tags <span className="text-dracula-comment/50">(Enter ou vírgula para adicionar)</span></label>
          <div
            className="flex flex-wrap gap-1.5 min-h-[42px] items-center rounded-xl bg-dracula-card/40 border border-dracula-card px-3 py-2 focus-within:border-dracula-purple focus-within:ring-2 focus-within:ring-dracula-purple/20 transition-all duration-150 cursor-text"
            onClick={() => tagRef.current?.focus()}
          >
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-dracula-purple/15 text-dracula-purple border border-dracula-purple/30">
                #{tag}
                <button onClick={(e) => { e.stopPropagation(); removeTag(tag); }} className="hover:text-dracula-red transition-colors ml-0.5">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            <input
              ref={tagRef}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
              placeholder={tags.length === 0 ? "react, hooks, utils..." : ""}
              className="flex-1 min-w-[80px] bg-transparent text-sm text-dracula-fg placeholder:text-dracula-comment/50 outline-none"
            />
          </div>
        </div>

        {/* Public toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${isPublic ? "bg-dracula-purple" : "bg-dracula-card"}`}
            onClick={() => setIsPublic((v) => !v)}
          >
            <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-dracula-fg shadow transition-transform duration-200 ${isPublic ? "translate-x-[18px]" : ""}`} />
          </div>
          <span className="text-sm text-dracula-comment">Snippet público</span>
        </label>

        {error && <p className="text-sm text-dracula-red">{error}</p>}

        <div className="flex justify-end gap-3 pt-1">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-dracula-comment hover:text-dracula-fg hover:bg-dracula-card transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-dracula-purple text-dracula-bg hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all duration-150"
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
