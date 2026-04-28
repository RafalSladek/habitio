const fs = require('fs');

const file = 'i18n.js';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const targetLanguages = ['ca', 'el', 'fr', 'hi', 'hr', 'it', 'nl', 'pt', 'ro', 'ru', 'sq', 'sr', 'tr', 'uk'];

const newKeys = [
  '    diary_ph_mood: "",',
  '    mood_7day: "Mood Trends",',
  '    mood_sub: "Your emotional patterns over the past week",',
  '    coach_stats_view: "AI Coach Reflection",',
  '    tip_diary_mood: "Daily mood tracking\\n\\nResearch shows daily emotional awareness helps identify patterns, reduces stress, and improves mental health outcomes.",'
];

for (const lang of targetLanguages) {
  let langSectionStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`  ${lang}: {`)) {
      langSectionStart = i;
      break;
    }
  }
  
  if (langSectionStart === -1) {
    console.log(`✗ ${lang}: section not found`);
    continue;
  }

  let insertAfterLine = -1;
  for (let i = langSectionStart; i < lines.length; i++) {
    if (lines[i].includes('morning_routine:')) {
      insertAfterLine = i - 1;
      break;
    }
  }

  if (insertAfterLine === -1) {
    console.log(`✗ ${lang}: morning_routine not found`);
    continue;
  }

  if (lines[insertAfterLine].includes('tip_diary_mood')) {
    console.log(`✓ ${lang}: already has keys`);
    continue;
  }

  lines.splice(insertAfterLine + 1, 0, ...newKeys);
  console.log(`✓ ${lang}: keys added`);
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('\n✓ All languages updated!');
