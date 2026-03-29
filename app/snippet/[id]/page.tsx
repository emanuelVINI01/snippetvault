import { SnippetService } from "@/src/services/snippet-service";
import { notFound } from "next/navigation";
import Logo from "@/src/components/Logo";
import { Calendar, Tag, User, Code2 } from "lucide-react";
import CodeViewerClient from "@/src/components/viewer/CodeViewerClient";
import ShareButton from "@/src/components/ShareButton";

export default async function PublicSnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snippet = await SnippetService.getById(id);

  if (!snippet) {
    notFound();
  }

  // Se necessário, impedir acesso público a snippets privados não autenticados
  // if (!snippet.public) return notFound();

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(snippet.createdAt));

  return (
    <div className="min-h-screen bg-dracula-bg text-dracula-fg flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-dracula-card/60 bg-dracula-bg/90 backdrop-blur-md">
        <Logo />
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="text-sm text-dracula-comment hover:text-dracula-purple transition-colors font-medium"
          >
            Ir para Dashboard
          </a>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-dracula-comment">
            {snippet.user?.name && (
              <span className="flex items-center gap-1.5 bg-dracula-card/30 px-2.5 py-1 rounded-full border border-dracula-card/60 text-dracula-fg">
                <User className="w-3.5 h-3.5" />
                {snippet.user.name}
              </span>
            )}
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-dracula-comment">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-dracula-fg leading-tight">
            {snippet.title}
          </h1>

          {snippet.description && (
            <p className="text-lg text-dracula-comment/80 leading-relaxed">
              {snippet.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-dracula-purple font-mono text-sm bg-dracula-purple/10 px-3 py-1.5 rounded-lg border border-dracula-purple/20">
                <Code2 className="w-4 h-4" />
                {snippet.language}
              </div>
              {snippet.public && (
                <ShareButton 
                  snippetId={snippet.id} 
                  iconSize={18} 
                  className="bg-dracula-card/30 border border-dracula-card/60 p-2" 
                />
              )}
            </div>
            
            {snippet.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {snippet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dracula-card/30 border border-dracula-card text-xs text-dracula-cyan capitalize"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <section className="rounded-xl border border-dracula-card/70 overflow-hidden shadow-2xl shadow-black/20 bg-[#282a36]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#21222c] border-b border-dracula-card/60">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-dracula-red" />
              <span className="w-3 h-3 rounded-full bg-dracula-yellow" />
              <span className="w-3 h-3 rounded-full bg-dracula-green" />
            </div>
            <div className="text-xs font-mono text-dracula-comment flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5" /> {snippet.language.toLowerCase()}
            </div>
          </div>
          
          <CodeViewerClient 
            code={snippet.code} 
            language={snippet.language} 
          />
        </section>
      </main>
    </div>
  );
}
