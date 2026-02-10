# User Flows

## Flow 1: Save Current Session

1. User clicks extension icon and selects `Save Session`.
2. Modal opens with suggested name and optional description field.
3. User confirms save.
4. System captures current windows, groups, and tabs.
5. Session appears at top of library (sorted by updated date).

Acceptance criteria:
- Save succeeds with one click after naming.
- Saved session appears immediately without manual refresh.

## Flow 2: Browse and Inspect Session

1. User opens extension home/library view.
2. User selects a session row/card.
3. Detail view opens with explorer tree.
4. User expands window node, then group node, then tab nodes.

Acceptance criteria:
- Hierarchy is accurate to snapshot structure.
- Expand/collapse state responds with minimal delay.

## Flow 3: Favorite and Describe Session

1. User toggles favorite icon on a session.
2. User edits description in details pane or inline editor.
3. System saves metadata instantly.

Acceptance criteria:
- Favorite state persists across reopen/reload.
- Description updates are reflected in library preview.

## Flow 4: Restore Session

1. User opens session detail.
2. User clicks `Restore Full Session` or contextual restore on a node.
3. Confirmation appears with expected number of windows/tabs.
4. On confirm, system restores selected scope.
5. Completion toast shows success and any partial failures.

Acceptance criteria:
- Full restore recreates window/group/tab structure as closely as possible.
- Partial restore only restores selected branch.

## Flow 5: Delete Session

1. User chooses delete from session actions menu.
2. Confirmation dialog appears.
3. User confirms delete.
4. Session is removed from storage and library list.

Acceptance criteria:
- No delete without explicit confirmation.
- Deleted session is not restorable unless future undo feature is added.
