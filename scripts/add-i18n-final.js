const fs = require('fs');
const file = 'i18n.js';
let content = fs.readFileSync(file, 'utf8');

// Patterns for each language's tip_diary_better line
const replacements = [
  {
    lang: 'ca',
    find: 'tip_diary_better:\n      "Millora",',
    replace: 'tip_diary_better:\n      "Millora",\n    diary_ph_mood: "",\n    mood_7day: "Mood Trends",\n    mood_sub: "Your emotional patterns over the past week",\n    coach_stats_view: "AI Coach Reflection",\n    tip_diary_mood: "Daily mood tracking\\n\\nResearch shows daily emotional awareness helps identify patterns, reduces stress, and improves mental health outcomes.",'
  },
  {
    lang: 'el',
    find: 'tip_diary_better:\n      "Βελτίωση",',
    replace: 'tip_diary_better:\n      "Βελτίωση",\n    diary_ph_mood: "",\n    mood_7day: "Mood Trends",\n    mood_sub: "Your emotional patterns over the past week",\n    coach_stats_view: "AI Coach Reflection",\n    tip_diary_mood: "Daily mood tracking\\n\\nResearch shows daily emotional awareness helps identify patterns, reduces stress, and improves mental health outcomes.",'
  },
  {
    lang: 'fr',
    find: 'tip_diary_better:\n      "Intenciones de implementación\\n\\nGollwitzer (1999): les personnes qui écrivent des plans spécifiques \'si X alors Y\' ont 2–3× plus de probabilités de les respecter.",',
    replace: 'tip_diary_better:\n      "Intenciones de implementación\\n\\nGollwitzer (1999): les personnes qui écrivent des plans spécifiques \'si X alors Y\' ont 2–3× plus de probabilités de les respecter.",\n    diary_ph_mood: "",\n    mood_7day: "Mood Trends",\n    mood_sub: "Your emotional patterns over the past week",\n    coach_stats_view: "AI Coach Reflection",\n    tip_diary_mood: "Daily mood tracking\\n\\nResearch shows daily emotional awareness helps identify patterns, reduces stress, and improves mental health outcomes.",'
  },
  {
    lang: 'hi',
    find: 'tip_diary_better:\n      "कार्यान्वयन इरादे\\n\\nGollwitzer (1999): जो लोग विशिष्ट योजनाएं \'यदि X तो Y\' लिखते हैं, वे अस्पष्ट लक्ष्यों की तुलना में 2–3 गुना अधिक संभावना रखते हैं।",',
    replace: 'tip_diary_better:\n      "कार्यान्वयन इरादे\\n\\nGollwitzer (1999): जो लोग विशिष्ट योजनाएं \'यदि X तो Y\' लिखते हैं, वे अस्पष्ट लक्ष्यों की तुलना में 2–3 गुना अधिक संभावना रखते हैं।",\n    diary_ph_mood: "",\n    mood_7day: "Mood Trends",\n    mood_sub: "Your emotional patterns over the past week",\n    coach_stats_view: "AI Coach Reflection",\n    tip_diary_mood: "Daily mood tracking\\n\\nResearch shows daily emotional awareness helps identify patterns, reduces stress, and improves mental health outcomes.",'
  },
  {
    lang: 'hr',
    find: 'tip_diary_better:\n      "Poboljšanje\\n\\nGollwitzer (1999): Osobe koje pišu konkretne planove \'ako X onda Y\' imaju 2–3× veće šanse za uspjeh u usporedbi s nejasnim ciljevima.",',
    replace: 'tip_diary_better:\n      "Poboljšanje\\n\\nGollwitzer (1999): Osobe koje pišu konkretne planove \'ako X onda Y\' imaju 2–3× veće šanse za uspjeh u usporedbi s nejasnim ciljevima.",\n    diary_ph_mood: "",\n    mood_7day: "Mood Trends",\n    mood_sub: "Your emotional patterns over the past week",\n    coach_stats_view: "AI Coach Reflection",\n    tip_diary_mood: "Daily mood tracking\\n\\nResearch shows daily emotional awareness helps identify patterns, reduces stress, and improves mental health outcomes.",'
  },
  {
    lang: 'it',
    find: 'tip_diary_better:\n      "Intenzioni di implementazione\\n\\nGollwitzer (1999): chi scrive piani specifici \'se X allora Y\' ha 2–3× più probabilità di seguirli.",',
    replace: 'tip_diary_better:\n      "Intenzioni di implementazione\\n\\nGollwitzer (1999): chi scrive piani specifici \'se X allora Y\' ha 2–3× più probabilità di seguirli.",\n    diary_ph_mood: "",\n    mood_7day: "Mood Trends",\n    mood_sub: "Your emotional patterns over the past week",\n    coach_stats_view: "AI Coach Reflection",\n    tip_diary_mood: "Daily mood tracking\\n\\nResearch shows daily emotional awareness helps identify patterns, reduces stress, and improves mental health outcomes.",'
  },
  {
    lang: 'nl',
    find: 'tip_diary_better:\n      "Verbetering\\n\\nGollwitzer (1999): mensen die specifieke plannen \'als X dan Y\' schrijven, hebben 2–3× meer kans om ze na te leven.",',
    replace: 'tip_diary_better:\n      "Verbetering\\n\\nGollwitzer (1999): mensen die specifieke plannen \'als X dan Y\' schrijven, hebben 2–3× meer kans om ze na te leven.",\n    diary_ph_mood: "",\n    mood_7day: "Mood Trends",\n    mood_sub: "Your emotional patterns over the past week",\n    coach_stats_view: "AI Coach Reflection",\n    tip_diary_mood: "Daily mood tracking\\n\\nResearch shows daily emotional awareness helps identify patterns, reduces stress, and improves mental health outcomes.",'
  },
  {
    lang: 'pt',
    find: 'tip_diary_better:\n      "Intenciones de implementación\\n\\nGollwitzer (1999): as pessoas que escrevem planos específicos \'se X então Y\' têm 2–3× mais probabilidades de segui-los em comparação com metas vagas.",',
    replace: 'tip_diary_better:\n      "Intenciones de implementación\\n\\nGollwitzer (1999): as pessoas que escrevem planos específicos \'se X então Y\' têm 2–3× mais probabilidades de segui-los em comparação com metas vagas.",\n    diary_ph_mood: "",\n    mood_7day: "Mood Trends",\n    mood_sub: "Your emotional patterns over the past week",\n    coach_stats_view: "AI Coach Reflection",\n    tip_diary_mood: "Daily mood tracking\\n\\nResearch shows daily emotional awareness helps identify patterns, reduces stress, and improves mental health outcomes.",'
  },
];

let count = 0;
for (const rep of replacements) {
  if (content.includes(rep.find)) {
    content = content.replace(rep.find, rep.replace);
    count++;
    console.log(`✓ ${rep.lang}`);
  } else {
    console.log(`✗ ${rep.lang} - pattern not found`);
  }
}

fs.writeFileSync(file, content, 'utf8');
console.log(`\nTotal: ${count} languages`);
