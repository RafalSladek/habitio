const fs = require("fs");
let src = fs.readFileSync("i18n.js", "utf8");

// diary_mood translations for languages that are missing it
const translations = {
  pt: "Como você está se sentindo hoje?",
  ru: "Как вы себя чувствуете сегодня?",
  fr: "Comment vous sentez-vous aujourd'hui ?",
  hi: "आज आप कैसा महसूस कर रहे हैं?",
  uk: "Як ви себе почуваєте сьогодні?",
  ar: "كيف تشعر اليوم؟",
  sq: "Si ndiheni sot?",
  sr: "Како се осећате данас?",
  bar: "Wia gähts da heit?",
  es: "¿Cómo te sientes hoy?",
  it: "Come ti senti oggi?",
  ro: "Cum te simți azi?",
  nl: "Hoe voel je je vandaag?",
  tr: "Bugün nasıl hissediyorsun?",
  el: "Πώς νιώθεις σήμερα;",
  hr: "Kako se osjećaš danas?",
  ca: "Com et sents avui?",
};

for (const [lang, text] of Object.entries(translations)) {
  // Find diary_better line for this language and insert diary_mood after it
  const pattern = new RegExp(
    `(  ${lang}: \\{[\\s\\S]*?diary_better: "[^"]*",)\\n`
  );
  const match = src.match(pattern);
  if (!match) {
    console.error(`Could not find diary_step3 for lang: ${lang}`);
    continue;
  }
  const insertAfter = match[1];
  const newLines = insertAfter + `\n    diary_mood: "${text}",`;
  src = src.replace(insertAfter, newLines);
  console.log(`✓ ${lang}: ${text}`);
}

fs.writeFileSync("i18n.js", src);
console.log("\nDone!");
