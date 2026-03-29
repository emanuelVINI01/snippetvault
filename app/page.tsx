import Link from "next/link";
import { Search, Tag, Zap, Lock, Globe2, LayoutDashboard } from "lucide-react";

import { FaGithub } from "react-icons/fa";

import { auth } from "@/src/auth";
import Features from "../src/components/main/Features";
import HowItWorks from "../src/components/main/HowItWorks";
import CodePreview from "../src/components/main/CodePreview";
import FAQ from "../src/components/main/FAQ";
import Logo from "@/src/components/Logo";


const MOCK_SNIPPETS = [
  { lang: "TypeScript", title: "useDebounce hook", tags: ["react", "hooks"] },
  { lang: "Python",     title: "Async rate limiter", tags: ["async", "api"] },
  { lang: "SQL",        title: "Paginated query",    tags: ["postgres"] },
  { lang: "Bash",       title: "Deploy pipeline",    tags: ["devops", "ci"] },
  { lang: "CSS",        title: "Glassmorphism card", tags: ["ui", "design"] },
  { lang: "Go",         title: "HTTP middleware",    tags: ["server"] },
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "text-dracula-cyan  bg-dracula-cyan/10  border-dracula-cyan/30",
  Python:     "text-dracula-green bg-dracula-green/10 border-dracula-green/30",
  SQL:        "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",
  Bash:       "text-dracula-comment bg-dracula-comment/10 border-dracula-comment/30",
  CSS:        "text-dracula-red  bg-dracula-red/10  border-dracula-red/30",
  Go:         "text-dracula-cyan  bg-dracula-cyan/10  border-dracula-cyan/30",
};

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-dracula-bg text-dracula-fg font-sans flex flex-col">

      {/* ── Nav ─────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 border-b border-dracula-card/60 backdrop-blur-md bg-dracula-bg/80">
        <Logo />
        {session ? (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-dracula-purple/15 text-dracula-purple border border-dracula-purple/30 hover:bg-dracula-purple/25 transition-all duration-200"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-dracula-purple/15 text-dracula-purple border border-dracula-purple/30 hover:bg-dracula-purple/25 transition-all duration-200"
          >
            <FaGithub className="w-4 h-4" />
            Entrar
          </Link>
        )}
      </nav>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-36 pb-24 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-dracula-purple/25 bg-dracula-purple/8 text-dracula-purple text-xs font-semibold tracking-widest uppercase">
          <Zap className="w-3 h-3" />
          Seus snippets, organizados
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
          O cofre dos seus{" "}
          <span className="relative">
            <span className="text-dracula-purple">melhores</span>
          </span>
          {" "}snippets
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-lg sm:text-xl text-dracula-comment leading-relaxed mb-10">
          Salve, organize e encontre qualquer trecho de código em segundos.
          Suporte a múltiplas linguagens, tags e busca instantânea.
        </p>

        {/* CTA */}
        {session ? (
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-dracula-purple text-dracula-bg font-bold text-lg shadow-lg shadow-dracula-purple/25 hover:shadow-dracula-purple/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            <LayoutDashboard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Acessar meu Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="group flex items-center gap-3 px-7 py-4 rounded-xl bg-dracula-purple text-dracula-bg font-bold text-base shadow-lg shadow-dracula-purple/25 hover:shadow-dracula-purple/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            <FaGithub className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Entrar com GitHub
          </Link>
        )}

        {/* Trust tags */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-dracula-comment">
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-dracula-green" /> Autenticação segura</span>
          <span className="h-4 w-px bg-dracula-card" />
          <span className="flex items-center gap-1.5"><Globe2 className="w-3.5 h-3.5 text-dracula-cyan" /> Snippets públicos</span>
          <span className="h-4 w-px bg-dracula-card" />
          <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-dracula-purple" /> Tags & busca avançada</span>
        </div>
      </section>

      {/* ── Dashboard Mockup ────────────────────────── */}
      <section className="pb-28 px-6">
        <div className="mx-auto max-w-5xl">
          {/* Browser chrome */}
          <div className="rounded-2xl border border-dracula-card/70 overflow-hidden shadow-2xl shadow-black/40">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-dracula-card border-b border-dracula-card/60">
              <span className="w-3 h-3 rounded-full bg-dracula-red/80" />
              <span className="w-3 h-3 rounded-full bg-dracula-green/50" />
              <span className="w-3 h-3 rounded-full bg-dracula-comment/40" />
              <div className="flex-1 mx-4 h-6 rounded-md bg-dracula-bg/60 border border-dracula-card flex items-center px-3">
                <span className="text-xs text-dracula-comment">snippetvault.app/dashboard</span>
              </div>
            </div>

            {/* App content */}
            <div className="bg-dracula-bg p-5">
              {/* Search bar mock */}
              <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl bg-dracula-card/50 border border-dracula-card text-dracula-comment text-sm">
                <Search className="w-4 h-4 shrink-0" />
                <span className="flex-1">Buscar snippets...</span>
                <span className="px-2 py-0.5 rounded border border-dracula-comment/30 text-xs font-mono">⌘ K</span>
              </div>

              {/* Snippet grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_SNIPPETS.map((s) => (
                  <div
                    key={s.title}
                    className="group rounded-xl border border-dracula-card hover:border-dracula-purple/40 bg-dracula-card/30 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-dracula-purple/10 cursor-default"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="font-semibold text-sm text-dracula-fg leading-tight">{s.title}</span>
                      <span className={`shrink-0 ml-2 text-xs font-mono px-2 py-0.5 rounded border ${LANG_COLORS[s.lang] ?? "text-dracula-comment border-dracula-card"}`}>
                        {s.lang}
                      </span>
                    </div>
                    {/* Fake code lines */}
                    <div className="space-y-1.5 mb-3">
                      {[70, 90, 55].map((w, i) => (
                        <div key={i} className="h-2 rounded-full bg-dracula-comment/20" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {s.tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-dracula-purple/10 text-dracula-purple border border-dracula-purple/20">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-dracula-comment mt-4 tracking-wide">Mockup ilustrativo do dashboard</p>
        </div>
      </section>

      {/* Novas Seções */}
      <Features />
      <HowItWorks />
      <CodePreview />
      <FAQ />

    </div>
  );
}
