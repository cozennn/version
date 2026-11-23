# Produces NorDa-Complete-Platform.zip at the project root.
$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$Out = Join-Path $Root 'NorDa-Complete-Platform.zip'
$StageRoot = Join-Path $Root '.package-stage'
$StageName = 'NorDa-Complete-Platform'
$Stage = Join-Path $StageRoot $StageName

if (Test-Path $StageRoot) { Remove-Item -Recurse -Force $StageRoot }
New-Item -ItemType Directory -Path $Stage | Out-Null

$excludeDirs = @('node_modules', '.pnpm-store', 'dist', 'build', '.git', 'storage', 'data', 'coverage', 'playwright-report', 'test-results', '.package-stage')
function Copy-Filtered {
  param([string]$Src, [string]$Dst)
  foreach ($item in Get-ChildItem -Force -LiteralPath $Src) {
    if ($item.PSIsContainer) {
      if ($excludeDirs -contains $item.Name) { continue }
      $target = Join-Path $Dst $item.Name
      New-Item -ItemType Directory -Path $target -Force | Out-Null
      Copy-Filtered -Src $item.FullName -Dst $target
    } else {
      if ($item.Name -eq '.env') { continue }
      if ($item.Name -like '.env.*' -and $item.Name -ne '.env.example') { continue }
      if ($item.Name -eq 'NorDa-Complete-Platform.zip') { continue }
      if ($item.Name -like '*.sqlite*' -or $item.Name -like '*.log') { continue }
      Copy-Item -LiteralPath $item.FullName -Destination (Join-Path $Dst $item.Name)
    }
  }
}
Copy-Filtered -Src $Root -Dst $Stage

$required = @('README.md', '.env.example', 'package.json', 'pnpm-workspace.yaml', 'tsconfig.base.json', 'apps/web/package.json', 'apps/api/package.json', 'packages/shared/package.json')
foreach ($f in $required) {
  if (-not (Test-Path (Join-Path $Stage $f))) { throw "Missing required file in stage: $f" }
}
if (Test-Path $Out) { Remove-Item -Force $Out }
Compress-Archive -Path (Join-Path $Stage '*') -DestinationPath $Out -CompressionLevel Optimal
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($Out)
$count = $zip.Entries.Count
$zip.Dispose()
Write-Host 'Created:' $Out
Write-Host 'Entries:' $count
