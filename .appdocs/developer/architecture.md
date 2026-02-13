# Architecture

## Runtime Surfaces

- Manifest: `src/manifest.ts`
- Background worker (MV3 service worker): `src/background/index.ts`
- Options app (main product UI): `src/options/*`
- Popup (entry shortcut only): `src/popup/*`

## Data Flow

1. UI sends typed messages via `bgCall` in `src/options/ui/chromeRpc.ts`.
2. Background worker receives messages in `src/background/index.ts`.
3. Background calls storage/capture/restore libraries in `src/lib/*`.
4. Background returns typed responses back to UI.

## Core Functional Modules

- Type model: `src/lib/types.ts`
- Message contracts: `src/lib/messages.ts`
- Storage layer + indexing: `src/lib/storage.ts`
- Capture current browser state: `src/lib/capture.ts`
- Restore planning/execution: `src/lib/restore.ts`
- Restricted URL classifier: `src/lib/restrictedUrl.ts`

## Product Behaviors

- Save session:
  - Captures windows/groups/tabs.
  - Normalizes data into schema v1.
  - Writes both summary index and full payload.
- Library:
  - Sort/filter/favorite/delete in `LibraryPage.tsx`.
- Session detail:
  - Metadata editing.
  - Explorer tree selection.
  - Restore full or selected scope.
- Restore engine:
  - Builds scoped plan from session + target.
  - Skips restricted/invalid URLs.
  - Returns restore report (created/skipped/warnings).

## Build System

- Toolchain: Vite + `@crxjs/vite-plugin`.
- Output: `dist/` (load this as unpacked extension).
- Config files:
  - `vite.config.ts`
  - `playwright.config.ts`
  - `vitest.config.ts`
  - `eslint.config.js`
