const fs = require('fs');
const path = require('path');
const vm = require('vm');

const file = 'i18n.js';
let content = fs.readFileSync(file, 'utf8');
let lines = content.split('\n');

// Parse to get all the keys
const sandbox = {};
vm.runInNewContext(content + "\nthis.__translations = T;", sandbox);
const translations = sandbox.__translations;
const englishKeys = Object.keys(translations.en);
const moodKeys = ['diary_ph_mood', 'mood_7day', 'mood_sub', 'coach_stats_view', 'tip_diary_mood'];

// Identify languages and their line numbers
const languageSections = [];
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/^  (\w+): \{/);
  if (match) {
    languageSections.push({ locale: match[1], startLine: i });
  }
}

console.log(`Found ${languageSections.length} languages`);

// For each language, add missing keys
let insertions = 0;
for (let langIdx = 0; langIdx < languageSections.length; langIdx++) {
  const lang = languageSections[langIdx];
  const nextLangStart = langIdx + 1 < languageSections.length ? languageSections[langIdx + 1].startLine : lines.length;
  
  if (lang.locale === 'en') continue;
  
  const locale = lang.locale;
  const missingKeys = moodKeys.filter(k => !(k in translations[locale]));
  
  if (!missingKeys.length) {
    console.log(`✓ ${locale}: complete`);
    continue;
  }

  // Find insertion points within this language section
  let diaryPhBetterLine = -1;
  let tipDiaryBetterLine = -1;
  let hmAllLine = -1;

  for (let i = lang.startLine + 1; i < nextLangStart; i++) {
    if (lines[i].includes('diary_ph_better:')) diaryPhBetterLine = i;
    if (lines[i].includes('tip_diary_better:')) tipDiaryBetterLine = i;
    if (lines[i].includes('hm_all:')) hmAllLine = i;
  }

  // Add keys in the right order (reverse order to keep line numbers valid)
  const additions = [];

  // 1. Add tip_diary_mood after tip_diary_better block
  if (missingKeys.includes('tip_diary_mood') && tipDiaryBetterLine > -1) {
    // Find the end of tip_diary_better (next line that has a comma and isn't part of the string)
    let endLine = tipDiaryBetterLine;
    for (let i = tipDiaryBetterLine + 1; i < nextLangStart && i < lines.length; i++) {
      endLine = i;
      if (lines[i].trim().endsWith(',')) break;
    }
    additions.push({
      line: endLine,
      key: 'tip_diary_mood',
      value: 'Daily mood tracking\\n\\nResearch shows daily emotional awareness helps identify patterns, reduces stress, and improves mental health outcomes.'
    });
  }

  // 2. Add diary_ph_mood after diary_ph_better line
  if (missingKeys.includes('diary_ph_mood') && diaryPhBetterLine > -1) {
    // Find next line after diary_ph_better
    for (let i = diaryPhBetterLine + 1; i < nextLangStart && i < lines.length; i++) {
      if (lines[i].trim().endsWith(',')) {
        additions.push({
          line: i,
          key: 'diary_ph_mood',
          value: ''
        });
        break;
      }
    }
  }

  // 3. Add mood_7day, mood_sub, coach_stats_view after hm_all or before morning_routine
  if ((missingKeys.includes('mood_7day') || missingKeys.includes('mood_sub') || missingKeys.includes('coach_stats_view')) && hmAllLine > -1) {
    for (let i = hmAllLine + 1; i < nextLangStart && i < lines.length; i++) {
      if (lines[i].trim().endsWith(',')) {
        // Get the indentation from this line
        const indent = lines[i].match(/^(\s+)/)[1];
        
        if (missingKeys.includes('coach_stats_view')) {
          additions.push({
            line: i,
            key: 'coach_stats_view',
            value: 'AI Coach Reflection',
            indent
          });
        }
        if (missingKeys.includes('mood_sub')) {
          additions.push({
            line: i,
            key: 'mood_sub',
            value: 'Your emotional patterns over the past week',
            indent
          });
        }
        if (missingKeys.includes('mood_7day')) {
          additions.push({
            line: i,
            key: 'mood_7day',
            value: 'Mood Trends',
            indent
          });
        }
        break;
      }
    }
  }

  // Apply additions in reverse line order
  additions.sort((a, b) => b.line - a.line);
  for (const add of additions) {
    const indent = add.indent || '    ';
    const newLine = `${indent}${add.key}: "${add.value}",`;
    lines.splice(add.line + 1, 0, newLine);
    console.log(`  + ${add.key}`);
    insertions++;
  }

  console.log(`✓ ${locale}: added ${additions.length} keys`);
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log(`\n✓ Done! Added ${insertions} keys total.`);
