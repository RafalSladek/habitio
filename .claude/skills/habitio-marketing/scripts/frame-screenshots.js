// frame-screenshots.js — wraps habit.io screenshots in a device frame (rounded corners + drop shadow)
// Usage: node .claude/skills/habitio-marketing/scripts/frame-screenshots.js
// Requires: playwright installed (yarn install && npx playwright install chromium)

const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const DOCS_DIR = path.join(__dirname, "..", "..", "..", "..", "docs");
const OUT_DIR = path.join(DOCS_DIR, "marketing", "framed");

// Mobile screenshots to frame (update if take-screenshots.js adds new ones)
const MOBILE_FRAMES = [
  "screenshot-onboarding.png",
  "screenshot-tracker.png",
  "screenshot-add-habit.png",
  "screenshot-journal.png",
  "screenshot-journal-summary.png",
  "screenshot-stats.png",
  "screenshot-settings.png",
];

// Shadow + border-radius matching modern phone aesthetics
const FRAME_STYLE = `
  border-radius: 40px;
  box-shadow:
    0 60px 120px rgba(0,0,0,0.5),
    0 20px 40px rgba(0,0,0,0.35),
    0 4px 8px rgba(0,0,0,0.2);
`;

async function frameScreenshot(page, inputPath, outputPath) {
  const imgBuffer = fs.readFileSync(inputPath);
  const base64 = imgBuffer.toString("base64");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  background: transparent;
  display: inline-block;
  padding: 40px;
}
.frame {
  ${FRAME_STYLE}
  overflow: hidden;
  display: block;
  line-height: 0;
}
img { display: block; max-width: 100%; }
</style>
</head>
<body>
<div class="frame">
  <img src="data:image/png;base64,${base64}" />
</div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: "load" });
  await page.waitForTimeout(200);
  const el = await page.$(".frame");
  await el.screenshot({ path: outputPath, omitBackground: true });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const present = MOBILE_FRAMES.filter((f) => fs.existsSync(path.join(DOCS_DIR, f)));
  const missing = MOBILE_FRAMES.filter((f) => !fs.existsSync(path.join(DOCS_DIR, f)));

  if (missing.length > 0) {
    console.warn(`\nMissing source screenshots (run take-screenshots.js first):`);
    missing.forEach((f) => console.warn(`  ✗ ${f}`));
  }

  if (present.length === 0) {
    console.error("No screenshots found in docs/. Run: node scripts/take-screenshots.js");
    process.exit(1);
  }

  console.log(`\nFraming ${present.length} screenshots → docs/marketing/framed/`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const filename of present) {
    const inputPath = path.join(DOCS_DIR, filename);
    const outputPath = path.join(OUT_DIR, filename);
    console.log(`  ${filename}`);
    await frameScreenshot(page, inputPath, outputPath);
  }

  await browser.close();
  console.log(`\n✅ Framed screenshots saved to docs/marketing/framed/`);
}

main().catch((err) => {
  console.error("frame-screenshots failed:", err);
  process.exit(1);
});
