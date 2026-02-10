import type { SavedSessionV1, SessionId, SessionSummaryV1 } from "./types";

export type PingRequest = { type: "PING" };
export type GetSessionsRequest = { type: "GET_SESSIONS_INDEX" };
export type GetSessionRequest = { type: "GET_SESSION"; id: SessionId };
export type SaveSessionRequest = { type: "SAVE_SESSION"; name: string; description?: string };
export type UpdateSessionMetaRequest = {
  type: "UPDATE_SESSION_META";
  id: SessionId;
  patch: { name?: string; description?: string; favorite?: boolean };
};
export type DeleteSessionRequest = { type: "DELETE_SESSION"; id: SessionId };

export type BackgroundRequest =
  | PingRequest
  | GetSessionsRequest
  | GetSessionRequest
  | SaveSessionRequest
  | UpdateSessionMetaRequest
  | DeleteSessionRequest;

export type BackgroundResponse =
  | { ok: true; ts?: string }
  | { ok: true; sessions: SessionSummaryV1[] }
  | { ok: true; session: SavedSessionV1 }
  | { ok: true; summary: SessionSummaryV1 }
  | { ok: true }
  | { ok: false; error: string };

