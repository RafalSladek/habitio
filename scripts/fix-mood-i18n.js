const fs = require('fs');
const vm = require('vm');

const file = 'i18n.js';
const content = fs.readFileSync(file, 'utf8');

// Parse to get structure
const sandbox = {};
vm.runInNewContext(content + "\nthis.__translations = T;", sandbox);
const translations = sandbox.__translations;

// English reference values
const en = translations.en;
const moodKeys = [
  'diary_ph_mood',
  'mood_7day',
  'mood_sub',
  'coach_stats_view',
  'tip_diary_mood'
];

const moodValues = {
  diary_ph_mood: "",
  mood_7day: "Mood Trends",
  mood_sub: "Your emotional patterns over the past week",
  coach_stats_view: "AI Coach Reflection",
  tip_diary_mood: "Daily mood tracking\\n\\nResearch shows daily emotional awareness helps identify patterns, reduces stress, and improves mental health outcomes."
};

let lines = content.split('\n');

// Find all language sections
const languages = [];
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/^  (\w+): \{/);
  if (match) {
    languages.push({ locale: match[1], line: i });
  }
}

// For each language that needs fixes
let totalAdded = 0;
for (let idx = 0; idx < languages.length; idx++) {
  const lang = languages[idx];
  if (lang.locale === 'en') continue;

  const locale = lang.locale;
  const strings = translations[locale];
  
  // Find what's missing
  const missing = moodKeys.filter(k => !(k in strings));
  if (!missing.length) {
    console.log(`✓ ${locale}: complete`);
    continue;
  }

  // Find insertion point: line before "morning_routine:" within this language
  const langStart = lang.line;
  const langEnd = idx + 1 < languages.length ? languages[idx + 1].line : lines.length;
  
  let insertLine = -1;
  for (let i = langStart + 1; i < langEnd; i++) {
    if (lines[i].includes('morning_routine:')) {
      insertLine = i - 1;
      break;
    }
  }

  if (insertLine === -1) {
    console.log(`✗ ${locale}: could not find morning_routine`);
    continue;
  }

  // Build the keys to insert (in reverse order so we insert from bottom up)
  const newLines = [];
  for (const key of [...missing].reverse()) {
    const value = moodValues[key];
    newLines.unshift(`    ${key}: "${value}",`);
  }

  // Insert before morning_routine
  lines.splice(insertLine + 1, 0, ...newLines);
  totalAdded += missing.length;
  console.log(`✓ ${locale}: added [${missing.join(', ')}]`);
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log(`\n✓ Complete! Added ${totalAdded} keys.`);
