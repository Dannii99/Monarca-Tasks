# AGENTS.md — monarca-tasks

## Project

- **Framework**: Next.js 16.2.6 (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS v4 (via `@tailwindcss/postcss`) + Sass
- **Path alias**: `@/*` → project root

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Notes

- No test framework is configured yet — do not assume or invent one
- No CI/CD pipeline exists
- Deploy target: Vercel
- `next.config.ts` is empty defaults — safe to modify
- `.env*` files are gitignored; create `.env.local` for local secrets
- The `.next/` directory is generated; never edit files inside it
