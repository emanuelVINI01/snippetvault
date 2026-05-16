# SnippetVault

SnippetVault is a full-stack code snippet manager built for developers who want a clean place to save, search, edit, copy, and share reusable code. It combines a private authenticated dashboard with public snippet discovery and shareable snippet pages.

![SnippetVault dashboard](public/snippet_dash.png)

## GitHub Description

Full-stack code snippet manager with GitHub authentication, syntax highlighting, public sharing, global search, Prisma/PostgreSQL persistence, and a dark developer-focused dashboard.

## What It Does

- Saves personal code snippets with title, language, description, tags, and visibility.
- Provides a private dashboard for creating, editing, deleting, copying, and searching snippets.
- Supports public snippets that can be discovered through global search.
- Generates shareable snippet pages for presenting code outside the dashboard.
- Highlights code in both the editor and viewer using Prism syntax highlighting.
- Includes language labels, tag filtering, copy-to-clipboard actions, and public share links.
- Supports English and Portuguese UI text.
- Uses a responsive Dracula-inspired dark interface built for developer workflows.

## Use Cases

- Personal snippet vault for frequently reused code.
- Developer portfolio project demonstrating a complete full-stack workflow.
- Public snippet library for sharing utilities, examples, and references.
- Demo application for authentication, database modeling, API routes, validation, and polished UI.

## Tech Stack

### Core

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- PostgreSQL
- Prisma 7

### Authentication and Data

- NextAuth/Auth.js with GitHub OAuth
- Prisma Adapter for Auth.js
- Prisma PostgreSQL adapter
- Zod for API validation

### UI and Experience

- Framer Motion for interface animations
- Lucide React for icons
- React Icons
- React Syntax Highlighter with Prism
- Sonner for toast notifications
- Dracula-inspired custom theme
- `next/font` with JetBrains Mono and Fira Code

## Main Features

### Authenticated Dashboard

Users sign in with GitHub and manage their own snippets from a private dashboard. The dashboard includes fast local search, global public search, snippet cards, copy actions, edit/delete flows, and responsive empty/loading/error states.

### Code Editor and Syntax Highlighting

SnippetVault includes a code-editor style input with syntax highlighting, line numbers, tab indentation, horizontal scrolling, and language-aware rendering.

### Public Sharing

Snippets can be marked as public and shared through generated links. Public snippets can also appear in global search.

### Validated API Layer

Snippet create/update requests are validated with Zod before reaching the database. Authenticated routes use the current session to scope user-owned snippet operations.

### Persistent Data Model

The database stores users, accounts, sessions, verification tokens, and snippets. Snippets include code, language, public visibility, description, tags, owner, and timestamps.

## Project Structure

```txt
app/
  api/
    auth/[...nextauth]/route.ts
    snippets/route.ts
    snippets/[id]/route.ts
    snippets/search/route.ts
  dashboard/page.tsx
  login/page.tsx
  snippet/[id]/page.tsx
  page.tsx
src/
  auth.ts
  prisma.ts
  components/
  context/
  hook/
  i18n/
  lib/
  services/
prisma/
  schema.prisma
  migrations/
  generated/
public/
  snippet_dash.png
```

## Getting Started

### Requirements

- Node.js
- npm
- PostgreSQL database
- GitHub OAuth App credentials

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
PRISMA_DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

AUTH_SECRET="your-auth-secret"
AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"
```

For local GitHub OAuth development, set the callback URL in your GitHub OAuth App to:

```txt
http://localhost:3000/api/auth/callback/github
```

`DATABASE_URL` is used by Prisma CLI commands. `PRISMA_DATABASE_URL` is used by the runtime Prisma PostgreSQL adapter in the application.

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Start the development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after a build.

```bash
npm run lint
```

Runs ESLint.

## API Routes

- `GET /api/snippets` - list authenticated user's snippets.
- `POST /api/snippets` - create a snippet for the authenticated user.
- `GET /api/snippets/[id]` - fetch a snippet by ID.
- `PATCH /api/snippets/[id]` - update an authenticated user's snippet.
- `DELETE /api/snippets/[id]` - delete an authenticated user's snippet.
- `GET /api/snippets/search?q=term` - search public snippets.
- `/api/auth/[...nextauth]` - Auth.js route handler.

## Data Model

Snippet fields:

- `title`
- `code`
- `language`
- `public`
- `description`
- `tags`
- `createdAt`
- `updatedAt`
- `userId`

Auth-related models:

- `User`
- `Account`
- `Session`
- `VerificationToken`

## Production Notes

- Set strong production values for all auth and database environment variables.
- Use HTTPS URLs for deployed OAuth callbacks.
- Run migrations against the production database before deploying new schema changes.
- Public search only returns snippets marked as public.
- For a stricter production privacy model, ensure direct snippet viewer routes enforce the same visibility rules expected by the product.

## License

This project is currently private and does not declare an open-source license.
