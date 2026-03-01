# Phase Plan

Phase: phase_1
Session: session-explorer
Date: 2026-02-10
Owner: codex
Status: in_progress

## Objectives
- Establish production-ready extension project scaffolding (MV3 build, background worker, options UI, popup).
- Implement schema v1 storage initialization and migration hook.

## Task checklist
- [x] Scaffold Vite + MV3 extension build pipeline
- [x] Add background service worker entrypoint
- [x] Add options + popup entrypoints
- [x] Implement initial storage root init (`schemaVersion`, empty index/payload maps)
- [ ] Implement capture pipeline (windows/groups/tabs) -> normalized snapshot
- [ ] Implement save session (capture + persist + update index)
- [ ] Implement list/get/delete/update metadata in storage
- [ ] Add unit tests for pure functions (restricted URL, summary counts)
- [x] Implement capture pipeline (windows/groups/tabs) -> normalized snapshot
- [x] Implement save session (capture + persist + update index)
- [x] Implement list/get/delete/update metadata in storage
- [x] Add unit tests for pure functions (restricted URL, summary counts)

## Deliverables
- `src/manifest.ts`
- `src/background/index.ts`
- `src/lib/storage.ts`
- Initial UI entrypoints under `src/options/` and `src/popup/`

## Validation checklist
- [x] `npm run build` succeeds
- [ ] Can `PING` background worker (manual validation once loaded in Chrome)
- [ ] Can save a session and see it in storage (manual validation once loaded in Chrome)

## Risks / blockers
- None yet.

## Notes
- Orchestration truth lives in `.adr/orchestration/session-explorer/primary_task_list.md`.
