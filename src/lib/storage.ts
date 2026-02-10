import { chromePromise, chromePromiseVoid } from "./chromeAsync";
import type { SavedSessionV1, SchemaRootV1, SessionId, SessionSummaryV1 } from "./types";

const ROOT_KEY = "root";

function emptyRoot(): SchemaRootV1 {
  return { schemaVersion: 1, sessionsIndex: [], sessionsById: {} };
}

export type SessionMetaPatch = Partial<Pick<SavedSessionV1, "name" | "description" | "favorite">>;

export async function ensureInitialized(): Promise<void> {
  const root = await getRoot();
  if (!root) {
    await setRoot(emptyRoot());
    return;
  }

  // Migration hook (future): if (root.schemaVersion !== 1) migrate().
  if (root.schemaVersion !== 1) {
    // Unknown version; avoid clobbering.
    // Real migration will be implemented in Phase 1.
    return;
  }
}

export async function getRoot(): Promise<SchemaRootV1 | null> {
  const res = await chromePromise<Record<string, unknown>>((cb) => chrome.storage.local.get([ROOT_KEY], cb));
  const raw = res[ROOT_KEY] as unknown;
  if (!raw) return null;
  return raw as SchemaRootV1;
}

export async function setRoot(root: SchemaRootV1): Promise<void> {
  await chromePromiseVoid((cb) => chrome.storage.local.set({ [ROOT_KEY]: root }, cb));
}

export function summarizeSession(session: SavedSessionV1): SessionSummaryV1 {
  let groupCount = 0;
  let tabCount = 0;
  for (const w of session.windows) {
    groupCount += w.groups.length;
    for (const g of w.groups) tabCount += g.tabs.length;
    tabCount += w.ungroupedTabs.length;
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
}

export async function listSessions(): Promise<SessionSummaryV1[]> {
  await ensureInitialized();
  const root = (await getRoot()) ?? emptyRoot();
  return root.sessionsIndex.slice();
}

export async function getSession(id: SessionId): Promise<SavedSessionV1 | null> {
  await ensureInitialized();
  const root = (await getRoot()) ?? emptyRoot();
  return root.sessionsById[id] ?? null;
}

export async function upsertSession(session: SavedSessionV1): Promise<SessionSummaryV1> {
  await ensureInitialized();
  const root = (await getRoot()) ?? emptyRoot();
  root.sessionsById[session.id] = session;

  const summary = summarizeSession(session);
  root.sessionsIndex = [summary, ...root.sessionsIndex.filter((s) => s.id !== session.id)];
  await setRoot(root);
  return summary;
}

export async function updateSessionMeta(id: SessionId, patch: SessionMetaPatch): Promise<SessionSummaryV1> {
  await ensureInitialized();
  const root = (await getRoot()) ?? emptyRoot();
  const session = root.sessionsById[id];
  if (!session) throw new Error("session_not_found");

  const now = new Date().toISOString();
  session.updatedAt = now;
  if (typeof patch.name === "string") session.name = patch.name;
  if (typeof patch.description === "string") session.description = patch.description;
  if (typeof patch.favorite === "boolean") session.favorite = patch.favorite;

  const summary = summarizeSession(session);
  root.sessionsIndex = root.sessionsIndex.map((s) => (s.id === id ? summary : s));
  await setRoot(root);
  return summary;
}

export async function deleteSession(id: SessionId): Promise<void> {
  await ensureInitialized();
  const root = (await getRoot()) ?? emptyRoot();
  delete root.sessionsById[id];
  root.sessionsIndex = root.sessionsIndex.filter((s) => s.id !== id);
  await setRoot(root);
}
