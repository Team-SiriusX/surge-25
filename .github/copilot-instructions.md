# Copilot Instructions for Surge-25 (UniConnect)

## Project Overview
This is a **campus job marketplace** built with Next.js 15 (React 19), connecting students for academic projects, startups, internships, and campus opportunities. Users can post jobs, apply, and communicate through an integrated messaging system.

## Architecture & Key Decisions

### API Layer (Hono + Next.js Route Handlers)
- **All API routes** are defined in `src/app/api/[[...route]]/route.ts` using Hono
- Controllers are organized by feature in `src/app/api/[[...route]]/controllers/`
  - Base features: `(base)/sample.ts` 
  - Finder features: `(finder)/job.ts`, `(finder)/application.ts`
- Use `zValidator` from `@hono/zod-validator` for request validation
- Export HTTP methods (GET, POST, PUT, PATCH, DELETE) via `handle(app)` for Next.js compatibility
- **Client imports**: Use `client` from `@/lib/hono.ts` which is typed as `hc<AppType>`

### Data Layer (Prisma)
- **Critical**: Prisma client is generated to `src/generated/prisma` (not default `node_modules`)
- Always import from: `import { PrismaClient } from "@/generated/prisma"`
- Database singleton is at `@/lib/db` - use `db` export for all queries
- After schema changes: `pnpm dlx prisma db push` then `pnpm dlx prisma generate`
- Models: User (with extended profile fields), JobPost, Application, SavedJob, Conversation, Message, Notification

### Authentication (Better Auth)
- Uses `better-auth` with Prisma adapter
- Server-side auth instance: `@/lib/auth` 
- Client-side hooks: `@/lib/auth-client` (exports `useSession`, `signIn`, `signOut`, etc.)
- Get current user server-side: `await currentUser()` from `@/lib/current-user`
- Email verification is **required** on signup
- Social providers: Google, GitHub (requires env vars)

### Middleware & Routing
- `src/middleware.ts` handles auth protection using `getSessionCookie` from `better-auth/cookies`
- Route patterns support wildcards (e.g., `/finder/*`)
- Routes defined in `src/routes.ts`:
  - `authRoutes`: Sign-in, sign-up, password reset pages
  - `publicRoutes`: Home `/`, `/sample`, `/finder` (including wildcards)
  - Protected routes: Everything else requires authentication

### State Management Pattern
- **TanStack Query** for all server state
- Query keys centralized in `src/constants/query-keys.ts` as `QUERY_KEYS` enum
- API hooks organized in feature `_api` folders (e.g., `src/app/sample/_api/`)
- Pattern for queries:
  ```typescript
  export const useGetJobs = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.POST],
      queryFn: async () => {
        const response = await client.api.jobs.$get();
        if (!response.ok) throw new Error("Failed to fetch");
        return response.json();
      },
    });
  };
  ```
- Pattern for mutations:
  ```typescript
  export const useCreateJob = () => {
    const queryClient = useQueryClient();
    return useMutation<ResponseType, Error, RequestType>({
      mutationFn: async (json) => {
        const response = await client.api.jobs.$post({ json });
        if (!response.ok) throw new Error("Failed");
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POST] });
        toast.success("Created!");
      },
    });
  };
  ```

## UI & Styling Conventions

### Component Library
- **shadcn/ui** components in `src/components/ui/` (New York style variant)
- Uses Radix UI primitives + Tailwind CSS 4
- Icon library: Lucide React (`lucide-react`)
- Additional icons: Tabler Icons (`@tabler/icons-react`)
- Utility function: `cn()` from `@/lib/utils` for conditional classes

### Route Groups (App Router)
- `(auth)`: Authentication pages - shared auth layout
- `(root)`: Public landing pages - custom layout with spotlight effects
- `(protected)`: Dashboard and authenticated areas - protected layout
- `(dashboard)`: Feature-specific dashboards (finder, seeker)
- Route group folders use parentheses and are **not** part of the URL path

### Feature Organization
- Pages: `src/app/[feature]/page.tsx`
- API hooks: `src/app/[feature]/_api/` (client-side only, prefixed with `_`)
- Components: `src/app/[feature]/_components/` (feature-specific, prefixed with `_`)
- Shared components: `src/components/`

## Development Workflows

### Running the App
- Dev: `pnpm dev` (uses Turbopack)
- Build: `pnpm build --turbopack`
- Start prod: `pnpm start`
- Lint: `pnpm lint`

### Database Workflows
1. **Schema changes**: Edit `prisma/schema.prisma`
2. Push to DB: `pnpm dlx prisma db push`
3. Generate client: `pnpm dlx prisma generate` (auto-runs on `postinstall`)
4. View data: `pnpm dlx prisma studio`
5. Seed data: `pnpm seed` (uses Bun runtime with `seed/seed.ts`)

### Adding New Features
1. Define Hono controller in `src/app/api/[[...route]]/controllers/`
2. Register route in `src/app/api/[[...route]]/route.ts`
3. Create typed client hooks in feature's `_api/` folder
4. Add query keys to `QUERY_KEYS` enum
5. Build UI components in feature's `_components/` folder

## Environment Variables
Required in `.env`:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/surge25?schema=public"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"  # For Hono client

# Optional OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

## Common Patterns

### Type Inference from Hono
```typescript
import { InferRequestType, InferResponseType } from "hono";
type ResponseType = InferResponseType<typeof client.api.jobs.$post>;
type RequestType = InferRequestType<typeof client.api.jobs.$post>["json"];
```

### Toast Notifications
Use Sonner: `toast.success()`, `toast.error()`, `toast.info()`

### Path Aliases
- `@/*` → `src/*`
- Example: `@/components/ui/button`, `@/lib/db`, `@/generated/prisma`

## Key Files Reference
- API Router: `src/app/api/[[...route]]/route.ts`
- Auth Config: `src/lib/auth.ts`
- Middleware: `src/middleware.ts`
- DB Client: `src/lib/db.ts`
- Schema: `prisma/schema.prisma`
- Root Layout: `src/app/layout.tsx` (Space Grotesk font, providers)
