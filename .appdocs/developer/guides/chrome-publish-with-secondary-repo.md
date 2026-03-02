# Guide: Chrome Publish With Secondary Dist-Only Repo

Use this when you want the main source repo private and a separate public repo for release artifacts.

## Important Reality Check

- A Chrome extension package (`zip` / `crx`) contains shipped JavaScript and assets.
- Users can inspect extension code from installed packages.
- A dist-only repo does not prevent reverse engineering; it only keeps your original source, planning docs, and workflow private.

## Preflight (must pass first)

Run:

```bash
npm run prelaunch:check
```

Why:
- Confirms lint, unit tests, user-story validation, and production build all pass before publish.

## Step 1: Ensure version is correct

For updates to an existing CWS item, bump version in:

- `src/manifest.ts` -> `version`
- `package.json` -> `version`

Why:
- CWS rejects uploads that do not increase extension version.

## Step 2: Build and package release artifact

Run:

```powershell
npm run build
if (!(Test-Path .release)) { New-Item -ItemType Directory -Path .release | Out-Null }
Compress-Archive -Path .\dist\* -DestinationPath .\.release\sessionsaver-upload.zip -Force
```

Why:
- Produces the exact upload package for CWS.

## Step 3: Sync `dist` to secondary public repo

Assume:

- Main/private repo: `C:\Extensions\SessionSaver`
- Secondary/public repo local clone: `C:\Extensions\SessionSaver-dist-public`

Run in PowerShell:

```powershell
$src = "C:\Extensions\SessionSaver\dist"
$dst = "C:\Extensions\SessionSaver-dist-public"

if (!(Test-Path $dst)) {
  throw "Clone the secondary repo first: git clone <secondary-repo-url> $dst"
}

Get-ChildItem -Path $dst -Force | Where-Object { $_.Name -notin ".git" } | Remove-Item -Recurse -Force
Copy-Item -Path "$src\*" -Destination $dst -Recurse -Force
Set-Location $dst
git add -A
git commit -m "chore: publish dist for SessionSaver <version>"
git push
```

Why:
- Keeps public repo limited to shipped artifact contents only.

## Step 4: Upload to Chrome Web Store

1. Open: `https://chrome.google.com/webstore/devconsole`
2. Open your extension item.
3. Upload `C:\Extensions\SessionSaver\.release\sessionsaver-upload.zip`.
4. Complete listing/privacy fields and submit for review.

Why:
- This is the actual review candidate submitted to Google.

## Step 5: Post-submit checklist

1. Verify `main` and release savepoint branch are pushed.
2. Tag release commit in private repo if desired.
3. Record published version + dashboard submission timestamp in your release notes.

Why:
- Keeps release history auditable and reproducible.
