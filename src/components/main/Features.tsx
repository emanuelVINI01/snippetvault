import { Search, Tag, Globe2, Lock, Zap, Code2 } from "lucide-react";

const FEATURES = [
  {
    icon: <Search className="w-6 h-6 text-dracula-cyan" />,
    title: "Busca Instantânea",
    description: "Encontre exatamente o fragmento de código que você precisa em milissegundos com busca rápida e eficiente.",
    colorClass: "group-hover:border-dracula-cyan/50",
    bgClass: "bg-dracula-cyan/10",
  },
  {
    icon: <Tag className="w-6 h-6 text-dracula-purple" />,
    title: "Organização por Tags",
    description: "Categorize seus snippets com tags personalizadas para manter tudo estruturado e fácil de navegar.",
    colorClass: "group-hover:border-dracula-purple/50",
    bgClass: "bg-dracula-purple/10",
  },
  {
    icon: <Code2 className="w-6 h-6 text-dracula-green" />,
    title: "Multi-Linguagem",
    description: "Suporte completo à colorização de sintaxe para as principais linguagens de programação do mercado.",
    colorClass: "group-hover:border-dracula-green/50",
    bgClass: "bg-dracula-green/10",
  },
  {
    icon: <Lock className="w-6 h-6 text-dracula-red" />,
    title: "Cofre Seguro",
    description: "Seus snippets privados ficam protegidos e visíveis apenas para você após autenticação.",
    colorClass: "group-hover:border-dracula-red/50",
    bgClass: "bg-dracula-red/10",
  },
  {
    icon: <Globe2 className="w-6 h-6 text-dracula-orange" />,
    title: "Acesso Global",
    description: "Acesse sua biblioteca de código de qualquer dispositivo, a qualquer momento.",
    colorClass: "group-hover:border-dracula-orange/50",
    bgClass: "bg-dracula-orange/10",
  },
  {
    icon: <Zap className="w-6 h-6 text-dracula-yellow" />,
    title: "Foco no Fluxo",
    description: "Interface desenhada focar no que importa e não te distrair enquanto programa.",
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
            Tudo o que você precisa em um só <span className="text-dracula-purple">lugar</span>
          </h2>
          <p className="text-dracula-comment max-w-2xl mx-auto">
            O SnippetVault foi desenhado do zero focando na experiência de desenvolvedores, eliminando fricções na hora de guardar e reutilizar código.
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
