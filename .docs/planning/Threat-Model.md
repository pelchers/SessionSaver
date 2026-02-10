# Threat Model (Local-Only Chrome Extension)

## Assets

- User’s saved session library:
  - Tab URLs and titles
  - Group names/colors
  - User-provided session names/descriptions/favorites

## Trust Boundaries

- Extension UI <-> background service worker
- Extension storage (`chrome.storage.local`)
- Chrome APIs (tabs/windows/tabGroups)

## Threats and Mitigations

1. Accidental sensitive data retention
- Risk: session names/descriptions and tab URLs may contain sensitive info.
- Mitigations:
  - Keep v1 local-only (no sync, no network calls).
  - Provide delete and (recommended) “Clear all data” settings action.
  - Avoid storing any page content beyond URL/title.

2. Overbroad permissions
- Risk: requesting host permissions or scripting increases attack surface.
- Mitigations:
  - MVP permissions limited to `storage`, `tabs`, `tabGroups`.
  - No host permissions/content scripts in v1.

3. Data corruption / loss
- Risk: schema change or partial write breaks library.
- Mitigations:
  - Schema versioning + migrations.
  - Validate writes; detect corruption; isolate bad sessions.

4. Restore abuse / UX hazards
- Risk: restoring hundreds of tabs unexpectedly harms user experience.
- Mitigations:
  - Confirmation with counts.
  - Optional background restore / rate limiting.

5. Supply-chain / dependency risk (if used)
- Risk: third-party libraries introduce vulnerabilities.
- Mitigations:
  - Keep dependencies minimal.
  - Lock versions and run basic security checks.

## Security Posture Summary

- No remote data exfiltration in MVP.
- Minimal permissions and no content scripts.
- User controls for deletion and future “clear all”.
