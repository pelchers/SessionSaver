# Filesystem And Orchestration

## Primary Application Folders

- `src/`: Extension source code.
- `dist/`: Built extension artifacts for Chrome unpacked loading.
- `tests/`: Playwright user-story automation.
- `user_stories/`: Story specs, validation logs, and screenshot evidence.

## Developer Tooling and Validation

- `package.json`: Scripts and dependencies.
- `eslint.config.js`: Flat-config lint rules for app code.
- `vitest.config.ts`: Unit test config.
- `playwright.config.ts`: User-story E2E config.

## Planning and Release Governance

- `.docs/planning/`: PRD/spec/QA/release planning docs.
- `.docs/planning/Chrome-Prelaunch-Test-Setup.md`: Pre-launch manual runbook.
- `.docs/planning/Developer-Instructions.md`: Dev instruction baseline.

## Codex Orchestration Folders

- `.codex/adr/orchestration/session-explorer/`: Source-of-truth task list and technical requirements.
- `.codex/adr/current/session-explorer/`: Current phase files.
- `.codex/adr/history/session-explorer/`: Completed phase reviews.

## Where Core Functionality Lives

- Save/Capture:
  - `src/lib/capture.ts`
  - `src/background/index.ts` (`SAVE_SESSION`)
- Session management:
  - `src/lib/storage.ts`
  - `src/options/ui/pages/LibraryPage.tsx`
- Metadata/tree/restore UI:
  - `src/options/ui/pages/SessionPage.tsx`
- Restore internals:
  - `src/lib/restore.ts`

## Validation Evidence Layout

- Master list: `user_stories/user_stories.md`
- Per story:
  - `user_stories/<story_slug>/story.md`
  - `user_stories/<story_slug>/validation/validation.md`
  - `user_stories/<story_slug>/validation/*.png`
