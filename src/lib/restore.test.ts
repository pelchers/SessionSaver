import { describe, expect, it } from "vitest";
import { buildRestorePlan } from "./restore";
import type { SavedSessionV1 } from "./types";

function makeSession(): SavedSessionV1 {
  return {
    id: "session-1",
    name: "Validation Session",
    description: "fixture",
    favorite: false,
    createdAt: "2026-02-13T00:00:00.000Z",
    updatedAt: "2026-02-13T00:00:00.000Z",
    windows: [
      {
        index: 0,
        groups: [
          {
            title: "Research",
            tabs: [
              { url: "https://example.com/a", title: "A", pinned: false, active: true },
              { url: "chrome://settings", title: "Settings", pinned: false, active: false, restricted: true }
            ]
          }
        ],
        ungroupedTabs: [
          { url: "https://example.com/b", title: "B", pinned: true, active: false },
          { url: " not a url ", title: "Bad URL", pinned: false, active: false }
        ]
      },
      {
        index: 1,
        groups: [],
        ungroupedTabs: [{ url: "https://example.com/c", title: "C", pinned: false, active: true }]
      }
    ]
  };
}

describe("buildRestorePlan", () => {
  it("restores session while skipping restricted/invalid tabs", () => {
    const plan = buildRestorePlan(makeSession(), { kind: "session" });
    expect(plan.windows).toHaveLength(2);
    expect(plan.windows[0]?.groups[0]?.tabs).toHaveLength(1);
    expect(plan.windows[0]?.ungroupedTabs).toHaveLength(1);
    expect(plan.windows[1]?.ungroupedTabs).toHaveLength(1);
    expect(plan.skippedTabs).toBe(2);
    expect(plan.skippedReasons.length).toBe(2);
  });

  it("builds a group-scoped plan", () => {
    const plan = buildRestorePlan(makeSession(), { kind: "group", windowIndex: 0, groupIndex: 0 });
    expect(plan.windows).toHaveLength(1);
    expect(plan.windows[0]?.groups).toHaveLength(1);
    expect(plan.windows[0]?.groups[0]?.tabs).toHaveLength(1);
    expect(plan.windows[0]?.ungroupedTabs).toHaveLength(0);
  });

  it("returns warning for unknown node selections", () => {
    const plan = buildRestorePlan(makeSession(), { kind: "tab", windowIndex: 999, groupIndex: null, tabIndex: 0 });
    expect(plan.windows).toHaveLength(0);
    expect(plan.warnings).toContain("No matching restore target.");
  });

  it("returns warning for non-restorable single tab selection", () => {
    const plan = buildRestorePlan(makeSession(), { kind: "tab", windowIndex: 0, groupIndex: null, tabIndex: 1 });
    expect(plan.windows).toHaveLength(0);
    expect(plan.warnings).toContain("Selected tab is not restorable.");
    expect(plan.skippedTabs).toBe(1);
  });
});
