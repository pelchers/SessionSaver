# User Story Validation Template

## Story

- Title: View session tree
- Owner: product
- Role: As a user
- Goal: I want to drill into a session and see the hierarchy of windows, groups, and tabs
- Scope: MVP

## Steps

1) From the library, open an existing session.
2) Expand Window nodes.
3) Expand Tab Group nodes.
4) Select a tab node.

## Expected Results

- Tree shows windows -> groups -> tabs (plus ungrouped bucket).
- Expand/collapse works.
- Selection updates the restore action label/scope correctly.

## Edge Cases

- Missing session id route shows a clear not-found error.
- Windows with zero groups still render an `Ungrouped` branch.
- Very long tab titles remain selectable via tooltip/title attribute.

## Evidence

- Screenshots: /user_stories/view-session-tree/validation/
- Notes: validation.md
