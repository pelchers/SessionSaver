# Guide: Pre-Launch Approval Readiness

Use this before requesting launch approval.

## Step 1: Run local quality gate

Command:

```bash
npm run prelaunch:check
```

Why:
- Ensures lint, unit tests, user-story suite, and build are all passing together.

## Step 2: Verify permission footprint

Action:

1. Open extension details in `chrome://extensions`.
2. Confirm permissions align with manifest and docs.
3. Current MVP expected permissions:
   - `storage`
   - `tabs`
   - `tabGroups`

Why:
- Approval reviewers will compare implementation vs claimed permissions.

## Step 3: Execute manual Chrome QA pass

Action:

1. Follow `.docs/planning/Chrome-Prelaunch-Test-Setup.md`.
2. Validate all stories and edge behaviors.
3. Save evidence in `user_stories/*/validation/`.

Why:
- Real runtime APIs can behave differently from mocked automation.

## Step 4: Validate approval packet docs

Checklist:

- `.docs/planning/Manifest-and-Permissions.md`
- `.docs/planning/Telemetry-and-Privacy.md`
- `.docs/planning/Release-Checklist.md`
- `user_stories/*/validation/validation.md`

Why:
- Makes review and signoff auditable and reproducible.

## Step 5: Freeze candidate build

Action:

1. Run `npm run build`.
2. Test unpacked `dist/` one final time.
3. Tag/branch candidate as needed in your workflow.

Why:
- Avoids “tested one build, shipped another” drift.
