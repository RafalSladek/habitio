#!/bin/bash
# generate-video.sh — creates MP4 and WebM from screenshot frames for social media
# Usage: bash .claude/skills/habitio-marketing/scripts/generate-video.sh
# Requires: ffmpeg in PATH, screenshots already in docs/

set -e

REPO_ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
DOCS_DIR="$REPO_ROOT/docs"
MARKETING_DIR="$DOCS_DIR/marketing"
CONCAT="$DOCS_DIR/_frames_video.txt"
FRAME_DURATION=2

mkdir -p "$MARKETING_DIR"

# Same order as generate-gif.js — update both if you add new screenshots to the journey
FRAMES=(
  "screenshot-onboarding.png"
  "screenshot-tracker.png"
  "screenshot-add-habit.png"
  "screenshot-journal.png"
  "screenshot-journal-summary.png"
  "screenshot-stats.png"
  "screenshot-settings.png"
)

# Verify all frames exist
missing=0
for f in "${FRAMES[@]}"; do
  if [ ! -f "$DOCS_DIR/$f" ]; then
    echo "Missing: $DOCS_DIR/$f" >&2
    missing=1
  fi
done
if [ "$missing" = "1" ]; then
  echo "Run 'node scripts/take-screenshots.js' first." >&2
  exit 1
fi

# Build ffmpeg concat demuxer input
{
  for f in "${FRAMES[@]}"; do
    echo "file '$DOCS_DIR/$f'"
    echo "duration $FRAME_DURATION"
  done
  echo "file '$DOCS_DIR/${FRAMES[-1]}'"
} > "$CONCAT"

echo "Generating MP4..."
ffmpeg -y -f concat -safe 0 -i "$CONCAT" \
  -vf "scale=393:-2:flags=lanczos" \
  -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p \
  -movflags +faststart \
  "$MARKETING_DIR/user-journey.mp4" 2>/dev/null

echo "Generating WebM..."
ffmpeg -y -f concat -safe 0 -i "$CONCAT" \
  -vf "scale=393:-2:flags=lanczos" \
  -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 \
  "$MARKETING_DIR/user-journey.webm" 2>/dev/null

rm -f "$CONCAT"

mp4_size=$(du -sh "$MARKETING_DIR/user-journey.mp4" 2>/dev/null | cut -f1)
webm_size=$(du -sh "$MARKETING_DIR/user-journey.webm" 2>/dev/null | cut -f1)
echo "✅ MP4  → docs/marketing/user-journey.mp4  ($mp4_size)"
echo "✅ WebM → docs/marketing/user-journey.webm ($webm_size)"
