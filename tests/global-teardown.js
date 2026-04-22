// @ts-check
/**
 * Playwright global teardown — converts V8 coverage JSON files written by
 * test.afterEach (in habitio.spec.js) into a single LCOV report that
 * SonarCloud reads via sonar.javascript.lcov.reportPaths.
 *
 * Requires dev dependencies:
 *   v8-to-istanbul, istanbul-lib-coverage, istanbul-lib-report, istanbul-reports
 *
 * If the packages are absent (e.g. first run before install) the teardown
 * exits silently so it never breaks the test run.
 */
const fs = require("node:fs");
const path = require("node:path");

module.exports = async function globalTeardown() {
  const nycOutput = path.join(process.cwd(), ".nyc_output");
  if (!fs.existsSync(nycOutput)) return;

  let v8ToIstanbul, libCoverage, libReport, reports;
  try {
    v8ToIstanbul = require("v8-to-istanbul");
    libCoverage = require("istanbul-lib-coverage");
    libReport = require("istanbul-lib-report");
    reports = require("istanbul-reports");
  } catch (e) {
    console.warn(
      "[coverage] Skipping LCOV generation — run: yarn add -D v8-to-istanbul istanbul-lib-coverage istanbul-lib-report istanbul-reports",
      e
    );
    return;
  }

  const files = fs.readdirSync(nycOutput).filter((f) => f.endsWith(".json"));
  if (!files.length) return;

  const SOURCE_FILES = new Set(["app.js", "suggestions.js", "i18n.js"]);
  const coverageMap = libCoverage.createCoverageMap({});

  for (const file of files) {
    /** @type {any[]} */
    const v8Entries = JSON.parse(fs.readFileSync(path.join(nycOutput, file), "utf8"));
    for (const entry of v8Entries) {
      const fileName = entry.url.replace("http://localhost:3000/", "");
      if (!SOURCE_FILES.has(fileName)) continue;
      const absPath = path.join(process.cwd(), fileName);
      if (!fs.existsSync(absPath)) continue;
      const converter = v8ToIstanbul(absPath, 0, { source: fs.readFileSync(absPath, "utf8") });
      await converter.load();
      converter.applyCoverage(entry.functions);
      coverageMap.merge(converter.toIstanbul());
    }
  }

  const coverageDir = path.join(process.cwd(), "coverage");
  fs.mkdirSync(coverageDir, { recursive: true });
  const context = libReport.createContext({ dir: coverageDir, coverageMap });
  reports.create("lcov").execute(context);
  console.log("[coverage] LCOV written to coverage/lcov.info");
};
