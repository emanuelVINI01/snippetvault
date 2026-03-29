"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Code2, LogOut, Package, RefreshCw, Globe } from "lucide-react";
import SearchBar from "@/src/components/main/SearchBar";
import SnippetCard, { type Snippet } from "@/src/components/dashboard/SnippetCard";
import CreateSnippetModal from "@/src/components/dashboard/CreateSnippetModal";
import EditSnippetModal from "@/src/components/dashboard/EditSnippetModal";
import ConfirmDeleteModal from "@/src/components/dashboard/ConfirmDeleteModal";
import { useSnippets } from "@/src/hook/use-snippets-hook";
import Logo from "@/src/components/Logo";

type ModalState = "none" | "create" | "edit" | "delete";

function filterSnippets(snippets: Snippet[], query: string): Snippet[] {
  const q = query.trim().toLowerCase();
  if (!q) return snippets;
  return snippets.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.language.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q)) ||
      s.description?.toLowerCase().includes(q),
  );
}

export default function DashboardPage() {
  const [query,     setQuery]     = useState("");
  const [isGlobal,  setIsGlobal]  = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [modal,     setModal]     = useState<ModalState>("none");
  const [selected,  setSelected]  = useState<Snippet | null>(null);

  const { snippets, loading, error, fetchSnippets, fetchGlobalSnippets } = useSnippets(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const searchRef = useRef<HTMLDivElement>(null);

  // ── Global ⌘K shortcut ──────────────────────────────
  useEffect(() => {
  const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = searchRef.current?.querySelector("input");
        input?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (isGlobal) {
      fetchGlobalSnippets(debouncedQuery);
    } else {
      fetchSnippets();
    }
  }, [isGlobal, debouncedQuery, fetchSnippets, fetchGlobalSnippets]);

  // ── Modal helpers ────────────────────────────────────
  const openCreate = () => setModal("create");
  const openEdit   = (s: Snippet) => { setSelected(s); setModal("edit"); };
  const openDelete = (s: Snippet) => { setSelected(s); setModal("delete"); };
  const closeModal = () => { setModal("none"); setSelected(null); };

  const filtered = isGlobal ? snippets : filterSnippets(snippets, query);

  return (
    <div className="min-h-screen bg-dracula-bg text-dracula-fg flex flex-col">

      {/* ── Topbar ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-dracula-card/60 bg-dracula-bg/90 backdrop-blur-md">
        <Logo />
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSnippets}
            className="p-2 rounded-lg text-dracula-comment hover:text-dracula-fg hover:bg-dracula-card transition-colors"
            title="Atualizar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="/api/auth/signout"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-dracula-comment hover:text-dracula-red hover:bg-dracula-red/8 transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </a>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">

        {/* Page title + stats */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dracula-fg">Meus Snippets</h1>
            {!loading && (
              <p className="text-sm text-dracula-comment mt-1">
                {snippets.length === 0
                  ? "Nenhum snippet criado ainda."
                  : `${snippets.length} snippet${snippets.length !== 1 ? "s" : ""} · ${filterSnippets(snippets, query).length} visível${filterSnippets(snippets, query).length !== 1 ? "s" : ""}`
                }
              </p>
            )}
          </div>

          <button
            onClick={openCreate}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dracula-purple text-dracula-bg font-semibold text-sm hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 shadow-lg shadow-dracula-purple/20"
          >
            <Plus className="w-4 h-4" />
            Novo Snippet
          </button>
        </div>

        {/* Search bar and Global Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 items-center" ref={searchRef}>
          <div className="flex-1 w-full relative">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <button
            onClick={() => setIsGlobal(!isGlobal)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all text-sm font-medium whitespace-nowrap ${
              isGlobal
                ? "bg-dracula-purple/10 border-dracula-purple text-dracula-purple shadow-sm shadow-dracula-purple/20"
                : "bg-dracula-card/30 border-dracula-card text-dracula-comment hover:text-dracula-fg hover:border-dracula-comment/50"
            }`}
            title="Alternar busca global"
          >
            <Globe className="w-5 h-5" />
            <span className="hidden sm:inline">Busca Global</span>
          </button>
        </div>

        {/* ── States ──────────────────────────────────── */}

        {/* Loading */}
        {loading && (
          <div className="flex-1 flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3 text-dracula-comment">
              <div className="w-8 h-8 border-2 border-dracula-purple/30 border-t-dracula-purple rounded-full animate-spin" />
              <span className="text-sm">Carregando snippets...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex-1 flex items-center justify-center py-24">
            <div className="text-center">
              <p className="text-dracula-red text-sm">{error}</p>
              <button onClick={fetchSnippets} className="mt-3 text-sm text-dracula-purple hover:underline">
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && snippets.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-dracula-card/50 border border-dracula-card flex items-center justify-center">
              <Package className="w-8 h-8 text-dracula-comment" />
            </div>
            <div>
              <p className="text-dracula-fg font-medium">Nenhum snippet ainda</p>
              <p className="text-dracula-comment text-sm mt-1">Crie seu primeiro snippet e comece a organizar seu código.</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dracula-purple/15 text-dracula-purple border border-dracula-purple/30 text-sm font-medium hover:bg-dracula-purple/25 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Criar primeiro snippet
            </button>
          </div>
        )}

        {/* Empty search */}
        {!loading && !error && snippets.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-dracula-comment">Nenhum resultado para <span className="text-dracula-fg">&quot;{query}&quot;</span></p>
            <button onClick={() => setQuery("")} className="mt-2 text-sm text-dracula-purple hover:underline">
              Limpar busca
            </button>
          </div>
        )}

        {/* Snippet grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ────────────────────────────────────── */}
      <CreateSnippetModal
        isOpen={modal === "create"}
        onClose={closeModal}
        onCreated={fetchSnippets}
      />
      <EditSnippetModal
        isOpen={modal === "edit"}
        onClose={closeModal}
        onUpdated={fetchSnippets}
        snippet={selected}
      />
      <ConfirmDeleteModal
        isOpen={modal === "delete"}
        onClose={closeModal}
        onDeleted={fetchSnippets}
        snippet={selected}
      />
    </div>
  );
}
