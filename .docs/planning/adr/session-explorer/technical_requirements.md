# Technical Requirements (ADR Session): session-explorer

## Stack / runtime

- Chrome extension Manifest V3.
- Background service worker for capture/restore orchestration.
- UI in extension page (options-like) plus popup for quick actions.

## Data / storage

- Primary store: `chrome.storage.local`.
- Data model supports:
  - Sessions list (index metadata)
  - Per-session details (windows/groups/tabs)
  - Schema version to support migrations
- Quota strategy:
  - Track approximate size per session.
  - Allow pruning old sessions (future).
  - Consider `unlimitedStorage` if needed (explicit decision later).

## Permissions (expected)

- `storage`
- `tabs`
- `tabGroups`

Optional / later decisions:
- `unlimitedStorage` (quota pressure)
- Incognito support (requires explicit design decision)

## Restore behavior constraints

- Best-effort recreation of group title/color.
- Some URLs cannot be created/restored (e.g., certain internal/restricted schemes).
- Provide user-visible report of skipped/failed tabs.

## Security / compliance

- No network calls required for core save/browse/restore.
- Store only snapshot metadata needed for restore and display.

## Performance

- Capture is linear in number of tabs.
- UI should virtualize long lists/trees if needed.

## Testing / validation

- Unit tests for:
  - Snapshot builder
  - Tree model builder
  - Restore planner (plan-only with mocked API)
- Integration tests with mocked Chrome APIs for end-to-end flows.

## Deployment

- Local dev build and manual QA checklist.
- Release checklist includes manifest/permissions review and basic privacy statement.
