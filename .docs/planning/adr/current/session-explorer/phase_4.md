# Phase Plan

Phase: phase_4
Session: session-explorer
Date: 2026-02-10
Owner: codex
Status: planned

## Objectives
- Specify restore semantics (full + selective) and rate limiting.
- Define user feedback (progress, partial failures) and reporting.

## Task checklist
- [ ] Add `Restore-Spec.md` (algorithms, ordering, group recreation rules).
- [ ] Add `Failure-Reporting-Spec.md` (error model, UI messaging).

## Deliverables
- `.docs/planning/Restore-Spec.md`
- `.docs/planning/Failure-Reporting-Spec.md`

## Validation checklist
- [ ] Restore is best-effort and never silently drops items.
- [ ] Confirmation shows accurate counts for selected scope.

## Risks / blockers
- Chrome limitations for certain schemes and tabs.

## Notes
- Consider staggered restore for large sessions.
