# Notes (ADR Session): session-explorer

## Decisions (to be made)

- Snapshot policy:
  - Always-new session on save
  - Overwrite existing session
  - Both (save-as-new vs update)
- Search scope:
  - Name/description only (likely)
  - URL/title (likely)
  - Full text (no for v1)
- Restore mode:
  - Immediate open all
  - Staggered open (rate-limit) for large restores
- Storage strategy:
  - Keep everything forever
  - Auto-prune oldest
  - User-managed retention

## Constraints

- Chrome MV3 service worker lifecycle (background may suspend).
- Restricted URLs cannot be opened by extensions.
- Storage quotas may be hit with very large session libraries.

## Open questions

- Incognito: supported? if yes, how to segregate storage and UX?
- Tab group fidelity: how strict do we need to be about exact grouping?
- Should restore open new windows or reuse current window optionally?

## References (local)

- `.docs/planning/PRD-Overview.md`
- `.docs/planning/Requirements.md`
- `.docs/planning/Wireframes.md`
