const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const testsDir = path.join(repoRoot, "tests");
const outputDir = path.join(repoRoot, "badges");
const outputFile = path.join(outputDir, "tests.json");
const config = require(path.join(repoRoot, "playwright.config.js"));

function normalizeForMatch(value) {
  return value.replace(/\\/g, "/");
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

const ignorePatterns = Array.isArray(config.testIgnore)
  ? config.testIgnore
  : config.testIgnore
    ? [config.testIgnore]
    : [];

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
