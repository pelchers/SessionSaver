export type SchemaVersion = 1;

export type SessionId = string;

export type SessionSummaryV1 = {
  id: SessionId;
  name: string;
  description: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  windowCount: number;
  groupCount: number;
  tabCount: number;
};

export type SavedTabV1 = {
  url: string;
  title: string;
  favIconUrl?: string;
  pinned: boolean;
  active: boolean;
  restricted?: boolean;
};

export type SavedGroupV1 = {
  title: string;
  color?: string;
  collapsed?: boolean;
  tabs: SavedTabV1[];
};

export type SavedWindowV1 = {
  index: number;
  focused?: boolean;
  groups: SavedGroupV1[];
  ungroupedTabs: SavedTabV1[];
};

export type SavedSessionV1 = {
  id: SessionId;
  name: string;
  description: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  windows: SavedWindowV1[];
};

export type SchemaRootV1 = {
  schemaVersion: 1;
  sessionsIndex: SessionSummaryV1[];
  sessionsById: Record<SessionId, SavedSessionV1>;
};

