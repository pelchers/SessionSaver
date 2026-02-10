# Release Checklist

## Build and Packaging

- Manifest MV3 valid.
- Version bumped.
- Icons and store assets present.
- No dev-only flags enabled.

## Permissions Review

- Confirm permissions are minimal and match implementation.
- Confirm no host permissions or content scripts in MVP unless required.

## Privacy and Data Handling

- Verify product is local-only (no network calls) in MVP.
- Privacy statement matches actual behavior.
- Confirm no sensitive data is stored beyond tab metadata.

## QA and Reliability

- Manual QA matrix completed (`.docs/planning/QA-Test-Plan.md`).
- Restore edge cases validated (restricted URLs, group failures).
- Corrupt data handling verified.

## Performance

- Capture and restore acceptably fast for large sessions.
- UI remains responsive for large trees.

## Accessibility

- Keyboard navigation for library and tree works.
- Focus management for modals correct.
- Contrast and semantics baseline checks pass.

## Store Readiness

- Short description, long description, and screenshots ready.
- Support/contact info ready.
- Known limitations documented (restricted URLs).
