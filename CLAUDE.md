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
- **Data Fetching**: TanStack Query (Separation of Read/Suspense and Write/Actions)
- **Forms**: TanStack Form with custom hooks (`src/hooks/useAppForm.tsx`)
- **Tables**: TanStack Table with TanStack Virtual for infinite scroll
- **UI**: shadcn/ui (new-york style) with Tailwind CSS v4
- **Validation**: Zod v4

### Testing Guidelines (Strict)

#### Coverage Rules

- **Excluded (No Unit Tests Required):**
  - `src/components/ui/*`: shadcn/ui components are treated as trusted third-party code.
  - `src/routes/*`: Route definitions and integration layers are excluded from **Unit Tests** (rely on E2E/Integration if needed).

- **Mandatory:**
  - **ALL other `.ts` and `.tsx` files** (Features, Custom Components, Hooks, Utils) MUST have unit tests.

#### Test Design Philosophy

- **Testability is Quality**: If a function or component is difficult to test, consider it a **design flaw**. Refactor the code to be testable (e.g., dependency injection, smaller functions) rather than writing complex, fragile tests.
- **Keep it DRY & Simple**: Avoid repetitive boilerplate in test files.
  - Extract common mocks, renderers, and utilities to `src/test/utils.tsx`.
  - Tests should be readable documentation of the code's behavior.

### File Naming Conventions (Strict)

Follow these naming rules based on file responsibility:

| Category               | Extension | Case Style                   | Example                                  | Note                                                                        |
| :--------------------- | :-------- | :--------------------------- | :--------------------------------------- | :-------------------------------------------------------------------------- |
| **Routes**             | `.tsx`    | **Flat Routes** (kebab-case) | `posts.index.tsx`, `_auth.login.tsx`     | Follow TanStack Router flat-file spec. Use `.` for nesting, `$` for params. |
| **UI Lib (shadcn)**    | `.tsx`    | **kebab-case**               | `components/ui/button.tsx`               | **DO NOT RENAME**. Keep shadcn CLI defaults.                                |
| **Feature Components** | `.tsx`    | **PascalCase**               | `features/auth/components/LoginForm.tsx` | Custom components must use PascalCase.                                      |
| **Custom Hooks**       | `.ts`     | **camelCase**                | `useAuth.ts`                             | Must start with `use`.                                                      |
| **Utilities/Helpers**  | `.ts`     | **camelCase**                | `dateFormatter.ts`                       | Match filename to primary export function.                                  |
| **Types/Classes**      | `.ts`     | **PascalCase**               | `User.ts`, `ApiError.ts`                 | Match filename to Type/Class name.                                          |

### Feature-Based Structure (Best Practice)

Each domain feature in `src/features/` MUST follow this unified pattern to ensure scalability and maintainability:

```text
features/<feature>/
  api/          # API communication & Query logic
    ├── <resource>.ts     # REST API communication (e.g., posts for posts)
    └── <sub-resource>.ts # REST API communication (e.g., comments for posts)
  components/   # Feature-specific UI components (PascalCase)
  hooks/        # Feature-specific hooks (camelCase)
    └── use<Feature>Actions.ts # Mutation logic only (Create/Update/Delete)
  types/        # TypeScript definitions
    ├── index.ts      # Interfaces and Types
    └── schemas.ts    # Zod schemas
  utils/        # Pure helper functions (replaces 'lib')
    └── queries.ts    # TanStackQuery Options
  index.ts      # Barrel file exporting ONLY public components/hooks
```

### Coding Standards

#### Import Paths

- **Internal Imports (Same Feature)**: Use **Relative Paths** (`./` or `../`).
  - _Goal:_ Maintain feature portability and isolation.
- **External Imports (Shared/Other Features)**: Use **Absolute Paths** (`@/...`).
  - _Goal:_ Improve readability and avoid deep relative paths.

#### Query Object Pattern

Define all queries in `features/<feature>/utils/queries.ts` as a single object with methods. This object is used by both Route Loaders and Components.

```typescript
// features/<feature>/utils/queries.ts
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
    }),
};
```

#### Data Fetching & State Management (Separation of Concerns)

**1. Read (Query & Suspense)**

- **Strict Suspense Architecture**:
  - Avoid `isLoading` checks in components. Assume data is present ("Meat is ready").
  - ALWAYS use `useSuspenseQuery` for reading data.
  - Delegate loading states to `<Suspense>` boundaries (either at the Route level or Granular level) and error handling to `ErrorComponent` or `ErrorBoundary`.

- **Route Loaders Strategy**:
  - **Critical Data (Page Content)**: Use `await queryClient.ensureQueryData(...)` in the loader. This blocks the route transition until the main data is ready to prevent layout shifts.
  - **Secondary Data (Dropdowns/Modals/Sidebar)**: Use `queryClient.prefetchQuery(...)` **WITHOUT await**. This initiates fetching immediately but allows the route to transition. The specific component will suspend locally.

* **Granular Suspense Pattern**:
  - For secondary data (e.g., selection lists, related items), isolate the data fetching into a sub-component.
  - Wrap the sub-component with `<Suspense fallback={<Skeleton />}>` in the parent feature component.

````tsx
// routes/features.$id.tsx (Loader)
loader: async ({ context: { queryClient }, params }) => {
  // 1. Critical: Block navigation until the main feature details are ready
  await queryClient.ensureQueryData(featureQueries.detail(params.id));

  // 2. Secondary: Start fetching related resources (e.g., options, history), but don't wait
  queryClient.prefetchQuery(relatedQueries.list());
}

// features/<feature>/components/FeatureForm.tsx (Parent)
const FeatureForm = () => {
  return (
    <div>
      <MainInfoDisplay />
      {/* 3. Granular Suspense: Only this part shows a spinner/skeleton */}
      <Suspense fallback={<RelatedResourceSkeleton />}>
        <RelatedResourceSelect />
      </Suspense>
    </div>
  );
};

// features/<feature>/components/RelatedResourceSelect.tsx (Child)
const RelatedResourceSelect = () => {
  // 4. Data is guaranteed (either from prefetch or suspense)
  const { data } = useSuspenseQuery(relatedQueries.list());
  return <Select options={data} />;
};

**2. Write (Actions Hooks)**
- Create a dedicated hook for mutations to encapsulate side effects (invalidation, optimistic updates).
- Naming convention: `use<Feature>Actions`.

```typescript
// features/<feature>/hooks/useFeatureActions.ts
export const useFeatureActions = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createFeature,
    onSuccess: () => {
      queryClient.invalidateQueries(featureQueries.list());
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: UpdateInput) => updateFeature(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(featureQueries.detail(variables.id));
      queryClient.invalidateQueries(featureQueries.list());
    },
  });

  return { create, update };
};
````

**Usage in Component**:

```tsx
const FeaturePage = () => {
  // Read
  const { data } = useSuspenseQuery(featureQueries.list());

  // Write
  const { create } = useFeatureActions();

  return <FeatureList data={data} onCreate={create.mutate} />;
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
