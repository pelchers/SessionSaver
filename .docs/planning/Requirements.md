# Requirements

## Functional Requirements

1. Session creation
- User can save all currently open windows, tab groups, and tabs as one session.
- User must provide session name at save time (default suggestion allowed).
- User can optionally add a description.

2. Session metadata management
- User can rename a session.
- User can edit session description.
- User can favorite/unfavorite a session.
- System stores created and last-updated timestamps.

3. Session library view
- Show sessions in a Drive-like browser layout (list-first in MVP).
- Display name, favorite indicator, description snippet, and counts.
- Support sorting by updated date, name, and favorite-first.

4. Session detail explorer
- Clicking a session opens tree view:
  - Window nodes
  - Tab group nodes inside windows
  - Tab nodes inside groups
  - Ungrouped tab bucket per window
- Tree supports expand/collapse for each node level.

5. Restore behavior
- User can restore:
  - Entire session
  - Single window
  - Single tab group
  - Single tab
- Restore action opens tabs/windows in Chrome with best-effort group recreation.

6. Deletion and safety
- User can delete a session.
- System prompts confirmation for destructive actions.

7. Persistence
- All session data is persisted locally and survives browser restarts.

## Non-Functional Requirements

1. Performance
- Save operation should complete in under 2 seconds for 200 tabs on a typical machine.
- Library view should load in under 1 second for 500 sessions.

2. Reliability
- Extension must handle partial API failures gracefully and preserve existing saved sessions.
- Failed restores should report which windows/groups/tabs could not be restored.

3. Usability
- Tree labels should remain readable with long tab titles.
- Keyboard navigation for primary actions should be supported.

4. Privacy
- Data stays local by default in MVP.
- No external analytics or network upload unless explicitly enabled in future phases.

## Data Requirements

- Session object includes:
  - `id`
  - `name`
  - `description`
  - `favorite`
  - `createdAt`
  - `updatedAt`
  - `windows[]`
- Window object includes:
  - `windowIdSnapshot`
  - `index`
  - `groups[]`
  - `ungroupedTabs[]`
- Group object includes:
  - `groupIdSnapshot`
  - `title`
  - `color`
  - `tabs[]`
- Tab object includes:
  - `url`
  - `title`
  - `favIconUrl` (optional)
  - `pinned`
  - `active` (snapshot state)

## Out of Scope for MVP

- Team/shared session libraries
- Full-text tab search across saved page contents
- External backups and conflict resolution
