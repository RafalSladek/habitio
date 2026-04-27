const APP_VERSION = "v2.10";
const BUILD_SHA = "__BUILD_SHA__";
// Replace with your deployed worker URL after running: wrangler deploy
const WORKER_BASE_URL = "https://habitio-feedback.rafal-sladek.workers.dev";
const FEEDBACK_WORKER_URL = WORKER_BASE_URL;
const COACH_WORKER_URL = WORKER_BASE_URL + "/coach";
const COACH_DEVICE_KEY = "habitio_ai_device";

const GA_MEASUREMENT_ID = "G-V9TJW7N2VY";
const GA_SCRIPT_SRC = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
const GA_DISABLE_KEY = "ga-disable-" + GA_MEASUREMENT_ID;
const GA_COOKIE_RE = /^(_ga|_gid|_gat|_gac_|_dc_gtm_)/;
const GA_CONSENT_DENIED = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};
const GA_CONSENT_GRANTED = {
  analytics_storage: "granted",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

let analyticsLoadPromise = null;
let analyticsConfigured = false;

function ensureAnalyticsStub() {
  globalThis.dataLayer = globalThis.dataLayer || [];
  if (typeof globalThis.gtag !== "function") {
    globalThis.gtag = function gtag() {
      globalThis.dataLayer.push(arguments);
    };
  }
}

function setAnalyticsDisabled(disabled) {
  globalThis[GA_DISABLE_KEY] = !!disabled;
}

function ensureAnalyticsBootstrap() {
  if (analyticsConfigured) return;
  ensureAnalyticsStub();
  globalThis.gtag("consent", "default", GA_CONSENT_DENIED);
  globalThis.gtag("js", new Date());
  globalThis.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  analyticsConfigured = true;
}

function loadAnalyticsScript() {
  if (analyticsLoadPromise) return analyticsLoadPromise;
  ensureAnalyticsBootstrap();
  analyticsLoadPromise = new Promise((resolve, reject) => {
    if (document.querySelector('script[data-ga4-loader="true"]')) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.src = GA_SCRIPT_SRC;
    script.dataset.ga4Loader = "true";
    script.onload = () => resolve();
    script.onerror = () => {
      analyticsLoadPromise = null;
      reject(new Error("Failed to load GA4"));
    };
    document.head.appendChild(script);
  }).catch((error) => {
    console.warn("[habitio] Failed to load GA4:", error);
    return false;
  });
  return analyticsLoadPromise;
}

function applyAnalyticsConsent(granted) {
  ensureAnalyticsBootstrap();
  setAnalyticsDisabled(!granted);
  globalThis.gtag("consent", "update", granted ? GA_CONSENT_GRANTED : GA_CONSENT_DENIED);
  if (granted) loadAnalyticsScript();
}

function clearAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter((name) => name && GA_COOKIE_RE.test(name));
  if (!names.length) return;

  const hostParts = location.hostname.split(".").filter(Boolean);
  const domains = new Set(["", location.hostname]);
  if (location.hostname !== "localhost" && !/^\d{1,3}(\.\d{1,3}){3}$/.test(location.hostname)) {
    domains.add("." + location.hostname);
    if (hostParts.length > 2) domains.add("." + hostParts.slice(-2).join("."));
  }

  names.forEach((name) => {
    domains.forEach((domain) => {
      document.cookie =
        name +
        "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" +
        (domain ? "; domain=" + domain : "");
    });
  });
}

function queueAnalyticsCall() {
  if (!state.consentAnalytics) return;
  ensureAnalyticsBootstrap();
  setAnalyticsDisabled(false);
  loadAnalyticsScript();
  globalThis.gtag(...arguments);
}

// Set GA4 user-scoped properties — called once on consent and whenever
// profile changes. User properties persist for the whole session and are
// attached to every subsequent event automatically.
function updateUserProperties() {
  if (!state.consentAnalytics) return;
  queueAnalyticsCall("set", "user_properties", {
    age_group: state.profile.ageGroup || null,
    sex: state.profile.sex || null,
    ui_language: state.lang || null,
  });
}
function trackEvent(name, params) {
  if (!state.consentAnalytics) return;
  // Event-level params allow per-event segmentation in addition to user props
  queueAnalyticsCall("event", name, {
    age_group: state.profile.ageGroup || "unknown",
    sex: state.profile.sex || "unknown",
    ui_language: state.lang || "unknown",
    ...params,
  });
}
function trackPageView(pageTitle, pageLocation) {
  if (!state.consentAnalytics) return;
  queueAnalyticsCall("event", "page_view", {
    page_title: pageTitle,
    page_location: pageLocation,
  });
}
function setConsent(granted) {
  state.consentAnalytics = !!granted;
  save();

  if (granted) {
    applyAnalyticsConsent(true);
    updateUserProperties();
    trackPageView("habit.io", location.href);
  } else {
    if (analyticsConfigured) {
      applyAnalyticsConsent(false);
    } else {
      setAnalyticsDisabled(true);
    }
    clearAnalyticsCookies();
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
  const seed = (date + h.id).split("").reduce((a, c) => a + c.codePointAt(0), 0);
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

let sugPriorityCache = {};

function getSuggestions() {
  // Clear cache if profile changed
  const cacheKey = state.profile.age + "|" + state.profile.sex;
  if (!sugPriorityCache.key || sugPriorityCache.key !== cacheKey) {
    sugPriorityCache = { key: cacheKey, cache: {} };
  }

  return SUGGESTION_DATA.map((group) => ({
    cat: t(group.catKey),
    items: group.items
      .map((item) => {
        const prio =
          sugPriorityCache.cache[item.nameKey] ??
          (sugPriorityCache.cache[item.nameKey] = sugPriority(item.nameKey, state.profile));
        return {
          ...item,
          name: t(item.nameKey),
          _p: prio,
        };
      })
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
  const days = Math.floor((Date.now() - new Date(h.createdAt)) / 86400000);
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
  { key: "teen", age: 15, range: "13–17" },
  { key: "young", age: 25, range: "18–29" },
  { key: "adult", age: 40, range: "30–49" },
  { key: "mid", age: 55, range: "50–64" },
  { key: "senior", age: 70, range: "65+" },
];
function renderAgeChips() {
  const cur = welcomeAgeGroup || state.profile.ageGroup || "";
  document.getElementById("welcome-age-chips").innerHTML = AGE_GROUPS.map(
    (g) =>
      '<button type="button" class="age-chip' +
      (cur === g.key ? " selected" : "") +
      '" onclick="setAgeGroup(\'' +
      g.key +
      "')\">" +
      g.range +
      "</button>"
  ).join("");
}
function setAgeGroup(k) {
  welcomeAgeGroup = k;
  renderAgeChips();
  validateWelcomeForm();
}
function validateWelcomeForm() {
  const name = (document.getElementById("welcome-name").value || "").trim();
  const valid = name.length > 0 && !!welcomeAgeGroup && !!state.profile.sex;
  document.getElementById("welcome-go-btn").disabled = !valid;
}
let diaryTimers = {};

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "h_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
}
function defaultCoachState() {
  return {
    includeDiary: false,
    lastFocus: "",
    lastFeedback: null,
    lastBudget: null,
    lastModel: "",
    lastRequestedAt: "",
  };
}
function getCoachDeviceId() {
  let id = localStorage.getItem(COACH_DEVICE_KEY);
  if (!id) {
    id = uid()
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 32);
    localStorage.setItem(COACH_DEVICE_KEY, id);
  }
  return id;
}
function save() {
  localStorage.setItem("habitio_v10", JSON.stringify(state));
}
function load() {
  try {
    // Migration: read from current/older keys if current key is absent
    const raw =
      localStorage.getItem("habitio_v10") ||
      localStorage.getItem("habitio_v9") ||
      localStorage.getItem("habitio_v8") ||
      localStorage.getItem("habitio_v7") ||
      localStorage.getItem("habitio_v6") ||
      localStorage.getItem("habitio_v5") ||
      localStorage.getItem("habitio_v4") ||
      localStorage.getItem("habitio_v3") ||
      localStorage.getItem("habitio_v2");
    const d = JSON.parse(raw);
    if (d?.habits) {
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
      d.aiCoach = { ...defaultCoachState(), ...(d.aiCoach || {}) };
      state = d;
      // Persist under new key and clean up old keys
      localStorage.setItem("habitio_v10", JSON.stringify(state));
      localStorage.removeItem("habitio_v9");
      localStorage.removeItem("habitio_v8");
      localStorage.removeItem("habitio_v7");
      localStorage.removeItem("habitio_v6");
      localStorage.removeItem("habitio_v5");
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
    aiCoach: defaultCoachState(),
  };
}

function fmt(d) {
  const y = d.getFullYear(),
    m = String(d.getMonth() + 1).padStart(2, "0"),
    day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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
  if (c?.type !== "x_per") return null;
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
  let key;
  if (h >= 5 && h < 12) key = "greet_morning";
  else if (h >= 12 && h < 17) key = "greet_afternoon";
  else if (h >= 17 && h < 21) key = "greet_evening";
  else key = "greet_night";
  const name = state.profile.name;
  return t(key) + (name ? ", " + name + " 👋" : " 👋");
}

let motivTimer = null;
function showMotivation(pct) {
  if (!isToday(selectedDate)) return;
  let level, emoji;
  if (pct === 100) {
    level = "perfect";
    emoji = "🏆";
  } else if (pct >= 75) {
    level = "great";
    emoji = "💪";
  } else if (pct >= 40) {
    level = "good";
    emoji = "✨";
  } else {
    level = "low";
    emoji = "🌱";
  }
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

function scoreFor(val, flag) {
  return val && flag ? val : 0;
}

function sugPriority(nameKey, profile) {
  const age = Number.parseInt(profile.age) || 30;
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
    scoreFor(p.M, isM) +
    scoreFor(p.F, isF) +
    scoreFor(p.teen, isTeen) +
    scoreFor(p.young, isYoung) +
    scoreFor(p.adult, isAdult) +
    scoreFor(p.mid, isMid) +
    scoreFor(p.senior, isSenior)
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
  if (state.habits.length) {
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
  } else {
    document.getElementById("progress-title").textContent = t("no_habits");
    document.getElementById("progress-subtitle").textContent = t("tap_add");
  }
}

function buildHabitHtml(h, ch) {
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
  let html =
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
  if (checked && isToday && kit && !state.kitsDismissed?.[h.id]) {
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
  return html;
}

function renderHabits() {
  const c = document.getElementById("habits-list");
  if (!state.habits.length) {
    const langQuotes = T[state.lang]?.quotes || T.en.quotes;
    const q = langQuotes[Math.floor(Math.random() * langQuotes.length)];
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
    html += buildHabitHtml(h, ch);
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
  setSex(state.profile.sex || "");
  document.getElementById("wl-lang-label").textContent = t("language");
  document.getElementById("welcome-go-btn").textContent = t("lets_go");
  welcomeAgeGroup = state.profile.ageGroup || "";
  renderAgeChips();
  const lc = document.getElementById("welcome-lang-chips");
  const LANGS = {
    ar: "🇪🇬 عربي مصري",
    bar: "🏔️ Bayrisch",
    ca: "🏴󠁥󠁳󠁣󠁴󠁿 Català",
    de: "🇩🇪 Deutsch",
    el: "🇬🇷 Ελληνικά",
    en: "🇬🇧 English",
    es: "🇪🇸 Español",
    fr: "🇫🇷 Français",
    hi: "🇮🇳 हिन्दी",
    hr: "🇭🇷 Hrvatski",
    it: "🇮🇹 Italiano",
    nl: "🇳🇱 Nederlands",
    pl: "🇵🇱 Polski",
    pt: "🇧🇷 Português",
    ro: "🇷🇴 Română",
    ru: "🇷🇺 Русский",
    sq: "🇦🇱 Shqip",
    sr: "🇷🇸 Srpski",
    tr: "🇹🇷 Türkçe",
    uk: "🇺🇦 Українська",
  };
  lc.innerHTML =
    '<select class="lang-select lang-list" size="5" onchange="setWelcomeLang(this.value)">' +
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
  validateWelcomeForm();
  setTimeout(() => document.getElementById("welcome-name").focus(), 300);
}
function setWelcomeLang(l) {
  const savedName = document.getElementById("welcome-name").value;
  const savedAgeGroup = welcomeAgeGroup;
  const savedSex = state.profile.sex;
  state.lang = l;
  save();
  showWelcome();
  document.getElementById("welcome-name").value = savedName;
  welcomeAgeGroup = savedAgeGroup;
  renderAgeChips();
  setSex(savedSex);
  validateWelcomeForm();
  render();
}
function setSex(val) {
  state.profile.sex = val;
  document.getElementById("sex-male").classList.toggle("active", val === "male");
  document.getElementById("sex-female").classList.toggle("active", val === "female");
  document.getElementById("sex-prefer").classList.toggle("active", val === "prefer");
  validateWelcomeForm();
}
function finishWelcome() {
  const n = document.getElementById("welcome-name").value.trim();
  const g = welcomeAgeGroup;
  state.profile.name = n;
  state.profile.ageGroup = g;
  state.profile.age = g ? String(AGE_GROUPS.find((x) => x.key === g)?.age || "") : "";
  save();
  updateUserProperties();
  document.getElementById("welcome-modal").classList.remove("show");
  render();
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
function toggleSuggestionSection(btn) {
  const sectionId = btn.getAttribute("data-section-id");
  const section = document.getElementById(sectionId);
  const isExpanded = btn.classList.contains("expanded");
  if (isExpanded) {
    btn.classList.remove("expanded");
    section.classList.remove("expanded");
    btn.setAttribute("aria-expanded", "false");
  } else {
    btn.classList.add("expanded");
    section.classList.add("expanded");
    btn.setAttribute("aria-expanded", "true");
  }
}

function renderSuggestions() {
  const existing = new Set(state.habits.map((h) => h.name.toLowerCase()));
  let html = '<div class="suggestions">';
  getSuggestions().forEach((cat, idx) => {
    const items = cat.items.filter((s) => !existing.has(s.name.toLowerCase()));
    if (!items.length) return;
    const sectionId = "suggestion-section-" + idx;
    html +=
      '<div class="suggestion-cat-header">' +
      '<button class="suggestion-toggle" onclick="toggleSuggestionSection(this)" aria-label="' +
      esc(t("toggle_suggestions")) +
      ": " +
      esc(cat.cat) +
      '" data-section-id="' +
      sectionId +
      '" aria-expanded="false">▶</button>' +
      '<div class="suggestion-cat">' +
      esc(cat.cat) +
      "</div>" +
      "</div>" +
      '<div class="suggestion-section" id="' +
      sectionId +
      '">';
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
    html += "</div>";
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
    cadence = { type: "specific_days", days: [...modalDays].sort((a, b) => a - b) };
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
  const entry = state.diary[k] || { grateful: "", affirm: "", good: "", mood: null, better: "" };

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
    let cl = "";
    if (i < diaryStep) cl = "done";
    else if (i === diaryStep) cl = "active";
    return '<div class="diary-dot ' + cl + '"></div>';
  }).join("");
  const progress = '<div class="diary-progress">' + dots + "</div>";

  // Display summary screen for completed entries instead of auto-navigating away
  if (diaryStep >= DIARY_FIELDS.length) {
    c.innerHTML =
      dateNav +
      progress +
      '<div class="diary-summary"><p>' +
      t("diary_done") +
      " ✓</p></div>" +
      '<div class="diary-step-nav">' +
      '<button class="diary-back-btn" onclick="diaryStepGo(-1)">← ' +
      t("diary_back") +
      "</button>" +
      '<button class="diary-next-btn" onclick="switchPage(\'stats\')">' +
      t("nav_stats") +
      " →</button>" +
      "</div>";
    return;
  }

  // ── Single prompt step ──
  const field = DIARY_FIELDS[diaryStep];
  const moodSection =
    field === "good"
      ? '<div class="diary-mood-section">' +
        '<label class="diary-mood-label">' +
        esc(t("diary_mood")) +
        tipBtn("tip_diary_mood") +
        "</label>" +
        '<div class="diary-mood-container">' +
        '<span class="mood-emoji" id="mood-display">😐</span>' +
        '<input type="range" class="diary-mood-slider" id="d_mood" min="1" max="5" ' +
        'value="' +
        (entry.mood || 3) +
        '" ' +
        "oninput=\"updateMoodDisplay(this.value); saveMood('" +
        k +
        "', this.value)\">" +
        '<div class="mood-scale">' +
        "<span>😔</span><span>😕</span><span>😐</span><span>🙂</span><span>😄</span>" +
        "</div>" +
        "</div>" +
        "</div>"
      : "";
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
    moodSection +
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
}

function diaryStepGo(dir) {
  diaryStep = Math.max(0, Math.min(DIARY_FIELDS.length, diaryStep + dir));
  // Auto-navigate to stats only when completing the form (clicking Done on final step)
  if (dir > 0 && diaryStep >= DIARY_FIELDS.length) {
    switchPage("stats");
    return;
  }
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
  if (state.habits.some((h) => h.name === name)) return;
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
  if (!state.diary[k])
    state.diary[k] = { grateful: "", affirm: "", good: "", mood: null, better: "" };
  const wasEmpty = !state.diary[k][field]?.trim();
  state.diary[k][field] = val;
  if (wasEmpty && val.trim()) trackEvent("journal_write", { section: field, date: k });
  save();
  clearTimeout(diaryTimers[field]);
  const el = document.getElementById("ds_" + field);
  el.classList.add("show");
  diaryTimers[field] = setTimeout(() => el.classList.remove("show"), 1500);
}

function saveMood(k, val) {
  if (!state.diary[k])
    state.diary[k] = { grateful: "", affirm: "", good: "", mood: null, better: "" };
  const wasMissing = state.diary[k].mood === null || state.diary[k].mood === undefined;
  state.diary[k].mood = parseInt(val, 10);
  if (wasMissing && val) trackEvent("journal_mood", { mood: val, date: k });
  save();
}

function updateMoodDisplay(val) {
  const emojis = ["", "😔", "😕", "😐", "🙂", "😄"];
  const display = document.getElementById("mood-display");
  if (display) display.textContent = emojis[parseInt(val, 10)] || "😐";
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
function applyImportData(d) {
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
            const nh = state.habits.find((h) => h.name.toLowerCase() === oh.name.toLowerCase());
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
}

function doImport() {
  const i = document.createElement("input");
  i.type = "file";
  i.accept = ".json";
  i.onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      applyImportData(JSON.parse(text));
    } catch {
      showToast(t("error_file"));
    }
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

function calcProgressWindow(days) {
  let completed = 0,
    planned = 0;
  for (let i = 0; i < days; i++) {
    const day = addD(new Date(), -i);
    state.habits.forEach((habit) => {
      if (habit.createdAt && day < new Date(habit.createdAt)) return;
      if (!isScheduled(habit, day)) return;
      planned++;
      if (state.checks[fmt(day)]?.[habit.id]) completed++;
    });
  }
  return {
    completed,
    planned,
    pct: planned ? Math.round((completed / planned) * 100) : 0,
  };
}

function hasDiaryContent(entry) {
  return DIARY_FIELDS.some((field) => String(entry?.[field] || "").trim().length > 0);
}

function getTrackedDayCount() {
  const trackedDays = new Set();

  Object.entries(state.checks || {}).forEach(([date, checks]) => {
    if (checks && Object.values(checks).some(Boolean)) trackedDays.add(date);
  });

  Object.entries(state.diary || {}).forEach(([date, entry]) => {
    if (hasDiaryContent(entry)) trackedDays.add(date);
  });

  return trackedDays.size;
}

function isCoachUnlocked() {
  return getTrackedDayCount() >= 3;
}

function getCoachDiarySummary() {
  if (!state.aiCoach?.includeDiary) return [];
  return Object.keys(state.diary || {})
    .sort((a, b) => b.localeCompare(a))
    .map((date) => ({ date, ...state.diary[date] }))
    .filter((entry) => hasDiaryContent(entry))
    .slice(0, 3)
    .map((entry) => ({
      date: entry.date,
      grateful: String(entry.grateful || "")
        .trim()
        .slice(0, 180),
      affirm: String(entry.affirm || "")
        .trim()
        .slice(0, 180),
      good: String(entry.good || "")
        .trim()
        .slice(0, 180),
      better: String(entry.better || "")
        .trim()
        .slice(0, 180),
    }));
}

function coachLanguageLabel(code) {
  const labels = {
    en: "English",
    de: "German",
    pl: "Polish",
    pt: "Portuguese",
    ru: "Russian",
    fr: "French",
    hi: "Hindi",
    uk: "Ukrainian",
    ar: "Arabic",
    sq: "Albanian",
    sr: "Serbian",
    bar: "Bavarian",
  };
  return labels[code] || "English";
}

function buildCoachPayload(focus) {
  const todayKey = fmt(new Date());
  const todayPlanned = state.habits.filter((habit) => {
    if (habit.createdAt && new Date() < new Date(habit.createdAt)) return false;
    return isScheduled(habit, new Date());
  }).length;
  const todayCompleted = state.habits.filter((habit) => state.checks[todayKey]?.[habit.id]).length;
  const habits = state.habits
    .map((habit) => {
      const stats = calcHabitStats(habit);
      const phase = getFormationPhase(habit);
      return {
        name: habit.name,
        emoji: habit.emoji,
        cadence: cadenceLabel(habit.cadence) || "daily",
        morning: !!habit.morning,
        streak: stats.streak,
        completion_30d_pct: stats.pct,
        scheduled_30d: stats.exp,
        phase: phase ? phase.key.replace("phase_", "") : "unknown",
        days_since_created: phase?.days ?? 0,
      };
    })
    .sort((a, b) => a.completion_30d_pct - b.completion_30d_pct)
    .slice(0, 8);
  const bestHabit = [...habits].sort(
    (a, b) => b.completion_30d_pct - a.completion_30d_pct || b.streak - a.streak
  )[0];
  const toughestHabit = [...habits].sort(
    (a, b) => a.completion_30d_pct - b.completion_30d_pct || a.streak - b.streak
  )[0];

  return {
    deviceId: getCoachDeviceId(),
    focus: (focus || "").trim().slice(0, 280),
    summary: {
      ui_language: state.lang,
      reply_language: coachLanguageLabel(state.lang),
      app_version: APP_VERSION,
      profile: {
        age_group: state.profile.ageGroup || "unknown",
        sex: state.profile.sex || "unknown",
      },
      totals: {
        habits: state.habits.length,
        today_completed: todayCompleted,
        today_planned: todayPlanned,
      },
      last_7_days: calcProgressWindow(7),
      last_30_days: calcProgressWindow(30),
      best_habit: bestHabit || null,
      toughest_habit: toughestHabit || null,
      habits,
      recent_journal: getCoachDiarySummary(),
    },
  };
}

function formatCoachTimestamp(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(state.lang || "en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function renderCoachResultCard() {
  const feedback = state.aiCoach?.lastFeedback;
  if (!feedback) return "";
  return (
    '<div id="coach-result" class="coach-result">' +
    '<div class="coach-result-header"><div class="coach-result-title">' +
    t("coach_result_title") +
    '</div><div class="coach-result-meta">' +
    esc(formatCoachTimestamp(state.aiCoach.lastRequestedAt)) +
    "</div></div>" +
    '<div class="coach-block"><div class="coach-label">' +
    t("coach_result_encouragement") +
    '</div><p class="coach-copy">' +
    esc(feedback.encouragement) +
    "</p></div>" +
    '<div class="coach-block"><div class="coach-label">' +
    t("coach_result_candid") +
    '</div><p class="coach-copy">' +
    esc(feedback.candid_feedback) +
    "</p></div>" +
    '<div class="coach-block"><div class="coach-label">' +
    t("coach_result_next") +
    '</div><ul class="coach-list">' +
    feedback.next_steps.map((step) => "<li>" + esc(step) + "</li>").join("") +
    "</ul></div>" +
    "</div>"
  );
}

function renderCoachPanel() {
  if (!isCoachUnlocked()) {
    return (
      '<div class="coach-panel coach-panel-journal">' +
      '<div class="coach-section-title">' +
      t("settings_ai_coach") +
      "</div>" +
      '<p class="coach-empty-note">' +
      t("coach_unlock_note") +
      "</p></div>"
    );
  }

  return (
    '<div class="coach-panel coach-panel-journal">' +
    '<div class="coach-section-title">' +
    t("settings_ai_coach") +
    "</div>" +
    '<p class="coach-note">' +
    t("coach_privacy_note") +
    "</p>" +
    '<textarea id="coach-focus" rows="3" placeholder="' +
    t("coach_focus_placeholder") +
    '" class="coach-textarea">' +
    esc(state.aiCoach?.lastFocus || "") +
    "</textarea>" +
    '<label class="coach-check"><input id="coach-include-diary" type="checkbox" onchange="setCoachDiaryPreference(this.checked)"' +
    (state.aiCoach?.includeDiary ? " checked" : "") +
    "><span>" +
    t("coach_include_diary") +
    "</span></label>" +
    '<button id="coach-submit" onclick="requestCoachFeedback()" class="coach-submit">' +
    t("coach_submit") +
    "</button>" +
    renderCoachResultCard() +
    "</div>"
  );
}

function shareApp() {
  const url = "https://habitio.rafal-sladek.com/";
  if (navigator.share) {
    navigator
      .share({ title: "habit.io", text: t("share_text"), url })
      .then(() => trackEvent("share", { method: "web_share_api", content_type: "app" }))
      .catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      showToast(t("share_copied"));
      trackEvent("share", { method: "clipboard", content_type: "app" });
    });
  }
}

// ═══ STATS ═══
function calcHabitStats(h) {
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
}

function calcBestStreak(hs) {
  let bS = 0,
    bE = "";
  hs.forEach((h) => {
    if (h.streak > bS) {
      bS = h.streak;
      bE = h.emoji;
    }
  });
  return { bS, bE };
}

function buildHeatmapHtml() {
  let hm = "";
  for (let i = 27; i >= 0; i--) {
    const d = addD(new Date(), -i);
    const ch = state.checks[fmt(d)] || {};
    const sc = state.habits.filter((h) => isScheduled(h, d));
    const r = sc.length ? sc.filter((h) => ch[h.id]).length / sc.length : 0;
    const pct = Math.round(r * 100);
    let fill = "";
    if (pct > 0) {
      let bg;
      if (pct === 100) bg = "var(--success)";
      else if (pct >= 50) bg = "var(--accent)";
      else bg = "var(--warn)";
      fill = '<div class="hm-fill" style="height:' + pct + "%;background:" + bg + '"></div>';
    }
    hm += '<div class="heatmap-cell hm-level">' + fill + "</div>";
  }
  return hm;
}

function renderMoodGraph(days = 7) {
  const today = new Date();
  const moodData = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = addD(today, -i);
    const key = fmt(d);
    const mood = state.diary[key]?.mood || null;
    const isToday = fmt(d) === fmt(today);
    moodData.push({
      date: d,
      mood: mood,
      key: key,
      label: isToday ? t("nav_today") : DN()[dIdx(d)].slice(0, 3),
      isToday: isToday,
    });
  }

  const width = 280;
  const height = 100;
  const padding = { top: 10, right: 10, bottom: 20, left: 40 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const yMin = 1,
    yMax = 5;
  const yScale = graphHeight / (yMax - yMin);
  const xScale = graphWidth / (moodData.length - 1 || 1);

  const validPoints = moodData
    .map((d, i) => (d.mood !== null ? { ...d, index: i } : null))
    .filter(Boolean);

  let pathD = "";
  if (validPoints.length > 0) {
    validPoints.forEach((d, i) => {
      const x = padding.left + d.index * xScale;
      const y = padding.top + graphHeight - (d.mood - yMin) * yScale;
      pathD += (i === 0 ? "M" : "L") + " " + x + " " + y + " ";
    });
  }

  let svg =
    '<svg class="mood-graph" viewBox="0 0 ' +
    width +
    " " +
    height +
    '" width="' +
    width +
    '" height="' +
    height +
    '">';

  svg += '<g class="mood-axis">';
  for (let i = 1; i <= 5; i++) {
    const y = padding.top + graphHeight - (i - yMin) * yScale;
    const emoji = ["", "😔", "😕", "😐", "🙂", "😄"][i];
    svg += '<text x="18" y="' + (y + 4) + '" class="mood-axis-label">' + emoji + "</text>";
    svg +=
      '<line x1="' +
      padding.left +
      '" y1="' +
      y +
      '" x2="' +
      (width - padding.right) +
      '" y2="' +
      y +
      '" class="mood-grid-line"/>';
  }
  svg += "</g>";

  if (pathD) {
    svg +=
      '<path d="' +
      pathD +
      '" class="mood-line" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  validPoints.forEach((d) => {
    const x = padding.left + d.index * xScale;
    const y = padding.top + graphHeight - (d.mood - yMin) * yScale;
    const dotColor = d.isToday ? "var(--success)" : "var(--accent)";
    svg += '<circle cx="' + x + '" cy="' + y + '" r="3" class="mood-dot" fill="' + dotColor + '"/>';
  });

  svg += '<g class="mood-x-axis">';
  moodData.forEach((d, i) => {
    const x = padding.left + i * xScale;
    svg +=
      '<text x="' +
      x +
      '" y="' +
      (padding.top + graphHeight + 15) +
      '" class="mood-x-label">' +
      d.label +
      "</text>";
  });
  svg += "</g>";

  svg += "</svg>";

  return svg;
}

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
  const hs = state.habits.map(calcHabitStats).sort((a, b) => b.pct - a.pct);
  const { bS, bE } = calcBestStreak(hs);
  // Water-level cells: fill height = % of habits completed that day
  const hm = buildHeatmapHtml();
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
    '<div class="stats-grid-item stats-grid-split">' +
    '<div class="stats-grid-top">' +
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
    '<div class="stats-grid-bottom">' +
    '<div class="stat-big">' +
    wD +
    "/" +
    wT +
    "</div>" +
    '<div class="stat-big-label">' +
    t("week_completed") +
    "</div>" +
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
      .map((h) => {
        let perfColor;
        if (h.pct >= 70) perfColor = "var(--success)";
        else if (h.pct >= 40) perfColor = "var(--warn)";
        else perfColor = "var(--danger)";
        return (
          '<div class="stat-row">' +
          '<span class="stat-label">' +
          h.emoji +
          " <span>" +
          esc(h.name) +
          "</span></span>" +
          '<div class="stat-bar-bg"><div class="stat-bar-fill" style="width:' +
          h.pct +
          "%;background:" +
          perfColor +
          '"></div></div>' +
          '<span class="stat-value">' +
          h.pct +
          "%</span>" +
          "</div>"
        );
      })
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
        const days = h.createdAt ? Math.floor((Date.now() - new Date(h.createdAt)) / 86400000) : 0;
        const pct = Math.min(100, Math.round((days / 66) * 100));
        let phase;
        if (days >= 66) phase = { key: "phase_formed", cls: "phase-formed" };
        else if (days >= 50) phase = { key: "phase_forming", cls: "phase-forming" };
        else if (days >= 20) phase = { key: "phase_building", cls: "phase-building" };
        else phase = { key: "phase_learning", cls: "phase-learning" };
        let barColor;
        if (days >= 50) barColor = "var(--success)";
        else if (days >= 20) barColor = "var(--accent)";
        else barColor = "var(--warn)";
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
    "</div>" +
    '<div class="stat-card">' +
    '<div class="stat-card-title">💭 ' +
    t("stats_mood_title") +
    "</div>" +
    renderMoodGraph(7) +
    "</div>" +
    '<div class="stat-card">' +
    renderCoachPanel() +
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
    '<select class="lang-select lang-list" size="5" onclick="event.stopPropagation()" onchange="event.stopPropagation();changeLang(this.value)">' +
    [
      ["ar", "🇪🇬 عربي مصري"],
      ["bar", "🏔️ Bayrisch"],
      ["ca", "🏴󠁥󠁳󠁣󠁴󠁿 Català"],
      ["de", "🇩🇪 Deutsch"],
      ["el", "🇬🇷 Ελληνικά"],
      ["en", "🇬🇧 English"],
      ["es", "🇪🇸 Español"],
      ["fr", "🇫🇷 Français"],
      ["hi", "🇮🇳 हिन्दी"],
      ["hr", "🇭🇷 Hrvatski"],
      ["it", "🇮🇹 Italiano"],
      ["nl", "🇳🇱 Nederlands"],
      ["pl", "🇵🇱 Polski"],
      ["pt", "🇧🇷 Português"],
      ["ro", "🇷🇴 Română"],
      ["ru", "🇷🇺 Русский"],
      ["sq", "🇦🇱 Shqip"],
      ["sr", "🇷🇸 Srpski"],
      ["tr", "🇹🇷 Türkçe"],
      ["uk", "🇺🇦 Українська"],
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
    (state.habits.length
      ? state.habits
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
          .join("")
      : '<div style="padding:14px 16px;color:var(--text-muted);font-size:13px">—</div>') +
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
    '</div><div class="settings-list"><div class="setting-item" style="cursor:default"><div class="setting-left"><span class="setting-emoji">🌱</span><span class="setting-label">habit.io ' +
    APP_VERSION +
    '</span></div><span class="setting-action">' +
    t("about_on_device") +
    '</span></div><div class="setting-item" style="cursor:default"><div class="setting-left"><span class="setting-emoji">🔨</span><span class="setting-label">Build</span></div><span class="setting-action" style="font-family:monospace;font-size:12px">' +
    (BUILD_SHA.startsWith("__") ? "dev" : BUILD_SHA) +
    '</span></div><div class="setting-item" onclick="shareApp()"><div class="setting-left"><span class="setting-emoji">🔗</span><span class="setting-label">' +
    t("share_app") +
    '</span></div><span class="setting-action">›</span></div><div class="setting-item" onclick="setConsent(' +
    !state.consentAnalytics +
    ')"><div class="setting-left"><span class="setting-emoji">' +
    (state.consentAnalytics ? "📊" : "🚫") +
    '</span><span class="setting-label">' +
    t(state.consentAnalytics ? "analytics_on" : "analytics_off") +
    '</span></div><span class="setting-action">›</span></div></div></div>' +
    '<div class="settings-section"><div class="settings-title">' +
    t("settings_feedback") +
    '</div><div class="settings-list"><div style="padding:12px 16px;display:flex;flex-direction:column;gap:10px">' +
    '<select id="feedback-type" class="lang-select">' +
    '<option value="bug">' +
    t("feedback_type_bug") +
    "</option>" +
    '<option value="wish">' +
    t("feedback_type_wish") +
    "</option>" +
    '<option value="feature">' +
    t("feedback_type_feature") +
    "</option>" +
    "</select>" +
    '<div><div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">' +
    t("feedback_rating") +
    "</div>" +
    '<div id="feedback-stars" style="display:flex;gap:6px">' +
    [1, 2, 3, 4, 5]
      .map(
        (n) =>
          '<button type="button" data-star="' +
          n +
          '" onclick="setFeedbackStar(' +
          n +
          ')" style="background:none;border:none;font-size:24px;cursor:pointer;padding:0;opacity:0.25;transition:opacity 0.1s" aria-label="' +
          n +
          ' plant">🌱</button>'
      )
      .join("") +
    "</div></div>" +
    '<textarea id="feedback-msg" rows="4" placeholder="' +
    t("feedback_placeholder") +
    '" style="width:100%;box-sizing:border-box;background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:14px;font-family:inherit;resize:vertical"></textarea>' +
    '<button id="feedback-submit" onclick="submitFeedback()" style="background:var(--accent);color:#fff;border:none;border-radius:10px;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer">' +
    t("feedback_submit") +
    "</button></div></div></div>";
}
function setFeedbackStar(n) {
  document.querySelectorAll("#feedback-stars button").forEach((btn) => {
    btn.style.opacity = Number(btn.dataset.star) <= n ? "1" : "0.25";
  });
  const stars = document.getElementById("feedback-stars");
  if (stars) stars.dataset.value = n;
}
async function submitFeedback() {
  const typeEl = document.getElementById("feedback-type");
  const msgEl = document.getElementById("feedback-msg");
  const btnEl = document.getElementById("feedback-submit");
  if (!typeEl || !msgEl || !btnEl) return;
  const message = msgEl.value.trim();
  if (message.length < 10) {
    showToast(t("feedback_short"));
    return;
  }
  const starsEl = document.getElementById("feedback-stars");
  const rating = starsEl?.dataset.value ? Number(starsEl.dataset.value) : null;
  btnEl.disabled = true;
  btnEl.textContent = "…";
  try {
    const res = await fetch(FEEDBACK_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: typeEl.value,
        message,
        rating,
        version: APP_VERSION,
        lang: state.lang,
      }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    msgEl.value = "";
    showToast(t("feedback_sent"));
  } catch {
    showToast(t("feedback_error"));
  } finally {
    btnEl.disabled = false;
    btnEl.textContent = t("feedback_submit");
  }
}
function setCoachDiaryPreference(checked) {
  state.aiCoach.includeDiary = !!checked;
  save();
}
async function requestCoachFeedback() {
  const focusEl = document.getElementById("coach-focus");
  const btnEl = document.getElementById("coach-submit");
  if (!focusEl || !btnEl) return;
  if (!isCoachUnlocked()) {
    showToast(t("coach_unlock_toast"));
    return;
  }

  const focus = (focusEl.value || "").trim();
  state.aiCoach.lastFocus = focus;
  save();

  btnEl.disabled = true;
  btnEl.textContent = t("coach_loading");

  try {
    const payload = buildCoachPayload(focus);
    const res = await fetch(COACH_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (data?.budget) {
        state.aiCoach.lastBudget = data.budget;
        save();
        renderStats();
      }
      throw new Error(data?.code || "HTTP_" + res.status);
    }

    state.aiCoach.lastFeedback = data.feedback;
    state.aiCoach.lastBudget = data.budget || null;
    state.aiCoach.lastModel = data.model || "";
    state.aiCoach.lastRequestedAt = new Date().toISOString();
    save();
    renderStats();
    showToast(t("coach_done"));
    trackEvent("ai_coach_success", {
      include_diary: state.aiCoach.includeDiary,
      habits_count: state.habits.length,
    });
  } catch (error) {
    const message = String(error?.message || "");
    showToast(message.includes("daily_") ? t("coach_limit") : t("coach_error"));
    trackEvent("ai_coach_error", {
      include_diary: state.aiCoach.includeDiary,
      habits_count: state.habits.length,
    });
  } finally {
    const liveButton = document.getElementById("coach-submit");
    if (liveButton) {
      liveButton.disabled = !isCoachUnlocked();
      liveButton.textContent = t("coach_submit");
    }
  }
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
    kitsDismissed: {},
    consentAnalytics: state.consentAnalytics,
    aiCoach: defaultCoachState(),
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
  // Update hash for direct linking
  if (p !== "tracker") {
    history.replaceState(null, "", "#" + p);
  } else {
    history.replaceState(null, "", location.pathname);
  }
  // SPA page_view — fires only when consent has been granted
  if (state.consentAnalytics) {
    const titles = { tracker: "Today", diary: "Journal", stats: "Stats", settings: "Settings" };
    trackPageView("habit.io · " + (titles[p] || p), location.origin + location.pathname + "#" + p);
  }
}
function showTip(btn, msg) {
  const tt = document.getElementById("tt");
  tt.innerHTML = msg.replaceAll("\n", "<br>");
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
    '<div class="consent-title">' +
    t("consent_title") +
    "</div>" +
    '<span class="consent-text">' +
    t("consent_text") +
    "</span>" +
    '<span class="consent-note">' +
    t("consent_note") +
    "</span>" +
    '<div class="consent-btns">' +
    '<button class="consent-btn decline" type="button" onclick="setConsent(false)">' +
    t("consent_decline") +
    "</button>" +
    '<button class="consent-btn accept" type="button" onclick="setConsent(true)">' +
    t("consent_accept") +
    "</button>" +
    "</div>";
  document.body.appendChild(b);
}

load();
setAnalyticsDisabled(state.consentAnalytics !== true);
render();
// Hash routing: switch to page if hash is set
const hash = location.hash.slice(1);
if (hash && ["tracker", "diary", "stats", "settings"].includes(hash)) {
  switchPage(hash);
}
// Listen for hash changes
window.addEventListener("hashchange", () => {
  const newHash = location.hash.slice(1);
  if (newHash && ["tracker", "diary", "stats", "settings"].includes(newHash)) {
    switchPage(newHash);
  }
});
setFabVisible(true);
const needsWelcome = !state.profile.name && !state.habits.length;
if (needsWelcome) {
  showWelcome();
}
document.documentElement.classList.remove("new-user");
if (state.consentAnalytics === null) {
  showConsentBannerIfNeeded();
} else if (state.consentAnalytics) {
  applyAnalyticsConsent(true);
  updateUserProperties();
  trackPageView("habit.io", location.href);
}
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

function initPullToRefresh() {
  const THRESHOLD = 65;
  let startY = 0;
  let pulling = false;

  const el = document.createElement("div");
  el.className = "ptr-indicator";
  el.textContent = "↓";
  document.body.appendChild(el);

  function getScrollContainer() {
    return Array.from(document.querySelectorAll(".habits-scroll, .page-scroll")).find(
      (c) => c.offsetParent !== null
    );
  }

  function setTranslate(dy) {
    const clamped = Math.min(dy, THRESHOLD + 20);
    el.style.transform = `translateX(-50%) translateY(${clamped - 64}px)`;
  }

  document.addEventListener(
    "touchstart",
    (e) => {
      const sc = getScrollContainer();
      if (!sc || sc.scrollTop > 0) return;
      startY = e.touches[0].clientY;
      pulling = true;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!pulling) return;
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0) {
        pulling = false;
        setTranslate(0);
        return;
      }
      setTranslate(dy);
    },
    { passive: true }
  );

  document.addEventListener("touchend", () => {
    if (!pulling) return;
    pulling = false;

    const currentTransform = el.style.transform;
    const match = currentTransform.match(/translateY\(([^p]+)px\)/);
    const currentOffset = match ? parseFloat(match[1]) : -64;
    const dy = currentOffset + 64;

    if (dy >= THRESHOLD) {
      el.textContent = "↻";
      el.classList.add("ptr-spinning");
      el.style.transform = "translateX(-50%) translateY(0)";
      setTimeout(() => {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistration().then((reg) => {
            if (reg) reg.update();
          });
        }
        location.reload();
      }, 1000);
    } else {
      el.style.transition = "transform 0.3s ease";
      setTranslate(0);
      setTimeout(() => {
        el.style.transition = "";
      }, 300);
    }
  });
}

initPullToRefresh();
