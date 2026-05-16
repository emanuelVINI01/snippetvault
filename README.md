# snippetvault

Produto full-stack para organização, busca e compartilhamento de snippets técnicos.

## Leitura arquitetural

- Demonstra autenticação GitHub, modelagem Prisma, validação Zod e dashboard operacional.
- A proposta é tratar snippets como conhecimento pesquisável, não apenas texto salvo.
- A estrutura do repositório foi lida como evidência principal; este README evita prometer features que não aparecem no código ou no contexto técnico consolidado do portfólio.

## Stack identificada

Docker, Framer Motion, Next.js, NextAuth/Auth.js, Node.js, Prisma, React, Tailwind CSS, Transactions, TypeScript, Zod

## Decisões de engenharia

- Separação explícita entre interface, regras de domínio e persistência sempre que a estrutura do projeto permite.
- Validação de entrada e contratos de API são tratados como fronteira de segurança, não como detalhe de UI.
- Persistência e autenticação são documentadas como partes críticas do sistema quando aparecem no stack.
- O projeto prioriza fundamentos verificáveis: modelagem de dados, fluxo operacional claro e manutenção pragmática.

## Evidências observadas

- package.json declara o pacote `snippetvault`.
- scripts disponíveis: `build`, `dev`, `lint`, `start`.
- schema Prisma encontrado em `prisma/schema.prisma`.
- diretório `app/` sugere Next.js App Router ou estrutura web moderna.
- diretório `src/` concentra a implementação principal.

## Operação

Antes de rodar em produção, revise variáveis de ambiente, migrações, credenciais, build e políticas de deploy. O repositório deve ser tratado como produto técnico auditável: dependências explícitas, scripts reproduzíveis e logs suficientes para investigar erro real.
