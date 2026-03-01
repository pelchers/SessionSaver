# Storage Sync (Single Session Selection)

## Why This Design Exists

`chrome.storage.sync` has quota limits and is not suitable for storing full multi-window tab libraries at scale.
To avoid quota churn and sync failures, SessionSaver only syncs one small piece of cross-device state:

- Which saved session is currently marked as the cross-device sync target.

Full session payloads remain in `chrome.storage.local`.

## What Is Synced

- Sync key: `syncSelection`
- Shape:

```json
{
  "syncedSessionId": "<session-id-or-null>"
}
```

- Storage area: `chrome.storage.sync`

## What Stays Local

- Session index and full session trees (windows, groups, tabs)
- Storage area: `chrome.storage.local`
- Root key: `root`

## Runtime API Contract

Background messages added:

- `GET_SYNC_SELECTION` -> `{ ok: true, syncedSessionId: string | null }`
- `SET_SYNC_SELECTION` with `{ id: string | null }` -> `{ ok: true, syncedSessionId: string | null }`

Behavior:

- Setting a session ID makes that session the single synced selection.
- Setting `id: null` clears the synced selection.
- If a selected session is deleted locally, synced selection is cleared automatically.
- If `SET_SYNC_SELECTION` is called with an unknown session ID, background returns `session_not_found`.

## UI Behavior

- Session detail page:
  - Metadata panel includes a sync toggle button (circular arrows).
  - Toggle sets/clears synced selection.
- Library page:
  - Sync indicator button appears beside the star icon.
  - Only one row can be in synced state at a time.

## Testing Notes

1. Mark Session A as synced in Session Detail.
2. Return to Library and verify Session A shows sync indicator as selected.
3. Mark Session B as synced and verify Session A indicator clears.
4. Delete currently synced session and verify no row remains synced.

## Reference

- Chrome Extensions Storage API:
  - https://developer.chrome.com/docs/extensions/reference/api/storage
