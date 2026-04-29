// add-week-labels.js - Add this_week_short and prev_week_short to all languages
const fs = require("fs");
const path = require("path");

const i18nPath = path.join(__dirname, "..", "i18n.js");
let content = fs.readFileSync(i18nPath, "utf8");

const translations = {
  en: { this_week_short: "This week", prev_week_short: "Last week" },
  de: { this_week_short: "Diese Woche", prev_week_short: "Letzte Woche" },
  pl: { this_week_short: "Ten tydzień", prev_week_short: "Ostatni tydzień" },
  pt: { this_week_short: "Esta semana", prev_week_short: "Semana passada" },
  ru: { this_week_short: "Эта неделя", prev_week_short: "Прошлая неделя" },
  fr: { this_week_short: "Cette semaine", prev_week_short: "Semaine dernière" },
  hi: { this_week_short: "इस सप्ताह", prev_week_short: "पिछला सप्ताह" },
  uk: { this_week_short: "Цей тиждень", prev_week_short: "Минулий тиждень" },
  ar: { this_week_short: "هذا الأسبوع", prev_week_short: "الأسبوع الماضي" },
  sq: { this_week_short: "Kjo javë", prev_week_short: "Java e kaluar" },
  sr: { this_week_short: "Ова недеља", prev_week_short: "Прошла недеља" },
  bar: { this_week_short: "De Wochn", prev_week_short: "Letzte Wochn" },
  es: { this_week_short: "Esta semana", prev_week_short: "Semana pasada" },
  it: { this_week_short: "Questa settimana", prev_week_short: "Settimana scorsa" },
  ro: { this_week_short: "Săptămâna aceasta", prev_week_short: "Săptămâna trecută" },
  nl: { this_week_short: "Deze week", prev_week_short: "Vorige week" },
  tr: { this_week_short: "Bu hafta", prev_week_short: "Geçen hafta" },
  el: { this_week_short: "Αυτή την εβδομάδα", prev_week_short: "Την περασμένη εβδομάδα" },
  hr: { this_week_short: "Ovaj tjedan", prev_week_short: "Prošli tjedan" },
  ca: { this_week_short: "Aquesta setmana", prev_week_short: "Setmana passada" },
};

Object.keys(translations).forEach((lang) => {
  const { this_week_short, prev_week_short } = translations[lang];
  
  // Find this_week: line and add two new lines after it
  const thisWeekPattern = new RegExp(
    `(\\s+this_week: "[^"]+",)`,
    "g"
  );
  
  content = content.replace(thisWeekPattern, (match) => {
    return (
      match +
      "\n    this_week_short: \"" + this_week_short + "\"," +
      "\n    prev_week_short: \"" + prev_week_short + "\","
    );
  });
});

fs.writeFileSync(i18nPath, content);
console.log("✅ Added this_week_short and prev_week_short to all 20 languages");
