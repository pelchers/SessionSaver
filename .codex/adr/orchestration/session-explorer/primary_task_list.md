# Primary Task List

Session: session-explorer
Date: 2026-02-10

This is the execution-oriented task list. It should be treated as the source of truth for phase scope and acceptance gates.

## Phase 1: Foundation (Schema, Capture, Storage)

Outcomes:
- Persisted schema v1 implemented with versioning and migration hook.
- Save flow captures windows/groups/tabs reliably and writes to storage.

Tasks:
- Define storage layout:
  - `schemaVersion`
  - `sessionsIndex` (summaries for library)
  - `sessionsById` (full payload)
- Implement schema migration entrypoint:
  - handles missing schema version (initialize)
  - migrates forward for known versions
  - blocks on unknown newer versions
- Implement capture pipeline:
  - enumerate windows
  - enumerate tabs per window
  - enumerate tab groups and assign tabs to groups
  - build normalized snapshot (windows -> groups -> tabs + ungrouped)
- Implement restricted URL classifier:
  - mark tabs as restricted at capture time
  - define skip-on-restore behavior
- Implement storage adapter:
  - upsert new session (create ID, timestamps)
  - update index counts (window/tab/group)
  - read list for library
  - read single session for detail
- Add unit tests:
  - snapshot normalization
  - restricted classifier
  - index count computation

Acceptance gates:
- Save 10-tab mixed grouped/ungrouped session successfully.
- Save 200-tab session without crashing; duration measured.
- Sessions persist across browser restart.

## Phase 2: Library UI (Drive-like)

Outcomes:
- Library list view with metadata, sorting, favorites filter, and quick actions.

Tasks:
- Build library route/page:
  - list rendering from `sessionsIndex`
  - empty states
  - loading skeleton state
- Implement save modal:
  - name required validation
  - optional description
  - capture summary counts shown
  - error banner + retry on failure
- Implement sorting:
  - updated desc
  - name asc
  - favorites first (favorites desc then updated desc)
- Implement favorites-only filter.
- Implement inline favorite toggle on rows.
- Implement row menu actions:
  - rename session
  - edit description
  - restore full session (calls restore confirm)
  - delete (confirm)
- Add unit tests:
  - sorting functions
  - filter logic

Acceptance gates:
- Can create a session from library CTA and see it appear immediately.
- Sorting and favorites filter behave deterministically and persist when navigating to detail and back.

## Phase 3: Session Detail + Explorer Tree

Outcomes:
- Session detail page renders explorer tree and supports selection + actions.

Tasks:
- Build detail route/page:
  - load session by ID
  - handle not-found and corrupt session states
- Implement metadata editing:
  - rename in header
  - favorite toggle
  - description editor save-on-blur + error state
- Implement explorer tree:
  - node types (window/group/ungrouped/tab)
  - expand/collapse
  - selection model
  - long title truncation + tooltip/focus reveal
  - basic keyboard navigation (up/down/left/right)
- Implement action panel:
  - restore full session button
  - restore selected node button label changes with selection

Acceptance gates:
- Tree structure matches snapshot: windows -> groups -> tabs.
- Selecting nodes changes restore scope correctly.
- Detail page is usable on narrow width (mobile-ish layout).

## Phase 4: Restore Engine (Full + Selective)

Outcomes:
- Restore reliably recreates tabs and groups best-effort with clear confirmation and reporting.

Tasks:
- Implement restore plan builder:
  - takes session + scope selection -> produces ordered operations
  - validates URLs and marks restricted/invalid items
- Implement executor:
  - create windows
  - create tabs
  - create groups and assign tabs
  - set group title/color best-effort
  - apply pinned/active hints best-effort
- Implement confirmation dialog:
  - accurate counts for scope (windows/groups/tabs)
  - optional background open toggle (if implemented)
- Implement restore feedback:
  - progress indication
  - success/partial/failure outcomes
  - details view for issues (skipped/failed/warnings)
- Add tests:
  - restore plan unit tests for each scope
  - mocked executor integration tests

Acceptance gates:
- Full restore recreates basic structure for a multi-window multi-group session.
- Selective restore works for window, group, and tab scope.
- Restricted URLs are reported as skipped with clear messaging.

## Phase 5: Hardening (Perf, A11y, Release)

Outcomes:
- Product is stable, accessible, and ready for store submission.

Tasks:
- Performance:
  - measure capture/restore for 200 tabs
  - optimize hot paths (lazy tree rendering, batching API calls)
- Storage quota strategy:
  - detect quota errors
  - user-facing guidance
  - (optional) implement “prune oldest” tooling
- Accessibility:
  - focus management for modals
  - ARIA roles for tree
  - keyboard coverage
- QA:
  - execute `.docs/planning/QA-Test-Plan.md`
  - regressions fixed
- Release readiness:
  - permissions review
  - privacy statement
  - store listing copy draft finalized

Acceptance gates:
- Manual QA matrix completed without P1 issues.
- Accessibility checklist passes baseline keyboard usage.
- Release checklist complete.

## Global Definition of Done

- Phase acceptance gates satisfied.
- Phase plan file moved to history with a phase review.
- Changes committed (and pushed when remote exists).
