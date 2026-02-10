# Accessibility Checklist

## Keyboard

- Can navigate library list and activate row with keyboard.
- Can navigate tree with arrow keys and expand/collapse.
- Can reach all controls (favorite toggle, menus, restore) via Tab.
- Modals trap focus and restore focus on close.

## Focus and States

- Visible focus indicator on all interactive elements.
- Selected tree node distinct from focused element.
- Disabled state visually clear and announced.

## Semantics

- Use proper headings for page structure.
- Library list uses table semantics (if table) or list semantics (if list).
- Tree uses appropriate ARIA roles and properties.
- Buttons have accessible names (including icon-only buttons).

## Contrast and Text

- Contrast meets baseline requirements for text/icons.
- Truncation provides full value via tooltip or accessible label.

## Announcements

- Toasts and banners are announced (ARIA live region).
- Restore progress and completion messages are perceivable.
