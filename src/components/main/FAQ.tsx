"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Por que o SnippetVault existe?",
    a: "Ele funciona como um case de portfólio para demonstrar uma aplicação full-stack completa, com autenticação, persistência, dashboard, busca pública e compartilhamento."
  },
  {
    q: "Quais decisões técnicas ele demonstra?",
    a: "O projeto mostra integração com NextAuth, modelagem com Prisma, validação com Zod, rotas de API, separação entre dados privados e públicos, e UI dark responsiva."
  },
  {
    q: "É um produto real ou apenas uma landing page?",
    a: "É uma aplicação funcional. A landing explica o projeto, mas o dashboard permite criar, editar, buscar, copiar e compartilhar snippets."
  },
  {
    q: "O que um recrutador consegue avaliar no projeto?",
    a: "Domínio de produto, backend, autenticação, banco de dados, validação, organização de código e acabamento visual em um projeto pequeno o suficiente para avaliação rápida."
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
          Perguntas do case
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
