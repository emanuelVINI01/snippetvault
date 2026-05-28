export type Language = "pt" | "en";

export const dictionaries = {
  pt: {
    common: {
      appName: "SnippetVault",
      repository: "Perfil do criador",
      website: "snippetvault.emanuelvini.dev",
      dashboard: "Minha área",
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
      project: "Produto",
      contact: "Contato",
      allRightsReserved: "Todos os direitos reservados.",
    },
    home: {
      badge: "Organizador de snippets",
      titlePrefix: "Organize seus",
      titleHighlight: "snippets",
      titleSuffix: "de código",
      subtitle:
        "Salve trechos de código, encontre rapidamente por linguagem ou tag e compartilhe exemplos públicos em páginas limpas e fáceis de ler.",
      ctaDashboard: "Abrir minha área",
      ctaLogin: "Entrar e começar",
      trustAuth: "Área privada",
      trustSearch: "Busca rápida",
      trustData: "Tags organizadas",
      mockSearch: "Buscar snippets, linguagem ou tag...",
      mockCaption: "Prévia da área de organização",
      mockSnippets: [
        { lang: "TypeScript", title: "useDebounce hook", tags: ["react", "hooks"] },
        { lang: "Python", title: "Async rate limiter", tags: ["async", "api"] },
        { lang: "SQL", title: "Paginated query", tags: ["postgres"] },
        { lang: "Bash", title: "Deploy pipeline", tags: ["devops", "ci"] },
        { lang: "CSS", title: "Glassmorphism card", tags: ["ui", "design"] },
        { lang: "Go", title: "HTTP middleware", tags: ["server"] },
      ],
      featuresTitlePrefix: "Tudo para manter seus",
      featuresTitleHighlight: "snippets à mão",
      featuresSubtitle:
        "Guarde comandos, funções, consultas e padrões em um só lugar, com busca simples e links públicos quando precisar compartilhar.",
      features: [
        {
          title: "Busca de snippets",
          description:
            "Encontre rapidamente o que você salvou pesquisando por título, descrição, linguagem ou tag.",
        },
        {
          title: "Organização por tags",
          description:
            "Agrupe exemplos por assunto, projeto ou linguagem para recuperar cada trecho sem perder tempo.",
        },
        {
          title: "Área pessoal",
          description:
            "Crie, edite, copie e gerencie seus snippets em uma interface direta para uso diário.",
        },
        {
          title: "Acesso privado",
          description:
            "Mantenha seus snippets privados por padrão e escolha quando um item deve ficar disponível por link.",
        },
        {
          title: "Links públicos",
          description:
            "Transforme um snippet em uma página compartilhável para enviar a colegas, guardar referências ou montar exemplos.",
        },
        {
          title: "Leitura confortável",
          description:
            "Visualize o código com contraste, espaçamento e destaque pensados para leitura sem esforço.",
        },
      ],
      flowTitle: "Como funciona",
      steps: [
        {
          title: "Entre na sua área",
          description:
            "Acesse seu espaço pessoal para manter snippets privados e organizar tudo em um só lugar.",
        },
        {
          title: "Salve o snippet",
          description:
            "Adicione título, linguagem, descrição, tags e o trecho de código que você quer reutilizar.",
        },
        {
          title: "Encontre e compartilhe",
          description:
            "Use a busca para recuperar exemplos e gere um link público quando quiser mostrar um snippet.",
        },
      ],
      codePreview: {
        badge: "Editor bonito",
        title: "Leia como se estivesse no seu editor.",
        description:
          "Nada de interfaces feias ou formatações quebradas. Ao salvar seu código, ele mantém destaque visual, espaçamento e indentação para ficar fácil de consultar depois.",
      },
      faqTitle: "Perguntas frequentes",
      faqs: [
        {
          q: "Para que serve o SnippetVault?",
          a: "Ele ajuda você a salvar, organizar, encontrar e compartilhar snippets de código sem depender de arquivos soltos ou conversas antigas.",
        },
        {
          q: "Meus snippets ficam públicos?",
          a: "Não. Você decide quando um snippet deve ser público. Itens privados continuam acessíveis apenas na sua área pessoal.",
        },
        {
          q: "Posso compartilhar um snippet específico?",
          a: "Sim. Ao marcar um snippet como público, ele ganha uma página própria com leitura limpa e botão de compartilhamento.",
        },
        {
          q: "Consigo encontrar snippets antigos com facilidade?",
          a: "Sim. A busca considera título, descrição, linguagem e tags para recuperar o trecho certo rapidamente.",
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
      accountContinue: "Continuar com minha conta",
      badge: "Acesso privado",
    },
    snippetPage: {
      dashboardLink: "Ir para minha área",
      languageFile: "arquivo",
      sharedSnippet: "Snippet compartilhado",
    },
    footer: {
      description:
        "Organize, encontre e compartilhe snippets de código em uma área simples, privada e fácil de usar.",
      madeByPrefix: "Desenvolvido por",
      version: "v1.0.0",
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
      repository: "Creator profile",
      website: "snippetvault.emanuelvini.dev",
      dashboard: "My space",
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
      project: "Product",
      contact: "Contact",
      allRightsReserved: "All rights reserved.",
    },
    home: {
      badge: "Snippet organizer",
      titlePrefix: "Organize your",
      titleHighlight: "code",
      titleSuffix: "snippets",
      subtitle:
        "Save code snippets, find them quickly by language or tag, and share public examples on clean, easy-to-read pages.",
      ctaDashboard: "Open my space",
      ctaLogin: "Sign in and start",
      trustAuth: "Private space",
      trustSearch: "Fast search",
      trustData: "Organized tags",
      mockSearch: "Search snippets, language, or tag...",
      mockCaption: "Preview of the organization space",
      mockSnippets: [
        { lang: "TypeScript", title: "useDebounce hook", tags: ["react", "hooks"] },
        { lang: "Python", title: "Async rate limiter", tags: ["async", "api"] },
        { lang: "SQL", title: "Paginated query", tags: ["postgres"] },
        { lang: "Bash", title: "Deploy pipeline", tags: ["devops", "ci"] },
        { lang: "CSS", title: "Glassmorphism card", tags: ["ui", "design"] },
        { lang: "Go", title: "HTTP middleware", tags: ["server"] },
      ],
      featuresTitlePrefix: "Everything to keep",
      featuresTitleHighlight: "snippets at hand",
      featuresSubtitle:
        "Keep commands, functions, queries, and patterns in one place, with simple search and public links whenever you need to share.",
      features: [
        {
          title: "Snippet search",
          description:
            "Find saved snippets quickly by title, description, language, or tag.",
        },
        {
          title: "Tag organization",
          description:
            "Group examples by subject, project, or language so each piece is easy to recover.",
        },
        {
          title: "Personal space",
          description:
            "Create, edit, copy, and manage snippets in a direct interface for daily use.",
        },
        {
          title: "Private access",
          description:
            "Keep snippets private by default and choose when an item should be available through a link.",
        },
        {
          title: "Public links",
          description:
            "Turn a snippet into a shareable page for teammates, references, or examples.",
        },
        {
          title: "Comfortable reading",
          description:
            "View code with contrast, spacing, and highlighting tuned for low-friction reading.",
        },
      ],
      flowTitle: "How it works",
      steps: [
        {
          title: "Enter your space",
          description:
            "Access your personal space to keep snippets private and organized in one place.",
        },
        {
          title: "Save the snippet",
          description:
            "Add a title, language, description, tags, and the code you want to reuse.",
        },
        {
          title: "Search and sharing",
          description:
            "Use search to recover examples and create a public link when you want to share one.",
        },
      ],
      codePreview: {
        badge: "Polished editor",
        title: "Read it like you are inside your editor.",
        description:
          "No rough interfaces or broken formatting. When you save code, it keeps visual highlighting, spacing, and indentation so it is easy to revisit later.",
      },
      faqTitle: "Frequently asked questions",
      faqs: [
        {
          q: "What is SnippetVault for?",
          a: "It helps you save, organize, find, and share code snippets without relying on scattered files or old conversations.",
        },
        {
          q: "Are my snippets public?",
          a: "No. You choose when a snippet should be public. Private items stay available only in your personal space.",
        },
        {
          q: "Can I share a specific snippet?",
          a: "Yes. When you mark a snippet as public, it gets its own page with clean reading and sharing controls.",
        },
        {
          q: "Can I find older snippets easily?",
          a: "Yes. Search checks the title, description, language, and tags to help you recover the right snippet quickly.",
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
      accountContinue: "Continue with my account",
      badge: "Private access",
    },
    snippetPage: {
      dashboardLink: "Go to my space",
      languageFile: "file",
      sharedSnippet: "Shared snippet",
    },
    footer: {
      description:
        "Organize, find, and share code snippets in a simple, private space that is easy to use.",
      madeByPrefix: "Built by",
      version: "v1.0.0",
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
