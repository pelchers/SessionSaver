import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isRestrictedUrl } from "../../../lib/restrictedUrl";
import type { RestoreReportV1, RestoreTargetV1, SavedSessionV1, SavedTabV1, SavedWindowV1 } from "../../../lib/types";
import { bgCall } from "../chromeRpc";

type TreeNode = {
  id: string;
  label: string;
  target: Exclude<RestoreTargetV1, { kind: "session" }>;
  children: TreeNode[];
};

type TabRef = {
  key: string;
  windowIndex: number;
  groupIndex: number | null;
  tabIndex: number;
  label: string;
  url: string;
  restricted: boolean;
};

type AddTarget =
  | { kind: "ungrouped"; windowIndex: number }
  | { kind: "group"; windowIndex: number; groupIndex: number };

function buildTree(session: SavedSessionV1): TreeNode[] {
  const nodes: TreeNode[] = [];
  session.windows.forEach((windowData, wi) => {
    const windowNode: TreeNode = {
      id: `w:${wi}`,
      label: `Window ${wi + 1} (${windowTabCount(windowData)} tabs)`,
      target: { kind: "window", windowIndex: wi },
      children: []
    };

    windowData.groups.forEach((group, gi) => {
      const groupNode: TreeNode = {
        id: `w:${wi}:g:${gi}`,
        label: `Group ${gi + 1}${group.title ? `: ${group.title}` : ""} (${group.tabs.length} tabs)`,
        target: { kind: "group", windowIndex: wi, groupIndex: gi },
        children: group.tabs.map((tab, ti) => ({
          id: `w:${wi}:g:${gi}:t:${ti}`,
          label: tab.title || tab.url || `Tab ${ti + 1}`,
          target: { kind: "tab", windowIndex: wi, groupIndex: gi, tabIndex: ti },
          children: []
        }))
      };
      windowNode.children.push(groupNode);
    });

    const ungroupedNode: TreeNode = {
      id: `w:${wi}:u`,
      label: `Ungrouped (${windowData.ungroupedTabs.length} tabs)`,
      target: { kind: "ungrouped", windowIndex: wi },
      children: windowData.ungroupedTabs.map((tab, ti) => ({
        id: `w:${wi}:u:t:${ti}`,
        label: tab.title || tab.url || `Tab ${ti + 1}`,
        target: { kind: "tab", windowIndex: wi, groupIndex: null, tabIndex: ti },
        children: []
      }))
    };
    windowNode.children.push(ungroupedNode);
    nodes.push(windowNode);
  });
  return nodes;
}

function flattenTabs(session: SavedSessionV1): TabRef[] {
  const refs: TabRef[] = [];
  session.windows.forEach((windowData, wi) => {
    windowData.groups.forEach((group, gi) => {
      group.tabs.forEach((tab, ti) => {
        refs.push({
          key: `w:${wi}:g:${gi}:t:${ti}`,
          windowIndex: wi,
          groupIndex: gi,
          tabIndex: ti,
          label: tab.title || tab.url || `Tab ${ti + 1}`,
          url: tab.url,
          restricted: Boolean(tab.restricted)
        });
      });
    });
    windowData.ungroupedTabs.forEach((tab, ti) => {
      refs.push({
        key: `w:${wi}:u:t:${ti}`,
        windowIndex: wi,
        groupIndex: null,
        tabIndex: ti,
        label: tab.title || tab.url || `Tab ${ti + 1}`,
        url: tab.url,
        restricted: Boolean(tab.restricted)
      });
    });
  });
  return refs;
}

function windowTabCount(windowData: SavedWindowV1): number {
  const groupTabCount = windowData.groups.reduce((sum, group) => sum + group.tabs.length, 0);
  return groupTabCount + windowData.ungroupedTabs.length;
}

function summarizeRestoreReport(report: RestoreReportV1): string {
  return `windows: ${report.createdWindows} | groups: ${report.createdGroups} | tabs: ${report.createdTabs} | skipped tabs: ${report.skippedTabs}`;
}

function selectedLabel(target: RestoreTargetV1 | null): string {
  if (!target) return "none";
  switch (target.kind) {
    case "session":
      return "full session";
    case "window":
      return `window ${target.windowIndex + 1}`;
    case "group":
      return `window ${target.windowIndex + 1} group ${target.groupIndex + 1}`;
    case "ungrouped":
      return `window ${target.windowIndex + 1} ungrouped tabs`;
    case "tab":
      return target.groupIndex === null
        ? `window ${target.windowIndex + 1} ungrouped tab ${target.tabIndex + 1}`
        : `window ${target.windowIndex + 1} group ${target.groupIndex + 1} tab ${target.tabIndex + 1}`;
    default:
      return "selection";
  }
}

function sessionCounts(session: SavedSessionV1): { windows: number; groups: number; tabs: number } {
  let groups = 0;
  let tabs = 0;
  for (const windowData of session.windows) {
    groups += windowData.groups.length;
    for (const group of windowData.groups) tabs += group.tabs.length;
    tabs += windowData.ungroupedTabs.length;
  }
  return { windows: session.windows.length, groups, tabs };
}

function normalizeHttpUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withScheme);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function parseAddTarget(value: string): AddTarget | null {
  const groupMatch = /^g:(\d+):(\d+)$/.exec(value);
  if (groupMatch) {
    return {
      kind: "group",
      windowIndex: Number(groupMatch[1]),
      groupIndex: Number(groupMatch[2])
    };
  }
  const ungroupedMatch = /^u:(\d+)$/.exec(value);
  if (ungroupedMatch) {
    return {
      kind: "ungrouped",
      windowIndex: Number(ungroupedMatch[1])
    };
  }
  return null;
}

export default function SessionPage(): JSX.Element {
  const { id } = useParams();
  const [session, setSession] = useState<SavedSessionV1 | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [metaName, setMetaName] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);
  const [savingTabs, setSavingTabs] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<Exclude<RestoreTargetV1, { kind: "session" }> | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedTabKeys, setSelectedTabKeys] = useState<string[]>([]);
  const [addTabUrl, setAddTabUrl] = useState("");
  const [addTabTitle, setAddTabTitle] = useState("");
  const [addTargetValue, setAddTargetValue] = useState("u:0");
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setError(null);
      const res = await bgCall({ type: "GET_SESSION", id });
      if (!res.ok) {
        setError(res.error);
        return;
      }

      setSession(res.session);
      setMetaName(res.session.name);
      setMetaDescription(res.session.description);
      setSelectedTabKeys([]);
      setAddTargetValue("u:0");

      const nextExpanded: Record<string, boolean> = {};
      buildTree(res.session).forEach((node) => {
        nextExpanded[node.id] = true;
      });
      setExpanded(nextExpanded);
    })();
  }, [id]);

  const tree = useMemo(() => (session ? buildTree(session) : []), [session]);
  const tabRefs = useMemo(() => (session ? flattenTabs(session) : []), [session]);
  const tabByKey = useMemo(() => new Map(tabRefs.map((ref) => [ref.key, ref])), [tabRefs]);
  const counts = useMemo(() => (session ? sessionCounts(session) : { windows: 0, groups: 0, tabs: 0 }), [session]);
  const addTargetOptions = useMemo(() => {
    if (!session) return [] as Array<{ value: string; label: string }>;
    const options: Array<{ value: string; label: string }> = [];
    session.windows.forEach((windowData, wi) => {
      options.push({ value: `u:${wi}`, label: `Window ${wi + 1} - Ungrouped` });
      windowData.groups.forEach((group, gi) => {
        options.push({
          value: `g:${wi}:${gi}`,
          label: `Window ${wi + 1} - Group ${gi + 1}${group.title ? ` (${group.title})` : ""}`
        });
      });
    });
    return options;
  }, [session]);

  useEffect(() => {
    setSelectedTabKeys((prev) => prev.filter((key) => tabByKey.has(key)));
  }, [tabByKey]);

  useEffect(() => {
    if (!selectedTarget) return;
    if (selectedTarget.kind === "group") setAddTargetValue(`g:${selectedTarget.windowIndex}:${selectedTarget.groupIndex}`);
    if (selectedTarget.kind === "ungrouped" || selectedTarget.kind === "window") setAddTargetValue(`u:${selectedTarget.windowIndex}`);
    if (selectedTarget.kind === "tab") {
      setAddTargetValue(
        selectedTarget.groupIndex === null
          ? `u:${selectedTarget.windowIndex}`
          : `g:${selectedTarget.windowIndex}:${selectedTarget.groupIndex}`
      );
    }
  }, [selectedTarget]);

  async function saveMetadata(patch: { name?: string; description?: string; favorite?: boolean }): Promise<void> {
    if (!id || !session) return;
    setSavingMeta(true);
    setError(null);
    setStatus(null);
    const res = await bgCall({ type: "UPDATE_SESSION_META", id, patch });
    setSavingMeta(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }

    setSession((prev) =>
      prev
        ? {
            ...prev,
            name: res.summary.name,
            description: res.summary.description,
            favorite: res.summary.favorite,
            updatedAt: res.summary.updatedAt
          }
        : prev
    );
    if (typeof patch.name === "string") setMetaName(res.summary.name);
    setMetaDescription(res.summary.description);
    setStatus("Metadata updated.");
  }

  async function persistWindows(nextWindows: SavedWindowV1[], okMessage: string): Promise<void> {
    if (!id || !session) return;
    setSavingTabs(true);
    setError(null);
    setStatus(null);
    const res = await bgCall({ type: "UPDATE_SESSION_WINDOWS", id, windows: nextWindows });
    setSavingTabs(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }

    setSession((prev) =>
      prev
        ? {
            ...prev,
            windows: nextWindows,
            updatedAt: res.summary.updatedAt
          }
        : prev
    );
    setStatus(okMessage);
  }

  async function onSaveMetaClick(): Promise<void> {
    if (!session) return;
    const trimmedName = metaName.trim();
    if (!trimmedName) {
      setError("Session name is required.");
      return;
    }

    const patch: { name?: string; description?: string } = {};
    if (trimmedName !== session.name) patch.name = trimmedName;
    if (metaDescription !== session.description) patch.description = metaDescription;
    if (!patch.name && patch.description === undefined) return;
    await saveMetadata(patch);
  }

  async function onDescriptionBlur(): Promise<void> {
    if (!session) return;
    if (metaDescription === session.description) return;
    await saveMetadata({ description: metaDescription });
  }

  async function onToggleFavorite(): Promise<void> {
    if (!session) return;
    await saveMetadata({ favorite: !session.favorite });
  }

  async function onRestore(target: RestoreTargetV1): Promise<void> {
    if (!id) return;
    setRestoring(true);
    setError(null);
    setStatus(null);
    const res =
      target.kind === "session"
        ? await bgCall({ type: "RESTORE_SESSION", id })
        : await bgCall({ type: "RESTORE_SELECTION", id, target });
    setRestoring(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }

    const report = res.report;
    const warning = report.warnings.length ? ` | warnings: ${report.warnings.join("; ")}` : "";
    const skipped = report.skippedReasons.length ? ` | skipped: ${report.skippedReasons.join("; ")}` : "";
    setStatus(`Restore complete (${summarizeRestoreReport(report)})${warning}${skipped}`);
  }

  async function onOpenSelectedTabs(): Promise<void> {
    if (!id || selectedTabKeys.length === 0) {
      setError("Select one or more tabs first.");
      return;
    }

    const selectedTabs = tabRefs.filter((tab) => selectedTabKeys.includes(tab.key));
    if (selectedTabs.length === 0) {
      setError("No selected tabs are available.");
      return;
    }

    setRestoring(true);
    setError(null);
    setStatus(null);
    const aggregate: RestoreReportV1 = {
      createdWindows: 0,
      createdGroups: 0,
      createdTabs: 0,
      skippedTabs: 0,
      skippedReasons: [],
      warnings: []
    };

    for (const tab of selectedTabs) {
      const res = await bgCall({
        type: "RESTORE_SELECTION",
        id,
        target: { kind: "tab", windowIndex: tab.windowIndex, groupIndex: tab.groupIndex, tabIndex: tab.tabIndex }
      });
      if (!res.ok) {
        aggregate.warnings.push(`Failed to open "${tab.label}": ${res.error}`);
        continue;
      }
      aggregate.createdWindows += res.report.createdWindows;
      aggregate.createdGroups += res.report.createdGroups;
      aggregate.createdTabs += res.report.createdTabs;
      aggregate.skippedTabs += res.report.skippedTabs;
      aggregate.skippedReasons.push(...res.report.skippedReasons);
      aggregate.warnings.push(...res.report.warnings);
    }

    setRestoring(false);
    setStatus(
      `Opened ${selectedTabs.length} selected tab(s) (${summarizeRestoreReport(aggregate)})${
        aggregate.warnings.length ? ` | warnings: ${aggregate.warnings.join("; ")}` : ""
      }`
    );
  }

  async function onDeleteSelectedTabs(): Promise<void> {
    if (!session || selectedTabKeys.length === 0) {
      setError("Select one or more tabs to delete.");
      return;
    }
    if (!confirm(`Delete ${selectedTabKeys.length} selected tab(s) from this saved session?`)) return;

    const selected = new Set(selectedTabKeys);
    const nextWindows = session.windows.map((windowData, wi) => ({
      ...windowData,
      groups: windowData.groups
        .map((group, gi) => ({
          ...group,
          tabs: group.tabs.filter((_tab, ti) => !selected.has(`w:${wi}:g:${gi}:t:${ti}`))
        }))
        .filter((group) => group.tabs.length > 0),
      ungroupedTabs: windowData.ungroupedTabs.filter((_tab, ti) => !selected.has(`w:${wi}:u:t:${ti}`))
    }));

    await persistWindows(nextWindows, `Deleted ${selectedTabKeys.length} tab(s) from saved session.`);
    setSelectedTabKeys([]);
  }

  async function onAddTab(): Promise<void> {
    if (!session) return;
    const normalizedUrl = normalizeHttpUrl(addTabUrl);
    if (!normalizedUrl) {
      setError("Provide a valid http(s) URL for the new tab.");
      return;
    }

    const target = parseAddTarget(addTargetValue);
    if (!target) {
      setError("Choose a valid target location.");
      return;
    }

    const parsed = new URL(normalizedUrl);
    const newTab: SavedTabV1 = {
      url: normalizedUrl,
      title: addTabTitle.trim() || parsed.hostname || normalizedUrl,
      pinned: false,
      active: false,
      restricted: isRestrictedUrl(normalizedUrl)
    };

    const nextWindows =
      session.windows.length > 0
        ? session.windows.map((windowData) => ({
            ...windowData,
            groups: windowData.groups.map((group) => ({ ...group, tabs: group.tabs.slice() })),
            ungroupedTabs: windowData.ungroupedTabs.slice()
          }))
        : [{ index: 0, focused: false, groups: [], ungroupedTabs: [] }];

    if (target.windowIndex < 0 || target.windowIndex >= nextWindows.length) {
      setError("Target window is out of range.");
      return;
    }

    const windowData = nextWindows[target.windowIndex];
    if (!windowData) {
      setError("Target window is missing.");
      return;
    }

    if (target.kind === "group") {
      const group = windowData.groups[target.groupIndex];
      if (group) group.tabs.push(newTab);
      else windowData.ungroupedTabs.push(newTab);
    } else {
      windowData.ungroupedTabs.push(newTab);
    }

    await persistWindows(nextWindows, "Tab added to saved session.");
    setAddTabUrl("");
    setAddTabTitle("");
  }

  function toggleExpanded(nodeId: string): void {
    setExpanded((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  }

  function applyTabSelection(tabKey: string): void {
    setSelectedTabKeys((prev) => (prev.includes(tabKey) ? prev.filter((key) => key !== tabKey) : [...prev, tabKey]));
  }

  function renderTreeNode(node: TreeNode, depth: number): JSX.Element {
    const hasChildren = node.children.length > 0;
    const isExpanded = expanded[node.id] ?? true;
    const isPrimarySelected = selectedNodeId === node.id;
    const isTabMultiSelected = node.target.kind === "tab" && selectedTabKeys.includes(node.id);
    return (
      <div key={node.id}>
        <div className="tree-row" style={{ paddingLeft: `${depth * 16}px` }}>
          {hasChildren ? (
            <button
              className="ghost tree-toggle"
              onClick={() => toggleExpanded(node.id)}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? "▾" : "▸"}
            </button>
          ) : (
            <span className="tree-spacer" />
          )}
          <button
            className={isPrimarySelected || isTabMultiSelected ? "tree-item selected" : "tree-item"}
            onClick={() => {
              setSelectedNodeId(node.id);
              setSelectedTarget(node.target);
              if (node.target.kind === "tab") applyTabSelection(node.id);
            }}
            title={node.label}
          >
            {node.label}
          </button>
        </div>
        {hasChildren && isExpanded ? node.children.map((child) => renderTreeNode(child, depth + 1)) : null}
      </div>
    );
  }

  if (!session) {
    if (error) {
      return (
        <div className="card">
          <h1>Session</h1>
          <div className="error">{error}</div>
          <Link to="/" className="link">
            Back to library
          </Link>
        </div>
      );
    }
    return (
      <div className="card">
        <div className="muted">Loading…</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="session-top">
        <h1 style={{ margin: 0 }}>Session Detail</h1>
        <Link to="/" className="link">
          Back
        </Link>
      </div>

      <div className="session-grid">
        <section className="session-panel">
          <div className="panel-head">
            <h2>Metadata</h2>
            <button
              className={session.favorite ? "star on" : "star"}
              onClick={() => void onToggleFavorite()}
              aria-label={session.favorite ? "Unfavorite" : "Favorite"}
              title={session.favorite ? "Unfavorite" : "Favorite"}
              disabled={savingMeta}
            >
              {session.favorite ? "★" : "☆"}
            </button>
          </div>

          <div className="meta-grid">
            <div className="meta-pill">Windows: {counts.windows}</div>
            <div className="meta-pill">Groups: {counts.groups}</div>
            <div className="meta-pill">Tabs: {counts.tabs}</div>
          </div>
          <div className="meta-list">
            <div>
              <strong>ID:</strong> {session.id}
            </div>
            <div>
              <strong>Created:</strong> {new Date(session.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Updated:</strong> {new Date(session.updatedAt).toLocaleString()}
            </div>
          </div>

          <label className="field">
            <span>Name</span>
            <input value={metaName} onChange={(e) => setMetaName(e.target.value)} />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              onBlur={() => void onDescriptionBlur()}
              rows={4}
            />
          </label>
          <div className="panel-actions">
            <button onClick={() => void onSaveMetaClick()} disabled={savingMeta}>
              {savingMeta ? "Saving…" : "Save Metadata"}
            </button>
            <button
              className="ghost"
              onClick={() => void onRestore({ kind: "session" })}
              disabled={restoring}
              title="Restore all windows/groups/tabs from this session"
            >
              {restoring ? "Restoring…" : "Restore Full Session"}
            </button>
          </div>
        </section>

        <section className="session-panel">
          <div className="panel-head">
            <h2>Tabs</h2>
            <button
              className="ghost"
              onClick={() => selectedTarget && void onRestore(selectedTarget)}
              disabled={!selectedTarget || restoring}
              title={selectedTarget ? `Restore selected: ${selectedLabel(selectedTarget)}` : "Select a node to restore"}
            >
              Restore Selected Node
            </button>
          </div>
          <div className="muted panel-subtext">Selected node: {selectedLabel(selectedTarget)}</div>
          <div className="muted panel-subtext">
            Selected tabs: {selectedTabKeys.length} (click a tab to toggle selection)
          </div>

          <div className="panel-actions">
            <button className="ghost" onClick={() => void onOpenSelectedTabs()} disabled={restoring || selectedTabKeys.length === 0}>
              Open Selected Tabs
            </button>
            <button
              className="ghost danger"
              onClick={() => void onDeleteSelectedTabs()}
              disabled={savingTabs || selectedTabKeys.length === 0}
            >
              Delete Selected Tabs
            </button>
          </div>

          <div className="add-tab">
            <label className="field">
              <span>URL</span>
              <input
                placeholder="https://example.com"
                value={addTabUrl}
                onChange={(e) => setAddTabUrl(e.target.value)}
                disabled={savingTabs}
              />
            </label>
            <label className="field">
              <span>Title (optional)</span>
              <input value={addTabTitle} onChange={(e) => setAddTabTitle(e.target.value)} disabled={savingTabs} />
            </label>
            <label className="field">
              <span>Add To</span>
              <select value={addTargetValue} onChange={(e) => setAddTargetValue(e.target.value)} disabled={savingTabs}>
                {addTargetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={() => void onAddTab()} disabled={savingTabs}>
              {savingTabs ? "Saving…" : "Add Tab"}
            </button>
          </div>

          <div className="tree" role="tree">
            {tree.map((node) => renderTreeNode(node, 0))}
          </div>
          {selectedTabKeys.length > 0 ? (
            <div className="selected-tab-list">
              {selectedTabKeys.map((key) => {
                const tab = tabByKey.get(key);
                if (!tab) return null;
                return (
                  <div key={key} className="selected-tab-item">
                    <span className="selected-tab-title">{tab.label}</span>
                    <span className={tab.restricted ? "selected-tab-badge restricted" : "selected-tab-badge"}>{tab.restricted ? "restricted" : "restorable"}</span>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>
      </div>

      {status ? <div className="ok">{status}</div> : null}
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}
