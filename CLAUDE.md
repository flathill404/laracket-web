# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Laracket is a ticket management web application built with TanStack Start (SPA mode) and React 19. The frontend communicates with a Laravel backend API at `localhost:8000`.

## Commands

```bash
bun --bun run dev      # Start development server
bun --bun run build    # Build for production
bun --bun run test     # Run tests with Vitest
bun run typecheck      # TypeScript type checking
bun run check          # Biome lint + format with auto-fix
bun run lint           # Biome lint only
bun run format         # Biome format only
```

## Architecture

### Stack
- **Framework**: TanStack Start (SPA mode with `/app` mask path)
- **Routing**: TanStack Router (file-based routing in `src/routes/`)
- **Data Fetching**: TanStack Query for server state
- **Forms**: TanStack Form with custom hooks (`src/hooks/use-app-form.tsx`)
- **Tables**: TanStack Table with TanStack Virtual for infinite scroll
- **UI**: shadcn/ui (new-york style) with Tailwind CSS v4
- **Validation**: Zod v4

### Feature-Based Structure
Each domain feature in `src/features/` follows this pattern:
```
features/<feature>/
  api/       # API functions with Zod schemas (e.g., fetchUser, ticketSchema)
  lib/       # TanStack Query options (e.g., userQueryOptions)
  hooks/     # React hooks
  components/
  types/
```

### Route Layout
- `src/routes/__root.tsx` - Root shell with QueryClientProvider and devtools
- `src/routes/_authenticated.tsx` - Protected layout with auth check, header, sidebar
- `src/routes/_guest.tsx` - Public routes (login, register)

### API Communication
- `src/lib/client.ts` - HTTP client wrapper with error handling
- Backend uses Laravel conventions; frontend sends `Key-Inflection: camel` header
- Sorting utilities in `src/lib/sorting.ts` convert between camelCase (frontend) and snake_case (backend)

### Mock Service Worker
MSW handlers in `src/mocks/handlers.ts` use `zocker` to generate fake data from Zod schemas for development/testing.

## Path Aliases

`@/*` maps to `./src/*`
