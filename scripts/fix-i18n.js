const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../i18n.js');
let content = fs.readFileSync(file, 'utf8');

// Languages that need the keys
const languages = ['ar', 'ca', 'el', 'es', 'fr', 'hi', 'hr', 'it', 'nl', 'pt', 'ro', 'ru', 'sq', 'sr', 'tr', 'uk'];

// Keys to add (in order)
const newKeyLines = [
  '    diary_ph_mood: "",',
  '    mood_7day: "Mood Trends",',
  '    mood_sub: "Your emotional patterns over the past week",',
  '    coach_stats_view: "AI Coach Reflection",',
  '    tip_diary_mood: "Daily mood tracking\\n\\nResearch shows daily emotional awareness helps identify patterns, reduces stress, and improves mental health outcomes.",'
];

let modifiedCount = 0;

for (const lang of languages) {
  // Find the language block
  const langBlockStart = content.indexOf(`  ${lang}: {`);
  if (langBlockStart === -1) {
    console.log(`Language block not found for ${lang}`);
    continue;
  }

  // Find the end of this language block (start of next language or end of file)
  const nextLangStart = content.indexOf('\n  ', langBlockStart + 1);
  const langBlockEnd = nextLangStart > 0 ? nextLangStart : content.length;
  const langSection = content.substring(langBlockStart, langBlockEnd);

  // Check if the language already has the keys
  if (langSection.includes('diary_ph_mood')) {
    console.log(`Language ${lang} already has mood keys`);
    continue;
  }

  // Find tip_diary_better in this section - it might be multiline
  const tipMatch = langSection.match(/tip_diary_better:\s*[\s\S]*?"[^"]*",\s*\n/);
  if (!tipMatch) {
    console.log(`tip_diary_better not found in ${lang}`);
    continue;
  }

  // Find the position in the original content
  const tipStartInSection = langSection.indexOf(tipMatch[0]);
  const tipEndInSection = tipStartInSection + tipMatch[0].length;
  const tipEndInContent = langBlockStart + tipEndInSection;

  // Create insertion text
  const insertion = newKeyLines.join('\n') + '\n';

  // Replace in content
  content = content.substring(0, tipEndInContent) + insertion + content.substring(tipEndInContent);

  modifiedCount++;
  console.log(`Added keys to ${lang}`);
}

fs.writeFileSync(file, content, 'utf8');
console.log(`\nModified ${modifiedCount} language sections`);
