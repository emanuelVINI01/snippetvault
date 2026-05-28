"use client";

import { motion } from "framer-motion";
import { BookOpen, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import { useCollections } from "@/src/hooks/collections/use-collections";
import { collectionApiClient } from "@/src/services/collections/collection-api-client";
import type { SnippetCollection } from "@/src/types/collection";
import type { Snippet } from "@/src/types/snippet";

interface CollectionWorkbenchProps {
  snippets: Snippet[];
}

const accents = ["purple", "cyan", "pink", "green"];

export default function CollectionWorkbench({ snippets }: CollectionWorkbenchProps) {
  const { t } = useLanguage();
  const { collections, loading, refreshCollections, setCollections } = useCollections();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accent, setAccent] = useState("purple");
  const [busy, setBusy] = useState(false);

  const createCollection = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      const collection = await collectionApiClient.create({ accent, description, title });
      setCollections([collection, ...collections]);
      setTitle("");
      setDescription("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-5 xl:grid-cols-[minmax(280px,0.42fr)_minmax(0,1fr)]"
    >
      <div className="rounded-2xl border border-dracula-card/70 bg-dracula-card/20 p-4 sm:p-5">
        <span className="inline-flex items-center gap-2 rounded-full border border-dracula-purple/25 bg-dracula-purple/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-dracula-purple">
          <BookOpen className="h-3.5 w-3.5" />
          {t.collections.badge}
        </span>
        <h2 className="mt-4 text-xl font-bold text-dracula-fg">{t.collections.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-dracula-comment">{t.collections.description}</p>

        <div className="mt-5 space-y-3">
          <input
            className="w-full rounded-xl border border-dracula-card bg-dracula-bg/65 px-3.5 py-3 text-sm text-dracula-fg outline-none transition-colors placeholder:text-dracula-comment/60 focus:border-dracula-purple"
            placeholder={t.collections.titlePlaceholder}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            className="min-h-24 w-full resize-none rounded-xl border border-dracula-card bg-dracula-bg/65 px-3.5 py-3 text-sm text-dracula-fg outline-none transition-colors placeholder:text-dracula-comment/60 focus:border-dracula-purple"
            placeholder={t.collections.descriptionPlaceholder}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="flex gap-2">
            {accents.map((item) => (
              <button
                key={item}
                onClick={() => setAccent(item)}
                className={`h-8 flex-1 rounded-xl border transition-all ${accent === item ? "border-dracula-fg" : "border-dracula-card"}`}
                style={{ background: getAccentColor(item) }}
                aria-label={item}
              />
            ))}
          </div>
          <button
            onClick={createCollection}
            disabled={busy || !title.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-dracula-purple px-4 py-3 text-sm font-bold text-dracula-bg transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {t.collections.create}
          </button>
        </div>
      </div>

      <div className="min-w-0">
        {loading ? (
          <div className="rounded-2xl border border-dracula-card/70 bg-dracula-card/20 p-6 text-dracula-comment">
            {t.collections.loading}
          </div>
        ) : collections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-dracula-card bg-dracula-card/15 p-6 text-sm text-dracula-comment">
            {t.collections.empty}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                snippets={snippets}
                onRefresh={refreshCollections}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

function CollectionCard({
  collection,
  snippets,
  onRefresh,
}: {
  collection: SnippetCollection;
  snippets: Snippet[];
  onRefresh: () => void;
}) {
  const { t } = useLanguage();
  const [selectedSnippet, setSelectedSnippet] = useState("");
  const existingIds = useMemo(
    () => new Set(collection.items.map((item) => item.snippet.id)),
    [collection.items],
  );
  const availableSnippets = snippets.filter((snippet) => !existingIds.has(snippet.id));

  const addSnippet = async () => {
    if (!selectedSnippet) return;
    await collectionApiClient.addSnippet(collection.id, selectedSnippet);
    setSelectedSnippet("");
    onRefresh();
  };

  const removeSnippet = async (snippetId: string) => {
    await collectionApiClient.removeSnippet(collection.id, snippetId);
    onRefresh();
  };

  const deleteCollection = async () => {
    await collectionApiClient.delete(collection.id);
    onRefresh();
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-dracula-card/70 bg-dracula-card/20">
      <div className="h-1" style={{ background: getAccentColor(collection.accent) }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-dracula-fg">{collection.title}</h3>
            {collection.description && (
              <p className="mt-1 line-clamp-2 text-sm text-dracula-comment">{collection.description}</p>
            )}
          </div>
          <button
            onClick={deleteCollection}
            className="rounded-lg p-2 text-dracula-comment transition-colors hover:bg-dracula-red/10 hover:text-dracula-red"
            title={t.collections.delete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex gap-2">
          <select
            className="min-w-0 flex-1 rounded-xl border border-dracula-card bg-dracula-bg/65 px-3 py-2 text-sm text-dracula-fg outline-none"
            value={selectedSnippet}
            onChange={(event) => setSelectedSnippet(event.target.value)}
          >
            <option value="">{t.collections.addSnippet}</option>
            {availableSnippets.map((snippet) => (
              <option key={snippet.id} value={snippet.id}>
                {snippet.title}
              </option>
            ))}
          </select>
          <button
            onClick={addSnippet}
            disabled={!selectedSnippet}
            className="rounded-xl bg-dracula-cyan px-3 py-2 text-sm font-bold text-dracula-bg disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {collection.items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-dracula-card p-3 text-sm text-dracula-comment">
              {t.collections.emptyCollection}
            </p>
          ) : (
            collection.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-dracula-bg/50 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-dracula-fg">{item.snippet.title}</p>
                  <p className="text-xs text-dracula-comment">{item.snippet.language}</p>
                </div>
                <button
                  onClick={() => removeSnippet(item.snippet.id)}
                  className="rounded-lg p-1.5 text-dracula-comment hover:bg-dracula-card hover:text-dracula-fg"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </article>
  );
}

function getAccentColor(accent: string) {
  const colors: Record<string, string> = {
    cyan: "#8be9fd",
    green: "#50fa7b",
    pink: "#ff79c6",
    purple: "#bd93f9",
  };

  return colors[accent] ?? colors.purple;
}
