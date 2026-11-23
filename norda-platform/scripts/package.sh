#!/usr/bin/env bash
# Produces NorDa-Complete-Platform.zip at the project root.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/NorDa-Complete-Platform.zip"
STAGE_NAME="NorDa-Complete-Platform"
STAGE="$ROOT/.package-stage/$STAGE_NAME"

echo "Cleaning previous stage..."
rm -rf "$ROOT/.package-stage"
mkdir -p "$STAGE"

echo "Copying project files..."
if command -v rsync >/dev/null 2>&1; then
  rsync -a \
    --exclude 'node_modules' --exclude '.pnpm-store' \
    --exclude 'dist' --exclude 'build' --exclude '.package-stage' --exclude '.git' \
    --exclude 'storage' --exclude 'data' \
    --exclude '*.sqlite' --exclude '*.sqlite-shm' --exclude '*.sqlite-wal' \
    --exclude '.env' --include '.env.example' --exclude '.env.*' \
    --exclude 'coverage' --exclude 'playwright-report' --exclude 'test-results' \
    --exclude '*.log' --exclude "$STAGE_NAME.zip" \
    "$ROOT/" "$STAGE/"
else
  echo "Error: rsync is required to package safely while preserving only .env.example." >&2
  exit 1
fi

echo "Verifying required files..."
for f in README.md .env.example package.json pnpm-workspace.yaml tsconfig.base.json \
         apps/web/package.json apps/api/package.json packages/shared/package.json; do
  if [ ! -f "$STAGE/$f" ]; then
    echo "Missing required file in stage: $f" >&2
    exit 1
  fi
done

rm -f "$OUT"
echo "Creating archive..."
( cd "$ROOT/.package-stage" && zip -r -q "$OUT" "$STAGE_NAME" )
unzip -t "$OUT" >/dev/null
echo "Created: $OUT"
echo "Size: $(du -h "$OUT" | cut -f1)"
echo "Entries: $(unzip -l "$OUT" | tail -1 | awk '{print $2}')"
