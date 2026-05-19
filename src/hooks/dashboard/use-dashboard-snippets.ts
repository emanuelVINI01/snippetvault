"use client";

import { useEffect, useRef, useState } from "react";
import { filterSnippets } from "@/src/utils/snippets/snippet-filters";
import type { Snippet } from "@/src/types/snippet";
import { useDebouncedValue } from "../shared/use-debounced-value";
import { useFocusShortcut } from "../shared/use-focus-shortcut";
import { useSnippetList } from "../snippets/use-snippet-list";

export type DashboardModal = "none" | "create" | "edit" | "delete";

export function useDashboardSnippets() {
  const searchRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);
  const [modal, setModal] = useState<DashboardModal>("none");
  const [selected, setSelected] = useState<Snippet | null>(null);
  const debouncedQuery = useDebouncedValue(query, 400);
  const snippetsState = useSnippetList(true);
  const { fetchGlobalSnippets, fetchSnippets } = snippetsState;

  useFocusShortcut(searchRef, "k");

  useEffect(() => {
    if (isGlobal) {
      fetchGlobalSnippets(debouncedQuery);
      return;
    }

    fetchSnippets();
  }, [debouncedQuery, fetchGlobalSnippets, fetchSnippets, isGlobal]);

  const localFiltered = filterSnippets(snippetsState.snippets, query);

  const filtered = isGlobal ? snippetsState.snippets : localFiltered;

  return {
    ...snippetsState,
    filtered,
    isGlobal,
    modal,
    query,
    searchRef,
    selected,
    visibleCount: localFiltered.length,
    clearQuery: () => setQuery(""),
    closeModal: () => closeModal(setModal, setSelected),
    openCreate: () => setModal("create"),
    openDelete: (snippet: Snippet) => openSelectedModal(snippet, "delete", setSelected, setModal),
    openEdit: (snippet: Snippet) => openSelectedModal(snippet, "edit", setSelected, setModal),
    refreshSnippets: fetchSnippets,
    setQuery,
    toggleGlobalSearch: () => setIsGlobal((value) => !value),
  };
}

function closeModal(
  setModal: (modal: DashboardModal) => void,
  setSelected: (snippet: Snippet | null) => void,
) {
  setModal("none");
  setSelected(null);
}

function openSelectedModal(
  snippet: Snippet,
  modal: DashboardModal,
  setSelected: (snippet: Snippet) => void,
  setModal: (modal: DashboardModal) => void,
) {
  setSelected(snippet);
  setModal(modal);
}
