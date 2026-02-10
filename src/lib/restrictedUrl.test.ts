import { describe, expect, it } from "vitest";
import { isRestrictedUrl } from "./restrictedUrl";

describe("isRestrictedUrl", () => {
  it("treats empty as restricted", () => {
    expect(isRestrictedUrl("")).toBe(true);
    expect(isRestrictedUrl("   ")).toBe(true);
    expect(isRestrictedUrl(undefined)).toBe(true);
  });

  it("treats chrome/internal schemes as restricted", () => {
    expect(isRestrictedUrl("chrome://extensions")).toBe(true);
    expect(isRestrictedUrl("chrome-extension://id/page.html")).toBe(true);
    expect(isRestrictedUrl("devtools://devtools/bundled/inspector.html")).toBe(true);
    expect(isRestrictedUrl("view-source:https://example.com")).toBe(true);
    expect(isRestrictedUrl("about:blank")).toBe(true);
    expect(isRestrictedUrl("file:///C:/Windows/System32/drivers/etc/hosts")).toBe(true);
  });

  it("allows http(s)", () => {
    expect(isRestrictedUrl("https://example.com")).toBe(false);
    expect(isRestrictedUrl("http://example.com")).toBe(false);
  });
});

