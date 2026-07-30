# WINK frontend

The WINK web app uses Next.js App Router, React, TypeScript, Tailwind CSS, and
TanStack Query.

## Rendering and data flow

- Route files are React Server Components by default.
- Public lists and authenticated detail pages prefetch on the server and
  dehydrate into TanStack Query.
- Client components are limited to interactive islands such as forms, dialogs,
  filters, and carousels.
- API calls go through `src/shared/api/server.ts` or
  `src/shared/api/client.ts`; domain-specific query keys and mutations live
  behind each `src/features/*` public API.
- Authentication uses backend-issued `HttpOnly` cookies. Tokens are never kept
  in browser storage. Unsafe requests forward the `XSRF-TOKEN` cookie through
  the `X-XSRF-TOKEN` header.

## Run

Use Node.js 24.x, the newest runtime currently supported by the Vercel
deployment. TypeScript 7 provides the `tsc` CLI; the `typescript` package name
temporarily points to the TypeScript 6 compatibility API required by Next.js
and typescript-eslint.

```bash
corepack enable
pnpm install
cp .env.template .env
pnpm dev
```

`API_URL` is the backend origin used by server rendering and the local `/api`
route-handler proxy. It is read at runtime, so the standalone Docker image can
point at a different backend without rebuilding.

`RECRUIT_PROXY_CLIENT_HMAC_KEY` is a Base64-encoded 32-byte secret used to sign
the client address sent to backend rate limiting. Generate it with
`openssl rand -base64 32`, keep it server-side, and configure the exact same
value in the backend. Do not reuse the recruitment PII encryption key.

On Vercel (`VERCEL=1`), the frontend signs the single client address supplied by
Vercel, preferring `X-Vercel-Forwarded-For` and requiring it to match
`X-Forwarded-For` when both are present. Missing, multi-value, malformed, or
mismatched forwarded address headers fail closed.

For non-Vercel production deployments, the frontend accepts a client address
only from an authenticated ingress. Generate a separate
`RECRUIT_TRUSTED_INGRESS_TOKEN` with `openssl rand -base64 32`; configure the
ingress to overwrite `X-WINK-Trusted-Ingress` with that value and to append its
direct peer to `X-Forwarded-For`. Set `RECRUIT_TRUSTED_PROXY_HOPS` to the exact
number of trusted proxies between the browser and Next.js (`1` for a single
ingress). Block direct access to the Next.js container. Missing or invalid
ingress configuration fails closed instead of signing user-supplied forwarding
headers.

## Architecture

The source tree follows Feature-Sliced Design while keeping the framework-owned
Next.js App Router directory:

```text
src/
├── app/       # Next.js route files only; thin re-exports and route handlers
├── _app/      # providers, global styles, root composition, API route adapters
├── _pages/    # route-level server components and interactive page composition
├── widgets/   # reusable, self-contained page sections and layouts
├── features/  # user actions, query options, mutations, and feature UI
├── entities/  # business models and entity-level state
└── shared/    # API clients, generic utilities, generated contracts, and UI kit
```

Dependencies flow downward only. Imports from another slice use its browser-safe
root `index.ts` or explicit `server.ts` entry; files within a slice use relative
imports. Entity-to-entity relations are exposed through a narrow `@x` entry.
ESLint enforces the layer direction, bans the retired `component`, `contracts`,
`hook`, `lib`, and `store` aliases, and prevents private deep imports across
slice boundaries.

## Verify a production build

```bash
pnpm exec tsc --noEmit
pnpm exec eslint "src/**/*.{js,jsx,ts,tsx}" --max-warnings=0
pnpm build
```
