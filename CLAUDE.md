# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**bazzuca-react** is a React component library (NPM package) for the Bazzuca social media management system. It provides UI components, custom hooks, API services, and TypeScript types for managing clients, social networks, and posts across multiple platforms. Published in dual format (ES modules + CommonJS).

## Commands

- `npm run build` — TypeScript compile + Vite library build
- `npm run dev` — Vite dev server
- `npm run lint` — ESLint (strict, max-warnings 0)
- `npm run test` — Vitest (single run)
- `npm run test:watch` — Vitest in watch mode
- `npm run test:coverage` — Vitest with coverage
- `npm run type-check` — `tsc --noEmit`

## Architecture

Layered architecture with clear separation:

1. **Components** (`src/components/`) — UI layer. Business components (ClientList, PostEditor, PostCalendar, etc.) and shadcn-style primitives (`src/components/ui/`).
2. **Hooks** (`src/hooks/`) — Business logic layer. `useClients`, `useSocialNetworks`, `usePosts` each return `{ data, loading, error, CRUD methods, refresh }`.
3. **Services** (`src/services/`) — Data access layer. Class-based API wrappers (`ClientAPI`, `SocialNetworkAPI`, `PostAPI`) using Axios.
4. **Context** (`src/contexts/BazzucaContext.tsx`) — Dependency injection. Creates Axios instance, instantiates API services, provides global state (selectedClient, loading, error). Consumers wrap their app with `<BazzucaProvider>`.
5. **Types** (`src/types/bazzuca.ts`) — All interfaces, enums (`SocialNetworkEnum`, `PostTypeEnum`, `PostStatusEnum`), type guards, and display-name utilities.
6. **Utils** (`src/utils/`) — `cn.ts` (classname merge), `validators.ts` (CPF, CNPJ, email, phone validation).

All public API is re-exported from `src/index.ts`.

## Build & Package Configuration

- **Vite library mode**: entry `src/index.ts`, outputs `dist/index.js` (ES) and `dist/index.cjs` (CJS) with declarations
- **Externals**: react, react-dom, react-router-dom are peer dependencies (not bundled)
- **CSS**: exported separately as `bazzuca-react/styles` (`dist/style.css`)
- **Path alias**: `@/*` → `./src/*`

## Styling

- Tailwind CSS 3.4 with class-based dark mode
- HSL CSS variable system for theming
- Brand colors: primary (#7C3AED), secondary (#DB2777), accent (#5cdef5)
- Uses class-variance-authority for component variants

## Testing

- Vitest with jsdom environment, globals enabled
- Setup file: `src/__tests__/setup.ts`
- Coverage excludes: node_modules, tests, stories, specs

## Example App

`example-app/` is a full working demo showing BazzucaProvider setup, routing with protected routes, and integration with nauth-react for authentication. It is a separate project with its own package.json.
