import { chromePromise, chromePromiseVoid } from "./chromeAsync";
import { isRestrictedUrl } from "./restrictedUrl";
import type { RestoreReportV1, RestoreTargetV1, SavedGroupV1, SavedSessionV1, SavedTabV1, SavedWindowV1 } from "./types";

type PlanTab = {
  url: string;
  pinned: boolean;
  active: boolean;
};

type PlanGroup = {
  title: string;
  color?: string;
  collapsed?: boolean;
  tabs: PlanTab[];
};

type PlanWindow = {
  groups: PlanGroup[];
  ungroupedTabs: PlanTab[];
};

export type RestorePlan = {
  windows: PlanWindow[];
  skippedTabs: number;
  skippedReasons: string[];
  warnings: string[];
};

function emptyReport(): RestoreReportV1 {
  return {
    createdWindows: 0,
    createdGroups: 0,
    createdTabs: 0,
    skippedTabs: 0,
    skippedReasons: [],
    warnings: []
  };
}

function isRestorableUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (isRestrictedUrl(trimmed)) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function toPlanTab(tab: SavedTabV1, out: RestorePlan): PlanTab | null {
  if (!isRestorableUrl(tab.url)) {
    out.skippedTabs += 1;
    out.skippedReasons.push(`Skipped tab "${tab.title}" (${tab.url || "empty_url"}): restricted_or_invalid_url`);
    return null;
  }

  return {
    url: tab.url.trim(),
    pinned: Boolean(tab.pinned),
    active: Boolean(tab.active)
  };
}

function collectGroup(group: SavedGroupV1, out: RestorePlan): PlanGroup | null {
  const tabs: PlanTab[] = [];
  for (const tab of group.tabs) {
    const planned = toPlanTab(tab, out);
    if (planned) tabs.push(planned);
  }
  if (tabs.length === 0) return null;

  return {
    title: group.title,
    color: group.color,
    collapsed: group.collapsed,
    tabs
  };
}

function collectWindow(source: SavedWindowV1, out: RestorePlan): PlanWindow | null {
  const groups: PlanGroup[] = [];
  const ungroupedTabs: PlanTab[] = [];

  for (const group of source.groups) {
    const planned = collectGroup(group, out);
    if (planned) groups.push(planned);
  }
  for (const tab of source.ungroupedTabs) {
    const planned = toPlanTab(tab, out);
    if (planned) ungroupedTabs.push(planned);
  }

  if (groups.length === 0 && ungroupedTabs.length === 0) return null;
  return { groups, ungroupedTabs };
}

function selectWindows(session: SavedSessionV1, target: RestoreTargetV1): SavedWindowV1[] {
  switch (target.kind) {
    case "session":
      return session.windows.slice();
    case "window":
      return session.windows[target.windowIndex] ? [session.windows[target.windowIndex]] : [];
    case "group":
    case "ungrouped":
    case "tab":
      return session.windows[target.windowIndex] ? [session.windows[target.windowIndex]] : [];
    default:
      return [];
  }
}

export function buildRestorePlan(session: SavedSessionV1, target: RestoreTargetV1): RestorePlan {
  const plan: RestorePlan = {
    windows: [],
    skippedTabs: 0,
    skippedReasons: [],
    warnings: []
  };

  const selectedWindows = selectWindows(session, target);
  if (selectedWindows.length === 0) {
    plan.warnings.push("No matching restore target.");
    return plan;
  }

  if (target.kind === "session" || target.kind === "window") {
    for (const sourceWindow of selectedWindows) {
      const plannedWindow = collectWindow(sourceWindow, plan);
      if (plannedWindow) plan.windows.push(plannedWindow);
    }
    if (plan.windows.length === 0) plan.warnings.push("No restorable tabs were found.");
    return plan;
  }

  const sourceWindow = selectedWindows[0];
  if (!sourceWindow) {
    plan.warnings.push("No matching restore target.");
    return plan;
  }

  if (target.kind === "group") {
    const sourceGroup = sourceWindow.groups[target.groupIndex];
    if (!sourceGroup) {
      plan.warnings.push("Selected group does not exist.");
      return plan;
    }
    const group = collectGroup(sourceGroup, plan);
    if (!group) {
      plan.warnings.push("Selected group has no restorable tabs.");
      return plan;
    }
    plan.windows.push({ groups: [group], ungroupedTabs: [] });
    return plan;
  }

  if (target.kind === "ungrouped") {
    const tabs: PlanTab[] = [];
    for (const tab of sourceWindow.ungroupedTabs) {
      const planned = toPlanTab(tab, plan);
      if (planned) tabs.push(planned);
    }
    if (tabs.length === 0) {
      plan.warnings.push("Selected ungrouped section has no restorable tabs.");
      return plan;
    }
    plan.windows.push({ groups: [], ungroupedTabs: tabs });
    return plan;
  }

  let sourceTab: SavedTabV1 | undefined;
  if (target.groupIndex === null) {
    sourceTab = sourceWindow.ungroupedTabs[target.tabIndex];
  } else {
    sourceTab = sourceWindow.groups[target.groupIndex]?.tabs[target.tabIndex];
  }
  if (!sourceTab) {
    plan.warnings.push("Selected tab does not exist.");
    return plan;
  }
  const tab = toPlanTab(sourceTab, plan);
  if (!tab) {
    plan.warnings.push("Selected tab is not restorable.");
    return plan;
  }
  plan.windows.push({ groups: [], ungroupedTabs: [tab] });
  return plan;
}

async function createWindowWithTabs(windowPlan: PlanWindow, report: RestoreReportV1): Promise<void> {
  const orderedTabs: PlanTab[] = [];
  const groupedTabRanges: { group: PlanGroup; startIndex: number; endIndex: number }[] = [];

  for (const group of windowPlan.groups) {
    const startIndex = orderedTabs.length;
    orderedTabs.push(...group.tabs);
    const endIndex = orderedTabs.length - 1;
    groupedTabRanges.push({ group, startIndex, endIndex });
  }
  orderedTabs.push(...windowPlan.ungroupedTabs);

  if (orderedTabs.length === 0) {
    report.warnings.push("Skipped empty restore window plan.");
    return;
  }

  const first = orderedTabs[0];
  const createdWindow = await chromePromise<chrome.windows.Window>((cb) =>
    chrome.windows.create({ url: first.url }, cb)
  );
  const windowId = createdWindow.id;
  if (typeof windowId !== "number") {
    report.warnings.push("Window creation did not return window id.");
    return;
  }

  report.createdWindows += 1;
  const tabIds: number[] = [];
  const initialTabId = createdWindow.tabs?.[0]?.id;
  if (typeof initialTabId === "number") {
    tabIds.push(initialTabId);
    report.createdTabs += 1;
    if (first.pinned) {
      await chromePromiseVoid((cb) => chrome.tabs.update(initialTabId, { pinned: true }, cb));
    }
  }

  for (let i = 1; i < orderedTabs.length; i++) {
    const tab = orderedTabs[i];
    const createdTab = await chromePromise<chrome.tabs.Tab>((cb) =>
      chrome.tabs.create({ windowId, url: tab.url, active: false, pinned: tab.pinned }, cb)
    );
    if (typeof createdTab.id === "number") {
      tabIds.push(createdTab.id);
      report.createdTabs += 1;
    } else {
      report.warnings.push(`Tab creation succeeded without tab id for ${tab.url}`);
    }
  }

  for (const range of groupedTabRanges) {
    const groupTabIds = tabIds.slice(range.startIndex, range.endIndex + 1).filter((id) => typeof id === "number");
    if (groupTabIds.length < 2) {
      continue;
    }

    const groupId = await chromePromise<number>((cb) => chrome.tabs.group({ tabIds: groupTabIds }, cb));
    report.createdGroups += 1;

    const update: chrome.tabGroups.UpdateProperties = {};
    if (range.group.title) update.title = range.group.title;
    if (range.group.color) update.color = range.group.color as chrome.tabGroups.ColorEnum;
    if (typeof range.group.collapsed === "boolean") update.collapsed = range.group.collapsed;
    await chromePromiseVoid((cb) => chrome.tabGroups.update(groupId, update, cb));
  }

  const activeIndex = orderedTabs.findIndex((t) => t.active);
  if (activeIndex >= 0 && typeof tabIds[activeIndex] === "number") {
    await chromePromiseVoid((cb) => chrome.tabs.update(tabIds[activeIndex], { active: true }, cb));
  }
}

export async function restoreSession(
  session: SavedSessionV1,
  target: RestoreTargetV1 = { kind: "session" }
): Promise<RestoreReportV1> {
  const report = emptyReport();
  const plan = buildRestorePlan(session, target);
  report.skippedTabs = plan.skippedTabs;
  report.skippedReasons = plan.skippedReasons.slice();
  report.warnings = plan.warnings.slice();

  for (const windowPlan of plan.windows) {
    try {
      await createWindowWithTabs(windowPlan, report);
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown_restore_error";
      report.warnings.push(`Restore window failed: ${message}`);
    }
  }

  return report;
}
