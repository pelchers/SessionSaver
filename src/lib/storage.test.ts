import { describe, expect, it } from "vitest";
import { summarizeSession } from "./storage";
import type { SavedSessionV1 } from "./types";

function makeSession(): SavedSessionV1 {
  return {
    id: "s1",
    name: "Work stack",
    description: "",
    favorite: false,
    createdAt: "2026-02-13T00:00:00.000Z",
    updatedAt: "2026-02-13T00:00:00.000Z",
    windows: [
      {
        index: 0,
        groups: [
          {
            title: "Docs",
            tabs: [
              {
                url: "https://example.com/docs",
                title: "Docs",
                pinned: false,
                active: true
              },
              {
                url: "https://example.com/spec",
                title: "Spec",
                pinned: true,
                active: false
              }
            ]
          }
        ],
        ungroupedTabs: [
          {
            url: "https://example.com/mail",
            title: "Mail",
            pinned: false,
            active: false
          }
        ]
      },
      {
        index: 1,
        groups: [],
        ungroupedTabs: []
      }
    ]
  };
}

describe("summarizeSession", () => {
  it("computes window/group/tab counts", () => {
    const summary = summarizeSession(makeSession());
    expect(summary.windowCount).toBe(2);
    expect(summary.groupCount).toBe(1);
    expect(summary.tabCount).toBe(3);
  });

  it("handles an empty snapshot", () => {
    const session = makeSession();
    session.windows = [];
    const summary = summarizeSession(session);
    expect(summary.windowCount).toBe(0);
    expect(summary.groupCount).toBe(0);
    expect(summary.tabCount).toBe(0);
  });
});
