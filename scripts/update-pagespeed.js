#!/usr/bin/env node
// update-pagespeed.js — pulls the latest Lighthouse CI artifact and prepends
// a new row to the Performance table in README.md.
//
// Usage:
//   node scripts/update-pagespeed.js
//
// Requirements:
//   - gh CLI authenticated (gh auth login)
//   - Run from the repo root

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const README = path.join(__dirname, "..", "README.md");
const TMP = path.join(os.tmpdir(), "lh-latest-" + Date.now());

// ── 1. Find the most recent successful CI run with a lighthouse artifact ───────
console.log("Fetching latest CI run list…");
const runsJson = execSync(
  'gh run list --branch main --workflow "CI / CD" --limit 20 --json databaseId,conclusion,displayTitle',
  { encoding: "utf8" }
);
const runs = JSON.parse(runsJson).filter((r) => r.conclusion === "success");
if (!runs.length) {
  console.error("No successful CI runs found.");
  process.exit(1);
}

let artifact = null;
for (const run of runs) {
  try {
    execSync(`gh run download ${run.databaseId} --name lighthouse-results --dir "${TMP}"`, {
      stdio: "pipe",
    });
    artifact = { runId: run.databaseId, title: run.displayTitle };
    break;
  } catch {
    // this run has no lighthouse-results artifact — try next
  }
}

if (!artifact) {
  console.error("No Lighthouse artifact found in recent successful runs.");
  process.exit(1);
}
console.log(`Downloaded artifact from run ${artifact.runId}: ${artifact.title}`);

// ── 2. Parse LHR JSON files ────────────────────────────────────────────────────
const files = fs
  .readdirSync(TMP)
  .filter((f) => f.startsWith("lhr-") && f.endsWith(".json"))
  .map((f) => path.join(TMP, f));

if (!files.length) {
  console.error("No lhr-*.json files found in artifact.");
  process.exit(1);
}

const scores = files.map((f) => {
  const d = JSON.parse(fs.readFileSync(f, "utf8"));
  const c = d.categories || {};
  return {
    perf: Math.round((c.performance?.score ?? 0) * 100),
    a11y: Math.round((c.accessibility?.score ?? 0) * 100),
    bp: Math.round((c["best-practices"]?.score ?? 0) * 100),
    seo: Math.round((c.seo?.score ?? 0) * 100),
    ts: d.fetchTime ?? "",
  };
});

const avg = (key) => Math.round(scores.reduce((s, r) => s + r[key], 0) / scores.length);
const ts = scores[0].ts.slice(0, 16).replace("T", " "); // "YYYY-MM-DD HH:MM"

// Extract APP_VERSION from app.js at HEAD
let version = "?";
try {
  const appJs = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  const m = appJs.match(/const APP_VERSION\s*=\s*"([^"]+)"/);
  if (m) version = m[1];
} catch {
  /* ignore */
}

// Shorten commit title to ≤30 chars
const title = artifact.title.length > 30 ? artifact.title.slice(0, 29) + "…" : artifact.title;

const newRow = `| ${ts}    | ${version.padEnd(7)} | ${title.padEnd(31)} | ${String(avg("perf")).padStart(4)} | ${String(avg("a11y")).padStart(4)} | ${String(avg("bp")).padStart(14)} | ${String(avg("seo")).padStart(3)} |`;

console.log("New row:", newRow);

// ── 3. Prepend row in README table ─────────────────────────────────────────────
let readme = fs.readFileSync(README, "utf8");

// Skip if this timestamp is already the top row (idempotent re-runs)
if (readme.includes(`| ${ts}    | ${version}`)) {
  console.log("ℹ️  Table already contains this run — nothing to update.");
  fs.rmSync(TMP, { recursive: true, force: true });
  process.exit(0);
}

// Match the header + separator rows of the performance table
const headerRe = /(\| Measured at \(UTC\).*\n\| [-| ]+\n)/;
const match = readme.match(headerRe);
if (!match) {
  console.error("Could not find the Performance table header in README.md.");
  process.exit(1);
}

// Keep only last 2 existing data rows (so total stays at 3 after prepend)
const tableStart = readme.indexOf(match[0]) + match[0].length;
const after = readme.slice(tableStart);
const rows = after.match(/^\|.+\n/gm) || [];
const keep = rows.slice(0, 2); // keep 2 most-recent rows → becomes 3 with new one

readme =
  readme.slice(0, tableStart) +
  newRow +
  "\n" +
  keep.join("") +
  after.slice(keep.reduce((n, r) => n + r.length, 0));

fs.writeFileSync(README, readme, "utf8");
console.log(`✅ README.md updated — ${scores.length} LHR files averaged.`);

// cleanup
fs.rmSync(TMP, { recursive: true, force: true });
