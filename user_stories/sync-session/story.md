# User Story Validation Template

## Story

- Title: Mark one session for cross-device sync
- Owner: product
- Role: As a user
- Goal: I want to pick one session as my synced target so I can keep my primary context aligned across signed-in Chrome profiles
- Scope: MVP

## Steps

1) Open a session detail page.
2) Click the sync toggle (circular arrows) in metadata.
3) Return to library and verify sync icon is active on that session.
4) Mark a different session and verify only one stays active.

## Expected Results

- Sync toggle sets or clears the selected synced session.
- Library reflects synced selection with the circular-arrow indicator.
- At most one session is marked synced at any time.

## Edge Cases

- Clicking sync on the same session twice should clear selection.
- Deleting the synced session should clear sync selection.

## Evidence

- Screenshots: /user_stories/sync-session/validation/
- Notes: validation.md
