# Failure Reporting Spec

## Goals

- Make failures actionable and non-scary.
- Distinguish:
  - skipped by design (restricted URL)
  - failed due to API error
  - partial fidelity (group not recreated but tabs restored)

## Error Model (Conceptual)

```ts
type RestoreOutcome = {
  requested: { windows: number; groups: number; tabs: number };
  opened: { windows: number; groups: number; tabs: number };
  skipped: RestoreIssue[];
  failed: RestoreIssue[];
  warnings: RestoreIssue[];
};

type RestoreIssue = {
  kind: "restricted_url" | "invalid_url" | "api_error" | "group_failed" | "tab_failed";
  message: string;
  context?: {
    sessionId?: string;
    windowIndex?: number;
    groupTitle?: string;
    tabUrl?: string;
  };
};
```

## UX Messaging Patterns

- Success:
  - `Restored successfully` with counts if helpful.
- Partial:
  - `Restored with issues` + summary `2 skipped, 1 warning`
  - Link/button: `View details`
- Failure:
  - `Restore failed` + short reason + `Retry`

## Detail View for Issues

- Collapsible list grouped by:
  - Skipped
  - Failed
  - Warnings
- Each item shows:
  - short message
  - URL (when relevant)
  - context (window/group)

## Logging (Local)

- Store last restore outcome per session for debugging UX.
- No external telemetry in v1.
