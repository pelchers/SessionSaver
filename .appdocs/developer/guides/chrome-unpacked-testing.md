# Guide: Chrome Unpacked Testing

Use this for real runtime testing with Chrome APIs (`tabs`, `tabGroups`, `storage`).

## Step 1: Build and start dev watcher

Commands:

```bash
npm run dev:chrome
```

Why:
- Keeps `dist/` updated as source changes.
- Locks dev server endpoint to `127.0.0.1:5173`, which avoids stale dev-server URL errors in extension pages.

## Step 2: Load unpacked extension

Action:

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Load unpacked from `dist/`.

Why:
- This runs the real extension worker and pages, not a mock harness.

## Step 3: Inspect service worker

Action:

1. In extension card, click `Service worker` inspect link.
2. Keep DevTools open while testing critical flows.

Why:
- Surface runtime errors during save/restore and messaging.

## Step 4: Run story flow manually

Action:

1. Open extension options page (library).
2. Execute all stories in `user_stories/user_stories.md`.
3. Capture screenshots and update each `validation.md`.

Why:
- Confirms real Chrome behavior beyond mocked Playwright flows.

## Step 5: Reload safely on each change

Action:

1. After code changes, wait for rebuild.
2. Click `Reload` on extension card.
3. Re-open options page.

Why:
- MV3 worker and manifest changes need explicit extension reload to take effect.

## If popup/options show Vite connection error

Symptom:
- `Cannot connect to the Vite Dev Server on http://localhost:5174` (or another port).

Fix:
1. Stop all running `vite` sessions.
2. Run `npm run dev:chrome`.
3. Open `http://127.0.0.1:5173` in a browser tab to confirm server is reachable.
4. Reload extension in `chrome://extensions`.
