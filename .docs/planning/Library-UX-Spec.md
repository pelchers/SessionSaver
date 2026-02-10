# Library UX Spec

## Primary Layout

- Top bar:
  - `Save Current Session` primary CTA
  - Optional search (post-MVP if needed)
- Controls:
  - Sort dropdown
  - Favorites-only filter toggle
- List/table:
  - Favorite icon
  - Name
  - Description preview
  - Counts (windows, tabs)
  - Updated time
  - Actions menu

## Sorting

Options:
- Updated (desc, default)
- Name (asc)
- Favorites first (favorites desc, then updated desc)

## Filtering

- Favorites only:
  - When enabled, library displays only favorite sessions.

## Actions

Per session (row menu):
- Open details
- Restore full session
- Rename
- Edit description
- Delete

Inline:
- Favorite toggle

## Save CTA Behavior

- Clicking `Save Current Session` opens save modal.
- If capture fails:
  - Show inline error banner in modal.
  - Keep modal open with retry.

## Empty States

- No sessions:
  - CTA to save first session.
- Favorites filter empty:
  - Message + clear filter control.

## Loading States

- Initial load:
  - skeleton list rows
- Actions in progress:
  - disable only the affected row controls

## Keyboard Rules (Minimum)

- Arrow keys move row selection in list (if implemented).
- Enter opens selected session.
- `Del` triggers delete confirmation (optional; confirm required).
