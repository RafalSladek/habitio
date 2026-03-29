const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const testsDir = path.join(repoRoot, "tests");
const outputDir = path.join(repoRoot, "badges");
const outputFile = path.join(outputDir, "tests.json");

// Inline ignore list — keep in sync with playwright.config.js testIgnore
const testIgnore = ["**/habitio.spec.js"];

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

const ignorePatterns = testIgnore;

const specFiles = fs
  .readdirSync(testsDir)
  .filter((name) => name.endsWith(".spec.js"))
  .filter((name) => !isIgnored(`tests/${name}`, ignorePatterns));

const totalTests = specFiles.reduce(
  (sum, name) => sum + countActiveTests(path.join(testsDir, name)),
  0
);

const badgePayload = {
  schemaVersion: 1,
  label: "tests",
  message: `${totalTests} active`,
  color: "brightgreen",
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(badgePayload, null, 2)}\n`);

console.log(
  `[badges] Wrote ${path.relative(repoRoot, outputFile)} for ${totalTests} active Playwright tests`
);
