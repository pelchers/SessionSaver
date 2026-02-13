# Testing And Validation

## Validation Layers

1. Lint: static correctness and code quality.
2. Unit tests: deterministic logic checks (storage, restricted URLs, restore planning).
3. User-story E2E tests: behavior-focused flows with screenshot evidence.
4. Manual Chrome runtime pass: real browser APIs and extension lifecycle validation.

## Commands

- Lint: `npm run lint`
- Unit tests: `npm run test`
- User-story suite: `npm run test:user-stories`
- Build: `npm run build`
- Full gate: `npm run prelaunch:check`

## Current Automated Coverage

- Unit tests:
  - `src/lib/restrictedUrl.test.ts`
  - `src/lib/storage.test.ts`
  - `src/lib/restore.test.ts`
- User-story suite:
  - `tests/user-stories/user-stories.spec.ts`

## Edge and Weird Behavior Coverage

- Whitespace-only session names rejected.
- Confirm-cancel delete behavior validated.
- Missing session route returns clear error.
- Restricted URLs in restore are skipped and reported.
- Metadata save race condition covered and fixed.

## Evidence Storage

- Story screenshots are written under each story:
  - `user_stories/<story_slug>/validation/*.png`
- Pass/fail + notes in:
  - `user_stories/<story_slug>/validation/validation.md`

## Manual Runtime Validation

Use this guide for real Chrome API behavior:

- `.appdocs/developer/guides/chrome-unpacked-testing.md`
- `.appdocs/developer/guides/chrome-prelaunch-approval.md`
