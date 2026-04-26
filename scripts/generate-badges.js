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
  { name: "Desktop Chromium", label: "Desktop", envKey: "DEVICE_DESKTOP", filename: "device-desktop" },
  { name: "Pixel 5 Chromium", label: "Mobile", envKey: "DEVICE_PIXEL-5", filename: "device-pixel-5" },
  { name: "Tablet Firefox", label: "Tablet", envKey: "DEVICE_TABLET", filename: "device-tablet" },
  { name: "iPhone 12 Safari", label: "iPhone", envKey: "DEVICE_IPHONE-12", filename: "device-iphone-12" },
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

function countTestsForProject(projectName, envKey) {
  // First try to use environment variable (set by CI during test summary aggregation)
  const envValue = process.env[envKey];
  if (envValue !== undefined) {
    const count = parseInt(envValue, 10);
    console.log(`[badges] Using ${envKey}=${count} from environment`);
    return count;
  }

  // Fallback to running pytest --list (for local development)
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
projects.forEach((project) => {
  const count = countTestsForProject(project.name, project.envKey);

  const badgePayload = {
    schemaVersion: 1,
    label: project.label,
    message: `${count} tests`,
    color: count > 0 ? "brightgreen" : "lightgrey",
  };

  const outputFile = path.join(
    outputDir,
    `${project.filename}.json`
  );
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, `${JSON.stringify(badgePayload, null, 2)}\n`);
  console.log(
    `[badges] Wrote ${path.relative(repoRoot, outputFile)} for ${count} tests on ${project.name}`
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
