"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "O SnippetVault é gratuito?",
    a: "Sim! Criamos o SnippetVault para a comunidade de desenvolvedores e suas as funções básicas são totalmente gratuitas."
  },
  {
    q: "Preciso ter uma conta no GitHub para usar?",
    a: "No momento sim, usamos a autenticação via GitHub para agilizar o login e garantir a segurança dos desenvolvedores na plataforma."
  },
  {
    q: "Os meus snippets ficam públicos para todos?",
    a: "Você que decide. É possível marcar os snippets como privados (só você vê) ou públicos (outras pessoas podem ver através da busca global)."
  },
  {
    q: "Quais linguagens são suportadas?",
    a: "Aceitamos qualquer tipo de texto ou código no salvamento, e fazemos o highlight inteligente para dezenas das principais linguagens: TypeScript, Python, Go, Rust, SQL, Bash e muitas outras."
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-dracula-fg">
          Dúvidas Frequentes
        </h2>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className={`rounded-xl border transition-colors duration-200 overflow-hidden ${isOpen ? 'bg-dracula-card/40 border-dracula-purple/30' : 'bg-dracula-bg border-dracula-card/60 hover:border-dracula-card'}`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className="font-medium text-dracula-fg">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-dracula-comment transition-transform duration-300 ${isOpen ? 'rotate-180 text-dracula-purple' : ''}`} />
                </button>
                <div 
                  className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-dracula-comment text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
