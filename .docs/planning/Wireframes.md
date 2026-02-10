# Wireframes (Clickable Spec)

## Navigation

- [WF-0 Library](#wf-0-library)
- [WF-1 Save Session Modal](#wf-1-save-session-modal)
- [WF-2 Session Detail + Explorer](#wf-2-session-detail--explorer)
- [WF-3 Restore Confirmation](#wf-3-restore-confirmation)
- [WF-4 Delete Confirmation](#wf-4-delete-confirmation)
- [WF-5 Empty and Error States](#wf-5-empty-and-error-states)

## Routes

- `/library` -> [WF-0 Library](#wf-0-library)
- `/library?new=1` -> [WF-1 Save Session Modal](#wf-1-save-session-modal)
- `/session/:id` -> [WF-2 Session Detail + Explorer](#wf-2-session-detail--explorer)

## WF-0 Library

### Layout Sections

1. Top bar
- App title: `SessionSaver`
- Primary CTA: `Save Current Session`
- Search input (optional in v1.1; show disabled/hidden in MVP)

2. Control bar
- Sort dropdown: `Updated`, `Name`, `Favorites First`
- Filter toggle: `Favorites Only`
- View toggle (optional): `List` / `Grid` (list default for MVP)

3. Session list/table
- Columns:
  - Favorite star
  - Name
  - Description preview
  - Windows
  - Tabs
  - Updated at
  - Actions (kebab menu)

4. Footer/status row
- Count text: `Showing X sessions`

### Row Behavior

- Click row -> navigate to `/session/:id`
- Click star -> toggle favorite inline
- Kebab menu:
  - Rename
  - Edit description
  - Restore full session
  - Delete

### Component States

- `SessionRow`
  - `default`
  - `hover`
  - `selected`
  - `favorite`
- `SortDropdown`
  - `collapsed`
  - `expanded`
- `FilterToggle`
  - `off`
  - `on`
- `LoadingState`
  - skeleton rows x 8

## WF-1 Save Session Modal

### Trigger

- From WF-0 top bar CTA.

### Sections

1. Header
- Title: `Save Current Session`
- Subtitle: `Capture all open windows, groups, and tabs`

2. Form
- Name field (required)
- Description textarea (optional)
- Read-only summary:
  - `N windows`
  - `N tab groups`
  - `N tabs`

3. Actions
- Secondary: `Cancel`
- Primary: `Save Session`

### Validation and States

- Name empty -> inline error: `Session name is required`
- Save in progress -> disable controls + spinner on primary button
- Save success -> close modal + toast + row appears in library
- Save failure -> inline banner with retry

## WF-2 Session Detail + Explorer

### Header Section

- Breadcrumb: `Library / <Session Name>`
- Title input (editable name)
- Favorite toggle (star)
- Metadata line: `Created`, `Updated`, `Window count`, `Tab count`

### Description Section

- Multiline description editor
- Save-on-blur behavior

### Explorer Section

Tree follows VS Code-style indentation and disclosure arrows:

1. `Window 1`
2. `Tab Group: Product Research` (color swatch)
3. `Tab: Example.com` (favicon + title + URL preview)
4. `Ungrouped Tabs`

### Right-side Action Panel (or sticky bottom bar on small screens)

- `Restore Full Session`
- Node action buttons (active on selected node):
  - `Restore This Window`
  - `Restore This Group`
  - `Restore This Tab`

### Component States

- `TreeNode`
  - `collapsed`
  - `expanded`
  - `selected`
  - `disabled` (invalid/unsupported entry)
- `DescriptionEditor`
  - `idle`
  - `editing`
  - `saving`
  - `error`
- `RestoreButton`
  - `idle`
  - `confirm-required`
  - `restoring`
  - `partial-success`
  - `success`
  - `failure`

### Responsive Rules

- Desktop: two-column layout (tree left, actions right)
- Mobile width: single-column stack with sticky restore actions bottom

## WF-3 Restore Confirmation

### Dialog Content

- Title: `Restore Selection`
- Body summary:
  - For full: `This will open 3 windows and 42 tabs`
  - For partial: `This will open 1 tab group and 8 tabs`
- Optional checkbox:
  - `Open in background where possible`

### Actions

- Secondary: `Cancel`
- Primary: `Restore`

### Outcomes

- Success toast: `Restored successfully`
- Partial toast: `Restored with 2 skipped tabs`
- Failure banner with `View details` link

## WF-4 Delete Confirmation

### Dialog Content

- Title: `Delete Session`
- Warning text includes session name.
- Secondary text: `This action cannot be undone in MVP.`

### Actions

- Secondary: `Cancel`
- Danger: `Delete Session`

### Outcomes

- Success toast + return/focus to library list

## WF-5 Empty and Error States

### Library Empty State

- Title: `No sessions yet`
- Description: `Save your current tabs to build your session library.`
- CTA: `Save Current Session`

### Favorites Filter Empty

- Title: `No favorite sessions`
- CTA: `Clear filter`

### Detail Not Found

- Title: `Session not found`
- CTA: `Back to library`

### Generic Error State

- Banner pattern:
  - Message
  - Optional details expander
  - `Retry` button
