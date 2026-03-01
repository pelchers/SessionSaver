# PRD

## Summary

Build a Chrome extension that saves the user’s current tab context as named “sessions” and lets users browse and restore those sessions in a Drive-like library view. Opening a session shows an explorer tree (VS Code style) of windows -> tab groups -> tabs, with restore actions at any level.

## Goals

- Capture current Chrome windows/tab-groups/tabs into a durable snapshot.
- Drive-like session library: list view with sorting/filtering and quick actions.
- Session detail view with explorer tree of windows/groups/tabs.
- Restore full sessions and selective branches (window/group/tab).
- Session metadata: name, favorite, description.

## Non-goals

- Cloud sync/collaboration in v1.
- Full-text indexing of page content in v1.
- Perfect restoration of restricted/internal pages (best-effort + reporting).

## Target users

- Power users who work across many tab groups and windows.
- Researchers, developers, PMs, students.

## Content requirements

- Library UI (Drive-like list).
- Save modal.
- Session detail + explorer tree UI.
- Restore confirmation + feedback.
- Delete confirmation.

## Functional requirements

- Save current session (all windows/groups/tabs).
- View library with sort/filter/favorites.
- View session detail tree.
- Rename, describe, favorite sessions.
- Restore full or partial scope.
- Delete sessions.

## UX requirements

- Library feels like a file browser with quick metadata.
- Explorer tree interaction should be keyboard-friendly.
- Restore always confirms with accurate counts.
- Errors are reported with explicit skipped/failed items.

## Technical requirements

See `.adr/orchestration/session-explorer/technical_requirements.md`.

## Risks / assumptions

- Chrome API edge cases for `tabGroups` restoration.
- Storage quotas for large libraries.
- MV3 service worker lifecycle constraints.

## Open questions

- Search in MVP or post-MVP?
- Overwrite vs always-new snapshot on “Save”?
- Incognito support policy?
