# PRD Overview: Session Explorer for Chrome Tabs

## Product Vision

Create a Chrome extension that lets users manage saved tab sessions in a familiar, Google Drive-like interface. Users browse sessions as if they are folders, then drill into a VS Code-style tree of:

1. Chrome window
2. Tab groups inside each window
3. Tabs inside each group (and ungrouped tabs)

The product helps users preserve context, find past research quickly, and restart complex work without manually rebuilding browser state.

## Problem Statement

Power users often keep many windows and tab groups for different projects. Existing session tools usually show flat lists, making it hard to understand structure or recover specific tabs. Users need:

- A visual hierarchy for sessions
- Quick metadata (name, description, favorite)
- Fast restore and selective restore options

## Goals

- Save and browse sessions in a folder-like library view.
- Show full session hierarchy (windows -> groups -> tabs).
- Allow users to name sessions, mark favorites, and add descriptions.
- Make restore actions clear, safe, and fast.

## Non-Goals (v1)

- Cross-browser sync beyond Chrome.
- Real-time collaboration/shared libraries.
- Full cloud backup service.
- Deep tab content indexing/search inside page body.

## Target Users

- Researchers and students with multi-window workflows.
- Developers and PMs juggling project contexts.
- Operations/power users with persistent tab-group habits.

## Core UX Concept

- Home/library screen resembles Drive list/grid of saved sessions.
- Each session card/row displays:
  - Name
  - Favorite state
  - Description preview
  - Created/updated time
  - Window/tab counts
- Clicking a session opens details with an explorer-style tree.

## Success Metrics

- Session save success rate >= 99%.
- Restore success rate >= 98%.
- >= 50% of active users use favorites or descriptions.
- Median time to restore a specific tab from a saved session < 20 seconds.

## MVP Scope

- Save current browser state as a named session.
- Browse sessions in list view.
- Open session details tree.
- Favorite/unfavorite session.
- Add/edit description.
- Restore full session and selective branches (window/group/tab).
- Local persistence using Chrome extension storage.
