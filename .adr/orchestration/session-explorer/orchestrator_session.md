# Orchestrator Session

Session: session-explorer
Date: 2026-02-10

## Phase handoff rules
- Each phase uses a fresh subagent.
- Each phase ends with a structured poke back to the orchestrator.

## Required artifacts per phase
- Phase plan in `.adr/current/session-explorer/`
- Phase review in `.adr/history/session-explorer/`
- Task list phase checkoff in `.adr/orchestration/session-explorer/primary_task_list.md`
- Commit + push

## Preplanning note

Planning artifacts that inform this orchestration live in `.docs/planning/`.
