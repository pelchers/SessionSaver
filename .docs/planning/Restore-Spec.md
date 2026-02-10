# Restore Spec

## Scope Types

- Full session restore
- Window restore
- Group restore
- Ungrouped bucket restore
- Single tab restore

## Core Principles

- Best-effort: restore as much as possible, never silently drop items.
- Deterministic ordering: restored windows/tabs appear in the snapshot order.
- Safety: always confirm restores with counts.
- Separation of concerns:
  - Build a restore plan (pure function).
  - Execute plan via Chrome APIs (side effects).

## Plan Model (Conceptual)

- `RestorePlan` contains a sequence of operations:
  - Create window
  - Create tabs (with URLs and pinned/active hints)
  - Create group and assign tabs
  - Set group title/color (best-effort)

## Full Restore Algorithm (Conceptual)

1. Load session by ID.
2. For each saved window in order:
  - Create new Chrome window (optionally start with a single tab).
  - Create tabs in order.
  - For each group:
    - Create group from tab IDs.
    - Set group title/color.
  - Ensure one tab is active (prefer saved active).
3. Report results.

## Selective Restore Algorithm (Conceptual)

- Window node:
  - Restore only that window subtree as above.
- Group node:
  - Create a new window (or use current window; decision later).
  - Create tabs for the group.
  - Create and configure group.
- Tab node:
  - Create tab in current window (default) or new window (optional).

## Rate Limiting / Staggering (Recommended)

- For large restores, execute in batches to reduce Chrome/UI thrash.
- Expose “open in background where possible” toggle.

## Group Fidelity Rules

- If group creation fails:
  - keep tabs ungrouped
  - record failure entry for reporting

## URL Validation Rules

- If URL is missing/empty/restricted:
  - skip creation
  - report as skipped with reason

## Focus Rules

- Prefer not to steal focus repeatedly.
- At end:
  - activate first restored window and the intended active tab (or keep background if user requested).
