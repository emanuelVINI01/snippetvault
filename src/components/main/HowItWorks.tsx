import { LogIn, Save, Search } from "lucide-react";

const STEPS = [
  {
    icon: <LogIn className="w-5 h-5 text-dracula-purple" />,
    title: "Faça Login",
    description: "Entre rapidamente usando sua conta do GitHub em poucos cliques.",
  },
  {
    icon: <Save className="w-5 h-5 text-dracula-green" />,
    title: "Salve seu Código",
    description: "Cole o snippet, escolha a linguagem, adicione tags e pronto.",
  },
  {
    icon: <Search className="w-5 h-5 text-dracula-cyan" />,
    title: "Encontre Sempre",
    description: "Sempre que precisar, busque e copie seu código num piscar de olhos.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-dracula-purple/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-dracula-fg">
          Como funciona?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-dracula-card/80">
            <div className="absolute inset-0 bg-gradient-to-r from-dracula-purple via-dracula-cyan to-dracula-green opacity-30"></div>
          </div>

          {STEPS.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-dracula-card/80 border border-dracula-card flex items-center justify-center mb-6 z-10 shadow-lg shadow-black/20">
                {step.icon}
              </div>
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-6 h-6 rounded-full bg-dracula-bg border border-dracula-card text-xs flex items-center justify-center text-dracula-comment font-mono z-20">
                {idx + 1}
              </div>
              <h3 className="text-xl font-semibold text-dracula-fg mb-3">{step.title}</h3>
              <p className="text-dracula-comment text-sm leading-relaxed px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
