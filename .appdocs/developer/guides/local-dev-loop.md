# Guide: Local Dev Loop

This is the fastest repeatable loop while building features.

## Step 1: Install dependencies

Command:

```bash
npm install
```

Why:
- Ensures CLI tools (Vite, Vitest, Playwright, ESLint) are available.
- Prevents inconsistent behavior across machines.

## Step 2: Start extension dev build

Command:

```bash
npm run dev:chrome
```

Why:
- CRX/Vite rebuilds to `dist/` on file changes.
- You can keep Chrome pointed at `dist/` and reload extension quickly.
- Fixed host/port avoids random port switching that can break extension dev mode injection.

## Step 3: Load extension once in Chrome

Action:

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select `dist/`.

Why:
- Unpacked loading avoids packaging/upload steps for local development.

## Step 4: Iterate

Action:

1. Edit code in `src/`.
2. Wait for `npm run dev` rebuild.
3. Click `Reload` on extension card.
4. Re-open options page and verify behavior.

Why:
- You get a short feedback cycle without store upload.

## Step 5: Run pre-commit checks

Command:

```bash
npm run prelaunch:check
```

Why:
- Keeps local branch aligned with release-quality gates.
- Catches regressions before manual QA.

## Troubleshooting: "Cannot connect to the Vite Dev Server"

If extension pages show:

- `Cannot connect to the Vite Dev Server on http://localhost:<port>`

run this recovery:

1. Stop all Vite terminals (`Ctrl+C`).
2. Start fixed command:
   - `npm run dev:chrome`
3. Verify browser reachability:
   - open `http://127.0.0.1:5173` in a normal tab.
4. Go to `chrome://extensions` and click `Reload` on SessionSaver.

Why:
- CRX dev mode references one explicit local URL; if the server is on a different port, extension pages fail until reloaded against the correct endpoint.
