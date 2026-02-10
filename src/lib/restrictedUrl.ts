const RESTRICTED_SCHEMES = [
  "chrome:",
  "chrome-extension:",
  "devtools:",
  "view-source:",
  "about:",
  "edge:"
];

export function isRestrictedUrl(url: string | undefined | null): boolean {
  if (!url) return true;
  const trimmed = url.trim();
  if (!trimmed) return true;

  // `file://` can be restorable only with explicit file URL access; default to restricted in MVP.
  if (trimmed.startsWith("file:")) return true;

  return RESTRICTED_SCHEMES.some((s) => trimmed.startsWith(s));
}

