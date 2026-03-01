# Guide: Troubleshooting Vite Dev Mode (Chrome Extension)

## Symptom

Extension popup/options page shows:

- `Vite Dev Mode`
- `Cannot connect to the Vite Dev Server on http://localhost:<port>`

## Root Cause

CRX dev mode injected a specific dev-server URL, but the running Vite process is either:

- on a different port, or
- not reachable on the same loopback family (IPv4 vs IPv6 mismatch).

## Fix Procedure

1. Stop all Vite sessions (`Ctrl+C`).
2. Start fixed command:
   - `npm run dev:chrome`
3. Verify endpoint:
   - open `http://127.0.0.1:5173` in Chrome.
4. Reload extension:
   - `chrome://extensions` -> SessionSaver -> `Reload`.
5. Retry popup/options.

## If Port 5173 is busy

PowerShell:

```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

Then restart:

```bash
npm run dev:chrome
```

## Why this works

Fixed host+port keeps the extension and dev server in sync, preventing stale runtime injection URLs.
