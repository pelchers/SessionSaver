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
npm run dev
```

Why:
- CRX/Vite rebuilds to `dist/` on file changes.
- You can keep Chrome pointed at `dist/` and reload extension quickly.

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
