import { chromePromise, chromePromiseVoid } from "./chromeAsync";
import type { SchemaRootV1 } from "./types";

const ROOT_KEY = "root";

function emptyRoot(): SchemaRootV1 {
  return { schemaVersion: 1, sessionsIndex: [], sessionsById: {} };
}

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

