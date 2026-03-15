// Habit suggestions — edit this file to add, remove, or reorder suggestions.
// Names and categories are translation keys resolved at runtime via t().
const SUGGESTION_DATA = [
  {
    catKey: "cat_health",
    items: [
      { nameKey: "sug_wake_up",        emoji: "⏰", cadence: { type: "daily" } },
      { nameKey: "sug_morning_workout", emoji: "🏃", cadence: { type: "daily" } },
      { nameKey: "sug_cold_shower",    emoji: "🥶", cadence: { type: "daily" } },
      { nameKey: "sug_drink_water",    emoji: "💧", cadence: { type: "daily" } },
      { nameKey: "sug_gym",            emoji: "🏋️", cadence: { type: "x_per", count: 3, period: "week" } },
      { nameKey: "sug_yoga",           emoji: "🧘", cadence: { type: "x_per", count: 2, period: "week" } },
      { nameKey: "sug_no_alcohol",     emoji: "🚫", cadence: { type: "daily" } },
      { nameKey: "sug_no_sweets",      emoji: "🍎", cadence: { type: "daily" } },
      { nameKey: "sug_vitamins",       emoji: "💊", cadence: { type: "daily" } },
      { nameKey: "sug_sleep_11",       emoji: "🛏️", cadence: { type: "daily" } },
      { nameKey: "sug_walk_10k",       emoji: "🚶", cadence: { type: "daily" } },
      { nameKey: "sug_walk_30",        emoji: "🥾", cadence: { type: "daily" } },
      { nameKey: "sug_meal_prep",      emoji: "🥗", cadence: { type: "x_per", count: 2, period: "week" } },
    ],
  },
  {
    catKey: "cat_mind",
    items: [
      { nameKey: "sug_read",      emoji: "📖", cadence: { type: "daily" } },
      { nameKey: "sug_meditate",  emoji: "🧘", cadence: { type: "daily" } },
      { nameKey: "sug_journal",   emoji: "✍️", cadence: { type: "daily" } },
      { nameKey: "sug_deep_work", emoji: "🧠", cadence: { type: "daily" } },
      { nameKey: "sug_learn",     emoji: "🎓", cadence: { type: "x_per", count: 3, period: "week" } },
      { nameKey: "sug_no_coffee", emoji: "☕", cadence: { type: "daily" } },
      { nameKey: "sug_gratitude", emoji: "🙏", cadence: { type: "daily" } },
      { nameKey: "sug_no_porn",   emoji: "🚫", cadence: { type: "daily" } },
    ],
  },
  {
    catKey: "cat_detox",
    items: [
      { nameKey: "sug_no_scrolling", emoji: "📵", cadence: { type: "daily" } },
      { nameKey: "sug_offline_day",  emoji: "🔇", cadence: { type: "x_per", count: 1, period: "week" } },
      { nameKey: "sug_no_social",    emoji: "📵", cadence: { type: "daily" } },
      { nameKey: "sug_screen_free",  emoji: "🌙", cadence: { type: "daily" } },
      { nameKey: "sug_phone_room",   emoji: "🏠", cadence: { type: "daily" } },
    ],
  },
  {
    catKey: "cat_social",
    items: [
      { nameKey: "sug_call_friend", emoji: "📞", cadence: { type: "daily" } },
      { nameKey: "sug_play_kids",   emoji: "👨‍👧‍👦", cadence: { type: "daily" } },
      { nameKey: "sug_hug",         emoji: "🤗", cadence: { type: "daily" } },
      { nameKey: "sug_date_night",  emoji: "❤️",  cadence: { type: "x_per", count: 1, period: "week" } },
      { nameKey: "sug_thank_you",   emoji: "✍️",  cadence: { type: "x_per", count: 1, period: "week" } },
      { nameKey: "sug_cook",        emoji: "🧑‍🍳", cadence: { type: "x_per", count: 2, period: "week" } },
    ],
  },
  {
    catKey: "cat_prod",
    items: [
      { nameKey: "sug_plan_tomorrow", emoji: "📝", cadence: { type: "daily" } },
      { nameKey: "sug_job_search",    emoji: "💼", cadence: { type: "daily" } },
      { nameKey: "sug_side_project",  emoji: "💻", cadence: { type: "x_per", count: 3, period: "week" } },
      { nameKey: "sug_finances",      emoji: "💰", cadence: { type: "x_per", count: 1, period: "month" } },
      { nameKey: "sug_clean",         emoji: "🧹", cadence: { type: "x_per", count: 2, period: "week" } },
      { nameKey: "sug_inbox",         emoji: "📊", cadence: { type: "daily" } },
      { nameKey: "sug_lang_practice", emoji: "🗣️", cadence: { type: "daily" } },
      { nameKey: "sug_driving",       emoji: "🚗", cadence: { type: "x_per", count: 2, period: "week" } },
      { nameKey: "sug_movie_lang",    emoji: "🎬", cadence: { type: "x_per", count: 1, period: "week" } },
    ],
  },
];
