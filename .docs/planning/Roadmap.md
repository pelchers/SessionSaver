# Roadmap

## Phase 0: Foundation

- Confirm scope and acceptance criteria.
- Define data schema and storage adapter.
- Set up extension page shell and baseline state management.

Deliverable:
- Technical baseline with stubbed library/detail pages.

## Phase 1: Core Session Capture and Library

- Implement save session action.
- Persist sessions in local storage.
- Render library list with metadata fields.
- Add rename, favorite, and description edit support.

Deliverable:
- Users can create and organize sessions in a Drive-like list.

## Phase 2: Explorer Tree + Restore

- Build session detail tree view (window/group/tab).
- Add expand/collapse behavior.
- Implement full restore.
- Implement selective restore for window/group/tab.

Deliverable:
- End-to-end value loop: save -> browse -> restore.

## Phase 3: Hardening and UX Refinement

- Improve performance for large sessions.
- Add better error reporting and recoverability.
- Polish accessibility and keyboard support.
- Add import/export JSON backup (optional stretch for v1.1).

Deliverable:
- Stable release candidate for real workflows.

## Release Readiness Checklist

- Functional regression pass complete.
- Performance targets validated with large datasets.
- Data migration strategy defined for future schema changes.
- Privacy and permissions review complete.
