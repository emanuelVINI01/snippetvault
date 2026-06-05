# 🗄️ Modelagem do Banco de Dados

O **SnippetVault** utiliza o **Prisma ORM** para se conectar a um banco de dados relacional **PostgreSQL**. A estrutura lógica foi modelada para suportar a autenticação segura do NextAuth, o controle de snippets, playbooks organizados e o cache de Inteligência Artificial.

---

## 1. Tabelas de Autenticação (Padrão Auth.js)

Estas tabelas armazenam as sessões, contas sociais associadas (GitHub) e tokens de segurança dos usuários autenticados.

### 👤 User
Representa o usuário cadastrado no sistema.
* `id` (String, Chave Primária): Identificador único no formato CUID.
* `name` (String, Opcional): Nome de exibição recuperado do GitHub.
* `email` (String, Opcional, Único): Endereço de e-mail do usuário.
* `emailVerified` (DateTime, Opcional): Data de verificação do e-mail.
* `image` (String, Opcional): URL da foto de perfil.

### 💳 Account
Armazena os tokens de acesso e credenciais de provedores sociais (OAuth).
* `id` (String, Chave Primária): CUID.
* `userId` (String, FK): Referência para o usuário da tabela `User`.
* `type` (String): Tipo de credencial (normalmente "oauth").
* `provider` (String): Provedor social (no caso, "github").
* `providerAccountId` (String): ID único do usuário no banco de dados do GitHub.
* `refresh_token`, `access_token`, `id_token` (String, Opcional): Tokens gerados pelo OAuth.
* `expires_at` (Int, Opcional): Timestamp de expiração do token.
* `token_type`, `scope`, `session_state` (String, Opcional): Metadados adicionais da autenticação.
* *Restrição:* `@@unique([provider, providerAccountId])` impede que a mesma conta do GitHub seja conectada a usuários diferentes.

### ⏰ Session
Sessões ativas no navegador dos usuários logados.
* `id` (String, Chave Primária): CUID.
* `sessionToken` (String, Único): Token de sessão enviado nos cookies do navegador.
* `userId` (String, FK): Referência para o usuário logado.
* `expires` (DateTime): Data limite de validade da sessão.

---

## 2. Tabelas de Conteúdo (Snippets & Playbooks)

Essas tabelas guardam os dados criados diretamente pelos usuários do sistema.

### 📝 Snippet
Guarda os trechos de código criados pelos desenvolvedores.
* `id` (String, Chave Primária): CUID.
* `title` (String): Título descritivo do snippet.
* `code` (String, DB.Text): Conteúdo bruto do código. Salvo como tipo `Text` no PostgreSQL para suportar trechos longos de código sem limites apertados de caracteres.
* `language` (String): Linguagem do código (ex: "javascript", "python").
* `public` (Boolean, Default: false): Controla a visibilidade do snippet. Se `true`, qualquer visitante da internet pode visualizar o código e a análise de IA.
* `description` (String, Opcional): Breve explicação sobre o trecho de código.
* `tags` (Array de Strings): Vetor de palavras-chave para busca de termos (ex: `["hook", "react", "auth"]`).
* `createdAt` (DateTime): Data e hora de criação.
* `updatedAt` (DateTime): Atualizado automaticamente na modificação do snippet.
* `userId` (String, FK): Dono do snippet (Relação com `User` com exclusão em cascata: se o usuário for deletado, seus snippets também são excluídos).

### 📂 SnippetCollection (Playbook)
Coleção lógica para agrupar e ordenar snippets em receitas e cookbooks reutilizáveis.
* `id` (String, Chave Primária): CUID.
* `title` (String): Nome da coleção (ex: "Receitas de PostgreSQL").
* `description` (String, Opcional): Propósito da coleção.
* `accent` (String, Default: "purple"): Cor visual de destaque usada no card (ex: "purple", "pink", "cyan").
* `public` (Boolean, Default: false): Controla se a coleção pode ser acessada externamente.
* `createdAt`, `updatedAt` (DateTime): Datas de auditoria.
* `userId` (String, FK): Usuário criador da coleção.
* *Performance:* `@@index([userId, createdAt])` acelera a consulta de playbooks no dashboard.

### 🔗 SnippetCollectionItem
Tabela de ligação (Join Table) que associa snippets a coleções de forma ordenada.
* `id` (String, Chave Primária): CUID.
* `collectionId` (String, FK): Coleção de destino.
* `snippetId` (String, FK): Snippet incluído na coleção.
* `position` (Int, Default: 0): Posição do snippet dentro da ordenação da coleção. Isso possibilita reorganizar a ordem de passos de um setup.
* `createdAt` (DateTime): Data de inserção na coleção.
* *Restrição:* `@@unique([collectionId, snippetId])` impede a duplicidade do mesmo snippet na mesma coleção.
* *Performance:* `@@index([collectionId, position])` otimiza a listagem ordenada de snippets e `@@index([snippetId])` acelera a busca reversa.

---

## 3. Tabelas de Controle de Inteligência Artificial

Tabelas voltadas ao armazenamento de caches e controle do consumo de IA.

### 🧠 AiSnippetAnalysis
Tabela de cache que armazena os resumos estruturados gerados pela Inteligência Artificial.
* `id` (String, Chave Primária): CUID.
* `codeHash` (String, Único): Hash SHA-256 gerado a partir do código do snippet normalizado (sem espaços extras e normalizando quebras de linha).
* `model` (String): Nome do modelo da Gemini usado (ex: "gemini-2.5-flash").
* `normalizedLength` (Int): Comprimento do código normalizado em caracteres.
* `result` (Json): JSON bruto com a resposta estruturada contendo as chaves `summary`, `description`, `language`, `tags`, `bugs`, `refactor` e `example`.
  * *Observação:* Durante o processamento concorrente da IA, este campo recebe provisoriamente o valor `{ status: "pending" }` para servir como lock de concorrência.
* `createdAt`, `updatedAt` (DateTime): Registros de auditoria temporal.

### 📊 AiUsageEvent
Registra cada tentativa (ou cache-hit) de utilização do assistente de IA. Serve para cálculo de estatísticas e limites diários de uso de requisições.
* `id` (String, Chave Primária): CUID.
* `userId` (String, FK): Identificador do usuário que acionou a IA.
* `snippetId` (String, Opcional, FK): ID do snippet associado.
* `codeHash` (String, FK): Hash do código avaliado, conectando-se diretamente à tabela `AiSnippetAnalysis` (com exclusão em cascata).
* `model` (String): Modelo da IA acionado.
* `cacheHit` (Boolean, Default: false): Indica se a requisição gerou um consumo real do Gemini (`false`) ou se reaproveitou um resultado do banco (`true`).
* `createdAt` (DateTime): Data e hora em que a IA foi solicitada pelo desenvolvedor.
* *Performance:* `@@index([userId, createdAt])` acelera o cálculo das cotas diárias de uso de IA do usuário conectado.
