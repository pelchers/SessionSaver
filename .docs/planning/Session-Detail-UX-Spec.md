# Session Detail UX Spec

## Layout

1. Header
- Breadcrumb: `Library / <name>`
- Editable session name (inline edit)
- Favorite toggle
- Metadata line: created/updated + counts

2. Description
- Multiline editor
- Save-on-blur + error banner on failure

3. Main content
- Left: Explorer tree
- Right (desktop): Action panel
- Bottom sticky (mobile): Restore actions for selected node + full restore button

## Actions

- Primary: `Restore Full Session`
- Contextual (selected node):
  - Restore window
  - Restore group
  - Restore tab
  - Restore ungrouped bucket
- Secondary:
  - Delete session (danger)

## Confirmation Rules

- Any restore shows confirmation dialog with accurate counts.
- Any delete requires confirmation.

## Feedback Rules

- Restore in progress:
  - disable restore buttons
  - show progress indicator (at least indeterminate)
- Restore outcome:
  - success toast
  - partial success toast + “view details”
  - failure banner + retry

## Responsive

- Desktop:
  - 2-column layout with sticky action panel
- Mobile:
  - tree full width
  - sticky bottom action bar

## Error States

- Session not found:
  - show “Back to library”
- Corrupt session:
  - show warning + delete option
