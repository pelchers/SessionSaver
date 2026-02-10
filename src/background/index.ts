import { ensureInitialized } from "../lib/storage";

chrome.runtime.onInstalled.addListener(() => {
  void ensureInitialized();
});

chrome.runtime.onStartup?.addListener(() => {
  void ensureInitialized();
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  // Placeholder: Phase 1 will implement message handlers for capture/storage.
  if (msg?.type === "PING") {
    sendResponse({ ok: true, ts: new Date().toISOString() });
    return;
  }

  sendResponse({ ok: false, error: "unhandled_message" });
});

