# Primary Task List (ADR Session): session-explorer

Session: session-explorer
Date: 2026-02-10

## Phase 1: Data Model + Capture
- Define persisted schema and versioning/migrations.
- Implement session capture plan (windows/groups/tabs) and summary counts.
- Define restricted URL handling rules.

## Phase 2: Library UX
- Build Drive-like library list view.
- Sorting/filtering/favorites.
- Save modal + metadata editing (rename/description).

## Phase 3: Detail Explorer UX
- Build session detail view.
- Build explorer tree with expand/collapse and selection model.
- Node-level restore action affordances and states.

## Phase 4: Restore Engine
- Full restore logic.
- Selective restore logic (window/group/tab).
- Confirmation UX + progress/partial failure reporting.

## Phase 5: Hardening + Release
- Performance and quota strategy.
- Accessibility + keyboard navigation.
- Test plan execution + release checklist.
