const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const testsDir = path.join(repoRoot, "tests");
const outputDir = path.join(repoRoot, "badges");

// Inline ignore list — keep in sync with playwright.config.js testIgnore
const testIgnore = ["**/habitio.spec.js"];

// Browser projects from playwright.config.js
const projects = [
  "Desktop Chromium",
  "Pixel 5 Chromium",
  "Tablet Firefox",
  "iPhone 12 Safari",
];

function normalizeForMatch(value) {
  return value.replaceAll("\\", "/");
}

function isIgnored(relativePath, patterns) {
  const normalizedPath = normalizeForMatch(relativePath);
  return patterns.some((pattern) => {
    const normalizedPattern = normalizeForMatch(pattern);
    if (normalizedPattern.startsWith("**/")) {
      return normalizedPath.endsWith(normalizedPattern.slice(3));
    }
    return normalizedPath === normalizedPattern;
  });
}

function countActiveTests(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const matches = source.match(/\btest(?:\.only)?\s*\(/g);
  return matches ? matches.length : 0;
}

function countTestsForProject(projectName) {
  try {
    const output = execSync(`npx playwright test --list --project="${projectName}"`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    const match = output.match(/(\d+) tests?/);
    return match ? parseInt(match[1], 10) : 0;
  } catch {
    return 0;
  }
}

const ignorePatterns = testIgnore;

const specFiles = fs
  .readdirSync(testsDir)
  .filter((name) => name.endsWith(".spec.js"))
  .filter((name) => !isIgnored(`tests/${name}`, ignorePatterns));

let totalTests = 0;

// Create individual badges for each test file
specFiles.forEach((name) => {
  const filePath = path.join(testsDir, name);
  const count = countActiveTests(filePath);
  totalTests += count;

  const category = name.replace(".spec.js", "");
  const badgePayload = {
    schemaVersion: 1,
    label: category,
    message: `${count} tests`,
    color: count > 0 ? "brightgreen" : "lightgrey",
  };

  const outputFile = path.join(outputDir, `${category}.json`);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, `${JSON.stringify(badgePayload, null, 2)}\n`);
  console.log(
    `[badges] Wrote ${path.relative(repoRoot, outputFile)} for ${count} tests`
  );
});

// Create badges for each project/device type
projects.forEach((projectName) => {
  const count = countTestsForProject(projectName);
  const deviceLabel = projectName
    .replace(" Chromium", "")
    .replace(" Firefox", "")
    .replace(" Safari", "");

  const badgePayload = {
    schemaVersion: 1,
    label: deviceLabel,
    message: `${count} tests`,
    color: count > 0 ? "brightgreen" : "lightgrey",
  };

  const outputFile = path.join(
    outputDir,
    `device-${deviceLabel.toLowerCase().replace(/\s+/g, "-")}.json`
  );
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, `${JSON.stringify(badgePayload, null, 2)}\n`);
  console.log(
    `[badges] Wrote ${path.relative(repoRoot, outputFile)} for ${count} tests on ${projectName}`
  );
});

// Create overall badge
const overallBadge = {
  schemaVersion: 1,
  label: "tests",
  message: `${totalTests} active`,
  color: "brightgreen",
};

const outputFile = path.join(outputDir, "tests.json");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(overallBadge, null, 2)}\n`);

console.log(
  `[badges] Wrote ${path.relative(repoRoot, outputFile)} for ${totalTests} active Playwright tests`
);
