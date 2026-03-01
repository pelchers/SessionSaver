# Technical Requirements

## Stack / runtime

- Chrome Extension, Manifest V3.
- Background service worker for orchestration.
- UI: extension page (options-like) for Library + Detail, popup for quick actions.

## Data / storage

- Persist in `chrome.storage.local`.
- Schema versioning + migrations required.
- Storage layout should separate library index from session payloads.

## Security / compliance

- Local-only by default for v1 (no network calls required).
- Store only snapshot metadata needed for UI + restore.

## Performance

- Capture should complete quickly for 200+ tabs.
- Library view should render quickly for 500+ sessions.
- Detail explorer tree should remain responsive for very large sessions (consider lazy rendering/virtualization).

## Testing / validation

- Unit tests:
  - snapshot normalization
  - restricted URL classifier
  - restore plan builder (pure)
  - tree model builder
- Integration tests with mocked Chrome APIs for key flows.
- User story validation (required for final phase):
  - `/user_stories/user_stories.md` master list
  - per-story `story.md` + validation evidence
  - execute via `.codex/agents/user-story-testing-agent.md` using `testing-user-stories-validation`

## Deployment

- Manual QA matrix before release.
- Store listing copy includes permissions justification and restricted URL disclosure.
