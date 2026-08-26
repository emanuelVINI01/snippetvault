# 🚀 Funcionalidades e Rotas de API

Este documento descreve as telas, os componentes interativos de modais e fornece um guia completo de todas as rotas de API do **SnippetVault**.

---

## 1. Páginas da Aplicação

### 🌐 Landing Page (Pública)
A porta de entrada do sistema.
* **Recursos:**
  * Apresentação visual da proposta de valor (vídeo/mockups).
  * Barra de busca de snippets públicos em tempo real (consome `/api/snippets/search`).
  * Visualização rápida de código com realce de sintaxe (*Syntax Highlighting*).
  * Tradução instantânea de idioma (Português/Inglês).
  * Link para login no GitHub.

### 🔑 Página de Login (Pública)
Tela de login simplificada.
* **Recursos:**
  * Botão de login OAuth com o GitHub.
  * Proteção automática contra redirecionamento infinito: se o usuário já estiver autenticado, ele é mandado de volta ao Dashboard.

### 📊 Dashboard (Privada - Requer Login)
Área de trabalho principal do desenvolvedor. Está dividida em 3 abas principais:
1. **Aba Snippets:** Exibe todos os trechos de código do usuário em formato de lista/grid responsivo. Inclui filtros por linguagem, busca textual e botões para criar, editar, deletar, abrir assistente de IA ou copiar o código.
2. **Aba Playbooks (Coleções):** Permite gerenciar coleções de snippets de forma sequenciada. Oferece controle de ordenação e cores personalizadas (accent) para os cards.
3. **Aba Uso de IA:** Painel estatístico exibindo um medidor animado do limite de requisições do dia, detalhando chamadas totais executadas, quantidade de cache-hits e chamadas restantes.

### 🔗 Página de Compartilhamento (Pública)
Página para compartilhamento de snippets individuais (`/snippet/[id]`).
* **Recursos:**
  * Exibe o título, metadados, autor do snippet e o código formatado.
  * **Se possuir revisão de IA em cache:** Renderiza o bloco completo da revisão de IA (Explicação, Descrição Sugerida, Tags, Bugs indicados, Refatoração com sintaxe correta e exemplo de uso).
  * **Se NÃO possuir revisão em cache:** Apresenta um card (CTA) de Glassmorphic convidando o visitante a se cadastrar/fazer login no SnippetVault para gerar a análise.

---

## 2. Modais de Ação

Os modais herdam o comportamento responsivo do componente base [Modal.tsx](../src/components/dashboard/modals/Modal.tsx) (`z-[60]` para sobrepor o menu mobile e paddings reduzidos em telas pequenas).

* **CreateSnippetModal:** Formulário completo para criar snippets (Título, Linguagem, Código, Descrição, Tags e checkbox de visibilidade pública).
* **EditSnippetModal:** Carrega os metadados existentes permitindo a alteração de qualquer campo do snippet.
* **ConfirmDeleteModal:** Confirmação segura de exclusão para evitar cliques acidentais.
* **AiSnippetModal (Assistente de IA):**
  * Ao abrir, faz um teste rápido em cache (`checkOnly: true`). Se houver análise, exibe na tela instantaneamente.
  * Se não houver, exibe o botão "Gerar análise completa".
  * Após gerar a análise, o botão some para evitar redundâncias, reaparecendo apenas se o snippet for editado.

---

## 3. Catálogo de Rotas da API

Todas as rotas de API respondem sob o prefixo `/api`.

### 🔐 Autenticação
* `[...nextauth]/route.ts`: Manipulador interno de rotas do Auth.js (OAuth callbacks, login, logout).

### 📝 Snippets (CRUD)
* **`GET /api/snippets`**
  * *Descrição:* Lista todos os snippets privados e públicos que pertencem ao usuário autenticado.
  * *Resposta:* `200 OK` com array de snippets.
* **`POST /api/snippets`**
  * *Descrição:* Cria um novo snippet.
  * *Corpo do Request:* `{ title: string, code: string, language: string, public?: boolean, description?: string, tags?: string[] }`
  * *Resposta:* `201 Created` com o snippet criado.
* **`GET /api/snippets/[id]`**
  * *Descrição:* Recupera metadados e código de um snippet específico.
  * *Resposta:* `200 OK` com o snippet ou `404 Not Found`.
* **`PATCH /api/snippets/[id]`**
  * *Descrição:* Atualiza dados de um snippet de propriedade do usuário autenticado.
  * *Resposta:* `200 OK` ou `401 Unauthorized` / `404 Not Found`.
* **`DELETE /api/snippets/[id]`**
  * *Descrição:* Deleta permanentemente um snippet pertencente ao usuário.
  * *Resposta:* `204 No Content` ou `401 Unauthorized`.
* **`GET /api/snippets/search?q={termo}`**
  * *Descrição:* Busca pública de snippets (usada na Landing Page). Retorna apenas snippets que tenham o campo `public: true`.
  * *Resposta:* `200 OK` com a lista filtrada.

### 🧠 Inteligência Artificial
* **`POST /api/ai/snippets/[id]`**
  * *Descrição:* Processa a análise de inteligência artificial do snippet.
  * *Corpo do Request:*
    * `locale`: `"pt"` ou `"en"` (idioma do retorno da IA).
    * `checkOnly`: `true` ou `false` (se `true`, apenas verifica se já existe cache, sem chamar a IA do Gemini se não houver).
    * `forceRefresh`: `true` ou `false` (se `true`, invalida e deleta o cache anterior no banco e força uma chamada nova ao Gemini).
  * *Respostas:*
    * `200 OK` com a análise JSON estruturada.
    * `429 Too Many Requests` (limite diário de uso de IA atingido).
    * `503 Service Unavailable` (Chave `GEMINI_API_KEY` ausente ou inválida).
* **`GET /api/ai/usage`**
  * *Descrição:* Retorna a quantidade de créditos e chamadas de IA efetuadas pelo usuário no dia.
  * *Resposta:* `200 OK` com `{ limit, used, remaining, cacheHits, totalRequests }`.

### 📂 Playbooks (Coleções)
* **`GET /api/collections`**
  * *Descrição:* Retorna as coleções do usuário.
  * *Resposta:* `200 OK`.
* **`POST /api/collections`**
  * *Descrição:* Cria uma nova coleção de snippets.
  * *Corpo do Request:* `{ title: string, description?: string, accent?: string, public?: boolean }`
  * *Resposta:* `201 Created`.
* **`PATCH /api/collections/[id]`**
  * *Descrição:* Atualiza metadados da coleção.
  * *Resposta:* `200 OK`.
* **`DELETE /api/collections/[id]`**
  * *Descrição:* Deleta uma coleção do usuário (os snippets contidos nela não são apagados, apenas a relação).
  * *Resposta:* `204 No Content`.
* **`POST /api/collections/[id]/snippets`**
  * *Descrição:* Adiciona um snippet existente a uma coleção.
  * *Corpo do Request:* `{ snippetId: string }`
  * *Resposta:* `201 Created`.
* **`DELETE /api/collections/[id]/snippets/[snippetId]`**
  * *Descrição:* Remove o snippet da coleção especificada.
  * *Resposta:* `204 No Content`.
