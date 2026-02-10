# Settings Spec

## MVP Settings (Recommended Minimal)

- None required to ship MVP if UI includes basic management (delete sessions).

## Post-MVP Settings (Planned)

1. Data management
- `Clear all sessions` (danger, confirm required)
- `Export sessions` (JSON)
- `Import sessions` (JSON, with conflict handling)

2. Restore behavior
- Default restore target:
  - `New windows (default)`
  - `Current window (for single-tab restores only)`
- `Open restored tabs in background` default toggle
- `Rate limit large restores` toggle (or fixed behavior)

3. Library behavior
- Default sort order
- Default filter (favorites-only on/off)

4. Privacy
- If telemetry ever exists: explicit opt-in toggle (not in v1)

## Import/Export Rules (Post-MVP)

- Export format includes schemaVersion and all sessions.
- Import supports:
  - Merge (default): keep existing + import new
  - Replace: delete existing then import
- ID collision handling:
  - Re-ID imported sessions if collision detected.
