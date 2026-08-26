# 🧠 Arquitetura e Fluxos (Autenticação & IA)

Este documento destrincha o funcionamento interno do **SnippetVault**, detalhando a lógica de login e o avançado ciclo de vida das requisições de Inteligência Artificial (incluindo o mecanismo de cache, controle de limites diários e prevenção de concorrência por banco).

---

## 1. Fluxo de Autenticação e Segurança

O SnippetVault utiliza o **Auth.js** (NextAuth v5) integrado com o **GitHub OAuth** para autenticação.

```mermaid
sequenceDiagram
    actor Usuario as Usuário (Navegador)
    participant App as Servidor Next.js
    participant Auth as Auth.js / GitHub OAuth
    participant DB as Banco de Dados (PostgreSQL)

    Usuario->>App: Clica em "Login com GitHub"
    App->>Auth: Redireciona para o login do GitHub
    Auth-->>Usuario: Exibe tela de consentimento do GitHub
    Usuario->>Auth: Autoriza o aplicativo
    Auth->>App: Retorna código OAuth no callback
    App->>DB: Salva/Atualiza o User e Account
    App->>DB: Cria sessão ativa (Session)
    App-->>Usuario: Retorna Cookie de Sessão e redireciona para /dashboard
```

* **Restrição de Acesso:** Rotas privadas de API e a página `/dashboard` verificam a sessão do usuário usando a função [getAuthenticatedUserId](../src/lib/api/auth.ts). Requisições sem sessão válida recebem resposta `401 Unauthorized`.

---

## 2. Ciclo de Vida da Análise de IA (Gemini 2.5)

Quando um usuário abre o assistente de IA ou visualiza um snippet público, a aplicação otimiza as chamadas ao Gemini usando normalização e hashing de código.

### Passo 2.1: Normalização e Hashing de Código
Para evitar que diferenças de quebra de linha (Windows `\r\n` vs Linux `\n`) ou espaços no final do arquivo alterem a assinatura do código, o SnippetVault executa:
1. **Normalização:** A função [normalizeCodeForHash](../src/services/ai/snippet-ai-service.ts) substitui todos os caracteres `\r\n` por `\n` e executa um `.trim()` no código para limpar espaços vazios no início e final do script.
2. **Hash SHA-256:** A função [getSnippetCodeHash](../src/services/ai/snippet-ai-service.ts) gera um hash SHA-256 único e curto (64 caracteres) que identifica univocamente aquela estrutura de código.

---

## 3. O Mecanismo de Lock contra Concorrência (Vercel Ready)

Em plataformas como a **Vercel**, os servidores rodam de forma serveless (sem estado). Isso significa que criar um `Map` ou `Set` na memória do NodeJS não previne concorrência, pois requisições simultâneas podem cair em servidores físicos diferentes.

O SnippetVault resolve isso utilizando o **Banco de Dados como Lock Central**.

### O Fluxo de Lock e Polling Concorrente:

```mermaid
sequenceDiagram
    actor NavA as Navegador A
    actor NavB as Navegador B
    participant API as API Route (Next.js)
    participant DB as Banco de Dados
    participant AI as Google Gemini API

    Note over NavA, NavB: Ambos clicam em "Gerar" ao mesmo tempo
    NavA->>API: POST /api/ai/snippets/1 (Req A)
    NavB->>API: POST /api/ai/snippets/1 (Req B)

    API->>DB: Req A tenta criar cache com status "pending"
    Note over DB: Registro criado com sucesso!<br/>codeHash único bloqueado.
    DB-->>API: Req A prossegue

    API->>DB: Req B tenta criar cache com status "pending"
    Note over DB: ERRO P2002!<br/>Hash já existente no banco de dados.
    
    Note over API: Req B captura erro de constraint,<br/>entra em loop de Polling (60x de 500ms)

    API->>AI: Req A faz chamada ao Gemini (Demora 3-4s)
    
    loop Polling (Req B)
        API->>DB: Consulta status do codeHash no banco
        DB-->>API: Retorna { result: { status: "pending" } }
        Note over API: Dorme por 500ms...
    end

    AI-->>API: Gemini retorna a análise JSON estruturada
    API->>DB: Req A atualiza o registro salvando o JSON final de análise
    API->>DB: Req A registra evento de uso (cacheHit = false)
    API-->>NavA: Req A retorna a análise (Gasta 1 cota de uso)

    Note over API: Polling da Req B roda mais uma vez
    API->>DB: Consulta status do codeHash no banco
    DB-->>API: Retorna { result: { ...analiseCompletaJSON } }
    Note over API: Loop quebrado! Status não é mais "pending".
    API->>DB: Req B registra evento de uso (cacheHit = true)
    API-->>NavB: Req B retorna a análise em cache (Gasta 0 cota de uso!)
```

### Detalhes de Tratamento de Erros no Lock:
* **Remoção em caso de Falha:** Se a chamada para a API do Gemini falhar na requisição principal (Req A), o bloco `catch` executa um delete do registro com `codeHash` correspondente. Isso impede que o sistema fique travado permanentemente em estado `pending` caso ocorra uma falha técnica com a IA.
* **Timeout do Polling:** O loop de consulta dura até 60 tentativas (máximo de 30 segundos). Se atingir o limite e ainda estiver pendente, o sistema remove o registro e dispara um erro de timeout instrutivo para o usuário tentar novamente.

---

## 4. Timeout da Vercel (`maxDuration = 60`)

As rotas da Vercel no plano gratuito têm um tempo máximo de resposta padrão de 10 a 15 segundos. Como a API do Gemini pode demorar dependendo do tamanho do código analisado, e a fila de concorrência pode somar tempo de espera, exportamos a configuração:
```typescript
export const maxDuration = 60;
```
no arquivo [app/api/ai/snippets/[id]/route.ts](../app/api/ai/snippets/[id]/route.ts). Isso instrui a Vercel a estender a duração limite da função serveless para 60 segundos, prevenindo erros de Gateway Timeout 504.

---

## 5. Cota Diária de Uso da IA (`AI_DAILY_LIMIT`)

* **Definição:** O limite diário é controlado no arquivo `.env` pela variável `AI_DAILY_LIMIT` (padrão: 50 chamadas).
* **Cálculo da Cota:** Ao chamar o método [getUsageSummary](../src/services/ai/snippet-ai-service.ts), o sistema busca na tabela `AiUsageEvent` todos os registros com `cacheHit = false` (chamadas que acionaram o Gemini de verdade) associados ao `userId` no período do dia atual (janela que reinicia às `00:00:00 UTC` e vai até `23:59:59 UTC`).
* **Cache Hits são Grátis:** As requisições que encontram o cache no banco de dados registram `cacheHit = true` e **não descontam** da cota diária do usuário.
* **Bloqueio Limite:** Se o usuário atingir seu limite diário e tentar analisar um snippet novo, o sistema retorna um erro `429 Too Many Requests` com a mensagem explicativa. No entanto, se o snippet solicitado já possuir análise em cache, ela será exibida instantaneamente sem restrições.

---

## 6. Atualização Manual de Análise (*Force Refresh*)

* **Propósito:** Se o desenvolvedor suspeitar que a IA gerou uma resposta desatualizada ou quer apenas reavaliar o snippet de forma fresca, ele pode forçar um recálculo.
* **Funcionamento:** Ao enviar o parâmetro `forceRefresh: true` no corpo da requisição POST:
  1. A API deleta o registro correspondente ao `codeHash` na tabela `AiSnippetAnalysis`.
  2. O banco dispara a deleção em cascata dos `AiUsageEvent` vinculados a esse cache.
  3. A variável `cached` é forçada a ser `null`, direcionando a requisição para um ciclo novo de chamada ao Gemini.
