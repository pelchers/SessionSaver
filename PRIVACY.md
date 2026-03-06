# SessionSaver Privacy Policy

Last updated: March 6, 2026

SessionSaver is a Chrome extension that saves and restores browser sessions. This policy explains what data the extension processes, where it is stored, and how it is used.

## Data We Process

When you save a session, SessionSaver processes:

- Session metadata you provide:
  - session name
  - session description
  - favorite flag
- Browser session structure:
  - open windows
  - tab groups (when available)
  - tabs
- Tab-level metadata needed for restore:
  - URL
  - title
  - pinned/active state
  - favicon URL (when available from Chrome APIs)

## Where Data Is Stored

- Primary storage: `chrome.storage.local` (on your device/browser profile)
- Sync storage: `chrome.storage.sync` for one small value only:
  - selected synced session ID (`syncedSessionId`)

SessionSaver does not operate a backend database for your session data.

## How Data Is Used

Data is used only to provide core extension functionality:

- save sessions
- browse sessions
- edit session metadata
- restore full sessions or selected parts
- mark one session as a sync target across signed-in Chrome profiles

## Data Sharing and Selling

- We do not sell personal information.
- We do not share session data with third parties for advertising.
- We do not use your data for creditworthiness or lending decisions.

## Analytics and Tracking

- No analytics or telemetry is collected in v1.
- SessionSaver does not include ad-tech SDKs.

## Permissions

SessionSaver requests these Chrome permissions:

- `storage`: store session data and sync-selection ID
- `tabs`: read open tab metadata and restore tabs
- `tabGroups`: read and recreate tab groups

## Retention and Deletion

- Session data remains until you delete it.
- You can delete sessions from the app UI at any time.

## Security Notes

SessionSaver runs as a browser extension and uses Chrome extension storage APIs. As with all browser extensions, installed package files can be inspected on a local machine.

## Contact

For support or privacy questions:

- https://github.com/pelchers/SessionSaver-Extension/issues
