# Guide: Chrome Web Store Upload And Re-Upload

Use this only for distribution/review builds.  
Do not use this for day-to-day local testing.

## Step 1: Build release artifacts

Command:

```bash
npm run prelaunch:check
```

Why:
- Ensures the uploaded package is from a validated build.

## Step 2: Package `dist/` as zip

PowerShell example:

```powershell
Compress-Archive -Path .\dist\* -DestinationPath .\sessionsaver-dist.zip -Force
```

Why:
- Chrome Web Store requires a packaged artifact for upload.

## Step 3: Upload in CWS dashboard

Action:

1. Open Chrome Web Store Developer Dashboard.
2. Select your extension item.
3. Upload `sessionsaver-dist.zip`.
4. Update listing text/screenshots if needed.

Why:
- Upload creates the review candidate that Chrome evaluates.

## Step 4: Re-upload workflow for fixes

Action:

1. Apply fixes.
2. Re-run `npm run prelaunch:check`.
3. Rebuild and recreate zip.
4. Upload new package version.

Why:
- Each review candidate must correspond to the exact tested build.

## Step 5: Keep local and store flows separate

Rule:

- Local loop: `npm run dev` + unpacked extension reload.
- Store loop: `npm run build` + zip upload.

Why:
- Avoids unnecessary store submissions while still moving quickly locally.
