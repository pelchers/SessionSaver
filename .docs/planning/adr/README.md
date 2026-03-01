# ADR Phase Planning (Preplanning Location)

This project uses the `.codex/templates/adr` phased planning method, but during preplanning we keep artifacts in `.docs/planning/adr` (not in `.adr/orchestration`).

## Structure

```
.docs/planning/adr/
  README.md
  session-explorer/
    prd.md
    primary_task_list.md
    technical_requirements.md
    notes.md
  current/
    session-explorer/
      phase_1.md
      phase_2.md
      phase_3.md
      phase_4.md
      phase_5.md
  history/
    session-explorer/
      README.md
```

## Workflow (High Level)

- Keep the canonical product planning docs in `.docs/planning/` (PRD, requirements, wireframes, backlog).
- Use phase files in `current/` to define execution objectives, tasks, deliverables, and validation gates.
- When a phase completes, move its phase file to `history/` and write a phase review.
