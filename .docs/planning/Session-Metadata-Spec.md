# Session Metadata Spec

## Fields

- Name (required)
- Description (optional)
- Favorite (boolean)
- Created at (system)
- Updated at (system)

## Name Rules

- Required on save.
- Allow duplicates (ID is unique). If duplicates become confusing, add suffix display like “(2)” later.
- Max length (soft): 120 chars; truncate in UI but preserve full value.

## Description Rules

- Optional, multiline.
- Show one-line preview in library.
- Save behavior:
  - Save-on-blur in detail view
  - Save explicit in modal on creation
- Max length (soft): 2,000 chars; truncate in previews.

## Favorite Rules

- Toggle should be instant and reversible.
- In “Favorites first” sort:
  - favorites group first, then updated desc.

## Timestamps

- `createdAt` set once on creation.
- `updatedAt` changes when:
  - metadata changes
  - session contents are updated (if “overwrite existing session” is supported later)

## Conflict Rules (Local-only)

- If storage write fails:
  - UI shows error and does not optimistically update.
- If UI uses optimistic update:
  - must rollback on failure.
