const fs = require("fs");
let src = fs.readFileSync("i18n.js", "utf8");

const translations = {
  de: { create_own_habit: "Eigene erstellen", suggestions_title: "Schnellstart-Ideen" },
  pl: { create_own_habit: "Stwórz własny", suggestions_title: "Pomysły na start" },
  pt: { create_own_habit: "Crie o seu", suggestions_title: "Ideias para começar" },
  ru: { create_own_habit: "Создать свою", suggestions_title: "Идеи для старта" },
  fr: { create_own_habit: "Créez le vôtre", suggestions_title: "Idées pour démarrer" },
  hi: { create_own_habit: "अपनी बनाएं", suggestions_title: "शुरुआत के आइडिया" },
  uk: { create_own_habit: "Створити свою", suggestions_title: "Ідеї для старту" },
  ar: { create_own_habit: "أنشئ عادتك", suggestions_title: "أفكار للبداية" },
  sq: { create_own_habit: "Krijo tënden", suggestions_title: "Ide për fillim" },
  sr: { create_own_habit: "Направи своју", suggestions_title: "Идеје за почетак" },
  bar: { create_own_habit: "Eigane erstejn", suggestions_title: "Schnöstart-Ideen" },
  es: { create_own_habit: "Crea el tuyo", suggestions_title: "Ideas para empezar" },
  it: { create_own_habit: "Crea la tua", suggestions_title: "Idee per iniziare" },
  ro: { create_own_habit: "Creează-ți propriul", suggestions_title: "Idei de start" },
  nl: { create_own_habit: "Maak je eigen", suggestions_title: "Snelstart-ideeën" },
  tr: { create_own_habit: "Kendininkini oluştur", suggestions_title: "Hızlı başlangıç fikirleri" },
  el: { create_own_habit: "Δημιούργησε τη δική σου", suggestions_title: "Ιδέες για ξεκίνημα" },
  hr: { create_own_habit: "Stvori svoju", suggestions_title: "Ideje za početak" },
  ca: { create_own_habit: "Crea el teu", suggestions_title: "Idees per començar" },
};

for (const [lang, keys] of Object.entries(translations)) {
  // Find the new_habit line for this language and insert after it
  const pattern = new RegExp(
    `(  ${lang}: \\{[\\s\\S]*?new_habit: "[^"]*",)\\n`
  );
  const match = src.match(pattern);
  if (!match) {
    console.error(`Could not find new_habit for lang: ${lang}`);
    continue;
  }
  const insertAfter = match[1];
  const newLines =
    insertAfter +
    `\n    create_own_habit: "${keys.create_own_habit}",` +
    `\n    suggestions_title: "${keys.suggestions_title}",`;
  src = src.replace(insertAfter, newLines);
  console.log(`✓ ${lang}`);
}

fs.writeFileSync("i18n.js", src);
console.log("\nDone!");
