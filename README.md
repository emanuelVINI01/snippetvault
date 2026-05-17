# SnippetVault

SnippetVault is a full-stack snippet manager for developers who need a fast place to save, search, edit, copy and share reusable code. It combines GitHub authentication, a private CRUD dashboard, public snippet discovery and a polished mobile-first Dracula interface.

## Short Description

Full-stack code snippet vault with GitHub authentication, Prisma/PostgreSQL persistence, public sharing, global search, syntax highlighting, responsive modals, Framer Motion transitions and a mobile bottom bar.

## Features

- GitHub sign-in through Auth.js / NextAuth.
- Private dashboard for creating, editing, deleting and copying snippets.
- Public visibility toggle for shareable snippets.
- Global search for public snippets.
- Language labels, tags, descriptions and syntax-highlighted code previews.
- Responsive create/edit/delete modals with mobile bottom-sheet behavior.
- Mobile-first navigation with a fixed bottom bar.
- English and Portuguese UI dictionaries.
- Dracula theme tokens, glass surfaces, animated cards and Framer Motion transitions.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Auth.js / NextAuth with GitHub OAuth
- Prisma 7
- PostgreSQL
- Zod
- Lucide React
- React Syntax Highlighter
- Sonner

## Project Structure

```txt
app/
  dashboard/page.tsx
  login/page.tsx
  page.tsx
src/
  auth.ts
  prisma.ts
  components/
    dashboard/
    login/
    main/
    viewer/
  context/
  hook/
  i18n/
  lib/
  services/
prisma/
  schema.prisma
public/
  snippet_dash.png
```

## Environment

Create `.env` in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
PRISMA_DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

AUTH_SECRET="your-auth-secret"
AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"
```

For local GitHub OAuth, configure the callback URL:

```txt
http://localhost:3000/api/auth/callback/github
```

## Running Locally

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Product Notes

SnippetVault is built as a technology-focused developer product, not only a CRUD demo. The UI is intentionally dark-first, touch-friendly and compact. Modals are usable on small screens, snippet actions remain visible on touch devices, and the bottom navigation follows the same compact mobile pattern as the rest of the app suite.

## API Surface

- `GET /api/snippets` - list the authenticated user's snippets.
- `POST /api/snippets` - create a snippet.
- `GET /api/snippets/[id]` - fetch a snippet.
- `PATCH /api/snippets/[id]` - update a snippet owned by the current user.
- `DELETE /api/snippets/[id]` - delete a snippet owned by the current user.
- `GET /api/snippets/search?q=term` - search public snippets.
- `/api/auth/[...nextauth]` - Auth.js route handler.

## License

No open-source license is declared yet.
