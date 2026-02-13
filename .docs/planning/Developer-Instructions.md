# Developer Instructions

## Primary Development Flow

1. Install deps:
   - `npm install`
2. Start local extension dev build:
   - `npm run dev`
3. Load unpacked extension from `dist/` in `chrome://extensions`.
4. For each change:
   - wait for rebuild
   - click `Reload` on extension card
   - re-test affected flow

## Validation Gates

- Fast checks:
  - `npm run lint`
  - `npm run test`
- Story validation:
  - `npm run test:user-stories`
- Full gate:
  - `npm run prelaunch:check`

## Pre-Launch Approval Path

1. Run `npm run prelaunch:check`.
2. Complete manual runtime checks in Chrome:
   - `.docs/planning/Chrome-Prelaunch-Test-Setup.md`
3. Confirm docs and evidence are up-to-date:
   - `user_stories/*/validation/validation.md`
   - `.docs/planning/Release-Checklist.md`

## Important Clarification

You do not need Chrome Web Store upload for local testing.

- Local testing uses unpacked extension from `dist/`.
- CWS upload/re-upload is only for approval/distribution.

## Developer Handbook

Detailed operational docs live in:

- `.appdocs/developer/README.md`
