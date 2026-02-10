# Data Model and Migrations

## Principles

- Store enough to:
  - Render library metadata quickly.
  - Render explorer tree with fidelity.
  - Restore structure best-effort.
- Version everything to allow schema changes without breaking existing users.

## Storage Layout (Conceptual)

- `schemaVersion`: number
- `sessionsIndex`: array of session summaries for fast library render
- `sessionsById`: map of session ID -> full session payload

Rationale:
- Index allows library to render without loading every tree.
- Details payload stays separate to reduce read/write churn.

## IDs and Ordering

- Session IDs: stable GUID/ULID-style strings.
- Window ordering: preserve snapshot order.
- Tab ordering: preserve within-group order; preserve ungrouped ordering.

## Schema v1 (Proposed)

```ts
type SchemaRootV1 = {
  schemaVersion: 1;
  sessionsIndex: SessionSummaryV1[];
  sessionsById: Record<string, SavedSessionV1>;
};

type SessionSummaryV1 = {
  id: string;
  name: string;
  description: string;
  favorite: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  windowCount: number;
  groupCount: number;
  tabCount: number;
};

type SavedSessionV1 = {
  id: string;
  name: string;
  description: string;
  favorite: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  windows: SavedWindowV1[];
};

type SavedWindowV1 = {
  index: number;
  focused?: boolean; // snapshot hint only
  groups: SavedGroupV1[];
  ungroupedTabs: SavedTabV1[];
};

type SavedGroupV1 = {
  title: string;      // may be empty/untitled
  color?: string;     // store as string enum (Chrome color)
  collapsed?: boolean;
  tabs: SavedTabV1[];
};

type SavedTabV1 = {
  url: string;
  title: string;
  favIconUrl?: string;
  pinned: boolean;
  active: boolean;
  audible?: boolean;
  discarded?: boolean;
  restricted?: boolean; // computed on capture (see Edge-Cases)
};
```

## Migration Strategy

- On extension load:
  - Read `schemaVersion`.
  - If missing: treat as v1 empty store.
  - If older: migrate forward in-place (transaction-like best effort).
  - If newer: show blocking error (extension too old).

## Forward Compatibility Rules

- New fields must be optional.
- Unknown fields should be preserved if possible.
- Never assume tab group fields are present.

## Data Validation

- Validate session object before persist.
- Validate URLs before restore planning.
- If corruption is detected:
  - Preserve raw payload.
  - Exclude broken session from library with visible “corrupt” indicator.
