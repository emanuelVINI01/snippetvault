"use client";

import type { DashboardModal } from "@/src/hooks/use-dashboard-snippets";
import type { Snippet } from "@/src/types/snippet";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import CreateSnippetModal from "./CreateSnippetModal";
import EditSnippetModal from "./EditSnippetModal";

interface DashboardModalsProps {
  activeModal: DashboardModal;
  selectedSnippet: Snippet | null;
  onClose: () => void;
  onMutated: () => void;
}

export default function DashboardModals({
  activeModal,
  onClose,
  onMutated,
  selectedSnippet,
}: DashboardModalsProps) {
  return (
    <>
      <CreateSnippetModal isOpen={activeModal === "create"} onClose={onClose} onCreated={onMutated} />
      <EditSnippetModal
        isOpen={activeModal === "edit"}
        onClose={onClose}
        onUpdated={onMutated}
        snippet={selectedSnippet}
      />
      <ConfirmDeleteModal
        isOpen={activeModal === "delete"}
        onClose={onClose}
        onDeleted={onMutated}
        snippet={selectedSnippet}
      />
    </>
  );
}
