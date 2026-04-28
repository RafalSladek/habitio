const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf8');

// Find and replace the mood rendering section
const oldPattern = /const moodValue = entry\[field\] \? parseInt\(entry\[field\]\) : 0;[\s\S]*?const fieldUI =[\s\S]*?field === "mood"[\s\S]*?\.join\(""\) \+[\s\S]*?"<\/div>"[\s\S]*?: '<textarea class="diary-textarea diary-textarea-lg"/;

const newCode = `const moodValue = entry[field] ? parseInt(entry[field]) : 3;
  const moodEmojis = [
    { v: 1, e: "😢" },
    { v: 2, e: "😕" },
    { v: 3, e: "😐" },
    { v: 4, e: "🙂" },
    { v: 5, e: "😄" },
  ];
  
  let fieldUI;
  if (field === "mood") {
    const currentEmoji = moodEmojis.find((m) => m.v === moodValue).e;
    fieldUI =
      '<div class="diary-mood-slider">' +
      '<div class="mood-emoji-display" id="mood-emoji-display">' +
      currentEmoji +
      '</div>' +
      '<input type="range" min="1" max="5" value="' +
      moodValue +
      '" class="mood-slider" id="mood-slider" ' +
      'oninput="updateMoodPreview(this.value)" ' +
      "onchange=\\"saveDiary('" +
      k +
      "','" +
      field +
      "',this.value);handleMoodSelected(parseInt(this.value))\\" />" +
      '<div class="mood-labels">' +
      '<span>😢</span><span>😕</span><span>😐</span><span>🙂</span><span>😄</span>' +
      '</div>' +
      "</div>";
  } else {
    fieldUI = '<textarea class="diary-textarea diary-textarea-lg"`;

content = content.replace(oldPattern, newCode);

fs.writeFileSync('app.js', content, 'utf8');
console.log('Fixed mood slider code');
