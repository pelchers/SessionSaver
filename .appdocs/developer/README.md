# SessionSaver Developer Docs

## Purpose

This is the execution-focused developer handbook for SessionSaver.
Use this folder for implementation details, local testing flow, and pre-launch approval checks.

## Quick Start

1. Install deps: `npm install`
2. Run local validation gate: `npm run prelaunch:check`
3. Start extension dev build: `npm run dev:chrome`
4. Load unpacked extension from `dist/` at `chrome://extensions`

## Core Commands

- `npm run dev`: Build/watch extension outputs into `dist/` for local Chrome testing.
- `npm run dev:chrome`: Same as dev, but fixed host/port for reliable Chrome extension dev mode.
- `npm run lint`: Lint extension source under `src/`.
- `npm run test`: Run Vitest unit tests.
- `npm run test:user-stories`: Run Playwright user-story validation with screenshot evidence.
- `npm run build`: Production build into `dist/`.
- `npm run prelaunch:check`: Full local pre-launch gate.

## Doc Map

- Architecture: `.appdocs/developer/architecture.md`
- Filesystem + orchestration map: `.appdocs/developer/filesystem-and-orchestration.md`
- Testing + validation model: `.appdocs/developer/testing-and-validation.md`
- Chrome integration notes:
  - `.appdocs/developer/chrome/README.md`
  - `.appdocs/developer/chrome/storage-sync.md`
- Guides:
  - `.appdocs/developer/guides/local-dev-loop.md`
  - `.appdocs/developer/guides/chrome-unpacked-testing.md`
  - `.appdocs/developer/guides/troubleshooting-vite-dev-mode.md`
  - `.appdocs/developer/guides/chrome-prelaunch-approval.md`
  - `.appdocs/developer/guides/chrome-web-store-upload.md`
  - `.appdocs/developer/guides/chrome-publish-with-secondary-repo.md`

## Related Planning Docs

- `.docs/planning/Developer-Instructions.md`
- `.docs/planning/Chrome-Prelaunch-Test-Setup.md`
- `.docs/planning/QA-Test-Plan.md`
- `.docs/planning/Release-Checklist.md`
