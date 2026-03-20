// Set GA4 user-scoped properties — called once on consent and whenever
// profile changes. User properties persist for the whole session and are
// attached to every subsequent event automatically.
function updateUserProperties() {
  if (!state.consentAnalytics) return;
  gtag("set", "user_properties", {
    age_group: state.profile.ageGroup || null,
    sex: state.profile.sex || null,
    ui_language: state.lang || null,
  });
}
function trackEvent(name, params) {
  if (!state.consentAnalytics) return;
  // Event-level params allow per-event segmentation in addition to user props
  gtag(
    "event",
    name,
    Object.assign(
      {
        age_group: state.profile.ageGroup || "unknown",
        sex: state.profile.sex || "unknown",
        ui_language: state.lang || "unknown",
      },
      params
    )
  );
}
function setConsent(granted) {
  state.consentAnalytics = !!granted;
  gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
  save();
  if (granted) {
    updateUserProperties();
    // Send the initial page_view now that consent is confirmed
    gtag("event", "page_view", { page_title: "habit.io", page_location: location.href });
  }
  document.getElementById("consent-banner")?.remove();
  renderSettings();
}

const EMOJIS = [
  "⏰",
  "🌅",
  "🏃",
  "💪",
  "🏋️",
  "🧘",
  "🚴",
  "🏊",
  "🥊",
  "⚽",
  "💧",
  "☕",
  "🥗",
  "🍎",
  "🥦",
  "🧃",
  "🚫",
  "📵",
  "🔇",
  "🛑",
  "📖",
  "✍️",
  "🧠",
  "💼",
  "🎯",
  "📝",
  "💻",
  "📊",
  "🎓",
  "📚",
  "🛏️",
  "🧹",
  "🧺",
  "🪥",
  "💊",
  "🩺",
  "❤️",
  "🤗",
  "👨‍👧‍👦",
  "📞",
  "🎸",
  "🎨",
  "📷",
  "🎮",
  "🌿",
  "🧑‍🍳",
  "🐕",
  "🚶",
  "🙏",
  "🥶",
  "💰",
  "🏠",
  "✈️",
  "🚗",
  "🎭",
  "🎵",
  "🔥",
  "⭐",
  "🌙",
  "🍷",
];

// ---------------------------------------------------------------------------
// Habit kits — contextual resource suggestions shown after first check-off
// Amazon affiliate tag: habitio-21 (amazon.de)
// amzn.to short links already carry the tag — do not modify them.
// For new amazon.de links append: ?tag=habitio-21
// ---------------------------------------------------------------------------
const AMZ_TAG = "habitio-21";
const amzDE = (path) =>
  "https://www.amazon.de" + path + (path.includes("?") ? "&" : "?") + "tag=" + AMZ_TAG;

// ---------------------------------------------------------------------------
// Micro-learning facts — shown below a habit on the day it's first checked.
// Rotates daily (seeded by date+habitId). Sources cited inline.
// ---------------------------------------------------------------------------
const HABIT_FACTS = [
  {
    match: /water|drink|hydrat/i,
    facts: [
      "Mild dehydration of just 1–2% body weight impairs memory and concentration. (Adan, 2012)",
      "Drinking 500 ml of water before a meal increases metabolism by 30% for 30–40 minutes. (Boschmann et al., 2003)",
      "The brain is about 75% water — even mild thirst reduces cognitive performance. (Riebl & Davy, 2013)",
    ],
  },
  {
    match: /read|book/i,
    facts: [
      "Reading for just 6 minutes reduces stress by 68% — more than listening to music or taking a walk. (Lewis, 2009 — University of Sussex)",
      "Regular readers have a 32% lower rate of cognitive decline in later life. (Wilson et al., 2013 — Rush University)",
      "Fiction readers develop stronger empathy and social cognition over time. (Kidd & Castano, 2013 — Science)",
    ],
  },
  {
    match: /run|jog|walk|gym|sport|fit|train|workout|exercise|step/i,
    facts: [
      "A single bout of aerobic exercise produces BDNF — a brain protein that grows new neurons. (Cotman & Berchtold, 2002)",
      "30 minutes of moderate exercise 3×/week is as effective as antidepressants for mild depression. (Blumenthal et al., 1999)",
      "Walking 8,000 steps/day is linked to a 51% lower all-cause mortality risk. (Saint-Maurice et al., 2020 — JAMA)",
    ],
  },
  {
    match: /meditat|mindful|breath|calm|relax/i,
    facts: [
      "8 weeks of mindfulness meditation visibly thickens the prefrontal cortex — the brain's decision centre. (Lazar et al., 2005 — NeuroReport)",
      "Just 10 minutes of daily meditation reduces anxiety scores by 38% after 8 weeks. (Hoge et al., 2013)",
      "Mindfulness practice lowers cortisol (the stress hormone) by an average of 14.5%. (Turakitwanakan et al., 2013)",
    ],
  },
  {
    match: /sleep|rest|nap/i,
    facts: [
      "Sleeping less than 7 hours doubles your risk of catching a cold. (Cohen et al., 2009 — JAMA)",
      "A 20-minute nap improves alertness by 54% and performance by 34% better than caffeine. (NASA study, Rosekind et al., 1995)",
      "During deep sleep, the brain clears toxic proteins linked to Alzheimer's disease. (Xie et al., 2013 — Science)",
    ],
  },
  {
    match: /journal|writ|diary|reflect/i,
    facts: [
      "Writing about emotions for 20 minutes/day for 4 days significantly improves immune function. (Pennebaker & Beall, 1986)",
      "Expressive writing reduces intrusive thoughts and improves working memory. (Klein & Boals, 2001)",
      "People who write down goals are 42% more likely to achieve them. (Matthews, 2007 — Dominican University)",
    ],
  },
  {
    match: /eat|diet|nutrit|vegetar|vegan|cook|meal|food/i,
    facts: [
      "Eating slowly and mindfully reduces calorie intake by up to 20% without feeling less full. (Andrade et al., 2008)",
      "A Mediterranean diet reduces the risk of heart disease by 30% compared to a low-fat diet. (Estruch et al., 2013 — NEJM)",
      "Adding 30g of fibre per day can reduce blood pressure as effectively as a complex diet. (Micha et al., 2010)",
    ],
  },
  {
    match: /gratitude|thank/i,
    facts: [
      "Writing 3 things you're grateful for daily for 21 days rewires the brain toward optimism. (Achor, 2010 — The Happiness Advantage)",
      "Gratitude practice increases dopamine and serotonin production — the same pathways targeted by antidepressants. (Emmons & McCullough, 2003)",
      "People who regularly express gratitude sleep on average 30 minutes more per night. (Wood et al., 2009)",
    ],
  },
  {
    match: /learn|study|language|course|skill|vocab|flash|podcast|micro/i,
    facts: [
      "Spaced repetition — reviewing material at increasing intervals — is 200% more effective than massed studying. (Ebbinghaus, 1885 — confirmed by modern fMRI)",
      "Learning a second language delays Alzheimer's onset by an average of 4.5 years. (Bialystok et al., 2007 — Neuropsychologia)",
      "The 'spacing effect' means 5 min/day every day beats 35 min in one sitting for retention. (Cepeda et al., 2006 — Psychological Bulletin)",
    ],
  },
  {
    match: /cold|shower/i,
    facts: [
      "Cold exposure activates brown fat tissue, increasing metabolism and heat generation for hours. (van Marken Lichtenbelt et al., 2009 — NEJM)",
      "A 30-second cold shower daily for 90 days reduced sick days taken by 29%. (Buijze et al., 2016 — PLOS ONE)",
    ],
  },
  {
    match: /no.screen|no.scroll|no.social|screen.free|digital/i,
    facts: [
      "Social media use above 2 hours/day is linked to a 66% higher rate of depression and anxiety in teens. (Twenge et al., 2018)",
      "Removing your phone from your bedroom improves sleep quality and reduces morning cortisol. (Murdock, 2013)",
    ],
  },
];

function getHabitFact(h, date) {
  const entry = HABIT_FACTS.find((f) => f.match.test(h.name));
  if (!entry) return null;
  // Deterministic daily rotation: seed by date string + habit id
  const seed = (date + h.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return entry.facts[seed % entry.facts.length];
}

const ATOMIC_HABITS = {
  icon: "📗",
  name: "Atomic Habits",
  hook: "The #1 book on habit science · James Clear",
  url: "https://amzn.to/3NCIaoC",
  cta: "Get the book →",
};
const KINDLE_UNLIMITED = {
  icon: "📚",
  name: "Kindle Unlimited",
  hook: "Zugang zu Millionen Büchern · 30 Tage kostenlos",
  url: amzDE("/kindle-dbs/hz/signup"),
  cta: "Kostenlos testen →",
};
const KINDLE_PW = {
  icon: "📖",
  name: "Kindle Paperwhite",
  hook: "E-Reader · wasserdicht, wochenlange Akkulaufzeit",
  url: "https://amzn.to/4shY1bp",
  cta: "Auf Amazon →",
};
const AUDIBLE = {
  icon: "🎧",
  name: "Audible",
  hook: "1 Hörbuch gratis zum Start",
  url: "https://www.amazon.de/hz/audible/mlp?tag=" + AMZ_TAG,
  cta: "Gratis starten →",
};

const HABIT_KITS = [
  {
    match: /read|book|librar/i,
    label: "📚 Your reading kit",
    items: [ATOMIC_HABITS, KINDLE_UNLIMITED],
  },
  {
    match: /run|jog|walk|gym|sport|fit|train|workout|exercise|step/i,
    label: "🏃 Your fitness kit",
    items: [
      {
        icon: "📊",
        name: "Strava",
        hook: "Track every run, ride & swim free",
        url: "https://www.strava.com",
        cta: "Join Strava →",
      },
      AUDIBLE,
    ],
  },
  {
    match: /meditat|mindful|breath|calm|relax|stress/i,
    label: "🧘 Your mindfulness kit",
    items: [
      {
        icon: "🌿",
        name: "Calm",
        hook: "7-day free trial · sleep & meditation",
        url: "https://www.calm.com",
        cta: "Try Calm →",
      },
      ATOMIC_HABITS,
    ],
  },
  {
    match: /sleep|rest|nap/i,
    label: "💤 Your sleep kit",
    items: [
      {
        icon: "📱",
        name: "Sleep Cycle",
        hook: "Smart alarm + sleep quality analysis",
        url: "https://www.sleepcycle.com",
        cta: "Download free →",
      },
      ATOMIC_HABITS,
    ],
  },
  {
    match: /eat|diet|nutrit|vegetar|vegan|cook|meal|food/i,
    label: "🥗 Your nutrition kit",
    items: [
      {
        icon: "🥘",
        name: "HelloFresh",
        hook: "Fresh recipes delivered · first box discount",
        url: "https://www.hellofresh.com",
        cta: "Claim offer →",
      },
      ATOMIC_HABITS,
    ],
  },
  {
    match: /water|drink|hydrat/i,
    label: "💧 Your hydration kit",
    items: [
      {
        icon: "📱",
        name: "WaterMinder",
        hook: "Smart daily water intake tracker",
        url: "https://waterminder.com",
        cta: "Try free →",
      },
      ATOMIC_HABITS,
    ],
  },
  {
    match: /journal|writ|diary|reflect/i,
    label: "✍️ Your writing kit",
    items: [
      {
        icon: "📓",
        name: "Day One",
        hook: "Beautiful journaling · private & secure",
        url: "https://dayoneapp.com",
        cta: "Try Day One →",
      },
      KINDLE_PW,
    ],
  },
  {
    match: /learn|study|language|course|skill/i,
    label: "🎓 Your learning kit",
    items: [KINDLE_UNLIMITED, ATOMIC_HABITS],
  },
];

function getHabitKit(h) {
  return HABIT_KITS.find((k) => k.match.test(h.name)) || null;
}

function dismissKit(id) {
  if (!state.kitsDismissed) state.kitsDismissed = {};
  state.kitsDismissed[id] = true;
  save();
  const el = document.getElementById("kit-" + id);
  if (el) el.remove();
}

const QUOTES = [
  {
    q: "Every action you take is a vote for the type of person you wish to become.",
    a: "James Clear",
  },
  {
    q: "You do not rise to the level of your goals. You fall to the level of your systems.",
    a: "James Clear",
  },
  {
    q: "Habits are the compound interest of self-improvement.",
    a: "James Clear",
  },
  {
    q: "Success is the product of daily habits — not once-in-a-lifetime transformations.",
    a: "James Clear",
  },
  {
    q: "Getting 1% better every day counts for a lot in the long run.",
    a: "James Clear",
  },
  {
    q: "You should be far more concerned with your current trajectory than with your current results.",
    a: "James Clear",
  },
  {
    q: "Be the designer of your world and not merely the consumer of it.",
    a: "James Clear",
  },
  {
    q: "The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become.",
    a: "James Clear",
  },
];

function getSuggestions() {
  return SUGGESTION_DATA.map((group) => ({
    cat: t(group.catKey),
    items: group.items
      .map((item) => ({
        ...item,
        name: t(item.nameKey),
        _p: sugPriority(item.nameKey, state.profile),
      }))
      .sort((a, b) => b._p - a._p),
  }));
}

// ═══ STATE ═══
let state = {
  habits: [],
  checks: {},
  diary: {},
  profile: { name: "", age: "", sex: "male" },
  lang: "en",
};
let selectedDate = new Date(),
  weekOffset = 0,
  diaryDate = new Date(),
  diaryStep = 0;
let modalEmoji = "🎯",
  modalCadenceType = "daily",
  modalDays = [],
  modalFreqCount = 2,
  modalFreqPeriod = "week",
  modalMorning = false,
  editId = null,
  modalAddedCount = 0;

function getFormationPhase(h) {
  if (!h.createdAt) return null;
  const days = Math.floor((new Date() - new Date(h.createdAt)) / 86400000);
  if (days >= 66) return { key: "phase_formed", cls: "phase-formed", days };
  if (days >= 50) return { key: "phase_forming", cls: "phase-forming", days };
  if (days >= 20) return { key: "phase_building", cls: "phase-building", days };
  return { key: "phase_learning", cls: "phase-learning", days };
}
function toggleModalMorning() {
  modalMorning = !modalMorning;
  const chip = document.getElementById("morning-chip");
  if (chip) chip.classList.toggle("selected", modalMorning);
}
let importOpts = { habits: true, tracking: true };
let welcomeAgeGroup = "";

const AGE_GROUPS = [
  { key: "teen", age: 15 },
  { key: "young", age: 25 },
  { key: "adult", age: 40 },
  { key: "mid", age: 55 },
  { key: "senior", age: 70 },
];
function renderAgeChips() {
  const cur = welcomeAgeGroup || state.profile.ageGroup || "";
  document.getElementById("welcome-age-chips").innerHTML = AGE_GROUPS.map(
    (g) =>
      '<div class="age-chip' +
      (cur === g.key ? " selected" : "") +
      '" onclick="setAgeGroup(\'' +
      g.key +
      "')\">" +
      t("age_" + g.key) +
      "</div>"
  ).join("");
}
function setAgeGroup(k) {
  welcomeAgeGroup = k;
  renderAgeChips();
}
let diaryTimers = {};

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "h_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
}
function save() {
  localStorage.setItem("habitio_v5", JSON.stringify(state));
}
function load() {
  try {
    // Migration: read from older keys if current key is absent
    const raw =
      localStorage.getItem("habitio_v5") ||
      localStorage.getItem("habitio_v4") ||
      localStorage.getItem("habitio_v3") ||
      localStorage.getItem("habitio_v2");
    const d = JSON.parse(raw);
    if (d && d.habits) {
      d.habits = (d.habits || []).map((h) => ({
        cadence: { type: "daily" },
        ...h,
      }));
      if (!d.diary) d.diary = {};
      if (!d.profile) d.profile = { name: "", age: "", sex: "male" };
      if (!d.profile.sex) d.profile.sex = "male";
      if (!d.lang) d.lang = "en";
      if (!d.kitsDismissed) d.kitsDismissed = {};
      if (d.consentAnalytics === undefined) d.consentAnalytics = null;
      state = d;
      // Persist under new key and clean up old keys
      localStorage.setItem("habitio_v5", JSON.stringify(state));
      localStorage.removeItem("habitio_v4");
      localStorage.removeItem("habitio_v3");
      localStorage.removeItem("habitio_v2");
      return;
    }
  } catch (e) {
    console.warn("[habitio] Failed to load saved state:", e);
  }
  state = {
    habits: [],
    checks: {},
    diary: {},
    profile: { name: "", age: "", sex: "male" },
    lang: "en",
    kitsDismissed: {},
    consentAnalytics: null,
  };
}

function fmt(d) {
  return d.toISOString().slice(0, 10);
}
function getMon(d) {
  const date = new Date(d),
    day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function addD(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function isToday(d) {
  return fmt(d) === fmt(new Date());
}
function sameDay(a, b) {
  return fmt(a) === fmt(b);
}
function dIdx(d) {
  return (d.getDay() + 6) % 7;
}

function isScheduled(h, date) {
  const c = h.cadence || { type: "daily" };
  if (c.type === "daily") return true;
  if (c.type === "specific_days") return (c.days || []).includes(dIdx(date));
  return true;
}
function cadenceLabel(c) {
  if (!c || c.type === "daily") return "";
  if (c.type === "specific_days") return (c.days || []).map((i) => DN()[i]).join(" · ");
  if (c.type === "x_per")
    return c.count + "x / " + (c.period === "week" ? t("per_week") : t("per_month"));
  return "";
}
function periodProg(h, date) {
  const c = h.cadence;
  if (!c || c.type !== "x_per") return null;
  let s, e;
  if (c.period === "week") {
    s = getMon(date);
    e = addD(s, 6);
  } else {
    s = new Date(date.getFullYear(), date.getMonth(), 1);
    e = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  let cnt = 0,
    d = new Date(s);
  while (d <= e) {
    if (state.checks[fmt(d)]?.[h.id]) cnt++;
    d = addD(d, 1);
  }
  return { done: cnt, target: c.count };
}
function getStreak(id) {
  const h = state.habits.find((x) => x.id === id);
  if (!h) return 0;
  let streak = 0,
    d = new Date();
  if (!state.checks[fmt(d)]?.[id]) d = addD(d, -1);
  for (let i = 0; i < 400; i++) {
    if (!isScheduled(h, d)) {
      d = addD(d, -1);
      continue;
    }
    if (state.checks[fmt(d)]?.[id]) {
      streak++;
      d = addD(d, -1);
    } else break;
  }
  return streak;
}

function applyLang() {
  document.querySelectorAll("[data-t]").forEach((el) => {
    const k = el.dataset.t;
    if (T[state.lang]?.[k]) el.textContent = T[state.lang][k];
  });
}

function getGreeting() {
  const h = new Date().getHours();
  const key =
    h >= 5 && h < 12
      ? "greet_morning"
      : h >= 12 && h < 17
        ? "greet_afternoon"
        : h >= 17 && h < 21
          ? "greet_evening"
          : "greet_night";
  const name = state.profile.name;
  return t(key) + (name ? ", " + name + " 👋" : " 👋");
}

let motivTimer = null;
function showMotivation(pct) {
  if (!isToday(selectedDate)) return;
  const level = pct === 100 ? "perfect" : pct >= 75 ? "great" : pct >= 40 ? "good" : "low";
  const emoji = pct === 100 ? "🏆" : pct >= 75 ? "💪" : pct >= 40 ? "✨" : "🌱";
  const pool = t("motiv_" + level);
  const msg = Array.isArray(pool) ? pool[Math.floor(Math.random() * pool.length)] : pool;
  const banner = document.getElementById("motiv-banner");
  banner.innerHTML =
    '<div class="motiv-card"><span class="motiv-emoji">' +
    emoji +
    '</span><span class="motiv-text">' +
    msg +
    "</span></div>";
  if (pct === 100) document.querySelector(".ring-container").classList.add("ring-celebrate");
  clearTimeout(motivTimer);
  motivTimer = setTimeout(() => {
    const card = banner.querySelector(".motiv-card");
    if (card) {
      card.classList.add("hide");
      setTimeout(() => {
        banner.innerHTML = "";
      }, 350);
    }
    document.querySelector(".ring-container")?.classList.remove("ring-celebrate");
  }, 3500);
}

function sugPriority(nameKey, profile) {
  const age = parseInt(profile.age) || 30;
  const sex = profile.sex || "male";
  // Five distinct age bands matching AGE_GROUPS
  const isTeen = age < 20;
  const isYoung = age >= 20 && age < 30;
  const isAdult = age >= 30 && age < 50;
  const isMid = age >= 50 && age < 65;
  const isSenior = age >= 65;
  const isM = sex === "male",
    isF = sex === "female";
  // Scores are evidence-based: higher = more relevant for that group.
  // Sources: Lally 2010 (habit formation), Haidt 2023 (teen screen harm),
  // Holt-Lunstad 2015 (social isolation), Lally/Layne Norton (sarcopenia),
  // Harvard Study of Adult Development (relationships), Walker 2017 (sleep).
  const P = {
    // ── Health & Body ──────────────────────────────────────────────
    sug_wake_up: { teen: 1, young: 2, adult: 2 },
    sug_morning_workout: { teen: 2, young: 3, adult: 2, F: 1 },
    sug_cold_shower: { teen: 2, young: 3, M: 2 },
    sug_drink_water: { teen: 2, young: 2, adult: 2, mid: 2, senior: 2 },
    sug_gym: { teen: 1, young: 3, adult: 2, M: 2 },
    // Strength training — sarcopenia prevention, critical 30+, peak urgency 50+
    sug_strength: { adult: 3, mid: 4, senior: 3, M: 1 },
    sug_yoga: { F: 2, mid: 2, senior: 2 },
    // Balance — fall prevention becomes critical after 50
    sug_balance: { mid: 2, senior: 4 },
    sug_no_alcohol: { teen: 4, young: 3, adult: 2, mid: 2, M: 2 },
    sug_no_sweets: { young: 2, adult: 2, mid: 2 },
    // Metabolism slows with age; late eating disrupts insulin — esp. women
    sug_no_late_eat: { adult: 2, mid: 3, F: 2 },
    sug_vitamins: { F: 2, mid: 2, senior: 3 },
    // Protein intake — muscle preservation from 30+ (Layne Norton research)
    sug_protein: { adult: 2, mid: 3, senior: 3, M: 1 },
    sug_sleep_11: { teen: 4, young: 3, adult: 1 },
    // Morning sunlight — circadian regulation, vitamin D (all ages; critical senior)
    sug_sunlight: { teen: 2, young: 1, adult: 2, mid: 2, senior: 3 },
    // Walking — #1 evidence-based longevity habit for 50+
    sug_walk_10k: { adult: 1, mid: 2, senior: 3 },
    sug_walk_30: { mid: 2, senior: 4, F: 1 },
    sug_meal_prep: { young: 3, adult: 2, M: 2 },

    // ── Mind & Focus ───────────────────────────────────────────────
    sug_read: { teen: 3, young: 2, mid: 1, senior: 2 },
    sug_meditate: { young: 2, adult: 3, mid: 2, F: 2 },
    sug_journal: { teen: 2, young: 2, F: 3 },
    sug_deep_work: { young: 3, adult: 2 },
    // Breathwork — stress management; most needed in high-pressure adult years
    sug_breathwork: { young: 2, adult: 3, mid: 2, F: 2 },
    sug_learn: { teen: 2, young: 2, adult: 1, senior: 2 },
    // Brain training — cognitive reserve building; critical 50+
    sug_brain_game: { mid: 3, senior: 4 },
    sug_no_coffee: { teen: 3, young: 1 },
    sug_gratitude: { teen: 2, adult: 1, mid: 2, senior: 2, F: 2 },
    sug_no_porn: { teen: 4, young: 2, M: 3 },

    // ── Digital Detox ──────────────────────────────────────────────
    // Haidt 2023: social media most harmful to teen girls
    sug_no_scrolling: { teen: 4, young: 2, F: 3 },
    sug_offline_day: { teen: 3, young: 2, F: 2 },
    sug_no_social: { teen: 4, young: 2, F: 3 },
    sug_screen_free: { teen: 3, young: 1, adult: 1, F: 2 },
    sug_phone_room: { teen: 3, adult: 1 },

    // ── Social ─────────────────────────────────────────────────────
    // Holt-Lunstad: isolation = 15 cigarettes/day; most dangerous for seniors
    sug_call_friend: { young: 1, adult: 1, mid: 2, senior: 4 },
    sug_play_kids: { adult: 3 },
    sug_hug: { adult: 2, mid: 1, senior: 2, F: 1 },
    sug_date_night: { adult: 2, mid: 1 },
    sug_thank_you: { adult: 1, mid: 2, senior: 2 },
    sug_cook: { young: 2, adult: 2, M: 1 },
    // Volunteering — sense of purpose linked to longevity (Blue Zones)
    sug_volunteer: { mid: 3, senior: 4 },

    // ── Productivity ───────────────────────────────────────────────
    sug_plan_tomorrow: { teen: 2, young: 3, adult: 2 },
    sug_job_search: { teen: 1, young: 3 },
    sug_side_project: { young: 3, adult: 2 },
    sug_finances: { adult: 3, mid: 2 },
    // Savings — compound interest window is widest in 20s-30s
    sug_savings: { young: 4, adult: 3 },
    sug_clean: { teen: 1, young: 1, adult: 1 },
    sug_inbox: { young: 2, adult: 2 },
    sug_lang_practice: { teen: 3, young: 3, adult: 1 },
    sug_driving: { teen: 3, young: 1 },
    sug_movie_lang: { teen: 2, young: 2 },

    // ── Micro Learning ─────────────────────────────────────────────
    sug_micro_vocab: { teen: 3, young: 2, senior: 1 },
    sug_micro_podcast: { young: 2, adult: 2, mid: 2 },
    sug_micro_flash: { teen: 4, young: 2 },
    sug_micro_typing: { teen: 2, young: 1 },
    sug_micro_math: { teen: 2, young: 1, senior: 2 },
    sug_micro_ted: { young: 2, adult: 2, mid: 1 },
    sug_micro_wiki: { adult: 1, mid: 1, senior: 2 },
    sug_micro_code: { teen: 3, young: 3, M: 1 },
    sug_micro_sketch: { teen: 2, mid: 1, senior: 2 },
    sug_micro_music: { teen: 2, senior: 3 },
  };
  const p = P[nameKey] || {};
  return (
    (p.M && isM ? p.M : 0) +
    (p.F && isF ? p.F : 0) +
    (p.teen && isTeen ? p.teen : 0) +
    (p.young && isYoung ? p.young : 0) +
    (p.adult && isAdult ? p.adult : 0) +
    (p.mid && isMid ? p.mid : 0) +
    (p.senior && isSenior ? p.senior : 0)
  );
}

function render() {
  applyLang();
  renderWeekNav();
  renderDays();
  renderProgress();
  renderHabits();
  document.getElementById("h-title").textContent = "habit.io";
  document.getElementById("h-greeting").textContent = getGreeting();
}
function renderWeekNav() {
  const m = getMon(addD(new Date(), weekOffset * 7)),
    s = addD(m, 6);
  document.getElementById("week-label").textContent =
    m.getDate() +
    " " +
    MN()[m.getMonth()] +
    " – " +
    s.getDate() +
    " " +
    MN()[s.getMonth()] +
    " " +
    s.getFullYear();
  document.getElementById("next-week-btn").disabled = weekOffset >= 0;
}
function renderDays() {
  const m = getMon(addD(new Date(), weekOffset * 7)),
    c = document.getElementById("days-header");
  c.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const d = addD(m, i),
      k = fmt(d),
      ch = state.checks[k] || {},
      sched = state.habits.filter((h) => isScheduled(h, d)),
      has = sched.some((h) => ch[h.id]),
      col = document.createElement("div");
    col.className =
      "day-col" +
      (sameDay(d, selectedDate) ? " active" : "") +
      (isToday(d) ? " today" : "") +
      (has ? " has-data" : "");
    col.innerHTML =
      '<div class="day-name">' +
      DN()[i] +
      '</div><div class="day-num">' +
      d.getDate() +
      '</div><div class="day-dot"></div>';
    col.addEventListener("click", () => {
      selectedDate = d;
      render();
    });
    c.appendChild(col);
  }
}
function renderProgress() {
  const k = fmt(selectedDate),
    ch = state.checks[k] || {},
    sched = state.habits.filter((h) => isScheduled(h, selectedDate)),
    total = sched.length,
    done = total ? sched.filter((h) => ch[h.id]).length : 0,
    pct = total ? Math.round((done / total) * 100) : 0,
    circ = 2 * Math.PI * 27;
  document.getElementById("ring-fill").style.strokeDashoffset = circ - (circ * pct) / 100;
  document.getElementById("ring-fill").style.stroke =
    pct === 100 ? "var(--success)" : "var(--accent)";
  document.getElementById("ring-text").textContent = pct + "%";
  if (!state.habits.length) {
    document.getElementById("progress-title").textContent = t("no_habits");
    document.getElementById("progress-subtitle").textContent = t("tap_add");
  } else {
    document.getElementById("progress-title").textContent =
      done + " / " + total + " " + t("scheduled");
    const dn = isToday(selectedDate)
      ? t("nav_today")
      : DN()[dIdx(selectedDate)] +
        ", " +
        selectedDate.getDate() +
        " " +
        MN()[selectedDate.getMonth()];
    document.getElementById("progress-subtitle").textContent = dn;
  }
}

function renderHabits() {
  const c = document.getElementById("habits-list");
  if (!state.habits.length) {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    c.innerHTML =
      '<div class="onboarding"><div class="onb-icon">🌱</div><div class="onb-title">' +
      t("onb_title") +
      '</div><div class="onb-quote">"' +
      esc(q.q) +
      '"</div><div class="onb-attr">— ' +
      esc(q.a) +
      '</div><button class="onb-btn" onclick="openAddModal()">' +
      t("onb_add") +
      '</button><button class="onb-btn ghost" onclick="openImportModal()">' +
      t("onb_import") +
      '</button><div class="onb-hint">' +
      t("onb_hint") +
      "</div></div>";
    return;
  }
  const k = fmt(selectedDate),
    ch = state.checks[k] || {};
  const sorted = [...state.habits].sort((a, b) => (b.morning ? 1 : 0) - (a.morning ? 1 : 0));
  const hasMorning = sorted.some((h) => h.morning);
  let html = "",
    morningHeaderShown = false,
    restHeaderShown = false;
  sorted.forEach((h) => {
    if (h.morning && !morningHeaderShown) {
      html += '<div class="habit-section-label">☀️ ' + t("morning_routine") + "</div>";
      morningHeaderShown = true;
    }
    if (!h.morning && hasMorning && !restHeaderShown) {
      html +=
        '<div class="habit-section-label" style="color:var(--text-muted)">· ' +
        t("habits") +
        "</div>";
      restHeaderShown = true;
    }
    const sched = isScheduled(h, selectedDate),
      checked = !!ch[h.id],
      streak = getStreak(h.id),
      cL = cadenceLabel(h.cadence),
      pp = periodProg(h, selectedDate),
      phase = getFormationPhase(h);
    let meta = "";
    if (streak > 0)
      meta +=
        '<span class="streak-tag" onclick="event.stopPropagation();showTip(this,t(\'tip_streak\'))">' +
        streak +
        "d 🔥</span>";
    if (cL) meta += '<span class="cadence-tag">' + cL + "</span>";
    if (pp) meta += '<span class="cadence-tag">' + pp.done + "/" + pp.target + "</span>";
    if (phase)
      meta +=
        '<span class="phase-tag ' +
        phase.cls +
        '" onclick="event.stopPropagation();showTip(this,t(\'tip_' +
        phase.cls.replace("phase-", "phase_") +
        "'))\">" +
        t(phase.key) +
        " " +
        phase.days +
        "d</span>";
    if (h.source === "custom") meta += '<span class="own-badge">' + t("own_badge") + "</span>";
    if (!meta) meta = '<span style="opacity:.4">—</span>';
    const cls =
      "habit-card" +
      (checked ? " checked" : "") +
      (!sched && h.cadence?.type === "specific_days" ? " off-day" : "");
    html +=
      '<div class="' +
      cls +
      '" onclick="toggleHabit(\'' +
      h.id +
      '\')"><div class="habit-emoji">' +
      h.emoji +
      '</div><div class="habit-info"><div class="habit-name">' +
      esc(h.name) +
      '</div><div class="habit-meta">' +
      meta +
      '</div></div><div class="habit-check"><span class="check-icon">✓</span></div></div>';
    // Micro-fact: shown every time this habit is checked today (rotates daily)
    const isTodaySelected = fmt(selectedDate) === fmt(new Date());
    if (checked && isTodaySelected) {
      const fact = getHabitFact(h, fmt(selectedDate));
      if (fact) {
        html += '<div class="habit-fact">💡 ' + esc(fact) + "</div>";
      }
    }
    // Habit kit: show once after first check-off today, if not dismissed
    const kit = getHabitKit(h);
    if (checked && isToday && kit && !(state.kitsDismissed || {})[h.id]) {
      html +=
        '<div class="habit-kit" id="kit-' +
        h.id +
        '">' +
        '<div class="hk-header"><span class="hk-label">' +
        kit.label +
        "</span>" +
        '<button class="hk-dismiss" onclick="event.stopPropagation();dismissKit(\'' +
        h.id +
        '\')" aria-label="Dismiss">×</button></div>' +
        kit.items
          .map(
            (item) =>
              '<div class="hk-item"><span class="hk-icon">' +
              item.icon +
              "</span>" +
              '<div class="hk-info"><div class="hk-name">' +
              esc(item.name) +
              "</div>" +
              '<div class="hk-hook">' +
              esc(item.hook) +
              "</div></div>" +
              '<a class="hk-cta" href="' +
              item.url +
              '" target="_blank" rel="noopener sponsored" onclick="event.stopPropagation()">' +
              esc(item.cta) +
              "</a></div>"
          )
          .join("") +
        "</div>";
    }
  });
  c.innerHTML = html;
  if (state.habits.length === 1) {
    const k = fmt(selectedDate),
      ch = state.checks[k] || {};
    const allUnchecked = state.habits.every((h) => !ch[h.id]);
    if (allUnchecked) {
      c.insertAdjacentHTML(
        "beforeend",
        '<div class="first-habit-cta">' +
          '<div class="fhc-icon">👆</div>' +
          '<div class="fhc-text">Tap the habit above to log your first check-in!</div>' +
          "</div>"
      );
    }
  }
}
function toggleHabit(id) {
  const k = fmt(selectedDate);
  if (!state.checks[k]) state.checks[k] = {};
  state.checks[k][id] = !state.checks[k][id];
  if (!state.checks[k][id]) delete state.checks[k][id];
  const th = state.habits.find((h) => h.id === id);
  const isChecked = !!state.checks[k]?.[id];
  trackEvent(isChecked ? "habit_complete" : "habit_uncheck", {
    habit_name: th?.name,
    habit_emoji: th?.emoji,
    cadence_type: th?.cadence?.type,
    date: k,
    is_today: isToday(selectedDate),
  });
  save();
  render();
  // animate the tapped card
  const card = document.querySelector("[onclick=\"toggleHabit('" + id + "')\"]");
  if (card && state.checks[k]?.[id]) {
    card.classList.add("just-checked");
    setTimeout(() => card.classList.remove("just-checked"), 400);
  }
  // motivational banner on today
  if (isToday(selectedDate) && state.habits.length) {
    const ch = state.checks[k] || {};
    const sched = state.habits.filter((h) => isScheduled(h, selectedDate));
    const pct = sched.length
      ? Math.round((sched.filter((h) => ch[h.id]).length / sched.length) * 100)
      : 0;
    showMotivation(pct);
  }
}
function changeWeek(dir) {
  weekOffset += dir;
  if (weekOffset > 0) weekOffset = 0;
  selectedDate = weekOffset === 0 ? new Date() : getMon(addD(new Date(), weekOffset * 7));
  render();
}

// ═══ WELCOME ═══
function showWelcome() {
  const wl = document.getElementById("welcome-modal");
  document.getElementById("welcome-title").textContent = t("welcome");
  document.getElementById("welcome-sub").textContent = t("welcome_sub");
  document.getElementById("wl-name-label").textContent = t("your_name");
  document.getElementById("wl-age-label").textContent = t("your_age");
  document.getElementById("wl-sex-label").textContent = t("your_sex");
  document.getElementById("sex-male-lbl").textContent = t("sex_male");
  document.getElementById("sex-female-lbl").textContent = t("sex_female");
  document.getElementById("sex-prefer-lbl").textContent = t("sex_prefer");
  setSex(state.profile.sex || "male");
  document.getElementById("wl-lang-label").textContent = t("language");
  document.getElementById("welcome-go-btn").textContent = t("lets_go");
  welcomeAgeGroup = state.profile.ageGroup || "";
  renderAgeChips();
  const lc = document.getElementById("welcome-lang-chips");
  const LANGS = {
    en: "🇬🇧 English",
    de: "🇩🇪 Deutsch",
    pl: "🇵🇱 Polski",
    pt: "🇧🇷 Português",
    fr: "🇫🇷 Français",
    ru: "🇷🇺 Русский",
    hi: "🇮🇳 हिन्दी",
    uk: "🇺🇦 Українська",
    ar: "🇪🇬 عربي مصري",
    sq: "🇦🇱 Shqip",
    sr: "🇷🇸 Srpski",
    bar: "🏔️ Bayrisch",
  };
  lc.innerHTML =
    '<select class="lang-select" onchange="setWelcomeLang(this.value)">' +
    Object.keys(LANGS)
      .map(
        (l) =>
          '<option value="' +
          l +
          '"' +
          (state.lang === l ? " selected" : "") +
          ">" +
          LANGS[l] +
          "</option>"
      )
      .join("") +
    "</select>";
  document.getElementById("welcome-name").value = state.profile.name || "";
  wl.classList.add("show");
  setTimeout(() => document.getElementById("welcome-name").focus(), 300);
}
function setWelcomeLang(l) {
  state.lang = l;
  save();
  showWelcome();
  render();
}
function setSex(val) {
  state.profile.sex = val;
  document.getElementById("sex-male").classList.toggle("active", val === "male");
  document.getElementById("sex-female").classList.toggle("active", val === "female");
  document.getElementById("sex-prefer").classList.toggle("active", val === "prefer");
}
function finishWelcome() {
  const n = document.getElementById("welcome-name").value.trim();
  const g = welcomeAgeGroup;
  state.profile.name = n;
  state.profile.ageGroup = g;
  state.profile.age = g ? String((AGE_GROUPS.find((x) => x.key === g) || {}).age || "") : "";
  save();
  updateUserProperties();
  document.getElementById("welcome-modal").classList.remove("show");
  render();
  showConsentBannerIfNeeded();
}

// ═══ ADD MODAL ═══
function openAddModal(hid) {
  editId = hid || null;
  const sa = document.getElementById("suggestions-area");
  if (editId) {
    const h = state.habits.find((x) => x.id === editId);
    document.getElementById("habit-name-input").value = h.name;
    modalEmoji = h.emoji;
    const c = h.cadence || { type: "daily" };
    modalCadenceType = c.type;
    modalDays = c.type === "specific_days" ? [...(c.days || [])] : [];
    modalFreqCount = c.type === "x_per" ? c.count || 2 : 2;
    modalFreqPeriod = c.type === "x_per" ? c.period || "week" : "week";
    modalMorning = !!h.morning;
    document.getElementById("modal-title").textContent = t("edit_habit");
    document.getElementById("modal-save-btn").textContent = t("save_changes");
    sa.innerHTML = "";
  } else {
    document.getElementById("habit-name-input").value = "";
    modalEmoji = "🎯";
    modalCadenceType = "daily";
    modalDays = [];
    modalFreqCount = 2;
    modalFreqPeriod = "week";
    modalMorning = false;
    modalAddedCount = 0;
    updateModalDoneState();
    document.getElementById("modal-title").textContent = t("new_habit");
    document.getElementById("modal-save-btn").textContent = t("add_habit");
    renderSuggestions();
  }
  const mc = document.getElementById("morning-chip");
  if (mc) mc.classList.toggle("selected", modalMorning);
  const mcl = document.getElementById("morning-chip-lbl");
  if (mcl) mcl.textContent = t("morning_routine");
  const lbl = document.getElementById("lbl-morning");
  if (lbl) lbl.textContent = t("options_label");
  document.getElementById("habit-name-input").placeholder = t("type_own");
  renderEmojiPicker();
  renderCadence();
  document.getElementById("add-modal").classList.add("show");
  document.getElementById("fab-add")?.classList.remove("visible");
  if (!editId) setTimeout(() => document.getElementById("habit-name-input").focus(), 300);
}
function closeAddModal() {
  document.getElementById("add-modal").classList.remove("show");
  // Restore FAB visibility if on tracker page
  const tracker = document.getElementById("page-tracker");
  if (tracker?.classList.contains("active"))
    document.getElementById("fab-add")?.classList.add("visible");
  editId = null;
  modalAddedCount = 0;
  updateModalDoneState();
}
function updateModalDoneState() {
  const bar = document.getElementById("modal-done-bar");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  if (!bar || !cancelBtn) return;
  if (modalAddedCount > 0) {
    bar.classList.add("show");
    document.getElementById("modal-done-label").textContent =
      modalAddedCount === 1
        ? t("modal_added_one")
        : t("modal_added_many").replace("{n}", modalAddedCount);
    cancelBtn.textContent = t("done_added").replace("{n}", modalAddedCount);
    cancelBtn.classList.add("done-state");
  } else {
    bar.classList.remove("show");
    cancelBtn.textContent = t("btn_cancel");
    cancelBtn.classList.remove("done-state");
  }
}
function renderSuggestions() {
  const existing = new Set(state.habits.map((h) => h.name.toLowerCase()));
  let html = '<div class="suggestions">';
  getSuggestions().forEach((cat) => {
    const items = cat.items.filter((s) => !existing.has(s.name.toLowerCase()));
    if (!items.length) return;
    html += '<div class="suggestion-cat">' + esc(cat.cat) + "</div>";
    items.forEach((s) => {
      const cL = cadenceLabel(s.cadence) || t("cad_daily");
      html +=
        '<div class="suggestion-item" onclick="addSuggestion(this)" data-name="' +
        esc(s.name) +
        '" data-emoji="' +
        s.emoji +
        "\" data-cadence='" +
        esc(JSON.stringify(s.cadence)) +
        '\'><span class="s-emoji">' +
        s.emoji +
        '</span><span class="s-info"><span class="s-name">' +
        esc(s.name) +
        '</span><span class="s-meta"><span class="s-cad">' +
        cL +
        "</span>" +
        (s._p > 0 ? '<span class="s-for-you">★ ' + t("for_you") + "</span>" : "") +
        '</span></span><span class="s-add">+</span></div>';
    });
  });
  html += "</div>";
  document.getElementById("suggestions-area").innerHTML = html;
}
function addSuggestion(el) {
  const name = el.dataset.name,
    emoji = el.dataset.emoji,
    cadence = JSON.parse(el.dataset.cadence);
  state.habits.push({
    id: uid(),
    name,
    emoji,
    cadence,
    morning: false,
    source: "suggested",
    createdAt: fmt(new Date()),
  });
  save();
  el.remove();
  render();
  modalAddedCount++;
  updateModalDoneState();
  trackEvent("habit_add", {
    habit_name: name,
    habit_emoji: emoji,
    cadence_type: cadence.type,
    source: "suggestion",
  });
  showToast(emoji + " " + name + "!");
}
function renderEmojiPicker() {
  document.getElementById("emoji-picker").innerHTML = EMOJIS.map(
    (e) =>
      '<div class="emoji-option' +
      (e === modalEmoji ? " selected" : "") +
      '" onclick="pickEmoji(this,\'' +
      e +
      "')\">" +
      e +
      "</div>"
  ).join("");
}
function pickEmoji(el, e) {
  modalEmoji = e;
  document.querySelectorAll(".emoji-option").forEach((x) => x.classList.remove("selected"));
  el.classList.add("selected");
}
function renderCadence() {
  const types = [
    { k: "daily", l: t("cad_daily") },
    { k: "specific_days", l: t("cad_specific") },
    { k: "x_per", l: t("cad_xper") },
  ];
  document.getElementById("cadence-chips").innerHTML = types
    .map(
      (tp) =>
        '<div class="cadence-chip' +
        (modalCadenceType === tp.k ? " selected" : "") +
        '" onclick="setCadType(\'' +
        tp.k +
        "')\">" +
        tp.l +
        "</div>"
    )
    .join("");
  renderCadDetail();
}
function setCadType(tp) {
  modalCadenceType = tp;
  renderCadence();
}
function renderCadDetail() {
  const el = document.getElementById("cadence-detail");
  if (modalCadenceType === "daily") {
    el.innerHTML = "";
    return;
  }
  if (modalCadenceType === "specific_days") {
    el.innerHTML =
      '<div class="day-chips">' +
      DN()
        .map(
          (d, i) =>
            '<div class="day-chip' +
            (modalDays.includes(i) ? " selected" : "") +
            '" onclick="togDay(' +
            i +
            ')">' +
            d +
            "</div>"
        )
        .join("") +
      "</div>";
    return;
  }
  el.innerHTML =
    '<div class="freq-row"><input class="freq-input" id="freq-count" type="number" min="1" max="30" value="' +
    modalFreqCount +
    '" onchange="modalFreqCount=Math.max(1,+this.value)"><span class="freq-label">' +
    t("times_per") +
    '</span><div class="period-chips"><div class="period-chip' +
    (modalFreqPeriod === "week" ? " selected" : "") +
    '" onclick="setFP(\'week\')">' +
    t("per_week") +
    '</div><div class="period-chip' +
    (modalFreqPeriod === "month" ? " selected" : "") +
    '" onclick="setFP(\'month\')">' +
    t("per_month") +
    "</div></div></div>";
}
function togDay(i) {
  const x = modalDays.indexOf(i);
  if (x >= 0) modalDays.splice(x, 1);
  else modalDays.push(i);
  renderCadDetail();
}
function setFP(p) {
  modalFreqPeriod = p;
  renderCadDetail();
}
function saveHabit() {
  const name = document.getElementById("habit-name-input").value.trim();
  if (!name) {
    showToast(t("enter_name"));
    return;
  }
  let cadence;
  if (modalCadenceType === "daily") cadence = { type: "daily" };
  else if (modalCadenceType === "specific_days") {
    if (!modalDays.length) {
      showToast(t("select_day"));
      return;
    }
    cadence = { type: "specific_days", days: [...modalDays].sort() };
  } else {
    const ct = document.getElementById("freq-count");
    cadence = {
      type: "x_per",
      count: ct ? Math.max(1, +ct.value) : modalFreqCount,
      period: modalFreqPeriod,
    };
  }
  if (editId) {
    const h = state.habits.find((x) => x.id === editId);
    h.name = name;
    h.emoji = modalEmoji;
    h.cadence = cadence;
    h.morning = modalMorning;
    showToast(t("habit_updated"));
  } else {
    state.habits.push({
      id: uid(),
      name,
      emoji: modalEmoji,
      cadence,
      morning: modalMorning,
      source: "custom",
      createdAt: fmt(new Date()),
    });
    showToast(t("habit_added"));
  }
  trackEvent(editId ? "habit_edit" : "habit_add", {
    habit_name: name,
    habit_emoji: modalEmoji,
    cadence_type: cadence.type,
    is_morning: modalMorning,
  });
  save();
  closeAddModal();
  render();
}

// ═══ DIARY ═══
const DIARY_FIELDS = ["grateful", "affirm", "good", "better"];
const DIARY_ICONS = { grateful: "🙏", affirm: "💪", good: "⭐", better: "🚀" };

function calcDiaryStep() {
  const entry = state.diary[fmt(diaryDate)] || {};
  const first = DIARY_FIELDS.findIndex((f) => !entry[f]?.trim());
  return first < 0 ? DIARY_FIELDS.length : first; // all answered → summary
}

function renderDiary() {
  const c = document.getElementById("diary-content");
  document.getElementById("diary-header").textContent = t("nav_journal");
  const k = fmt(diaryDate);
  const entry = state.diary[k] || { grateful: "", affirm: "", good: "", better: "" };

  const dn = isToday(diaryDate)
    ? t("nav_today")
    : DN()[dIdx(diaryDate)] + ", " + diaryDate.getDate() + " " + MN()[diaryDate.getMonth()];

  const dateNav =
    '<div class="diary-date-nav">' +
    '<button class="nav-btn" onclick="changeDiaryDay(-1)">&lsaquo;</button>' +
    '<span class="diary-date">' +
    dn +
    "</span>" +
    '<button class="nav-btn" onclick="changeDiaryDay(1)" ' +
    (isToday(diaryDate) ? "disabled" : "") +
    ">&rsaquo;</button>" +
    "</div>";

  const dots = DIARY_FIELDS.map((_, i) => {
    const cl = i < diaryStep ? "done" : i === diaryStep ? "active" : "";
    return '<div class="diary-dot ' + cl + '"></div>';
  }).join("");
  const progress = '<div class="diary-progress">' + dots + "</div>";

  // ── Summary screen ──
  if (diaryStep >= DIARY_FIELDS.length) {
    const filled = DIARY_FIELDS.filter((f) => entry[f]?.trim()).length;
    const suggestions = SUGGESTION_DATA.flatMap((cat) =>
      cat.items.map((s) => ({ name: t(s.nameKey), emoji: s.emoji, nameKey: s.nameKey }))
    )
      .filter((s) => !state.habits.find((h) => h.name === s.name))
      .slice(0, 3);

    c.innerHTML =
      dateNav +
      progress +
      '<div class="diary-summary">' +
      '<div class="diary-summary-icon">✨</div>' +
      '<div class="diary-summary-title">' +
      t("diary_complete") +
      "</div>" +
      '<div class="diary-summary-meta">' +
      filled +
      " / " +
      DIARY_FIELDS.length +
      " " +
      t("diary_filled") +
      "</div>" +
      (suggestions.length
        ? '<div class="diary-suggest-wrap">' +
          '<div class="diary-suggest-lbl">' +
          t("diary_suggest_label") +
          "</div>" +
          suggestions
            .map(
              (s) =>
                '<button class="diary-habit-chip" onclick="addFromDiary(\'' +
                s.nameKey +
                "'," +
                '"' +
                s.emoji +
                '"' +
                ')">' +
                s.emoji +
                " " +
                esc(s.name) +
                ' <span class="chip-add">+ Add</span></button>'
            )
            .join("") +
          "</div>"
        : "") +
      '<button class="diary-edit-btn" onclick="diaryStep=0;renderDiary()">← ' +
      t("diary_edit") +
      "</button>" +
      "</div>";
    return;
  }

  // ── Single prompt step ──
  const field = DIARY_FIELDS[diaryStep];
  c.innerHTML =
    dateNav +
    progress +
    '<div class="diary-step-card">' +
    '<div class="diary-step-icon">' +
    DIARY_ICONS[field] +
    "</div>" +
    '<div class="diary-step-label">' +
    esc(t("diary_" + field)) +
    tipBtn("tip_diary_" + field) +
    "</div>" +
    '<textarea class="diary-textarea diary-textarea-lg" placeholder="' +
    esc(t("diary_ph_" + field)) +
    '" ' +
    "oninput=\"saveDiary('" +
    k +
    "','" +
    field +
    '\',this.value)" id="d_' +
    field +
    '">' +
    esc(entry[field] || "") +
    "</textarea>" +
    '<div class="diary-saved" id="ds_' +
    field +
    '">' +
    t("diary_saved") +
    " ✓</div>" +
    "</div>" +
    '<div class="diary-step-nav">' +
    (diaryStep > 0
      ? '<button class="diary-back-btn" onclick="diaryStepGo(-1)">← ' +
        t("diary_back") +
        "</button>"
      : "<span></span>") +
    '<button class="diary-next-btn" onclick="diaryStepGo(1)">' +
    (diaryStep < DIARY_FIELDS.length - 1 ? t("diary_next") + " →" : "✓ " + t("diary_done")) +
    "</button>" +
    "</div>";

  setTimeout(() => document.getElementById("d_" + field)?.focus(), 80);
}

function diaryStepGo(dir) {
  diaryStep = Math.max(0, Math.min(DIARY_FIELDS.length, diaryStep + dir));
  renderDiary();
}

function changeDiaryDay(dir) {
  diaryDate = addD(diaryDate, dir);
  if (diaryDate > new Date()) diaryDate = new Date();
  diaryStep = calcDiaryStep();
  renderDiary();
}

function addFromDiary(nameKey, emoji) {
  const name = t(nameKey);
  if (state.habits.find((h) => h.name === name)) return;
  state.habits.push({
    id: uid(),
    name,
    emoji,
    cadence: { type: "daily" },
    morning: false,
    createdAt: fmt(new Date()),
    source: "suggested",
  });
  save();
  showToast(emoji + " " + name + " — " + t("sug_added"));
  renderDiary();
}
function saveDiary(k, field, val) {
  if (!state.diary[k]) state.diary[k] = { grateful: "", affirm: "", good: "", better: "" };
  const wasEmpty = !state.diary[k][field]?.trim();
  state.diary[k][field] = val;
  if (wasEmpty && val.trim()) trackEvent("journal_write", { section: field, date: k });
  save();
  clearTimeout(diaryTimers[field]);
  const el = document.getElementById("ds_" + field);
  el.classList.add("show");
  diaryTimers[field] = setTimeout(() => el.classList.remove("show"), 1500);
}

// ═══ IMPORT / EXPORT ═══
function openImportModal() {
  importOpts = { habits: true, tracking: true };
  document.getElementById("import-title").textContent = t("import_title");
  document.getElementById("import-desc").textContent = t("import_desc");
  document.getElementById("import-go-btn").textContent = t("imp_go");
  document.getElementById("import-options").innerHTML =
    '<div class="import-option selected" id="imp-habits" onclick="toggleImpOpt(\'habits\')"><span class="io-icon">📋</span><div class="io-info"><div class="io-title">' +
    t("imp_habits_title") +
    '</div><div class="io-desc">' +
    t("imp_habits_desc") +
    '</div></div><div class="io-check">✓</div></div>' +
    '<div class="import-option selected" id="imp-tracking" onclick="toggleImpOpt(\'tracking\')"><span class="io-icon">📊</span><div class="io-info"><div class="io-title">' +
    t("imp_tracking_title") +
    '</div><div class="io-desc">' +
    t("imp_tracking_desc") +
    '</div></div><div class="io-check">✓</div></div>';
  document.getElementById("import-modal").classList.add("show");
}
function closeImportModal() {
  document.getElementById("import-modal").classList.remove("show");
}
function toggleImpOpt(k) {
  importOpts[k] = !importOpts[k];
  document.getElementById("imp-" + k).classList.toggle("selected", importOpts[k]);
  if (!importOpts.habits && !importOpts.tracking) {
    importOpts.habits = true;
    document.getElementById("imp-habits").classList.add("selected");
  }
}
function doImport() {
  const i = document.createElement("input");
  i.type = "file";
  i.accept = ".json";
  i.onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (!d.habits || !Array.isArray(d.habits)) {
          showToast(t("invalid_file"));
          return;
        }
        if (importOpts.habits) {
          const existing = new Set(state.habits.map((h) => h.name.toLowerCase()));
          const nw = d.habits
            .filter((h) => !existing.has(h.name.toLowerCase()))
            .map((h) => ({
              ...h,
              id: uid(),
              cadence: h.cadence || { type: "daily" },
            }));
          state.habits = [...state.habits, ...nw];
        }
        if (importOpts.tracking) {
          if (d.checks)
            Object.keys(d.checks).forEach((day) => {
              if (!state.checks[day]) state.checks[day] = {};
              Object.keys(d.checks[day]).forEach((hid) => {
                const oh = d.habits.find((h) => h.id === hid);
                if (oh) {
                  const nh = state.habits.find(
                    (h) => h.name.toLowerCase() === oh.name.toLowerCase()
                  );
                  if (nh && d.checks[day][hid]) state.checks[day][nh.id] = true;
                }
              });
            });
          if (d.diary)
            Object.keys(d.diary).forEach((day) => {
              if (!state.diary[day]) state.diary[day] = d.diary[day];
            });
        }
        if (d.profile && !state.profile.name) {
          state.profile = d.profile;
        }
        if (d.lang && !state.profile.name) {
          state.lang = d.lang;
        }
        save();
        render();
        closeImportModal();
        showToast(t("imported"));
        trackEvent("data_import", {
          imported_habits: importOpts.habits,
          imported_tracking: importOpts.tracking,
        });
      } catch {
        showToast(t("error_file"));
      }
    };
    r.readAsText(f);
  };
  i.click();
}
function exportData() {
  const b = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = "habitio_backup_" + fmt(new Date()) + ".json";
  a.click();
  showToast(t("exported"));
  trackEvent("data_export", {});
}
function shareApp() {
  const url = "https://rafalsladek.github.io/habitio/";
  if (navigator.share) {
    navigator
      .share({ title: "habit.io", text: t("share_text"), url })
      .then(() => gtag("event", "share", { method: "web_share_api", content_type: "app" }))
      .catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      showToast(t("share_copied"));
      gtag("event", "share", { method: "clipboard", content_type: "app" });
    });
  }
}

// ═══ STATS ═══
function renderStats() {
  const c = document.getElementById("stats-content");
  document.getElementById("stats-header").textContent = t("nav_stats");
  if (!state.habits.length) {
    c.innerHTML =
      '<div class="empty-state" style="padding:48px 20px;text-align:center"><div style="font-size:48px;margin-bottom:12px;opacity:.5">📊</div><div style="font-size:16px;font-weight:600;margin-bottom:4px;color:var(--text-dim)">' +
      t("no_data") +
      '</div><div style="font-size:13px;color:var(--text-muted)">' +
      t("no_data_sub") +
      "</div></div>";
    return;
  }
  const mon = getMon(new Date());
  let wD = 0,
    wT = 0;
  for (let i = 0; i < 7; i++) {
    const d = addD(mon, i);
    if (d > new Date()) break;
    const ch = state.checks[fmt(d)] || {},
      sc = state.habits.filter((h) => isScheduled(h, d));
    wD += sc.filter((h) => ch[h.id]).length;
    wT += sc.length;
  }
  const wP = wT ? Math.round((wD / wT) * 100) : 0;
  const hs = state.habits
    .map((h) => {
      let done = 0,
        exp = 0;
      for (let i = 0; i < 30; i++) {
        const d = addD(new Date(), -i);
        if (d < new Date(h.createdAt)) continue;
        if (!isScheduled(h, d)) continue;
        exp++;
        if (state.checks[fmt(d)]?.[h.id]) done++;
      }
      return {
        ...h,
        done,
        exp,
        pct: exp ? Math.round((done / exp) * 100) : 0,
        streak: getStreak(h.id),
      };
    })
    .sort((a, b) => b.pct - a.pct);
  let bS = 0,
    bE = "";
  hs.forEach((h) => {
    if (h.streak > bS) {
      bS = h.streak;
      bE = h.emoji;
    }
  });
  // Water-level cells: fill height = % of habits completed that day
  let hm = "";
  for (let i = 27; i >= 0; i--) {
    const d = addD(new Date(), -i);
    const ch = state.checks[fmt(d)] || {};
    const sc = state.habits.filter((h) => isScheduled(h, d));
    const r = sc.length ? sc.filter((h) => ch[h.id]).length / sc.length : 0;
    const pct = Math.round(r * 100);
    const fill =
      pct === 0
        ? ""
        : '<div class="hm-fill" style="height:' +
          pct +
          "%;background:" +
          (pct === 100 ? "var(--success)" : pct >= 50 ? "var(--accent)" : "var(--warn)") +
          '"></div>';
    hm += '<div class="heatmap-cell hm-level">' + fill + "</div>";
  }
  // Legend: three sample cups showing none / partial / full
  const hmLegend =
    '<div class="heatmap-legend">' +
    '<span class="hm-legend-lbl">' +
    t("hm_none") +
    "</span>" +
    '<div class="heatmap-cell hm-level hm-dot"></div>' +
    '<div class="heatmap-cell hm-level hm-dot"><div class="hm-fill" style="height:40%;background:var(--warn)"></div></div>' +
    '<div class="heatmap-cell hm-level hm-dot"><div class="hm-fill" style="height:75%;background:var(--accent)"></div></div>' +
    '<div class="heatmap-cell hm-level hm-dot"><div class="hm-fill" style="height:100%;background:var(--success)"></div></div>' +
    '<span class="hm-legend-lbl">' +
    t("hm_all") +
    "</span>" +
    "</div>";

  // Performance color legend
  const perfLegend =
    '<div class="stat-legend">' +
    '<span><span class="stat-dot" style="background:var(--success)"></span>' +
    t("perf_great") +
    " ≥70%</span>" +
    '<span><span class="stat-dot" style="background:var(--warn)"></span>' +
    t("perf_fair") +
    " 40–69%</span>" +
    '<span><span class="stat-dot" style="background:var(--danger)"></span>' +
    t("perf_low") +
    " &lt;40%</span>" +
    "</div>";

  c.innerHTML =
    '<div class="stats-grid">' +
    '<div class="stats-grid-item">' +
    '<div class="stat-big">' +
    wP +
    "%</div>" +
    '<div class="stat-big-label">' +
    t("this_week") +
    "</div>" +
    '<div class="stat-big-sub">' +
    t("week_sub") +
    "</div>" +
    "</div>" +
    '<div class="stats-grid-item">' +
    '<div class="stat-big">' +
    bS +
    (bS ? '<span class="stat-big-unit">d</span>' : "") +
    " " +
    bE +
    "</div>" +
    '<div class="stat-big-label">' +
    t("best_streak") +
    tipBtn("tip_best_streak") +
    "</div>" +
    '<div class="stat-big-sub">' +
    t("streak_unit") +
    "</div>" +
    "</div>" +
    '<div class="stats-grid-item">' +
    '<div class="stat-big">' +
    state.habits.length +
    "</div>" +
    '<div class="stat-big-label">' +
    t("habits") +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div class="stat-card">' +
    '<div class="stat-card-title">' +
    t("last_28") +
    "</div>" +
    '<div class="stat-card-sub">' +
    t("heatmap_hint") +
    "</div>" +
    '<div class="heatmap">' +
    hm +
    "</div>" +
    '<div class="heatmap-dir"><span>← 28 days ago</span><span>today →</span></div>' +
    hmLegend +
    "</div>" +
    '<div class="stat-card">' +
    '<div class="stat-card-title">' +
    t("performance") +
    tipBtn("tip_performance") +
    "</div>" +
    '<div class="stat-card-sub">' +
    t("perf_sub") +
    "</div>" +
    hs
      .map(
        (h) =>
          '<div class="stat-row">' +
          '<span class="stat-label">' +
          h.emoji +
          " <span>" +
          esc(h.name) +
          "</span></span>" +
          '<div class="stat-bar-bg"><div class="stat-bar-fill" style="width:' +
          h.pct +
          "%;background:" +
          (h.pct >= 70 ? "var(--success)" : h.pct >= 40 ? "var(--warn)" : "var(--danger)") +
          '"></div></div>' +
          '<span class="stat-value">' +
          h.pct +
          "%</span>" +
          "</div>"
      )
      .join("") +
    perfLegend +
    "</div>" +
    '<div class="stat-card">' +
    '<div class="stat-card-title">' +
    t("stat_formation") +
    tipBtn("tip_formation") +
    "</div>" +
    '<div class="stat-card-sub">' +
    t("formation_sub") +
    "</div>" +
    state.habits
      .map((h) => {
        const days = h.createdAt ? Math.floor((new Date() - new Date(h.createdAt)) / 86400000) : 0;
        const pct = Math.min(100, Math.round((days / 66) * 100));
        const phase =
          days >= 66
            ? { key: "phase_formed", cls: "phase-formed" }
            : days >= 50
              ? { key: "phase_forming", cls: "phase-forming" }
              : days >= 20
                ? { key: "phase_building", cls: "phase-building" }
                : { key: "phase_learning", cls: "phase-learning" };
        const barColor =
          days >= 50 ? "var(--success)" : days >= 20 ? "var(--accent)" : "var(--warn)";
        return (
          '<div class="stat-row">' +
          '<span class="stat-label">' +
          h.emoji +
          " <span>" +
          esc(h.name) +
          "</span></span>" +
          '<div class="stat-bar-bg"><div class="stat-bar-fill" style="width:' +
          pct +
          "%;background:" +
          barColor +
          '"></div></div>' +
          '<span class="phase-tag ' +
          phase.cls +
          '">' +
          t(phase.key).split(" ")[0] +
          " " +
          days +
          " " +
          t("formation_of") +
          "</span>" +
          "</div>"
        );
      })
      .join("") +
    "</div>";
}

// ═══ SETTINGS ═══
function renderSettings() {
  const c = document.getElementById("settings-content");
  document.getElementById("settings-header").textContent = t("nav_settings");
  c.innerHTML =
    '<div class="settings-section"><div class="settings-title">' +
    t("settings_profile") +
    '</div><div class="settings-list"><div class="setting-item" style="flex-wrap:wrap;gap:8px" onclick="showWelcome()"><div class="setting-left" style="width:100%"><span class="setting-emoji">👤</span><span class="setting-label">' +
    (state.profile.name || "—") +
    (state.profile.age ? ", " + state.profile.age : "") +
    (state.profile.sex
      ? " · " +
        t(
          "sex_" +
            ({ m: "male", f: "female", prefer: "prefer" }[state.profile.sex] || state.profile.sex)
        )
      : "") +
    '</span><span class="setting-action" style="margin-left:auto">›</span></div><div style="width:100%;padding-left:32px;padding-top:6px">' +
    '<select class="lang-select" onclick="event.stopPropagation()" onchange="event.stopPropagation();changeLang(this.value)">' +
    [
      ["en", "🇬🇧 English"],
      ["de", "🇩🇪 Deutsch"],
      ["pl", "🇵🇱 Polski"],
      ["pt", "🇧🇷 Português"],
      ["fr", "🇫🇷 Français"],
      ["ru", "🇷🇺 Русский"],
      ["hi", "🇮🇳 हिन्दी"],
      ["uk", "🇺🇦 Українська"],
      ["ar", "🇪🇬 عربي مصري"],
      ["sq", "🇦🇱 Shqip"],
      ["sr", "🇷🇸 Srpski"],
      ["bar", "🏔️ Bayrisch"],
    ]
      .map(
        ([l, label]) =>
          '<option value="' +
          l +
          '"' +
          (state.lang === l ? " selected" : "") +
          ">" +
          label +
          "</option>"
      )
      .join("") +
    "</select></div></div></div></div></div>" +
    '<div class="settings-section"><div class="settings-title" style="display:flex;align-items:center;justify-content:space-between">' +
    "<span>" +
    t("settings_habits") +
    " (" +
    state.habits.length +
    ")</span>" +
    '<button class="icon-btn" onclick="openAddModal()" style="font-size:18px;padding:2px 8px">+</button>' +
    '</div><div class="settings-list">' +
    (!state.habits.length
      ? '<div style="padding:14px 16px;color:var(--text-muted);font-size:13px">—</div>'
      : state.habits
          .map(
            (h) =>
              '<div class="habit-edit-item" onclick="openAddModal(\'' +
              h.id +
              '\')"><span style="font-size:20px">' +
              h.emoji +
              '</span><div class="habit-edit-info"><div class="habit-edit-name">' +
              esc(h.name) +
              '</div><div class="habit-edit-cadence">' +
              (cadenceLabel(h.cadence) || t("cad_daily")) +
              '</div></div><button class="habit-delete-btn" onclick="event.stopPropagation();delHabit(\'' +
              h.id +
              "')\">✕</button></div>"
          )
          .join("")) +
    "</div></div>" +
    '<div class="settings-section"><div class="settings-title">' +
    t("settings_data") +
    '</div><div class="settings-list"><div class="setting-item" onclick="exportData()"><div class="setting-left"><span class="setting-emoji">📤</span><span class="setting-label">' +
    t("export_backup") +
    '</span></div><span class="setting-action">›</span></div><div class="setting-item" onclick="openImportModal()"><div class="setting-left"><span class="setting-emoji">📥</span><span class="setting-label">' +
    t("import_backup") +
    '</span></div><span class="setting-action">›</span></div><div class="setting-item" onclick="resetData()"><div class="setting-left"><span class="setting-emoji">🗑️</span><span class="setting-label" style="color:var(--danger)">' +
    t("reset_all") +
    '</span></div><span class="setting-action">›</span></div></div></div>' +
    '<div class="settings-section"><div class="settings-title">' +
    t("settings_about") +
    '</div><div class="settings-list"><div class="setting-item" style="cursor:default"><div class="setting-left"><span class="setting-emoji">🌱</span><span class="setting-label">habit.io v2.0</span></div><span class="setting-action" style="font-size:11px;font-family:var(--mono)">localStorage</span></div><div class="setting-item" onclick="shareApp()"><div class="setting-left"><span class="setting-emoji">🔗</span><span class="setting-label">' +
    t("share_app") +
    '</span></div><span class="setting-action">›</span></div><div class="setting-item" onclick="setConsent(' +
    !state.consentAnalytics +
    ')"><div class="setting-left"><span class="setting-emoji">' +
    (state.consentAnalytics ? "📊" : "🚫") +
    '</span><span class="setting-label">' +
    t(state.consentAnalytics ? "analytics_on" : "analytics_off") +
    '</span></div><span class="setting-action">›</span></div></div></div>';
}
function delHabit(id) {
  if (!confirm(t("confirm_delete"))) return;
  const dh = state.habits.find((h) => h.id === id);
  trackEvent("habit_remove", {
    habit_name: dh?.name,
    habit_emoji: dh?.emoji,
    cadence_type: dh?.cadence?.type,
  });
  state.habits = state.habits.filter((h) => h.id !== id);
  Object.keys(state.checks).forEach((k) => delete state.checks[k][id]);
  save();
  render();
  renderSettings();
  showToast(t("habit_deleted"));
}
function resetData() {
  if (!confirm(t("confirm_reset"))) return;
  if (!confirm(t("confirm_really"))) return;
  trackEvent("data_reset", { habits_count: state.habits.length });
  state = {
    habits: [],
    checks: {},
    diary: {},
    profile: { name: "", age: "", sex: "male" },
    lang: state.lang,
  };
  save();
  location.reload();
}
function changeLang(l) {
  state.lang = l;
  save();
  updateUserProperties();
  render();
  renderSettings();
}

function setFabVisible(show) {
  document.getElementById("fab-add")?.classList.toggle("visible", show);
}
function switchPage(p) {
  document.querySelectorAll(".page").forEach((x) => x.classList.remove("active"));
  document.getElementById("page-" + p).classList.add("active");
  setFabVisible(p === "tracker");
  document
    .querySelectorAll(".nav-tab")
    .forEach((t, i) =>
      t.classList.toggle("active", ["tracker", "diary", "stats", "settings"][i] === p)
    );
  if (p === "diary") {
    diaryStep = calcDiaryStep();
    renderDiary();
  }
  if (p === "stats") renderStats();
  if (p === "settings") renderSettings();
  // SPA page_view — fires only when consent has been granted
  if (state.consentAnalytics) {
    const titles = { tracker: "Today", diary: "Journal", stats: "Stats", settings: "Settings" };
    gtag("event", "page_view", {
      page_title: "habit.io · " + (titles[p] || p),
      page_location: location.origin + location.pathname + "#" + p,
    });
  }
}
function showTip(btn, msg) {
  const tt = document.getElementById("tt");
  tt.innerHTML = msg.replace(/\n/g, "<br>");
  tt.style.display = "block";
  const r = btn.getBoundingClientRect();
  const tw = tt.offsetWidth || 260;
  const th = tt.offsetHeight || 80;
  let top = r.bottom + 8;
  let left = r.left + r.width / 2 - tw / 2;
  if (left < 8) left = 8;
  if (left + tw > window.innerWidth - 8) left = window.innerWidth - tw - 8;
  if (top + th > window.innerHeight - 8) top = r.top - th - 8;
  tt.style.top = top + "px";
  tt.style.left = left + "px";
  requestAnimationFrame(() => document.addEventListener("click", hideTip, { once: true }));
}
function hideTip() {
  const tt = document.getElementById("tt");
  if (tt) tt.style.display = "none";
}
function tipBtn(key) {
  return (
    '<button class="tt-btn" onclick="event.stopPropagation();showTip(this,t(\'' +
    key +
    "'))\">ⓘ</button>"
  );
}

function showToast(m) {
  const t = document.getElementById("toast");
  t.textContent = m;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}
function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

document.getElementById("add-modal").addEventListener("click", (e) => {
  if (e.target.id === "add-modal") closeAddModal();
});
document.getElementById("import-modal").addEventListener("click", (e) => {
  if (e.target.id === "import-modal") closeImportModal();
});
document.getElementById("welcome-modal").addEventListener("click", () => {});
document.getElementById("habit-name-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveHabit();
});

function showConsentBannerIfNeeded() {
  if (state.consentAnalytics !== null) return;
  const b = document.createElement("div");
  b.id = "consent-banner";
  b.className = "consent-banner";
  b.innerHTML =
    '<span class="consent-text">We use analytics to improve the app. No personal data is shared.</span>' +
    '<div class="consent-btns">' +
    '<button class="consent-btn accept" onclick="setConsent(true)">Accept</button>' +
    '<button class="consent-btn decline" onclick="setConsent(false)">Decline</button>' +
    "</div>";
  document.body.appendChild(b);
}

load();
render();
setFabVisible(true);
const needsWelcome = !state.profile.name && !state.habits.length;
if (needsWelcome) {
  showWelcome();
} else if (state.consentAnalytics === null) {
  showConsentBannerIfNeeded();
} else if (state.consentAnalytics) {
  // Returning user — restore consent and set user properties
  gtag("consent", "update", { analytics_storage: "granted" });
  updateUserProperties();
  gtag("event", "page_view", { page_title: "habit.io", page_location: location.href });
}
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
