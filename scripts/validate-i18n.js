const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'i18n.js'), 'utf8');
const sandbox = {};

try {
  vm.runInNewContext(source + "\nthis.__translations = T;", sandbox);
  const t = sandbox.__translations;
  const enKeys = Object.keys(t.en);
  const issues = {};
  
  Object.entries(t)
    .filter(([l]) => l !== 'en')
    .forEach(([locale, strings]) => {
      const missing = enKeys.filter(k => !(k in strings));
      if (missing.length) {
        issues[locale] = missing;
      }
    });

  if (Object.keys(issues).length === 0) {
    console.log("✓ All languages have all keys!");
  } else {
    console.log("✗ Missing keys:");
    console.log(JSON.stringify(issues, null, 2));
  }
} catch (err) {
  console.error("✗ Parsing error:", err.message);
  console.error(err.stack);
}
