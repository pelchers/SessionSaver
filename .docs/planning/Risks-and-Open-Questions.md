# Risks and Open Questions

## Key Risks

1. Chrome API edge cases
- Group recreation may behave inconsistently across Chrome versions.
- Mitigation: build restore fallback paths and clear user messaging.

2. Storage limits
- Very large session histories could approach `chrome.storage.local` quota limits.
- Mitigation: optional pruning policy and session size warnings.

3. Restore side effects
- Restoring many tabs can impact system performance and user focus.
- Mitigation: confirmation with counts, optional delayed restore mode.

4. Data quality
- Tabs with restricted/internal URLs may not restore cleanly.
- Mitigation: validate URLs and report skipped tabs.

## Open Questions

1. Library visual mode
- Should MVP ship list-only, or list + grid toggle?

2. Session update behavior
- Should re-saving a session overwrite existing session or always create a new snapshot?

3. Naming conventions
- Do we enforce unique session names or allow duplicates with IDs only?

4. Search
- Is name/description search required in MVP, or deferred to post-MVP?

5. Sync strategy
- Will future sync use `chrome.storage.sync`, external backend, or both?

## Decision Log Template

Use this section as decisions are made:

- `YYYY-MM-DD`: Decision
- Owner
- Rationale
- Impact
