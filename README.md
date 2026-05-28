# SnippetVault

SnippetVault is a full-stack code snippet manager for developers who want a fast private vault for reusable code, plus public sharing when a snippet is worth sending to someone else. It combines GitHub authentication, a CRUD dashboard, public snippet search, syntax highlighting, responsive modals, and a compact Dracula-inspired interface.

![SnippetVault landing page](images/landing/landing-desktop.png)

## Features

- GitHub authentication with Auth.js / NextAuth.
- Private dashboard for creating, editing, deleting, copying, and filtering snippets.
- Public visibility controls for shareable snippets.
- Public snippet search through `GET /api/snippets/search`.
- Syntax-highlighted code previews with language labels, descriptions, and tags.
- Responsive create, edit, and delete modals.
- Mobile bottom navigation for the main application areas.
- English and Portuguese UI dictionaries.
- SEO metadata, sitemap, robots configuration, and JSON-LD for public snippets.
- Dracula theme tokens, glass surfaces, animated cards, and Framer Motion transitions.

## Screenshots

### Landing Page

![Landing hero and snippet browser preview](images/landing/Screenshot_2026-05-28_15-53-52.png)

![Landing feature section](images/landing/Screenshot_2026-05-28_15-53-59.png)

### Dashboard

![SnippetVault dashboard](images/dashboard/Screenshot_2026-05-28_15-54-58.png)

![Snippet editor modal](images/dashboard/Screenshot_2026-05-28_15-55-21.png)

![Snippet delete confirmation](images/dashboard/Screenshot_2026-05-28_15-55-49.png)

### Mobile

| Home | Features | Dashboard |
| --- | --- | --- |
| <img src="images/mobile/Screenshot_2026-05-28_16-06-35.png" alt="SnippetVault mobile home" width="180"> | <img src="images/mobile/Screenshot_2026-05-28_16-06-41.png" alt="SnippetVault mobile features" width="180"> | <img src="images/mobile/Screenshot_2026-05-28_16-06-43.png" alt="SnippetVault mobile dashboard" width="180"> |

| Create Snippet | Shared Snippet |
| --- | --- |
| <img src="images/mobile/Screenshot_2026-05-28_16-06-47.png" alt="SnippetVault mobile create snippet modal" width="180"> | <img src="images/mobile/Screenshot_2026-05-28_16-08-36.png" alt="SnippetVault mobile shared snippet" width="180"> |

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

## Project Structure

```txt
app/
  api/
    auth/[...nextauth]/route.ts
    snippets/
  dashboard/page.tsx
  login/page.tsx
  snippet/[id]/page.tsx
  page.tsx
src/
  auth.ts
  prisma.ts
  components/
    dashboard/
    home/
    shared/
    snippet/
  context/
  hooks/
  i18n/
  lib/
  services/
  utils/
prisma/
  schema.prisma
  migrations/
images/
  dashboard/
  landing/
  mobile/
public/
  snippet_dash.png
```

## Environment Variables

Copy `.env.example` to `.env` and replace the placeholder values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PRISMA_DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

AUTH_SECRET="replace-with-output-from-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
AUTH_GITHUB_ID="replace-with-github-oauth-client-id"
AUTH_GITHUB_SECRET="replace-with-github-oauth-client-secret"
```

For local GitHub OAuth, configure this callback URL in the GitHub OAuth app:

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

## API Routes

- `GET /api/snippets` lists snippets owned by the authenticated user.
- `POST /api/snippets` creates a snippet for the authenticated user.
- `GET /api/snippets/[id]` fetches one snippet.
- `PATCH /api/snippets/[id]` updates a snippet owned by the authenticated user.
- `DELETE /api/snippets/[id]` deletes a snippet owned by the authenticated user.
- `GET /api/snippets/search?q=term` searches public snippets.
- `/api/auth/[...nextauth]` handles Auth.js / NextAuth authentication.

## Notes

SnippetVault is designed as a real developer tool rather than a minimal CRUD demo. The interface is dark-first, touch-friendly, and compact. Public snippets are readable on desktop and mobile, while dashboard actions remain accessible on touch devices.

## License

This project is open source under the [MIT License](LICENSE).
