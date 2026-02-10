import type { ManifestV3Export } from "@crxjs/vite-plugin";

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "SessionSaver",
  description: "Save, browse, and restore Chrome tab sessions with a Drive-like library and explorer tree.",
  version: "0.1.0",
  action: {
    default_title: "SessionSaver",
    default_popup: "src/popup/index.html"
  },
  options_ui: {
    page: "src/options/index.html",
    open_in_tab: true
  },
  background: {
    service_worker: "src/background/index.ts",
    type: "module"
  },
  permissions: ["storage", "tabs", "tabGroups"],
  icons: {
    "16": "src/assets/icon-16.png",
    "32": "src/assets/icon-32.png",
    "48": "src/assets/icon-48.png",
    "128": "src/assets/icon-128.png"
  }
};

export default manifest;

