# Edge Cases (Capture + Restore)

## Restricted / Unrestorable URLs

Some URLs may be visible in the tab list but cannot be opened by an extension restore flow.

Rules:
- Capture: store the URL/title as observed (if provided by Chrome) and mark `restricted=true` when URL scheme/domain is known to be problematic.
- Restore: skip restricted tabs by default and report them explicitly to the user.

Common categories:
- Internal pages (Chrome/extension URLs)
- Special schemes (file-like, devtools-like)
- Blocked/empty URLs (about:blank, new tab variants)

Decision:
- Do we attempt to restore `about:blank` and new tab pages, or skip with a message?

## Permission-limited fields

- Some tab properties may be absent depending on permissions and Chrome version.
- UI must tolerate missing favicon/title and display fallback labels.

## Discarded / sleeping tabs

- Capture should store `discarded` if available (hint only).
- Restore should not try to preserve discarded state; it will be handled by Chrome.

## Pinned tabs

- Restore should preserve pinned state where possible.
- If pinning fails, report as a non-fatal partial issue.

## Active tab / focused window

- Capture active tab per window (snapshot hint).
- Restore should:
  - Prefer activating the previously active tab in first restored window.
  - Avoid stealing focus repeatedly during large restores (consider background open option).

## Tab group recreation limitations

- If group recreation fails:
  - Still restore tabs (ungrouped fallback).
  - Report “group not recreated” with group title/color.

## Duplicate URLs and titles

- Tree nodes should disambiguate duplicates by showing URL secondary line and/or index.

## Large restores

- Opening hundreds of tabs at once can degrade system performance.
Mitigations:
- Confirmation shows counts.
- Consider rate limiting (staggered tab creation).
- Optional “open in background” toggle in confirm dialog.

## Storage quota pressure

- Very large libraries can exceed local storage quota.
Mitigations:
- Surface warning when saves fail due to quota.
- Optional “prune oldest sessions” feature (later).

## Corrupted session data

- Detect invalid shapes or missing mandatory fields.
- Exclude from restore and show “corrupt session” warning with delete option.
