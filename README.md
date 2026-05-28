# SnippetVault

SnippetVault is a full-stack code snippet manager for developers who want a fast private vault for reusable code, plus public sharing when a snippet is worth sending to someone else. It combines GitHub authentication, a CRUD dashboard, public snippet search, syntax highlighting, responsive modals, and a compact Dracula-inspired interface.

![SnippetVault landing page](images/landing/landing-desktop.png)

## Features

- GitHub authentication with Auth.js / NextAuth.
- Private dashboard for creating, editing, deleting, copying, and filtering snippets.
- AI Snippet Assistant powered by Gemini, with one request for explanation, description, tags, bug review, refactor, and usage example.
- AI response cache by normalized code hash, without storing code in the cache table.
- Daily per-user AI usage tracking with cache-hit visibility.
- Snippet collections/playbooks for grouping reusable flows and recipes.
- Dedicated AI usage tab with real calls, cache hits, remaining daily calls, and an animated usage meter.
- Magic-themed AI modal with animated accents, cache badges, copy-ready generated text, review cards, refactor code, and usage examples.
- Collection workbench for building setup guides, command packs, framework recipes, and reusable snippet paths.
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

| Home | Features | Home |
| --- | --- | --- |
| <img src="images/mobile/Screenshot_2026-05-28_16-06-35.png" alt="SnippetVault mobile home" width="180"> | <img src="images/mobile/Screenshot_2026-05-28_16-06-41.png" alt="SnippetVault mobile features" width="180"> | <img src="images/mobile/Screenshot_2026-05-28_16-06-43.png" alt="SnippetVault mobile dashboard" width="180"> |

| Snippet Example | Dashboard |
| --- | --- |
| <img src="images/mobile/Screenshot_2026-05-28_16-06-47.png" alt="SnippetVault mobile create snippet modal" width="180"> | <img src="images/mobile/Screenshot_2026-05-28_16-08-36.png" alt="SnippetVault mobile shared snippet" width="180"> |

## AI Snippet Assistant

The AI assistant is designed to make SnippetVault feel like a code knowledge tool instead of a plain CRUD app. Each snippet card has an AI action that opens a responsive modal with a more immersive interface: animated light passes, floating surfaces, cache status, generated cards, copy actions, and code blocks that fit the Dracula theme.

In a single Gemini request, the assistant returns:

- A plain-language explanation of the snippet.
- A suggested description that can be copied into the snippet metadata.
- Suggested language and tags for better search.
- Possible bugs, risks, and improvement points with severity.
- A refactored version of the code.
- A usage example with notes.

The goal is to turn saved snippets into reusable knowledge. A raw utility function can become a documented reference with tags, examples, review notes, and a cleaner alternative implementation.

## AI Caching and Limits

The assistant is built to avoid unnecessary Gemini API usage. Before calling Gemini, SnippetVault normalizes the snippet code by standardizing line endings and trimming leading/trailing whitespace. It then creates a SHA-256 hash from that normalized code.

The cache stores:

- The code hash.
- The Gemini model used.
- The normalized code length.
- The structured AI result.
- Timestamps.

The cache does not store the raw code. If another request uses the same normalized code hash, SnippetVault reuses the cached answer and records a cache hit instead of making another Gemini call.

Each user has a configurable daily limit of real AI calls. The default is `50` real calls per user per day through `AI_DAILY_LIMIT`. Cache hits are still recorded for visibility, but they do not consume the real-call quota. The dashboard usage tab shows real calls, cache hits, remaining calls, and progress for the current daily window.

## Snippet Collections / Playbooks

Collections turn loose snippets into reusable workflows. Instead of storing isolated cards forever, you can build playbooks around real developer tasks.

Example playbooks:

- `Next.js Auth Setup`
- `Prisma PostgreSQL Recipes`
- `Docker Deploy Commands`
- `React Hooks Toolkit`
- `API Error Handling`
- `Frontend Form Patterns`
- `Production Checklist`

Each playbook can have:

- A title.
- A short description.
- A visual accent color.
- Ordered snippet items.
- Add/remove controls for snippets.
- A responsive dashboard layout for desktop and mobile.

This makes SnippetVault useful for repeatable engineering flows: onboarding a project, setting up auth, keeping deployment commands together, collecting reusable hooks, or building a personal cookbook of backend and frontend recipes.

## Product Experience

SnippetVault uses AI and collections as first-class product surfaces:

- The landing page highlights the intelligent layer with floating badges, animated cards, and AI/collection messaging.
- The dashboard has tabs for snippets, playbooks, and AI usage.
- The AI modal uses motion and theme-aware panels so the feature feels integrated with the Dracula interface.
- The playbook workbench is intentionally direct: create a collection, pick an accent, add snippets, and build a reusable flow.
- Copy actions use inline button animations instead of toast notifications.

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
- Google Gen AI SDK

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
  services/
    ai/
    collections/
    snippets/
  context/
  hooks/
  i18n/
  lib/
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

GEMINI_API_KEY="replace-with-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"
AI_DAILY_LIMIT="50"
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
- `POST /api/ai/snippets/[id]` returns the full AI assistant analysis for one snippet.
- `GET /api/ai/usage` returns the authenticated user's daily AI usage.
- `GET /api/collections` lists the authenticated user's playbooks.
- `POST /api/collections` creates a playbook.
- `PATCH /api/collections/[id]` updates a playbook.
- `DELETE /api/collections/[id]` deletes a playbook.
- `POST /api/collections/[id]/snippets` adds a snippet to a playbook.
- `DELETE /api/collections/[id]/snippets/[snippetId]` removes a snippet from a playbook.
- `/api/auth/[...nextauth]` handles Auth.js / NextAuth authentication.

## Notes

SnippetVault is designed as a real developer tool rather than a minimal CRUD demo. The interface is dark-first, touch-friendly, and compact. Public snippets are readable on desktop and mobile, while dashboard actions remain accessible on touch devices.

## License

This project is open source under the [MIT License](LICENSE).
