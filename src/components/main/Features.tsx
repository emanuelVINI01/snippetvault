import { Search, Tag, Globe2, Lock, Zap, Code2 } from "lucide-react";

const FEATURES = [
  {
    icon: <Search className="w-6 h-6 text-dracula-cyan" />,
    title: "Busca Pública",
    description: "Demonstra uma camada de descoberta para snippets públicos, com pesquisa por conteúdo, linguagem e tags.",
    colorClass: "group-hover:border-dracula-cyan/50",
    bgClass: "bg-dracula-cyan/10",
  },
  {
    icon: <Tag className="w-6 h-6 text-dracula-purple" />,
    title: "Modelagem Organizada",
    description: "Estrutura dados de snippets, autores, visibilidade e tags em uma base persistente com Prisma.",
    colorClass: "group-hover:border-dracula-purple/50",
    bgClass: "bg-dracula-purple/10",
  },
  {
    icon: <Code2 className="w-6 h-6 text-dracula-green" />,
    title: "Dashboard de Produto",
    description: "Interface operacional para criar, editar, filtrar e compartilhar conhecimento técnico em poucos passos.",
    colorClass: "group-hover:border-dracula-green/50",
    bgClass: "bg-dracula-green/10",
  },
  {
    icon: <Lock className="w-6 h-6 text-dracula-red" />,
    title: "Autenticação GitHub",
    description: "Fluxo de login com NextAuth, separando áreas privadas e recursos públicos do produto.",
    colorClass: "group-hover:border-dracula-red/50",
    bgClass: "bg-dracula-red/10",
  },
  {
    icon: <Globe2 className="w-6 h-6 text-dracula-orange" />,
    title: "Compartilhamento Público",
    description: "Links públicos transformam snippets em páginas apresentáveis, úteis para demonstração e consulta.",
    colorClass: "group-hover:border-dracula-orange/50",
    bgClass: "bg-dracula-orange/10",
  },
  {
    icon: <Zap className="w-6 h-6 text-dracula-yellow" />,
    title: "Case de Portfólio",
    description: "Projeto pensado para evidenciar arquitetura full-stack, UX, validação de dados e acabamento visual para avaliação técnica.",
    colorClass: "group-hover:border-dracula-yellow/50",
    bgClass: "bg-dracula-yellow/10",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6 bg-dracula-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-dracula-fg">
            Um produto pequeno com decisões de <span className="text-dracula-purple">sistema real</span>
          </h2>
          <p className="text-dracula-comment max-w-2xl mx-auto">
            O SnippetVault apresenta uma aplicação completa em escala de portfólio: autenticação,
            persistência, validação, busca, dashboard e compartilhamento em uma experiência coesa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className={`group p-6 rounded-2xl bg-dracula-card/40 border border-dracula-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${feat.colorClass}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feat.bgClass}`}>
                {feat.icon}
              </div>
              <h3 className="text-xl font-semibold text-dracula-fg mb-3">{feat.title}</h3>
              <p className="text-dracula-comment leading-relaxed text-sm">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
