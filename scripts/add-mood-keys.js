const fs = require('fs');

const file = 'i18n.js';
const content = fs.readFileSync(file, 'utf8');

// Parse the file to extract T object
const sandbox = {};
const vm = require('vm');
vm.runInNewContext(content + "\nthis.__translations = T;", sandbox);
const translations = sandbox.__translations;

// Get English keys
const englishKeys = Object.keys(translations.en);
console.log(`English has ${englishKeys.length} keys`);

// Check which languages are missing which keys
const moodKeys = ['diary_ph_mood', 'mood_7day', 'mood_sub', 'coach_stats_view', 'tip_diary_mood'];
const missingByLanguage = {};

Object.entries(translations).forEach(([locale, strings]) => {
  if (locale === 'en') return;
  
  const missing = moodKeys.filter(key => !(key in strings));
  if (missing.length) {
    missingByLanguage[locale] = missing;
  }
});

console.log('\nLanguages missing mood keys:');
Object.entries(missingByLanguage).forEach(([locale, keys]) => {
  console.log(`  ${locale}: ${keys.join(', ')}`);
});

console.log(`\nTotal languages needing fixes: ${Object.keys(missingByLanguage).length}`);
