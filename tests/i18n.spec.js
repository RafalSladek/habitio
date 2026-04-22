// @ts-check
const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const REQUIRED_KEYS = [
  "about_on_device",
  "settings_ai_coach",
  "coach_privacy_note",
  "coach_focus_placeholder",
  "coach_include_diary",
  "coach_submit",
  "coach_loading",
  "coach_done",
  "coach_error",
  "coach_limit",
  "coach_result_title",
  "coach_result_encouragement",
  "coach_result_candid",
  "coach_result_next",
  "coach_unlock_note",
  "coach_unlock_toast",
];

test("coach translations exist for every locale", async () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "i18n.js"), "utf8");
  const sandbox = {};
  vm.runInNewContext(source + "\nthis.__translations = T;", sandbox);

  const translations = sandbox.__translations;
  const missingByLocale = Object.fromEntries(
    Object.entries(translations)
      .map(([locale, strings]) => [
        locale,
        REQUIRED_KEYS.filter((key) => !(key in /** @type {Record<string, string>} */ (strings))),
      ])
      .filter(([, missing]) => missing.length)
  );

  expect(missingByLocale).toEqual({});
});

test("every locale defines every english translation key", async () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "i18n.js"), "utf8");
  const sandbox = {};
  vm.runInNewContext(source + "\nthis.__translations = T;", sandbox);

  const translations = /** @type {Record<string, Record<string, unknown>>} */ (sandbox.__translations);
  const englishKeys = Object.keys(translations.en);
  const incompleteByLocale = Object.fromEntries(
    Object.entries(translations)
      .filter(([locale]) => locale !== "en")
      .map(([locale, strings]) => [
        locale,
        englishKeys.filter((key) => !(key in strings) || strings[key] === undefined),
      ])
      .filter(([, missing]) => missing.length)
  );

  expect(incompleteByLocale).toEqual({});
});
