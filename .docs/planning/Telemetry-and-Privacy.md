# Telemetry and Privacy (v1)

## Policy (MVP)

- No telemetry in v1.
- No analytics SDKs.
- No network calls required for save/browse/restore.

## Data Stored Locally

Stored in extension local storage:
- Session metadata:
  - name, description, favorite, created/updated timestamps
- Session snapshot:
  - windows
  - tab groups (title/color when available)
  - tabs (URL, title, pinned, favicon URL when available)

## Data Not Collected

- Page content/body text
- Form inputs/passwords
- Browsing history beyond what is present in currently open tabs

## User Controls

- Delete sessions at any time.
- Clear all data feature (recommended for settings page, post-MVP if needed).

## Future Telemetry (If Ever Added)

If telemetry is added later:
- Must be opt-in.
- Must be documented clearly with toggle.
- Must collect only aggregate events (no URLs/titles).
