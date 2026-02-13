# User Stories (Master List)

This file is the master list used for final user story validation with Playwright.

Each story MUST have a matching folder:

- `/user_stories/<story_slug>/story.md`
- `/user_stories/<story_slug>/validation/validation.md`

## Stories

1. `save-session`: Save the current browser state as a named session.
2. `browse-library`: Browse the session library, sort, and filter favorites.
3. `favorite-session`: Favorite/unfavorite a session from the library.
4. `edit-metadata`: Rename a session and edit its description.
5. `view-session-tree`: Open a session and explore windows/groups/tabs in the tree.
6. `restore-full-session`: Restore a full saved session with confirmation.
7. `restore-selection`: Restore a single window/group/tab from a session.
8. `delete-session`: Delete a session with confirmation.

## Edge-Behavior Coverage

Validation must include unusual behavior, not just happy paths:

- whitespace-only metadata input
- confirm-cancel flows (delete/restore)
- missing/invalid session route id
- restricted/internal URLs during restore
- rapid toggle interactions (favorite/filter/sort)

Run command:

- `npm run test:user-stories`
