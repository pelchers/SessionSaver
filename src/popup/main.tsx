import React from "react";
import ReactDOM from "react-dom/client";

function openLibrary(): void {
  chrome.runtime.openOptionsPage();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div style={{ padding: 12, width: 260, fontFamily: "system-ui, Segoe UI, Arial" }}>
    <div style={{ fontWeight: 700, marginBottom: 8 }}>SessionSaver</div>
    <button onClick={openLibrary} style={{ width: "100%", padding: "8px 10px" }}>
      Open Library
    </button>
  </div>
);

