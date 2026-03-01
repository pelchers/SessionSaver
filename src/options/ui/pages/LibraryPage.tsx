import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SessionSummaryV1 } from "../../../lib/types";
import { bgCall } from "../chromeRpc";

type SortMode = "updated_desc" | "name_asc" | "favorites_first";

export default function LibraryPage(): JSX.Element {
  const [sessions, setSessions] = useState<SessionSummaryV1[]>([]);
  const [syncedSessionId, setSyncedSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortMode, setSortMode] = useState<SortMode>("updated_desc");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveDesc, setSaveDesc] = useState("");
  const [saving, setSaving] = useState(false);

  async function refresh(): Promise<void> {
    setLoading(true);
    setError(null);
    const [sessionsRes, syncRes] = await Promise.all([
      bgCall({ type: "GET_SESSIONS_INDEX" }),
      bgCall({ type: "GET_SYNC_SELECTION" })
    ]);
    if (!sessionsRes.ok) {
      setError(sessionsRes.error);
      setLoading(false);
      return;
    }
    if (!syncRes.ok) {
      setError(syncRes.error);
      setLoading(false);
      return;
    }
    setSessions(sessionsRes.sessions);
    setSyncedSessionId(syncRes.syncedSessionId);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const visible = useMemo(() => {
    let list = sessions.slice();
    if (favoritesOnly) list = list.filter((s) => s.favorite);
    switch (sortMode) {
      case "name_asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "favorites_first":
        list.sort((a, b) => {
          if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
          return b.updatedAt.localeCompare(a.updatedAt);
        });
        break;
      case "updated_desc":
      default:
        list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        break;
    }
    return list;
  }, [sessions, favoritesOnly, sortMode]);

  async function toggleFavorite(id: string, favorite: boolean): Promise<void> {
    const res = await bgCall({ type: "UPDATE_SESSION_META", id, patch: { favorite } });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSessions((prev) => prev.map((s) => (s.id === id ? res.summary : s)));
  }

  async function doDelete(id: string): Promise<void> {
    if (!confirm("Delete this session? This cannot be undone in MVP.")) return;
    const res = await bgCall({ type: "DELETE_SESSION", id });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setSyncedSessionId((prev) => (prev === id ? null : prev));
  }

  async function toggleSyncedSession(id: string): Promise<void> {
    const nextId = syncedSessionId === id ? null : id;
    const res = await bgCall({ type: "SET_SYNC_SELECTION", id: nextId });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSyncedSessionId(res.syncedSessionId);
  }

  async function doSave(): Promise<void> {
    if (!saveName.trim()) {
      setError("Session name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await bgCall({ type: "SAVE_SESSION", name: saveName.trim(), description: saveDesc.trim() });
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSaveOpen(false);
    setSaveName("");
    setSaveDesc("");
    await refresh();
  }

  return (
    <div className="card">
      <div className="library-header">
        <div>
          <h1 style={{ margin: 0 }}>Library</h1>
          <div className="muted">Saved tab sessions</div>
        </div>
        <div className="library-actions">
          <button onClick={() => setSaveOpen(true)}>Save Current Session</button>
        </div>
      </div>

      <div className="toolbar">
        <label className="tool">
          <span>Sort</span>
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}>
            <option value="updated_desc">Updated</option>
            <option value="name_asc">Name</option>
            <option value="favorites_first">Favorites first</option>
          </select>
        </label>
        <label className="tool checkbox">
          <input type="checkbox" checked={favoritesOnly} onChange={(e) => setFavoritesOnly(e.target.checked)} />
          <span>Favorites only</span>
        </label>
        <button className="ghost" onClick={() => void refresh()} disabled={loading}>
          Refresh
        </button>
      </div>

      {error ? <div className="error">{error}</div> : null}

      {loading ? (
        <div className="muted">Loading…</div>
      ) : visible.length === 0 ? (
        <div className="empty">
          <div className="empty-title">{favoritesOnly ? "No favorite sessions" : "No sessions yet"}</div>
          <div className="muted">
            {favoritesOnly ? "Star a session or clear the filter." : "Save your current tabs to build your library."}
          </div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>Flags</th>
              <th>Name</th>
              <th>Description</th>
              <th style={{ width: 90 }}>Windows</th>
              <th style={{ width: 70 }}>Tabs</th>
              <th style={{ width: 160 }}>Updated</th>
              <th style={{ width: 90 }} />
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="row-flags">
                    <button
                      className={s.favorite ? "star on" : "star"}
                      onClick={() => void toggleFavorite(s.id, !s.favorite)}
                      aria-label={s.favorite ? "Unfavorite" : "Favorite"}
                      title={s.favorite ? "Unfavorite" : "Favorite"}
                    >
                      {s.favorite ? "★" : "☆"}
                    </button>
                    <button
                      className={syncedSessionId === s.id ? "sync-mark on" : "sync-mark"}
                      onClick={() => void toggleSyncedSession(s.id)}
                      aria-label={syncedSessionId === s.id ? "Unsync session" : "Sync session"}
                      title={syncedSessionId === s.id ? "Unsync session" : "Mark session for cross-device sync"}
                    >
                      ⟳
                    </button>
                  </div>
                </td>
                <td>
                  <Link to={`/session/${s.id}`} className="link">
                    {s.name}
                  </Link>
                </td>
                <td className="muted">{s.description}</td>
                <td className="muted">{s.windowCount}</td>
                <td className="muted">{s.tabCount}</td>
                <td className="muted">{new Date(s.updatedAt).toLocaleString()}</td>
                <td>
                  <button className="danger ghost" onClick={() => void doDelete(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {saveOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-title">Save Current Session</div>
            <label className="field">
              <span>Name</span>
              <input value={saveName} onChange={(e) => setSaveName(e.target.value)} autoFocus />
            </label>
            <label className="field">
              <span>Description</span>
              <textarea value={saveDesc} onChange={(e) => setSaveDesc(e.target.value)} rows={3} />
            </label>
            <div className="modal-actions">
              <button className="ghost" onClick={() => setSaveOpen(false)} disabled={saving}>
                Cancel
              </button>
              <button onClick={() => void doSave()} disabled={saving}>
                {saving ? "Saving…" : "Save Session"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
