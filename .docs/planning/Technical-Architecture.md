# Technical Architecture (Chrome Extension)

## Extension Surfaces

1. `popup` UI
- Quick actions (save session, open library).

2. `options` or dedicated extension page
- Main library and explorer tree interface.

3. `background` service worker
- Orchestrates capture/restore operations.
- Handles storage read/write.

## Chrome APIs (Expected)

- `chrome.windows`: enumerate and create windows.
- `chrome.tabs`: enumerate and create tabs.
- `chrome.tabGroups`: capture and recreate group metadata.
- `chrome.storage.local` (MVP): persist session data.

## Proposed Data Schema (TypeScript-style)

```ts
type SavedSession = {
  id: string;
  name: string;
  description: string;
  favorite: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  windows: SavedWindow[];
};

type SavedWindow = {
  index: number;
  groups: SavedGroup[];
  ungroupedTabs: SavedTab[];
};

type SavedGroup = {
  title: string;
  color?: chrome.tabGroups.ColorEnum;
  tabs: SavedTab[];
};

type SavedTab = {
  url: string;
  title: string;
  favIconUrl?: string;
  pinned: boolean;
  active: boolean;
};
```

## Save Algorithm

1. Query all windows and tabs.
2. Build in-memory hierarchy of windows/groups/tabs.
3. Normalize objects into schema.
4. Upsert to `chrome.storage.local`.
5. Return saved summary for UI refresh.

## Restore Algorithm

1. Load session by ID.
2. For selected scope, create window(s) and tab(s) in intended order.
3. Rebuild tab groups where supported.
4. Report partial failures with actionable message.

## Error Handling

- Validation errors: missing name, invalid session ID.
- API errors: permission denied, tab creation failures.
- Storage errors: quota issues, serialization failures.

## Security and Privacy

- Store only necessary tab metadata.
- Avoid fetching remote data during save/restore.
- Future sync should be opt-in with explicit consent.

## Testing Strategy

- Unit tests:
  - Hierarchy builder
  - Storage adapter
  - Restore planner
- Integration tests:
  - Save/restore end-to-end on mocked Chrome APIs
- Manual QA:
  - Large tab counts
  - Mixed grouped/ungrouped tabs
  - Invalid URLs and discarded tabs
