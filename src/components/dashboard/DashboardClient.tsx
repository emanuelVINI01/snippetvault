"use client";

import { useState } from "react";
import MobileBottomNav from "@/src/components/shared/navigation/MobileBottomNav";
import { useDashboardSnippets } from "@/src/hooks/dashboard/use-dashboard-snippets";
import AiUsagePanel from "./ai/AiUsagePanel";
import CollectionWorkbench from "./collections/CollectionWorkbench";
import DashboardContent from "./DashboardContent";
import DashboardHeader from "./DashboardHeader";
import DashboardModals from "./modals/DashboardModals";
import DashboardSearchControls from "./DashboardSearchControls";
import DashboardSummary from "./DashboardSummary";
import DashboardTabs, { type DashboardView } from "./DashboardTabs";

export default function DashboardClient() {
  const dashboard = useDashboardSnippets();
  const [view, setView] = useState<DashboardView>("snippets");

  return (
    <div className="flex min-h-screen flex-col pb-24 text-dracula-fg md:pb-0">
      <DashboardHeader onRefresh={dashboard.refreshSnippets} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
        <DashboardSummary
          loading={dashboard.loading}
          snippetCount={dashboard.snippets.length}
          visibleCount={dashboard.visibleCount}
          onCreate={dashboard.openCreate}
        />
        <DashboardTabs value={view} onChange={setView} />
        {view === "snippets" && (
          <>
            <DashboardSearchControls
              isGlobal={dashboard.isGlobal}
              query={dashboard.query}
              searchRef={dashboard.searchRef}
              onQueryChange={dashboard.setQuery}
              onToggleGlobal={dashboard.toggleGlobalSearch}
            />
            <DashboardContent
              error={dashboard.error}
              filteredSnippets={dashboard.filtered}
              loading={dashboard.loading}
              query={dashboard.query}
              totalSnippets={dashboard.snippets.length}
              onAi={dashboard.openAi}
              onClearSearch={dashboard.clearQuery}
              onCreate={dashboard.openCreate}
              onDelete={dashboard.openDelete}
              onEdit={dashboard.openEdit}
              onRetry={dashboard.refreshSnippets}
            />
          </>
        )}
        {view === "collections" && <CollectionWorkbench snippets={dashboard.snippets} />}
        {view === "usage" && <AiUsagePanel />}
      </main>
      <DashboardModals
        activeModal={dashboard.modal}
        selectedSnippet={dashboard.selected}
        onClose={dashboard.closeModal}
        onMutated={dashboard.refreshSnippets}
      />
      <MobileBottomNav />
    </div>
  );
}
