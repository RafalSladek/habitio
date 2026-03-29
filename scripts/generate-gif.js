// generate-gif.js — creates an animated user-journey GIF from docs/ screenshots
// Usage: node scripts/generate-gif.js
// Requires: ffmpeg in PATH, screenshots already generated in docs/

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const DOCS_DIR = path.join(__dirname, "..", "docs");
const OUTPUT = path.join(DOCS_DIR, "user-journey.gif");
const CONCAT_FILE = path.join(DOCS_DIR, "_frames.txt");

// Mobile screenshots in user-journey order
const FRAMES = [
  "screenshot-onboarding.png",
  "screenshot-consent.png",
  "screenshot-tracker.png",
  "screenshot-add-habit.png",
  "screenshot-journal.png",
  "screenshot-journal-summary.png",
  "screenshot-stats.png",
  "screenshot-settings.png",
];

const FRAME_DURATION = 2; // seconds per frame
const WIDTH = 393; // half of 2× Pixel 5 width

// Verify all source frames exist
for (const f of FRAMES) {
  const p = path.join(DOCS_DIR, f);
  if (!fs.existsSync(p)) {
    console.error(`Missing screenshot: ${p}`);
    console.error("Run 'node scripts/take-screenshots.js' first.");
    process.exit(1);
  }
}

// Build ffmpeg concat demuxer input file
const lines = FRAMES.flatMap((f) => [`file '${f}'`, `duration ${FRAME_DURATION}`]);
// Concat demuxer requires repeating the last file without a duration
lines.push(`file '${FRAMES[FRAMES.length - 1]}'`);
fs.writeFileSync(CONCAT_FILE, lines.join("\n") + "\n");

// Generate GIF with palette optimisation for quality
const vf = [
  `scale=${WIDTH}:-1:flags=lanczos`,
  "split[s0][s1]",
  "[s0]palettegen=max_colors=128[p]",
  "[s1][p]paletteuse=dither=bayer:bayer_scale=3",
].join(",");

const cmd = `ffmpeg -y -f concat -safe 0 -i "${CONCAT_FILE}" -vf "${vf}" -loop 0 "${OUTPUT}"`;

try {
  console.log("Generating user-journey.gif …");
  execSync(cmd, { stdio: "pipe" });
  const size = (fs.statSync(OUTPUT).size / 1024).toFixed(0);
  console.log(`✅ ${path.relative(path.join(__dirname, ".."), OUTPUT)} (${size} KB)`);
} catch (err) {
  console.error("ffmpeg failed:", err.stderr?.toString() || err.message);
  process.exit(1);
} finally {
  fs.unlinkSync(CONCAT_FILE);
}
