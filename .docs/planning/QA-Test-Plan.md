# QA Test Plan

## Scope

- Save session
- Library browse/sort/filter
- Session detail explorer
- Full restore
- Selective restore (window/group/tab)
- Delete
- Error and edge cases

Reference runbook:
- `.docs/planning/Chrome-Prelaunch-Test-Setup.md`

## Manual Test Matrix

1. Save
- Save with 1 window / 1 tab
- Save with multiple windows
- Save with multiple groups per window
- Save with ungrouped + grouped mix
- Save with pinned tabs
- Save with very long titles
- Save with restricted URLs present

2. Library
- Sort by updated
- Sort by name
- Favorites-first sort
- Favorites-only filter
- Rename
- Edit description
- Delete (confirm required)

3. Detail explorer
- Expand/collapse windows/groups
- Selection changes update restore action label
- Long titles truncate with tooltip/focus reveal

4. Restore
- Full restore small (<= 10 tabs)
- Full restore large (>= 200 tabs)
- Restore window only
- Restore group only (new window behavior)
- Restore single tab (current window behavior)
- Restore with restricted URLs -> verify reporting
- Restore when group recreation fails (simulate by Chrome changes) -> tabs still restored

5. Persistence
- Restart browser and ensure sessions persist
- Close and reopen extension UI; ensure correct state

## Automated Tests (Planned)

- Unit:
  - Snapshot normalization
  - Tree model building
  - Restore plan generation for each scope
  - Restricted URL classifier
- Integration (mock Chrome APIs):
  - Save -> list -> open detail -> restore (plan execution mocked)

## User Story Validation (Required Final Gate)

- Maintain `/user_stories/user_stories.md` as the source-of-truth story list.
- Each story must have:
  - `/user_stories/<story_slug>/story.md`
  - `/user_stories/<story_slug>/validation/validation.md`
  - evidence screenshots captured during validation
- Run validation using `.codex/agents/user-story-testing-agent.md` with the `testing-user-stories-validation` workflow.

## Performance Checks (Manual)

- Capture time for 200 tabs
- Restore time for 200 tabs
- Library load for 500 sessions (synthetic data)

## Regression Checklist (Per Release)

- Save/restore on latest stable Chrome
- Permissions and privacy statement unchanged and accurate
