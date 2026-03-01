# Notes

## Decisions

- MVP is local-only (no sync, no telemetry).
- Restore is best-effort and must report skipped/failed items explicitly.

Pending decisions:
- Save policy: always-new vs overwrite existing session.
- Search: post-MVP vs MVP.
- Restore target: always new windows vs allow restore into current window.
- Incognito support policy.

## Constraints

- MV3 service worker can suspend; plan for short-lived orchestration steps.
- Certain URLs cannot be restored by an extension.
- Storage quotas may limit large session libraries.

## Open questions

- Should we store tab favicon URLs or compute them on demand?
- Should “Favorites first” be its own sort or a filter + secondary sort?
- What is the smallest set of permissions we can ship with while meeting requirements?

## References (local docs)

- `.docs/planning/README.md`
- `.docs/planning/Implementation-Backlog.md`
- `.docs/planning/Data-Model-and-Migrations.md`
- `.docs/planning/Restore-Spec.md`
