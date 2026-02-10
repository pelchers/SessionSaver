# Search Spec

## Status

- Recommended post-MVP unless you explicitly want it in MVP.

## Search Scope Options

Option A (lightweight):
- Search sessions by:
  - name
  - description

Option B (more powerful):
- Also search:
  - tab titles
  - tab URLs
Tradeoff: requires indexing and can increase storage size.

## UI Placement

- Library top bar search input.
- Results update as user types (debounced).

## Ranking (Simple)

- Exact prefix match on session name first.
- Substring match on session name.
- Substring match on description.
- If tab indexing enabled: title/URL matches after metadata matches.

## Result Presentation

- Keep same list layout.
- Highlight matched substrings (optional).
- Show “X results” with clear “reset search” affordance.

## Performance Notes

- For large libraries, index sessions into a normalized search string.
- If tab indexing enabled:
  - build incremental index on save and on import
  - avoid scanning entire payload on each keystroke
