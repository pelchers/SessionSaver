import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OPTIONS_URL = "/src/options/index.html#/";

async function screenshot(page: Page, storySlug: string, fileName: string): Promise<void> {
  const outputPath = `user_stories/${storySlug}/validation/${fileName}`;
  mkdirSync(dirname(outputPath), { recursive: true });
  await page.screenshot({ path: outputPath, fullPage: true });
}

async function installMockExtensionRuntime(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const clone = (value: unknown): any => JSON.parse(JSON.stringify(value));

    const summarizeSession = (session: any) => {
      let groupCount = 0;
      let tabCount = 0;
      for (const windowData of session.windows) {
        groupCount += windowData.groups.length;
        for (const group of windowData.groups) tabCount += group.tabs.length;
        tabCount += windowData.ungroupedTabs.length;
      }

      return {
        id: session.id,
        name: session.name,
        description: session.description,
        favorite: session.favorite,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        windowCount: session.windows.length,
        groupCount,
        tabCount
      };
    };

    const makeWindowsFixture = () => [
      {
        index: 0,
        focused: true,
        groups: [
          {
            title: "Research",
            color: "blue",
            collapsed: false,
            tabs: [
              { url: "https://example.com/spec", title: "Spec", pinned: false, active: true },
              { url: "https://example.com/roadmap", title: "Roadmap", pinned: false, active: false }
            ]
          }
        ],
        ungroupedTabs: [
          { url: "https://example.com/mail", title: "Mail", pinned: true, active: false },
          { url: "chrome://settings", title: "Settings", pinned: false, active: false, restricted: true }
        ]
      },
      {
        index: 1,
        focused: false,
        groups: [],
        ungroupedTabs: [{ url: "https://news.ycombinator.com", title: "HN", pinned: false, active: true }]
      }
    ];

    const now = () => new Date().toISOString();

    const state: {
      sessionsById: Record<string, any>;
      sessionsIndex: any[];
      saveCounter: number;
    } = {
      sessionsById: {},
      sessionsIndex: [],
      saveCounter: 0
    };

    const seedSession = (name: string, description: string) => {
      const id = `seed-${Object.keys(state.sessionsById).length + 1}`;
      const createdAt = now();
      const session = {
        id,
        name,
        description,
        favorite: false,
        createdAt,
        updatedAt: createdAt,
        windows: makeWindowsFixture()
      };
      state.sessionsById[id] = session;
      state.sessionsIndex = [summarizeSession(session), ...state.sessionsIndex];
      return id;
    };

    const primarySessionId = seedSession("Baseline Session", "Imported from fixture.");
    seedSession("Archive Session", "Legacy snapshot.");

    let confirmQueue: boolean[] = [];
    (window as any).__setConfirmResponses = (responses: boolean[]) => {
      confirmQueue = Array.isArray(responses) ? responses.slice() : [];
    };
    window.confirm = () => (confirmQueue.length ? Boolean(confirmQueue.shift()) : true);

    const sendResponse = (callback: (res: unknown) => void, result: unknown) => {
      Promise.resolve().then(() => callback(clone(result)));
    };

    const handleRequest = (req: any) => {
      switch (req?.type) {
        case "PING":
          return { ok: true, ts: now() };
        case "GET_SESSIONS_INDEX":
          return { ok: true, sessions: clone(state.sessionsIndex) };
        case "GET_SESSION": {
          const session = state.sessionsById[req.id];
          if (!session) return { ok: false, error: "session_not_found" };
          return { ok: true, session: clone(session) };
        }
        case "SAVE_SESSION": {
          const name = String(req.name ?? "").trim();
          if (!name) return { ok: false, error: "Session name is required." };
          state.saveCounter += 1;
          const timestamp = now();
          const session = {
            id: `saved-${state.saveCounter}`,
            name,
            description: String(req.description ?? "").trim(),
            favorite: false,
            createdAt: timestamp,
            updatedAt: timestamp,
            windows: makeWindowsFixture()
          };
          state.sessionsById[session.id] = session;
          const summary = summarizeSession(session);
          state.sessionsIndex = [summary, ...state.sessionsIndex.filter((s) => s.id !== session.id)];
          return { ok: true, summary };
        }
        case "UPDATE_SESSION_META": {
          const session = state.sessionsById[req.id];
          if (!session) return { ok: false, error: "session_not_found" };
          const patch = req.patch ?? {};
          if (typeof patch.name === "string") {
            const trimmed = patch.name.trim();
            if (!trimmed) return { ok: false, error: "Session name is required." };
            session.name = trimmed;
          }
          if (typeof patch.description === "string") session.description = patch.description;
          if (typeof patch.favorite === "boolean") session.favorite = patch.favorite;
          session.updatedAt = now();
          const summary = summarizeSession(session);
          state.sessionsIndex = state.sessionsIndex.map((s) => (s.id === req.id ? summary : s));
          return { ok: true, summary };
        }
        case "DELETE_SESSION": {
          delete state.sessionsById[req.id];
          state.sessionsIndex = state.sessionsIndex.filter((s) => s.id !== req.id);
          return { ok: true };
        }
        case "RESTORE_SESSION":
          return {
            ok: true,
            report: {
              createdWindows: 2,
              createdGroups: 1,
              createdTabs: 4,
              skippedTabs: 1,
              skippedReasons: ['Skipped tab "Settings" (chrome://settings): restricted_or_invalid_url'],
              warnings: []
            }
          };
        case "RESTORE_SELECTION": {
          const kind = req.target?.kind ?? "unknown";
          return {
            ok: true,
            report: {
              createdWindows: 1,
              createdGroups: kind === "group" ? 1 : 0,
              createdTabs: kind === "tab" ? 1 : 2,
              skippedTabs: 0,
              skippedReasons: [],
              warnings: []
            }
          };
        }
        default:
          return { ok: false, error: "unhandled_message" };
      }
    };

    (window as any).chrome = {
      runtime: {
        sendMessage: (req: unknown, callback: (res: unknown) => void) => {
          const result = handleRequest(req);
          sendResponse(callback, result);
          return true;
        }
      },
      __seedSessionId: primarySessionId
    };
  });
}

test.beforeEach(async ({ page }) => {
  await installMockExtensionRuntime(page);
  await page.goto(OPTIONS_URL);
});

test("save-session story + weird empty name behavior", async ({ page }) => {
  await page.getByRole("button", { name: "Save Current Session" }).click();
  const saveDialog = page.getByRole("dialog");
  await saveDialog.getByLabel("Name").fill("   ");
  await saveDialog.getByRole("button", { name: "Save Session" }).click();
  await expect(page.getByText("Session name is required.")).toBeVisible();
  await screenshot(page, "save-session", "01-empty-name-error.png");

  await saveDialog.getByLabel("Name").fill("Quarterly Review");
  await saveDialog.getByLabel("Description").fill("Q1 tabs for reporting");
  await saveDialog.getByRole("button", { name: "Save Session" }).click();
  await expect(page.getByRole("link", { name: "Quarterly Review" })).toBeVisible();
  await screenshot(page, "save-session", "02-session-saved.png");
});

test("browse-library story", async ({ page }) => {
  await page.getByLabel("Sort").selectOption("name_asc");
  await page.getByRole("checkbox", { name: "Favorites only" }).check();
  await expect(page.getByText("No favorite sessions")).toBeVisible();
  await screenshot(page, "browse-library", "01-favorites-empty-state.png");

  await page.getByRole("checkbox", { name: "Favorites only" }).uncheck();
  await expect(page.getByRole("link", { name: "Archive Session" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Baseline Session" })).toBeVisible();
  await screenshot(page, "browse-library", "02-library-sorted-by-name.png");
});

test("favorite-session story", async ({ page }) => {
  const baselineRow = page.locator("tr", { has: page.getByRole("link", { name: "Baseline Session" }) });
  await baselineRow.getByRole("button", { name: "Favorite" }).click();
  await expect(baselineRow.getByRole("button", { name: "Unfavorite" })).toBeVisible();
  await screenshot(page, "favorite-session", "01-session-favorited.png");
});

test("edit-metadata story with unusual input behavior", async ({ page }) => {
  await page.getByRole("link", { name: "Baseline Session" }).click();
  await expect(page.getByRole("heading", { name: "Metadata" })).toBeVisible();

  await page.getByLabel("Name").fill("  Baseline Session Renamed  ");
  await page.getByLabel("Description").fill("Line 1\nLine 2 with symbols: <> [] {}");
  await page.getByRole("button", { name: "Save Metadata" }).click();
  await expect(page.getByText("Metadata updated.")).toBeVisible();
  await expect(page.getByLabel("Name")).toHaveValue("Baseline Session Renamed");
  await screenshot(page, "edit-metadata", "01-metadata-updated.png");
});

test("view-session-tree story", async ({ page }) => {
  await page.getByRole("link", { name: "Baseline Session" }).click();
  await expect(page.getByText("Explorer Tree")).toBeVisible();
  await expect(page.getByRole("button", { name: "Window 1 (4 tabs)" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Group 1: Research (2 tabs)" })).toBeVisible();
  await screenshot(page, "view-session-tree", "01-tree-visible.png");
});

test("restore-full-session story", async ({ page }) => {
  await page.getByRole("link", { name: "Baseline Session" }).click();
  await page.getByRole("button", { name: "Restore Full Session" }).click();
  await expect(page.getByText(/Restore complete/)).toBeVisible();
  await screenshot(page, "restore-full-session", "01-full-restore-report.png");
});

test("restore-selection story", async ({ page }) => {
  await page.getByRole("link", { name: "Baseline Session" }).click();
  await page.getByRole("button", { name: "Group 1: Research (2 tabs)" }).click();
  await page.getByRole("button", { name: "Restore Selected" }).click();
  await expect(page.getByText(/Restore complete/)).toBeVisible();
  await screenshot(page, "restore-selection", "01-selected-restore-report.png");
});

test("delete-session story + weird cancel behavior", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).__setConfirmResponses([false, true]);
  });

  const baselineRow = page.locator("tr", { has: page.getByRole("link", { name: "Baseline Session" }) });
  await baselineRow.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("link", { name: "Baseline Session" })).toBeVisible();
  await screenshot(page, "delete-session", "01-delete-cancelled.png");

  await baselineRow.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("link", { name: "Baseline Session" })).toHaveCount(0);
  await screenshot(page, "delete-session", "02-delete-confirmed.png");
});

test("weird navigation behavior: unknown session id", async ({ page }) => {
  await page.goto("/src/options/index.html#/session/not-real");
  await expect(page.getByText("session_not_found")).toBeVisible();
  await screenshot(page, "view-session-tree", "02-missing-session-error.png");
});
