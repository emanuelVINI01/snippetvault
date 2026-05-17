export type Language = "pt" | "en";

export const dictionaries = {
  pt: {
    common: {
      appName: "SnippetVault",
      repository: "emanuelVINI01/snippetvault",
      website: "snippetvault.emanuelvini.dev",
      github: "GitHub",
      dashboard: "Dashboard",
      login: "Entrar",
      logout: "Sair",
      refresh: "Atualizar",
      toggleLanguage: "Alternar idioma",
      copy: "Copiar",
      copied: "Copiado!",
      copyCode: "Copiar código",
      shareSnippet: "Compartilhar snippet",
      public: "Público",
      private: "Privado",
      close: "Fechar",
      cancel: "Cancelar",
      tryAgain: "Tentar novamente",
      clearSearch: "Limpar busca",
      navigation: "Navegação",
      project: "Projeto",
      contact: "Contato",
      allRightsReserved: "Todos os direitos reservados.",
    },
    home: {
      badge: "Ferramenta full-stack para devs",
      titlePrefix: "Plataforma para organizar",
      titleHighlight: "conhecimento",
      titleSuffix: "técnico",
      subtitle:
        "O SnippetVault mostra uma aplicação full-stack real: autenticação GitHub, dashboard, CRUD validado, busca pública e uma experiência dark-first pensada para desenvolvedores.",
      ctaDashboard: "Acessar dashboard",
      ctaLogin: "Entrar com GitHub",
      trustAuth: "NextAuth + GitHub",
      trustSearch: "Busca pública",
      trustData: "Prisma + Zod",
      mockSearch: "Buscar conhecimento técnico...",
      mockCaption: "Recorte ilustrativo do dashboard técnico",
      mockSnippets: [
        { lang: "TypeScript", title: "useDebounce hook", tags: ["react", "hooks"] },
        { lang: "Python", title: "Async rate limiter", tags: ["async", "api"] },
        { lang: "SQL", title: "Paginated query", tags: ["postgres"] },
        { lang: "Bash", title: "Deploy pipeline", tags: ["devops", "ci"] },
        { lang: "CSS", title: "Glassmorphism card", tags: ["ui", "design"] },
        { lang: "Go", title: "HTTP middleware", tags: ["server"] },
      ],
      featuresTitlePrefix: "Um produto pequeno com decisões de",
      featuresTitleHighlight: "sistema real",
      featuresSubtitle:
        "O SnippetVault apresenta uma aplicação completa: autenticação, persistência, validação, busca, dashboard e compartilhamento em uma experiência coesa.",
      features: [
        {
          title: "Busca pública",
          description:
            "Demonstra uma camada de descoberta para snippets públicos, com pesquisa por conteúdo, linguagem e tags.",
        },
        {
          title: "Modelagem organizada",
          description:
            "Estrutura dados de snippets, autores, visibilidade e tags em uma base persistente com Prisma.",
        },
        {
          title: "Dashboard de produto",
          description:
            "Interface operacional para criar, editar, filtrar e compartilhar conhecimento técnico em poucos passos.",
        },
        {
          title: "Autenticação GitHub",
          description:
            "Fluxo de login com NextAuth, separando áreas privadas e recursos públicos do produto.",
        },
        {
          title: "Compartilhamento público",
          description:
            "Links públicos transformam snippets em páginas apresentáveis, úteis para demonstração e consulta.",
        },
        {
          title: "Stack demonstrada",
          description:
            "Projeto pensado para evidenciar arquitetura full-stack, UX, validação de dados e acabamento visual com uma stack moderna.",
        },
      ],
      flowTitle: "Fluxo do produto",
      steps: [
        {
          title: "Autenticação",
          description:
            "O usuário entra com GitHub e acessa um ambiente privado para gerenciar seus registros.",
        },
        {
          title: "Cadastro estruturado",
          description:
            "Cada snippet passa por campos claros, linguagem, tags, visibilidade e validação de dados.",
        },
        {
          title: "Consulta e compartilhamento",
          description:
            "O dashboard permite busca rápida, cópia, edição e páginas públicas para itens compartilháveis.",
        },
      ],
      codePreview: {
        badge: "Editor bonito",
        title: "Leia como se estivesse no seu editor.",
        description:
          "Nada de interfaces feias ou formatações quebradas. Ao salvar seu código, ele recebe syntax highlighting fiel às suas cores favoritas, preservando cada vírgula e indentação.",
      },
      faqTitle: "Perguntas técnicas",
      faqs: [
        {
          q: "Por que o SnippetVault existe?",
          a: "Ele demonstra uma aplicação full-stack completa, com autenticação, persistência, dashboard, busca pública e compartilhamento.",
        },
        {
          q: "Quais decisões técnicas ele demonstra?",
          a: "O projeto mostra integração com NextAuth, modelagem com Prisma, validação com Zod, rotas de API, separação entre dados privados e públicos, e UI dark responsiva.",
        },
        {
          q: "É um produto real ou apenas uma landing page?",
          a: "É uma aplicação funcional. A landing explica o projeto, mas o dashboard permite criar, editar, buscar, copiar e compartilhar snippets.",
        },
        {
          q: "Quais tecnologias ficam evidentes no projeto?",
          a: "Next.js, Auth.js, Prisma, PostgreSQL, Zod, rotas de API, organização de código e acabamento visual em um produto pequeno o suficiente para análise rápida.",
        },
      ],
    },
    dashboard: {
      title: "Meus snippets",
      emptyInline: "Nenhum snippet criado ainda.",
      visible: "visível",
      visiblePlural: "visíveis",
      snippetSingular: "snippet",
      snippetPlural: "snippets",
      newSnippet: "Novo snippet",
      searchPlaceholder: "Buscar por título, linguagem ou tag...",
      globalSearch: "Busca global",
      loadingSnippets: "Carregando snippets...",
      emptyTitle: "Nenhum snippet ainda",
      emptyDescription: "Crie seu primeiro snippet e comece a organizar seu código.",
      createFirst: "Criar primeiro snippet",
      noResults: "Nenhum resultado para",
      updateTitle: "Atualizar snippets",
      logoutTitle: "Sair da conta",
    },
    form: {
      createTitle: "Novo snippet",
      editTitle: "Editar snippet",
      deleteTitle: "Confirmar exclusão",
      title: "Título *",
      titlePlaceholder: "ex: useDebounce hook",
      language: "Linguagem *",
      description: "Descrição",
      descriptionPlaceholder: "Uma breve descrição do que esse snippet faz",
      editDescriptionPlaceholder: "Uma breve descrição",
      code: "Código *",
      codePlaceholder: "Cole ou escreva seu código aqui...",
      tags: "Tags",
      tagsHint: "Enter ou vírgula para adicionar",
      tagsPlaceholder: "react, hooks, utils...",
      publicSnippet: "Snippet público",
      requiredError: "Título e código são obrigatórios.",
      unexpectedError: "Erro inesperado.",
      create: "Criar snippet",
      creating: "Salvando...",
      save: "Salvar alterações",
      saving: "Salvando...",
      deleteQuestion: "Tem certeza que deseja excluir",
      deleteWarning: "Esta ação é irreversível e não pode ser desfeita.",
      deleting: "Excluindo...",
      delete: "Excluir",
    },
    login: {
      title: "Entrar",
      subtitle: "Faça login para salvar e compartilhar seus snippets.",
      github: "Continuar com GitHub",
      badge: "Acesso privado",
    },
    snippetPage: {
      dashboardLink: "Ir para Dashboard",
      languageFile: "arquivo",
      sharedSnippet: "Snippet compartilhado",
    },
    footer: {
      description:
        "Ferramenta full-stack para demonstrar autenticação, dados, dashboard, busca e compartilhamento com uma interface Dracula.",
      madeByPrefix: "Desenvolvido por",
      version: "v1.0.0",
    },
    toasts: {
      codeCopied: "Código copiado!",
      codeCopiedDescription: "O conteúdo do snippet agora está na sua área de transferência.",
      copyCodeError: "Erro ao copiar o código.",
      linkCopied: "Link copiado para a área de transferência!",
      linkCopiedDescription: "Agora você pode compartilhar este snippet publicamente.",
      copyLinkError: "Erro ao copiar o link.",
      copyLinkErrorDescription: "Tente copiar manualmente da barra de endereços.",
    },
    errors: {
      loadSnippets: "Erro ao carregar snippets.",
      searchSnippets: "Erro ao buscar snippets globais.",
      unexpected: "Erro inesperado.",
      createSnippet: "Erro ao criar snippet.",
      updateSnippet: "Erro ao atualizar snippet.",
      deleteSnippet: "Erro ao excluir snippet.",
    },
  },
  en: {
    common: {
      appName: "SnippetVault",
      repository: "emanuelVINI01/snippetvault",
      website: "snippetvault.emanuelvini.dev",
      github: "GitHub",
      dashboard: "Dashboard",
      login: "Sign in",
      logout: "Sign out",
      refresh: "Refresh",
      toggleLanguage: "Toggle language",
      copy: "Copy",
      copied: "Copied!",
      copyCode: "Copy code",
      shareSnippet: "Share snippet",
      public: "Public",
      private: "Private",
      close: "Close",
      cancel: "Cancel",
      tryAgain: "Try again",
      clearSearch: "Clear search",
      navigation: "Navigation",
      project: "Project",
      contact: "Contact",
      allRightsReserved: "All rights reserved.",
    },
    home: {
      badge: "Full-stack developer tool",
      titlePrefix: "A platform to organize",
      titleHighlight: "technical",
      titleSuffix: "knowledge",
      subtitle:
        "SnippetVault presents a real full-stack application: GitHub authentication, dashboard, validated CRUD, public search, and a dark-first experience designed for developers.",
      ctaDashboard: "Open dashboard",
      ctaLogin: "Sign in with GitHub",
      trustAuth: "NextAuth + GitHub",
      trustSearch: "Public search",
      trustData: "Prisma + Zod",
      mockSearch: "Search technical knowledge...",
      mockCaption: "Illustrative slice of the technical dashboard",
      mockSnippets: [
        { lang: "TypeScript", title: "useDebounce hook", tags: ["react", "hooks"] },
        { lang: "Python", title: "Async rate limiter", tags: ["async", "api"] },
        { lang: "SQL", title: "Paginated query", tags: ["postgres"] },
        { lang: "Bash", title: "Deploy pipeline", tags: ["devops", "ci"] },
        { lang: "CSS", title: "Glassmorphism card", tags: ["ui", "design"] },
        { lang: "Go", title: "HTTP middleware", tags: ["server"] },
      ],
      featuresTitlePrefix: "A small product with",
      featuresTitleHighlight: "real system decisions",
      featuresSubtitle:
        "SnippetVault presents a complete application: authentication, persistence, validation, search, dashboard, and sharing in one cohesive experience.",
      features: [
        {
          title: "Public search",
          description:
            "Demonstrates a discovery layer for public snippets, with search by content, language, and tags.",
        },
        {
          title: "Organized modeling",
          description:
            "Structures snippets, authors, visibility, and tags in a persistent database with Prisma.",
        },
        {
          title: "Product dashboard",
          description:
            "Operational interface to create, edit, filter, and share technical knowledge in a few steps.",
        },
        {
          title: "GitHub authentication",
          description:
            "NextAuth login flow separating private areas from public product resources.",
        },
        {
          title: "Public sharing",
          description:
            "Public links turn snippets into presentable pages for demos and reference.",
        },
        {
          title: "Demonstrated stack",
          description:
            "Designed to demonstrate full-stack architecture, UX, data validation, and visual polish for technical review.",
        },
      ],
      flowTitle: "Product flow",
      steps: [
        {
          title: "Authentication",
          description:
            "The user signs in with GitHub and enters a private workspace to manage records.",
        },
        {
          title: "Structured entry",
          description:
            "Each snippet has clear fields, language, tags, visibility, and data validation.",
        },
        {
          title: "Search and sharing",
          description:
            "The dashboard enables fast search, copy, editing, and public pages for shareable items.",
        },
      ],
      codePreview: {
        badge: "Polished editor",
        title: "Read it like you are inside your editor.",
        description:
          "No rough interfaces or broken formatting. When you save code, it receives syntax highlighting with your favorite colors while preserving every comma and indentation.",
      },
      faqTitle: "Case questions",
      faqs: [
        {
          q: "Why does SnippetVault exist?",
          a: "It demonstrates a complete full-stack application with authentication, persistence, dashboard, public search, and sharing.",
        },
        {
          q: "Which technical decisions does it demonstrate?",
          a: "The project shows NextAuth integration, Prisma modeling, Zod validation, API routes, separation between private and public data, and a responsive dark UI.",
        },
        {
          q: "Is it a real product or only a landing page?",
          a: "It is a functional application. The landing explains the project, but the dashboard can create, edit, search, copy, and share snippets.",
        },
        {
          q: "Which technologies are visible in this project?",
          a: "Next.js, Auth.js, Prisma, PostgreSQL, Zod, API routes, code organization, and visual polish in a product small enough for quick review.",
        },
      ],
    },
    dashboard: {
      title: "My snippets",
      emptyInline: "No snippets created yet.",
      visible: "visible",
      visiblePlural: "visible",
      snippetSingular: "snippet",
      snippetPlural: "snippets",
      newSnippet: "New snippet",
      searchPlaceholder: "Search by title, language, or tag...",
      globalSearch: "Global search",
      loadingSnippets: "Loading snippets...",
      emptyTitle: "No snippets yet",
      emptyDescription: "Create your first snippet and start organizing your code.",
      createFirst: "Create first snippet",
      noResults: "No results for",
      updateTitle: "Refresh snippets",
      logoutTitle: "Sign out",
    },
    form: {
      createTitle: "New snippet",
      editTitle: "Edit snippet",
      deleteTitle: "Confirm deletion",
      title: "Title *",
      titlePlaceholder: "ex: useDebounce hook",
      language: "Language *",
      description: "Description",
      descriptionPlaceholder: "A short description of what this snippet does",
      editDescriptionPlaceholder: "A short description",
      code: "Code *",
      codePlaceholder: "Paste or write your code here...",
      tags: "Tags",
      tagsHint: "Enter or comma to add",
      tagsPlaceholder: "react, hooks, utils...",
      publicSnippet: "Public snippet",
      requiredError: "Title and code are required.",
      unexpectedError: "Unexpected error.",
      create: "Create snippet",
      creating: "Saving...",
      save: "Save changes",
      saving: "Saving...",
      deleteQuestion: "Are you sure you want to delete",
      deleteWarning: "This action is irreversible and cannot be undone.",
      deleting: "Deleting...",
      delete: "Delete",
    },
    login: {
      title: "Sign in",
      subtitle: "Sign in to save and share your snippets.",
      github: "Continue with GitHub",
      badge: "Private access",
    },
    snippetPage: {
      dashboardLink: "Go to Dashboard",
      languageFile: "file",
      sharedSnippet: "Shared snippet",
    },
    footer: {
      description:
        "Full-stack developer tool demonstrating authentication, data, dashboard, search, and sharing with a Dracula interface.",
      madeByPrefix: "Built by",
      version: "v1.0.0",
    },
    toasts: {
      codeCopied: "Code copied!",
      codeCopiedDescription: "The snippet content is now in your clipboard.",
      copyCodeError: "Could not copy the code.",
      linkCopied: "Link copied to clipboard!",
      linkCopiedDescription: "You can now share this snippet publicly.",
      copyLinkError: "Could not copy the link.",
      copyLinkErrorDescription: "Try copying it manually from the address bar.",
    },
    errors: {
      loadSnippets: "Could not load snippets.",
      searchSnippets: "Could not search global snippets.",
      unexpected: "Unexpected error.",
      createSnippet: "Could not create snippet.",
      updateSnippet: "Could not update snippet.",
      deleteSnippet: "Could not delete snippet.",
    },
  },
};

export type Dictionary = (typeof dictionaries)["pt"];
