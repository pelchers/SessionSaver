import { chromePromise } from "./chromeAsync";
import { isRestrictedUrl } from "./restrictedUrl";
import type { SavedGroupV1, SavedTabV1, SavedWindowV1 } from "./types";

type GroupBuild = {
  groupId: number;
  title: string;
  color?: string;
  collapsed?: boolean;
  minTabIndex: number;
  tabs: SavedTabV1[];
};

export async function captureCurrentWindows(): Promise<SavedWindowV1[]> {
  const windows = await chromePromise<chrome.windows.Window[]>((cb) =>
    chrome.windows.getAll({ populate: true, windowTypes: ["normal"] }, cb)
  );

  const out: SavedWindowV1[] = [];
  for (let wi = 0; wi < windows.length; wi++) {
    const w = windows[wi];
    const windowId = w.id;
    const tabs = (w.tabs ?? []).slice().sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

    const groupsMeta = windowId
      ? await chromePromise<chrome.tabGroups.TabGroup[]>((cb) => chrome.tabGroups.query({ windowId }, cb))
      : [];
    const metaById = new Map<number, chrome.tabGroups.TabGroup>();
    for (const g of groupsMeta) metaById.set(g.id, g);

    const groupsById = new Map<number, GroupBuild>();
    const ungroupedTabs: SavedTabV1[] = [];

    for (const t of tabs) {
      const url = t.url ?? "";
      const saved: SavedTabV1 = {
        url,
        title: t.title ?? url,
        favIconUrl: t.favIconUrl ?? undefined,
        pinned: Boolean(t.pinned),
        active: Boolean(t.active),
        restricted: isRestrictedUrl(url)
      };

      const gid = t.groupId ?? -1;
      if (gid === -1) {
        ungroupedTabs.push(saved);
        continue;
      }

      let gb = groupsById.get(gid);
      if (!gb) {
        const meta = metaById.get(gid);
        gb = {
          groupId: gid,
          title: meta?.title ?? "",
          color: meta?.color ?? undefined,
          collapsed: meta?.collapsed ?? undefined,
          minTabIndex: t.index ?? 0,
          tabs: []
        };
        groupsById.set(gid, gb);
      }

      gb.minTabIndex = Math.min(gb.minTabIndex, t.index ?? 0);
      gb.tabs.push(saved);
    }

    const groups: SavedGroupV1[] = Array.from(groupsById.values())
      .sort((a, b) => a.minTabIndex - b.minTabIndex)
      .map<SavedGroupV1>((g) => ({
        title: g.title,
        color: g.color,
        collapsed: g.collapsed,
        tabs: g.tabs
      }));

    out.push({
      index: wi,
      focused: Boolean(w.focused),
      groups,
      ungroupedTabs
    });
  }

  return out;
}

