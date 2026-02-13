# Chrome Pre-Launch Test Setup

Date: 2026-02-13
Audience: Engineering, QA, Release owner

## Goal

Validate SessionSaver in real Chrome (unpacked extension) before launch approval, with reproducible evidence.

Companion developer handbook:
- `.appdocs/developer/README.md`

## 1) Local Validation Gate (must pass first)

Run from repo root:

```bash
npm install
npm run prelaunch:check
```

This executes:

- `npm run lint`
- `npm run test`
- `npm run test:user-stories`
- `npm run build`

Required result: all commands pass.

## 2) Load in Chrome (real runtime test)

1. Create a dedicated Chrome profile for QA (recommended).
2. Open `chrome://extensions`.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select the `dist/` folder in this repo.
6. Open the extension details page and verify permissions are only:
   - `storage`
   - `tabs`
   - `tabGroups`
7. Pin the extension and open `Options` page (`Open Library`).

Notes:
- Unpacked extension install may not show full store-style permission dialogs. Verify permissions on the details page.
- For service worker debugging, use `Inspect views` on the extension card.

## 3) Manual QA Pass (real APIs)

Run stories in this order and capture evidence in `/user_stories/<slug>/validation/`:

1. `save-session`
2. `browse-library`
3. `favorite-session`
4. `edit-metadata`
5. `view-session-tree`
6. `restore-full-session`
7. `restore-selection`
8. `delete-session`

Mandatory edge behavior checks:

- Save with whitespace-only name (must fail cleanly).
- Delete confirm cancel path (must keep row).
- Missing/invalid session route id (clear error state).
- Restore with restricted URLs (`chrome://`, `about:`, `file:`) reports skipped entries.
- Rapid favorite/filter toggles do not corrupt list state.

## 4) Approval Packet (pre-launch signoff)

Before launch approval, prepare:

- Test evidence:
  - Updated `validation.md` per story
  - Screenshots in each story validation folder
- Permission justification:
  - `.docs/planning/Manifest-and-Permissions.md`
- Privacy statement:
  - `.docs/planning/Telemetry-and-Privacy.md`
  - store listing privacy section
- Release checklist:
  - `.docs/planning/Release-Checklist.md`

## 5) Chrome Web Store Review Prep (if publishing)

1. Build:
   - `npm run build`
2. Package from `dist/` as zip.
3. Upload to Chrome Web Store dashboard.
4. Ensure listing text and permission justification match actual behavior.
5. Submit for review and wait for CWS approval before public release.

If any permission changes after submission, expect re-review.
