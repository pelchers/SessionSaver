import type { RestoreReportV1, RestoreTargetV1, SavedSessionV1, SavedWindowV1, SessionId, SessionSummaryV1 } from "./types";

export type PingRequest = { type: "PING" };
export type GetSessionsRequest = { type: "GET_SESSIONS_INDEX" };
export type GetSessionRequest = { type: "GET_SESSION"; id: SessionId };
export type GetSyncedSessionRequest = { type: "GET_SYNC_SELECTION" };
export type SetSyncedSessionRequest = { type: "SET_SYNC_SELECTION"; id: SessionId | null };
export type SaveSessionRequest = { type: "SAVE_SESSION"; name: string; description?: string };
export type UpdateSessionMetaRequest = {
  type: "UPDATE_SESSION_META";
  id: SessionId;
  patch: { name?: string; description?: string; favorite?: boolean };
};
export type DeleteSessionRequest = { type: "DELETE_SESSION"; id: SessionId };
export type RestoreSessionRequest = { type: "RESTORE_SESSION"; id: SessionId };
export type RestoreSelectionRequest = { type: "RESTORE_SELECTION"; id: SessionId; target: RestoreTargetV1 };
export type UpdateSessionWindowsRequest = { type: "UPDATE_SESSION_WINDOWS"; id: SessionId; windows: SavedWindowV1[] };

export type BackgroundRequest =
  | PingRequest
  | GetSessionsRequest
  | GetSessionRequest
  | GetSyncedSessionRequest
  | SetSyncedSessionRequest
  | SaveSessionRequest
  | UpdateSessionMetaRequest
  | DeleteSessionRequest
  | RestoreSessionRequest
  | RestoreSelectionRequest
  | UpdateSessionWindowsRequest;

export type BackgroundResponse =
  | { ok: true; ts?: string }
  | { ok: true; sessions: SessionSummaryV1[] }
  | { ok: true; session: SavedSessionV1 }
  | { ok: true; summary: SessionSummaryV1 }
  | { ok: true; syncedSessionId: SessionId | null }
  | { ok: true; report: RestoreReportV1 }
  | { ok: true }
  | { ok: false; error: string };
