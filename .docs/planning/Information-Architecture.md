# Information Architecture

## Primary Screens

1. Library
- Session list/table (Drive-like browser)
- Sort/filter controls
- Quick actions: save, favorite, delete

2. Session Detail
- Header: name, favorite toggle, timestamps
- Description editor
- Explorer tree (windows -> groups -> tabs)
- Restore controls (full and selective)

3. Save Session Modal
- Name input
- Description input
- Confirm/cancel actions

## Navigation Model

- Default route opens Library.
- Selecting a session navigates to Session Detail (`/session/:id` pattern).
- Back returns to Library preserving sort/filter state.

## Explorer Tree Model

- Level 1: `Window <n>`
- Level 2:
  - `Tab Group: <title or Untitled>`
  - `Ungrouped Tabs`
- Level 3: individual tabs (`title`, secondary `url`)

## Metadata Display Rules

- Name is primary label everywhere.
- Favorite state shown as star icon and sortable attribute.
- Description:
  - Library: truncated preview (single line)
  - Details: full editable text

## Sorting and Filtering (MVP)

- Sort options:
  - Last updated (default, desc)
  - Name (A-Z)
  - Favorites first
- Filter:
  - Favorites only

## Empty States

- No sessions yet: show CTA to save first session.
- No results for filter: show reset filter action.
