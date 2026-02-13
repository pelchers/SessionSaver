import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { RestoreReportV1, RestoreTargetV1, SavedSessionV1, SavedWindowV1 } from "../../../lib/types";
import { bgCall } from "../chromeRpc";

type TreeNode = {
  id: string;
  label: string;
  target: Exclude<RestoreTargetV1, { kind: "session" }>;
  children: TreeNode[];
};

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

function windowTabCount(windowData: SavedWindowV1): number {
  const groupTabCount = windowData.groups.reduce((sum, group) => sum + group.tabs.length, 0);
  return groupTabCount + windowData.ungroupedTabs.length;
}

function summarizeRestoreReport(report: RestoreReportV1): string {
  const parts = [
    `windows: ${report.createdWindows}`,
    `groups: ${report.createdGroups}`,
    `tabs: ${report.createdTabs}`,
    `skipped tabs: ${report.skippedTabs}`
  ];
  return parts.join(" | ");
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

export default function SessionPage(): JSX.Element {
  const { id } = useParams();
  const [session, setSession] = useState<SavedSessionV1 | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [metaName, setMetaName] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<Exclude<RestoreTargetV1, { kind: "session" }> | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
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
      const nextExpanded: Record<string, boolean> = {};
      buildTree(res.session).forEach((node) => {
        nextExpanded[node.id] = true;
      });
      setExpanded(nextExpanded);
    })();
  }, [id]);

  const tree = useMemo(() => (session ? buildTree(session) : []), [session]);

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
    if (typeof patch.name === "string") {
      setMetaName(res.summary.name);
    }
    setMetaDescription(res.summary.description);
    setStatus("Metadata updated.");
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

  function toggleExpanded(nodeId: string): void {
    setExpanded((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  }

  function renderTreeNode(node: TreeNode, depth: number): JSX.Element {
    const hasChildren = node.children.length > 0;
    const isExpanded = expanded[node.id] ?? true;
    const selected = selectedNodeId === node.id;
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
            className={selected ? "tree-item selected" : "tree-item"}
            onClick={() => {
              setSelectedNodeId(node.id);
              setSelectedTarget(node.target);
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
          <label className="field">
            <span>Name</span>
            <input value={metaName} onChange={(e) => setMetaName(e.target.value)} />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} onBlur={() => void onDescriptionBlur()} rows={4} />
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
            <h2>Explorer Tree</h2>
            <button
              className="ghost"
              onClick={() => selectedTarget && void onRestore(selectedTarget)}
              disabled={!selectedTarget || restoring}
              title={selectedTarget ? `Restore selected: ${selectedLabel(selectedTarget)}` : "Select a node to restore"}
            >
              Restore Selected
            </button>
          </div>
          <div className="muted" style={{ marginBottom: 8 }}>
            Selected: {selectedLabel(selectedTarget)}
          </div>
          <div className="tree" role="tree">
            {tree.map((node) => renderTreeNode(node, 0))}
          </div>
        </section>
      </div>

      {status ? <div className="ok">{status}</div> : null}
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}
