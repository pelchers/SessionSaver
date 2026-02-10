# Explorer Tree Spec

## Node Types

- Session (root, implicit on detail page)
- Window node
- Group node
- Ungrouped bucket node
- Tab node

## Labels

- Window: `Window 1`, `Window 2`, etc.
- Group:
  - `Tab Group: <title>` if title non-empty
  - `Tab Group: Untitled` if empty
  - Show color swatch if known
- Ungrouped: `Ungrouped Tabs`
- Tab:
  - Primary: tab title (fallback to URL)
  - Secondary: URL (truncated)
  - Optional favicon

## Ordering

- Windows: snapshot order.
- Within a window:
  - Groups in snapshot order.
  - Ungrouped bucket at end (or configurable; pick one and keep consistent).
- Tabs inside group/ungrouped:
  - snapshot order.

## Selection Model

- Exactly one selected node at a time.
- Selecting a node updates available restore action in action panel:
  - Window node: “Restore this window”
  - Group node: “Restore this group”
  - Tab node: “Restore this tab”
  - Ungrouped bucket: “Restore these tabs”

## Expand/Collapse Behavior

- Window and group nodes are collapsible.
- Default expand state:
  - Windows expanded
  - Groups collapsed (or expanded) decision; MVP default: collapsed for readability.

## Keyboard (Minimum)

- Up/Down: move selection among visible nodes.
- Left:
  - collapse expanded node OR move to parent if already collapsed
- Right:
  - expand collapsed node OR move to first child if expanded
- Enter:
  - if tab selected, optionally preview/open actions (MVP: no auto-open, only restore)

## Performance Notes

- Tree should handle:
  - many sessions with many nodes (detail view may reach thousands of tabs)
- Consider:
  - windowing/virtualization for tab lists
  - lazy render children only when expanded

## Accessibility Notes

- Use proper ARIA roles for tree widgets.
- Ensure focus ring and selection are distinct.
