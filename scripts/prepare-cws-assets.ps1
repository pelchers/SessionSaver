param(
  [string]$IconSource = ".reference/media/icon.png",
  [string]$ScreenshotSourceDir = "user_stories",
  [string]$OutputDir = ".release/cws-assets"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

function New-Dir([string]$path) {
  if (!(Test-Path $path)) { New-Item -ItemType Directory -Path $path -Force | Out-Null }
}

function Resize-SquareIcon([string]$srcPath, [int]$size, [string]$destPath) {
  $src = [System.Drawing.Image]::FromFile($srcPath)
  try {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    try {
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      try {
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.Clear([System.Drawing.Color]::Transparent)

        $scale = [Math]::Min($size / $src.Width, $size / $src.Height)
        $drawW = [int][Math]::Round($src.Width * $scale)
        $drawH = [int][Math]::Round($src.Height * $scale)
        $x = [int][Math]::Floor(($size - $drawW) / 2)
        $y = [int][Math]::Floor(($size - $drawH) / 2)
        $g.DrawImage($src, $x, $y, $drawW, $drawH)
      } finally {
        $g.Dispose()
      }
      $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $bmp.Dispose()
    }
  } finally {
    $src.Dispose()
  }
}

function Resize-Cover([string]$srcPath, [int]$targetW, [int]$targetH, [string]$destPath) {
  $src = [System.Drawing.Image]::FromFile($srcPath)
  try {
    $scale = [Math]::Max($targetW / $src.Width, $targetH / $src.Height)
    $drawW = [int][Math]::Round($src.Width * $scale)
    $drawH = [int][Math]::Round($src.Height * $scale)
    $offsetX = [int][Math]::Floor(($targetW - $drawW) / 2)
    $offsetY = [int][Math]::Floor(($targetH - $drawH) / 2)

    $bmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
    try {
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      try {
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.Clear([System.Drawing.Color]::Black)
        $g.DrawImage($src, $offsetX, $offsetY, $drawW, $drawH)
      } finally {
        $g.Dispose()
      }
      $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $bmp.Dispose()
    }
  } finally {
    $src.Dispose()
  }
}

if (!(Test-Path $IconSource)) {
  throw "Icon source not found: $IconSource"
}

$iconOutSizes = @(16, 32, 48, 128)
foreach ($size in $iconOutSizes) {
  Resize-SquareIcon -srcPath $IconSource -size $size -destPath "src/assets/icon-$size.png"
}

New-Dir $OutputDir
$screen1280Dir = Join-Path $OutputDir "screenshots-1280x800"
$screen640Dir = Join-Path $OutputDir "screenshots-640x400"
New-Dir $screen1280Dir
New-Dir $screen640Dir

$storyShots = Get-ChildItem -Recurse -File $ScreenshotSourceDir -Filter "*.png" | Where-Object { $_.FullName -match '\\validation\\' }
if ($storyShots.Count -eq 0) {
  throw "No validation screenshots found under $ScreenshotSourceDir"
}

foreach ($shot in $storyShots) {
  $slug = Split-Path (Split-Path $shot.DirectoryName -Parent) -Leaf
  $base = [System.IO.Path]::GetFileNameWithoutExtension($shot.Name)
  $name = "$slug-$base.png"

  Resize-Cover -srcPath $shot.FullName -targetW 1280 -targetH 800 -destPath (Join-Path $screen1280Dir $name)
  Resize-Cover -srcPath $shot.FullName -targetW 640 -targetH 400 -destPath (Join-Path $screen640Dir $name)
}

Resize-SquareIcon -srcPath $IconSource -size 128 -destPath (Join-Path $OutputDir 'store-icon-128.png')

Write-Output "Prepared icons + screenshots in $OutputDir"
