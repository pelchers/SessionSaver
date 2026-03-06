param(
  [string]$RemoteName = "extension",
  [string]$RemoteUrl = "",
  [string]$PublicBranch = "public-dist",
  [string]$TargetBranch = "main"
)

$ErrorActionPreference = "Stop"

function Assert-LastExitCode([string]$context) {
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed during: $context"
  }
}

$repoRoot = (git rev-parse --show-toplevel).Trim()
Assert-LastExitCode "resolve repository root"
if (-not $repoRoot) {
  throw "Not inside a git repository."
}

$distPath = Join-Path $repoRoot "dist"
if (-not (Test-Path $distPath)) {
  throw "dist/ not found. Run 'npm run build' first."
}

$remoteExists = $true
git remote get-url $RemoteName > $null 2>&1
if ($LASTEXITCODE -ne 0) { $remoteExists = $false }

if (-not $remoteExists) {
  if ([string]::IsNullOrWhiteSpace($RemoteUrl)) {
    throw "Remote '$RemoteName' does not exist. Provide -RemoteUrl to add it."
  }
  git remote add $RemoteName $RemoteUrl
  Assert-LastExitCode "add remote $RemoteName"
} elseif (-not [string]::IsNullOrWhiteSpace($RemoteUrl)) {
  git remote set-url $RemoteName $RemoteUrl
  Assert-LastExitCode "set remote url for $RemoteName"
}

$worktreeDir = Join-Path $repoRoot ".publish/extension-public"
$hasBranch = $true
git show-ref --verify --quiet "refs/heads/$PublicBranch"
if ($LASTEXITCODE -ne 0) { $hasBranch = $false }

if ($hasBranch) {
  if (Test-Path $worktreeDir) {
    Push-Location $worktreeDir
    try {
      git rev-parse --abbrev-ref HEAD > $null 2>&1
      if ($LASTEXITCODE -ne 0) {
        Pop-Location
        git worktree remove $worktreeDir --force
        Assert-LastExitCode "remove stale worktree"
        git worktree add $worktreeDir $PublicBranch
        Assert-LastExitCode "recreate worktree"
      } else {
        git checkout $PublicBranch
        Assert-LastExitCode "checkout $PublicBranch in worktree"
      }
    } finally {
      if ((Get-Location).Path -eq $worktreeDir) { Pop-Location }
    }
  } else {
    git worktree add $worktreeDir $PublicBranch
    Assert-LastExitCode "add worktree for $PublicBranch"
  }
} else {
  if (Test-Path $worktreeDir) {
    git worktree remove $worktreeDir --force
    Assert-LastExitCode "remove existing worktree for orphan init"
  }
  git worktree add $worktreeDir --detach
  Assert-LastExitCode "add detached worktree"
  Push-Location $worktreeDir
  try {
    git checkout --orphan $PublicBranch
    Assert-LastExitCode "create orphan branch $PublicBranch"
  } finally {
    Pop-Location
  }
}

Push-Location $worktreeDir
try {
  Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force

  Copy-Item -Path (Join-Path $distPath "*") -Destination $worktreeDir -Recurse -Force

  $sourceCommit = (git -C $repoRoot rev-parse --short HEAD).Trim()
  $sourceBranch = (git -C $repoRoot branch --show-current).Trim()
  $publishedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss K"

  @"
# SessionSaver Extension Distribution

This repository is a distribution mirror for the SessionSaver Chrome extension.

## Contents

- Built extension package from the private source repository (`dist/` output).
- No development/planning/source files are included here.

## Build Provenance

- Source branch: $sourceBranch
- Source commit: $sourceCommit
- Published at: $publishedAt

## Local Load

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this repository root.
"@ | Set-Content README.md

  git add -A
  Assert-LastExitCode "stage dist snapshot"
  git diff --cached --quiet
  if ($LASTEXITCODE -ne 0) {
    git commit -m "publish: dist snapshot from $sourceCommit"
    Assert-LastExitCode "commit dist snapshot"
  } else {
    Write-Output "No dist changes to commit."
  }

  git push -u $RemoteName "$PublicBranch`:$TargetBranch"
  Assert-LastExitCode "push $PublicBranch to $RemoteName/$TargetBranch"
} finally {
  Pop-Location
}

Write-Output "Published dist snapshot to remote '$RemoteName' branch '$TargetBranch'."
