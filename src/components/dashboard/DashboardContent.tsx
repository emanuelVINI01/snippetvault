"use client";

import { AnimatePresence } from "framer-motion";
import type { Snippet } from "@/src/types/snippet";
import DashboardEmptySearchState from "./states/DashboardEmptySearchState";
import DashboardEmptyState from "./states/DashboardEmptyState";
import DashboardErrorState from "./states/DashboardErrorState";
import DashboardLoadingState from "./states/DashboardLoadingState";
import SnippetGrid from "./SnippetGrid";

interface DashboardContentProps {
  error: string | null;
  filteredSnippets: Snippet[];
  loading: boolean;
  query: string;
  totalSnippets: number;
  onClearSearch: () => void;
  onCreate: () => void;
  onDelete: (snippet: Snippet) => void;
  onEdit: (snippet: Snippet) => void;
  onRetry: () => void;
}

export default function DashboardContent(props: DashboardContentProps) {
  return <AnimatePresence mode="wait">{getDashboardContent(props)}</AnimatePresence>;
}

function getDashboardContent(props: DashboardContentProps) {
  if (props.loading) return <DashboardLoadingState />;
  if (props.error) return <DashboardErrorState error={props.error} onRetry={props.onRetry} />;
  if (props.totalSnippets === 0) return <DashboardEmptyState onCreate={props.onCreate} />;
  if (props.filteredSnippets.length === 0) {
    return <DashboardEmptySearchState query={props.query} onClearSearch={props.onClearSearch} />;
  }

  return (
    <SnippetGrid
      snippets={props.filteredSnippets}
      onDelete={props.onDelete}
      onEdit={props.onEdit}
    />
  );
}
