# 📚 Documentação Técnica do SnippetVault

Bem-vindo à documentação oficial do **SnippetVault**! Este espaço foi criado para detalhar o funcionamento completo do sistema, desde a sua infraestrutura técnica até o comportamento dos recursos de Inteligência Artificial, de forma extremamente simples, didática e direta.

A documentação está dividida em 4 pilares fundamentais:

---

## 🗺️ Índice da Documentação

### 1. 🔍 [Visão Geral e Estrutura](./visao_geral.md)
* Apresentação do propósito do SnippetVault.
* Pilares de design e experiência do usuário (UX/UI).
* Stack Tecnológica completa.
* Mapeamento linha a linha da estrutura de diretórios do projeto.

### 2. 🗄️ [Banco de Dados e Modelagem](./banco_de_dados.md)
* Explicação conceitual de cada tabela do banco de dados (Prisma).
* Relacionamentos entre usuários, snippets, coleções e eventos de IA.
* Detalhamento de índices de performance e restrições de unicidade.

### 3. 🧠 [Arquitetura e Fluxos (IA & Autenticação)](./arquitetura_e_fluxos.md)
* Fluxo de login social seguro usando GitHub OAuth (Auth.js).
* Como funciona a inteligência artificial da Gemini (normalização e hashing de código).
* **Mecanismo de Lock do Banco contra concorrência** (impedindo requisições simultâneas de gastar cota).
* Controle diário de cota de uso de IA (`AI_DAILY_LIMIT`) e cálculo de economia por cache-hits.
* Ajustes de timeout na Vercel e o botão de recálculo manual (*Force Refresh*).

### 4. 🚀 [Funcionalidades e Rotas de API](./funcionalidades.md)
* Detalhamento de todas as páginas da aplicação (Dashboard, Compartilhamento Público, Login).
* Funcionamento detalhado de todos os Modais responsivos.
* Lista exaustiva de todas as rotas de API (`/api/...`) com métodos, parâmetros e respostas.

### 5. 🚀 [Recursos Avançados e Evolução](./recursos_avancados.md)
* Detalhamento de todos os recursos de produtividade, IA, versionamento e playbooks de checklist.
* Travas de segurança contra ataques de SSRF (SSRF Safe Resolution) e Zip Slip (caminhos sanitizados).
* Algoritmo nativo de Code Diff visual e Busca Semântica via Gemini Re-ranking.

---

> [!TIP]
> Se você é novo no projeto ou está começando agora, recomendamos iniciar pela [Visão Geral](./visao_geral.md) para compreender a organização do código-fonte e o que compõe cada pasta do sistema.
