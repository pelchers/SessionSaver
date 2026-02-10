# PRD (ADR Session): session-explorer

## Summary

Chrome extension that saves the user’s current browser state as a “session” and lets them browse sessions in a Google Drive-like library. Opening a session shows an explorer tree (VS Code-style) of windows -> tab groups -> tabs, with restore actions at any node.

## Goals

- Save current windows/tab-groups/tabs into a durable session snapshot.
- Browse sessions in a library view (sort/filter/favorites).
- Inspect a session via an explorer tree UI.
- Restore entire sessions or partial selections (window/group/tab).
- Support naming, favoriting, and descriptions for sessions.

## Non-goals

- Cloud sync or cross-device conflict resolution (v1).
- Collaboration/sharing sessions (v1).
- Full text indexing of page contents (v1).
- Perfect restoration of every special/internal URL (best-effort only).

## Target users

- Heavy tab-group users (research, engineering, PM, students).
- Anyone who needs to “freeze” context and come back later.

## Content requirements

- Library list view with session metadata and actions.
- Session detail view with explorer tree and restore actions.
- Modals for save, restore confirm, and delete confirm.

## Functional requirements

See `.docs/planning/Requirements.md`.

## UX requirements

See `.docs/planning/Wireframes.md` and `.docs/planning/Information-Architecture.md`.

## Technical requirements

See `.docs/planning/adr/session-explorer/technical_requirements.md`.

## Risks / assumptions

- Chrome API edge cases for group recreation and restricted URLs.
- Storage quotas for large libraries.

## Open questions

- Search in MVP or post-MVP?
- Overwrite-on-save vs always-new snapshot?
- Incognito support policy?
