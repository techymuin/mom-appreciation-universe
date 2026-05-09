param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'

$requiredFiles = @(
  'index.html',
  'style.css',
  'script.js',
  'README.md',
  'assets/sample-memory-1.png',
  'assets/sample-memory-2.png',
  'assets/sample-memory-3.png',
  'assets/sample-memory-4.png'
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $Root $file
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing required file: $file"
  }
}

$html = Get-Content -LiteralPath (Join-Path $Root 'index.html') -Raw
$css = Get-Content -LiteralPath (Join-Path $Root 'style.css') -Raw
$js = Get-Content -LiteralPath (Join-Path $Root 'script.js') -Raw

$checks = @(
  @{ Name = 'viewport meta'; Pass = $html -match '<meta\s+name="viewport"' },
  @{ Name = 'GitHub Pages relative CSS'; Pass = $html -match 'href="style\.css"' },
  @{ Name = 'GitHub Pages relative JS'; Pass = $html -match 'src="script\.js"' },
  @{ Name = 'welcome copy'; Pass = $html -match 'Welcome to the universe where you are the center of everything' },
  @{ Name = 'memory star UI'; Pass = $html -match 'memory-star' },
  @{ Name = 'days counter'; Pass = $html -match 'amazingDays' },
  @{ Name = 'timeline section'; Pass = $html -match 'loveTimeline' },
  @{ Name = 'photo gallery section'; Pass = $html -match 'photoGalaxy' },
  @{ Name = 'mobile breakpoint'; Pass = $css -match '@media\s+\(max-width:\s*720px\)' },
  @{ Name = 'star data'; Pass = $js -match 'const memoryStars' },
  @{ Name = 'audio guarded by user action'; Pass = $js -match 'enterButton\.addEventListener' -and $js -match 'music\.play' },
  @{ Name = 'birth date placeholder'; Pass = $js -match 'birthDate' }
)

$failed = $checks | Where-Object { -not $_.Pass }
if ($failed.Count -gt 0) {
  $names = ($failed | ForEach-Object { $_.Name }) -join ', '
  throw "Failed checks: $names"
}

Write-Host "Static site validation passed."
