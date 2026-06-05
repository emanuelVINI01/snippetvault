# 🧭 Visão Geral e Estrutura do Projeto

Este documento serve como mapa de introdução ao **SnippetVault**, explicando o propósito do sistema, as escolhas tecnológicas e a arquitetura das pastas do projeto.

---

## 1. O que é o SnippetVault?

O **SnippetVault** é um gerenciador de trechos de código (*code snippets*) criado de desenvolvedor para desenvolvedor. Ele resolve o problema comum de salvar scripts úteis, configurações reutilizáveis ou algoritmos complexos de forma organizada e rápida.

O sistema se apoia em três grandes pilares de produto:
1. **Organização Eficiente (Dashboard Privado):** Área pessoal segura para criar, editar, categorizar com tags e organizar snippets por linguagem.
2. **Integração Inteligente (IA Assistant):** Utilização do Google Gemini para ler o código do snippet e, em apenas **uma única chamada rápida**, gerar explicações detalhadas, descrição otimizada, tags adequadas, varredura de bugs em potencial, sugestão de código refatorado e exemplos de uso.
3. **Coleções Orientadas a Tarefas (Playbooks):** Agrupamento de snippets sequenciais para formar receitas de infraestrutura (ex: *Playbook de Deploy Docker*, *Configuração NextAuth PostgreSQL*), evitando snippets perdidos e criando guias de ação diretos.

---

## 2. Pilares de Design (Dracula & Glassmorphism)

Para garantir uma interface premium e estimulante, o visual foi construído sobre:
* **Tema Dracula:** Uso estrito da paleta Dracula (Dracula Purple, Dracula Pink, Dracula Cyan, Dracula Green, Dracula Yellow, Dracula Background, Dracula Comment).
* **Efeito Glassmorphism:** Bordas sutis semi-transparentes (`border-dracula-card/40`), fundos com efeito de desfoque de vidro (`backdrop-blur-xl`) e superfícies reflexivas para dar uma sensação moderna de camadas.
* **Micro-animações:** Transições suaves de escala e opacidade via **Framer Motion** ao abrir modais e ao interagir com cards de snippets.
* **Ações de Cópia Diretas:** Em vez de disparar alertas ou popups inconvenientes (toasts) que poluem o fluxo de uso, os botões de cópia têm feedbacks animados no próprio botão.

---

## 3. Stack Tecnológica

O SnippetVault utiliza o que há de mais moderno no desenvolvimento web moderno:

* **Next.js 16 (App Router):** Framework principal do React, utilizando Server Components para carregamento otimizado de dados e Client Components para interações de dashboard e modais dinâmicos.
* **React 19:** Biblioteca de interface para renderização reativa dos componentes.
* **TypeScript:** Tipagem estática rigorosa para evitar falhas em tempo de execução e facilitar manutenções.
* **Tailwind CSS v4:** Motor de estilização CSS utilitária, oferecendo alta performance de carregamento e compatibilidade nativa com variáveis CSS modernas.
* **Prisma v7 (ORM):** Abstração e modelagem das consultas ao banco de dados PostgreSQL.
* **PostgreSQL:** Banco de dados relacional de alta performance e integridade para armazenar credenciais, snippets, coleções e caches de IA.
* **Google Gen AI SDK (Gemini 2.5 Flash):** Modelo de linguagem leve, veloz e ideal para processar trechos de código e responder em formato JSON estruturado.
* **Auth.js (NextAuth v5 Beta):** Solução de autenticação integrada com provedores sociais, configurada nativamente com o GitHub OAuth.
* **Zod:** Validação estrita de esquemas em tempo de execução, garantindo que os corpos das requisições da API e as respostas geradas pela IA obedeçam exatamente ao formato esperado.
* **Framer Motion:** Biblioteca de animações baseadas em estados de React.
* **React Syntax Highlighter:** Biblioteca Prism para coloração de código de acordo com a linguagem informada.

---

## 4. Estrutura de Pastas (Mapeamento Completo)

Abaixo está o mapeamento detalhado da estrutura física do projeto e o propósito de cada pasta/arquivo principal:

```txt
snippetvault/
├── app/                              # 📁 Rotas, Páginas e Handlers de API (Next.js App Router)
│   ├── api/                          #   📁 Endpoints de API (/api/...)
│   │   ├── ai/                       #     📁 Rotas de Inteligência Artificial
│   │   │   ├── snippets/[id]/        #       📄 POST: Processa e gera a análise de IA do snippet
│   │   │   └── usage/                #       📄 GET: Retorna o uso diário de IA do usuário autenticado
│   │   ├── auth/[...nextauth]/       #     📄 Roteamento dinâmico de autenticação (Auth.js)
│   │   ├── collections/              #     📁 CRUD de Coleções (Playbooks)
│   │   └── snippets/                 #     📁 CRUD de Snippets & Busca pública
│   ├── dashboard/                    #   📄 Página do Dashboard privado do usuário logado
│   ├── login/                        #   📄 Página de Autenticação (Login do GitHub)
│   ├── snippet/[id]/                 #   📄 Página pública de compartilhamento de snippet individual
│   ├── globals.css                   #   📄 Folha de estilo CSS global (Carrega variáveis do Tailwind 4)
│   ├── layout.tsx                    #   📄 Layout raiz do Next.js (Define estrutura HTML, Fontes e SEO)
│   └── page.tsx                      #   📄 Landing Page pública do SnippetVault
│
├── src/                              # 📁 Núcleo da lógica do aplicativo (Source Code)
│   ├── auth.ts                       #   📄 Configuração do Auth.js (Estratégia, Provedores e Callbacks)
│   ├── prisma.ts                     #   📄 Instanciamento global do cliente Prisma (Singleton)
│   ├── components/                   #   📁 Componentes de Interface do Usuário (UI)
│   │   ├── auth/                     #     📁 Componentes de autenticação
│   │   ├── dashboard/                #     📁 Área privada (Editor, listas, modais, abas de estatísticas)
│   │   ├── home/                     #     📁 Landing page (Heróis de introdução, seções visuais)
│   │   ├── shared/                   #     📁 Elementos compartilhados (Menu móvel inferior, botões de cópia)
│   │   └── snippet/                  #     📁 Visualizador de código, metadados e layout de página pública
│   ├── context/                      #   📁 Contextos do React (Ex: LanguageContext para i18n PT-BR/EN)
│   ├── hooks/                        #   📁 React Hooks reutilizáveis (Ex: useEscapeKey, useBodyScrollLock)
│   ├── i18n/                         #   📁 Dicionários de tradução de idiomas (Inglês e Português)
│   ├── lib/                          #   📁 Mapeamentos, validações globais e integrações utilitárias
│   ├── mappers/                      #   📁 Mapeadores de dados (Ex: Conversão de modelo de DB para exibição)
│   ├── services/                     #   📁 Serviços de comunicação com dados
│   │   ├── ai/                       #     📁 Integração Gemini SDK e cliente HTTP da API
│   │   ├── collections/              #     📁 Lógica de integração de banco de dados para Playbooks
│   │   └── snippets/                 #     📁 Operações de listagem, deleção e busca de snippets
│   └── types/                        #   📁 Definições globais de tipos do TypeScript
│
├── prisma/                           # 📁 Configuração do banco de dados relacional
│   ├── schema.prisma                 #   📄 Modelo lógico, tabelas, relações e índices
│   └── migrations/                   #   📁 Histórico de alterações e versionamento do banco
│
├── docs/                             # 📁 Pasta de documentações completas do sistema (esta pasta!)
├── public/                           # 📁 Arquivos estáticos servidos diretamente pelo Next.js (Favicon, etc.)
├── package.json                      # 📄 Dependências do Node.js e scripts de execução
└── tsconfig.json                     # 📄 Configurações de compilação do TypeScript
```
