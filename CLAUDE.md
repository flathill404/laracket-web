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

### File Naming Conventions (Strict)
Follow these naming rules based on file responsibility:

| Category | Extension | Case Style | Example | Note |
| :--- | :--- | :--- | :--- | :--- |
| **Routes** | `.tsx` | **Flat Routes** (kebab-case) | `posts.index.tsx`, `_auth.login.tsx` | Follow TanStack Router flat-file spec. Use `.` for nesting, `$` for params. |
| **UI Lib (shadcn)** | `.tsx` | **kebab-case** | `components/ui/button.tsx` | **DO NOT RENAME**. Keep shadcn CLI defaults. |
| **Feature Components** | `.tsx` | **PascalCase** | `features/auth/components/LoginForm.tsx` | Custom components must use PascalCase. |
| **Custom Hooks** | `.ts` | **camelCase** | `useAuth.ts` | Must start with `use`. |
| **Utilities/Helpers** | `.ts` | **camelCase** | `dateFormatter.ts` | Match filename to primary export function. |
| **Types/Classes** | `.ts` | **PascalCase** | `User.ts`, `ApiError.ts` | Match filename to Type/Class name. |

### Feature-Based Structure (Best Practice)
Each domain feature in `src/features/` MUST follow this unified pattern to ensure scalability and maintainability:

```text
features/<feature>/
  api/          # API communication & Query logic
    ├── queries.ts    # Fetch functions & Query Options (get)
    └── mutations.ts  # Modification functions (create, update, delete)
  components/   # Feature-specific UI components (PascalCase)
  hooks/        # Feature-specific hooks (camelCase)
  types/        # TypeScript definitions
    ├── index.ts      # Interfaces and Types
    └── schemas.ts    # Zod schemas
  utils/        # Pure helper functions (replaces 'lib')
  index.ts      # Barrel file exporting ONLY public components/hooks
```

### Coding Standards

#### Import Paths
- **Internal Imports (Same Feature)**: Use **Relative Paths** (`./` or `../`).
  - *Goal:* Maintain feature portability and isolation.
- **External Imports (Shared/Other Features)**: Use **Absolute Paths** (`@/...`).
  - *Goal:* Improve readability and avoid deep relative paths.

#### Query Object Pattern
Define all queries in `utils/queries.ts` as a single object with methods:

```typescript
// utils/queries.ts
export const featureQueries = {
  list: () =>
    queryOptions({
      queryKey: queryKeys.feature.list(),
      queryFn: fetchFeatures,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: queryKeys.feature.detail(id),
      queryFn: () => fetchFeature(id),
      enabled: !!id,
    }),

  // Related resources follow the same pattern
  members: (id: string) =>
    queryOptions({
      queryKey: queryKeys.feature.members(id),
      queryFn: () => fetchFeatureMembers(id),
      enabled: !!id,
    }),
};
```

#### Feature Hooks Pattern
Create hooks that combine queries and mutations with a consistent return structure:

**Single Entity Hook** (`use-feature.ts`):
```typescript
export const useFeature = (id: string) => {
  const queryClient = useQueryClient();
  const query = useQuery(featureQueries.detail(id));

  const updateMutation = useMutation({
    mutationFn: (input: UpdateInput) => updateFeature(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries(featureQueries.detail(id));
      await queryClient.invalidateQueries(featureQueries.list());
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteFeature(id),
    onSuccess: () => {
      queryClient.removeQueries(featureQueries.detail(id));
      queryClient.invalidateQueries(featureQueries.list());
    },
  });

  return {
    ...query,
    actions: {
      update: updateMutation,
      delete: deleteMutation,
    },
  };
};
```

**Collection Hook** (`use-features.ts`):
```typescript
export const useFeatures = () => {
  const queryClient = useQueryClient();
  const query = useQuery(featureQueries.list());

  const createMutation = useMutation({
    mutationFn: createFeature,
    onSuccess: () => {
      queryClient.invalidateQueries(featureQueries.list());
    },
  });

  return {
    ...query,
    actions: {
      create: createMutation,
    },
  };
};
```

### Route Layout
- `src/routes/__root.tsx` - Root shell with QueryClientProvider and devtools
- `src/routes/_authenticated.tsx` - Protected layout with auth check, header, sidebar
- `src/routes/_guest.tsx` - Public routes (login, register)

### API Communication
- `src/lib/client.ts` - HTTP client wrapper with error handling
- Backend uses Laravel conventions; frontend sends `Key-Inflection: camel` header
- Sorting utilities in `src/lib/sorting.ts` convert between camelCase (frontend) and snake_case (backend)