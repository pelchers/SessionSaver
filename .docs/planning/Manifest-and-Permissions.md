# Manifest and Permissions (MV3)

## Surfaces

- Extension popup: quick entry points
  - `Save Current Session`
  - `Open Library`
- Extension page (options-like):
  - Primary UI: Library + Session Detail views
- Background service worker:
  - Capture and restore orchestration
  - Storage reads/writes

## Expected Permissions (MVP)

- `storage`
  - Persist sessions and metadata.
- `tabs`
  - Read tab state (URL/title/pinned/etc).
  - Create tabs on restore.
- `tabGroups`
  - Read groups and assign tabs to groups.
  - Recreate group title/color on restore (best-effort).

## Host Permissions

- None required for MVP (no content scripts).
- If future features require fetching metadata or indexing page content, revisit.

## Permission Minimization Notes

- Avoid `scripting` and any host permissions unless a concrete feature needs it.
- Avoid any network permissions for v1 (local-only product posture).

## Incognito Policy (Decision Needed)

Options:

1. Do not support incognito (simplest):
- Extension either disabled in incognito or operates but does not save incognito tabs.

2. Support incognito explicitly:
- Separate storage and clear UI indication.
- Clear warning on what is captured.

## Restricted URL Handling

- Some tab URLs cannot be opened by extensions during restore.
- Product must:
  - Capture them (if readable) with flags.
  - Skip on restore with clear reporting.

Reference: `.docs/planning/Edge-Cases.md`
