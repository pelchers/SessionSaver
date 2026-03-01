import { captureCurrentWindows } from "../lib/capture";
import { restoreSession } from "../lib/restore";
import type { BackgroundRequest, BackgroundResponse } from "../lib/messages";
import {
  deleteSession,
  ensureInitialized,
  getSession,
  getSyncedSessionId,
  listSessions,
  setSyncedSessionId,
  updateSessionMeta,
  updateSessionWindows,
  upsertSession
} from "../lib/storage";
import type { SavedSessionV1 } from "../lib/types";

chrome.runtime.onInstalled.addListener(() => {
  void ensureInitialized();
});

chrome.runtime.onStartup?.addListener(() => {
  void ensureInitialized();
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async (): Promise<BackgroundResponse> => {
    await ensureInitialized();
    const req = msg as BackgroundRequest;

    switch (req?.type) {
      case "PING":
        return { ok: true, ts: new Date().toISOString() };
      case "GET_SESSIONS_INDEX":
        return { ok: true, sessions: await listSessions() };
      case "GET_SESSION": {
        const session = await getSession(req.id);
        if (!session) return { ok: false, error: "session_not_found" };
        return { ok: true, session };
      }
      case "GET_SYNC_SELECTION":
        return { ok: true, syncedSessionId: await getSyncedSessionId() };
      case "SET_SYNC_SELECTION": {
        if (req.id) {
          const session = await getSession(req.id);
          if (!session) return { ok: false, error: "session_not_found" };
        }
        const syncedSessionId = await setSyncedSessionId(req.id);
        return { ok: true, syncedSessionId };
      }
      case "SAVE_SESSION": {
        const windows = await captureCurrentWindows();
        const now = new Date().toISOString();
        const id = crypto.randomUUID();
        const session: SavedSessionV1 = {
          id,
          name: req.name,
          description: req.description ?? "",
          favorite: false,
          createdAt: now,
          updatedAt: now,
          windows
        };
        const summary = await upsertSession(session);
        return { ok: true, summary };
      }
      case "UPDATE_SESSION_META": {
        const summary = await updateSessionMeta(req.id, req.patch);
        return { ok: true, summary };
      }
      case "DELETE_SESSION": {
        await deleteSession(req.id);
        return { ok: true };
      }
      case "RESTORE_SESSION": {
        const session = await getSession(req.id);
        if (!session) return { ok: false, error: "session_not_found" };
        const report = await restoreSession(session, { kind: "session" });
        return { ok: true, report };
      }
      case "RESTORE_SELECTION": {
        const session = await getSession(req.id);
        if (!session) return { ok: false, error: "session_not_found" };
        const report = await restoreSession(session, req.target);
        return { ok: true, report };
      }
      case "UPDATE_SESSION_WINDOWS": {
        const summary = await updateSessionWindows(req.id, req.windows);
        return { ok: true, summary };
      }
      default:
        return { ok: false, error: "unhandled_message" };
    }
  })()
    .then((res) => sendResponse(res))
    .catch((err: unknown) =>
      sendResponse({
        ok: false,
        error: err instanceof Error ? err.message : "unknown_error"
      } satisfies BackgroundResponse)
    );

  return true;
});
