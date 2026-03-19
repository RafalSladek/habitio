      // ═══ i18n ═══
      const T = {
        en: {
          nav_today: "Today",
          nav_journal: "Journal",
          nav_stats: "Stats",
          nav_settings: "Settings",
          no_habits: "No habits yet",
          tap_add: "Tap + to add your first habit",
          scheduled: "scheduled",
          lbl_icon: "Icon",
          lbl_cadence: "Cadence",
          btn_cancel: "Cancel",
          cad_daily: "Daily",
          cad_specific: "Specific Days",
          cad_xper: "X times per…",
          cad_select_days: "Select days",
          times_per: "times per",
          per_week: "Week",
          per_month: "Month",
          new_habit: "New Habit",
          edit_habit: "Edit Habit",
          add_habit: "Add Habit",
          save_changes: "Save Changes",
          type_own: "Or type your own…",
          enter_name: "Enter a habit name",
          select_day: "Select at least one day",
          habit_added: "Habit added!",
          habit_updated: "Habit updated!",
          habit_deleted: "Habit deleted",
          welcome: "Welcome to habit.io",
          welcome_sub:
            "Build better habits, one day at a time. Let's personalize your experience.",
          your_name: "Your first name",
          your_age: "Your age",
          your_sex: "Sex",
          sex_male: "Male",
          sex_female: "Female",
          language: "Language",
          lets_go: "Let's go!",
          age_teen:   "Teen (13–17)",
          age_young:  "Young Adult (18–29)",
          age_adult:  "Adult (30–49)",
          age_mid:    "Midlife (50–64)",
          age_senior: "Senior (65+)",
          onb_title: "Start small. Start now.",
          onb_add: "Add Your First Habit",
          onb_import: "Import from Backup",
          onb_hint: "Your data stays on this device",
          import_title: "Import Data",
          import_desc: "Choose what to import from your backup.",
          imp_habits_title: "Habits & Settings",
          imp_habits_desc: "Your habit list, icons, and cadence",
          imp_tracking_title: "Tracking & Journal",
          imp_tracking_desc: "Daily check-ins, progress, and diary entries",
          imp_go: "Select File & Import",
          imported: "Data imported!",
          export_backup: "Export Backup",
          import_backup: "Import Backup",
          reset_all: "Reset All Data",
          confirm_delete: "Delete this habit and all its history?",
          confirm_reset: "Delete ALL habits and history?",
          confirm_really: "Really? Cannot be undone.",
          all_cleared: "All data cleared",
          exported: "Backup exported!",
          invalid_file: "Invalid file",
          error_file: "Error reading file",
          this_week: "This Week",
          best_streak: "Best Streak",
          habits: "Habits",
          last_28: "Last 28 Days",
          performance: "Habit Performance · 30 Days",
          no_data: "No data yet",
          no_data_sub: "Add habits and check them off to see stats",
          diary_grateful: "What I am grateful for today",
          diary_affirm: "Affirmations — I am…",
          diary_good: "3 good things today",
          diary_better: "What could make this day even better",
          diary_saved: "Saved",
          diary_next: "Next",
          diary_back: "Back",
          diary_done: "Done",
          diary_complete: "Reflection complete",
          diary_filled: "prompts answered",
          diary_suggest_label: "Habits worth trying",
          diary_edit: "Edit",
          diary_ph_grateful: "e.g. my morning coffee, a kind message, a sunny day…",
          diary_ph_affirm: "e.g. I am resilient, I am growing, I am enough…",
          diary_ph_good: "e.g. finished a chapter, had a great workout, called a friend…",
          diary_ph_better: "e.g. take a walk after lunch, read before bed, drink more water…",
          habit_added: "added to your habits",
          settings_habits: "Habits",
          settings_data: "Data",
          settings_profile: "Profile",
          settings_about: "About",
          greet_morning: "Good morning",
          greet_afternoon: "Good afternoon",
          greet_evening: "Good evening",
          greet_night: "Good night",
          motiv_perfect: ["You crushed it today! 🏆", "100%! Nothing can stop you.", "A perfect day. Own it."],
          motiv_great:   ["Almost there — great effort!", "Strong day. Keep the streak!", "So close to perfect!"],
          motiv_good:    ["Good progress. One habit at a time.", "You're building momentum 💪", "Every check-in counts."],
          motiv_low:     ["A small step is still a step.", "Be kind to yourself — you showed up.", "Tomorrow is a fresh start 🌱"],
          phase_learning: "🌱 Learning",
          phase_building: "🔨 Building",
          phase_forming:  "⚡ Forming",
          phase_formed:   "✨ Formed",
          tip_streak:          "🔥 Consecutive days completed without a gap.\n\nYesterday or today must be checked — one missed day resets it to zero.\n\nStreaks are one of the strongest habit motivators (Milkman, 2021).",
          tip_best_streak:     "The longest active daily streak across all your habits.",
          tip_performance:     "% of scheduled days each habit was completed in the last 30 days.\n\nA habit set to 3×/week has ~12 possible days — not 30. Only counts days the habit was actually due.",
          tip_formation:       "Phillippa Lally et al. (2010) studied 96 people over 12 weeks and found habits take 18–254 days to become automatic, averaging 66 days.\n\nMissing an occasional day does not significantly disrupt the process.",
          tip_phase_learning:  "🌱 Days 0–19: Learning\n\nThe brain is starting to associate the cue with the behaviour. Missing a day is normal — just keep showing up.\n\nFocus: build the trigger, not the streak.",
          tip_phase_building:  "🔨 Days 20–49: Building\n\nNeural pathways are forming. Repetition is rewiring your automatic responses. Consistency matters most here.\n\nFocus: don't break the chain.",
          tip_phase_forming:   "⚡ Days 50–65: Forming\n\nThe behaviour is becoming a reflex. You're in the final critical stretch before the habit is truly wired in.\n\nFocus: protect the habit at all costs.",
          tip_phase_formed:    "✨ Days 66+: Formed\n\nLally et al. (2010): your habit has reached automaticity — it now requires less willpower and feels natural.\n\nFocus: maintain and build on it.",
          tip_diary_grateful:  "Gratitude journalling\n\nEmmons & McCullough (2003): people who wrote weekly about things they were grateful for were 25% happier and more optimistic than those who didn't.",
          tip_diary_affirm:    "Self-affirmations\n\nSteele (1988): affirming your core values reduces the brain's threat response, lowers stress, and improves rational decision-making under pressure.",
          tip_diary_good:      "Three Good Things\n\nSeligman et al. (2005): writing three good things and their causes each day for just one week significantly reduced depression and increased happiness for up to 6 months.",
          tip_diary_better:    "Implementation intentions\n\nGollwitzer (1999): people who write specific 'if X then Y' improvement plans are 2–3× more likely to follow through compared to vague goals.",
          morning_routine: "Morning routine",
          for_you: "for you",
          own_badge: "mine",
          stat_formation: "Formation Journey · 66 days",
          week_sub: "of all habits completed",
          streak_unit: "days in a row",
          heatmap_hint: "Each cell = 1 day · fill height = % of habits completed",
          hm_none: "None",
          hm_all: "All done",
          perf_sub: "% of scheduled days each habit was completed",
          perf_great: "Great",
          perf_fair: "Fair",
          perf_low: "Low",
          formation_sub: "Research shows it takes ~66 days to form a lasting habit",
          formation_of: "/ 66d",
          options_label: "Options",
          cat_health: "Health & Body",
          cat_mind: "Mind & Focus",
          cat_social: "Relationships",
          cat_prod: "Productivity",
          cat_detox: "Digital Detox",
          sug_wake_up: "Wake Up Early",
          sug_morning_workout: "Morning Workout",
          sug_cold_shower: "Cold Shower",
          sug_drink_water: "Drink 2L Water",
          sug_gym: "Gym",
          sug_yoga: "Yoga / Stretch",
          sug_no_alcohol: "No Alcohol",
          sug_no_sweets: "No Sweets",
          sug_vitamins: "Take Vitamins",
          sug_sleep_11: "Sleep by 11pm",
          sug_walk_10k: "Walk 10k Steps",
          sug_walk_30: "Walk 30 min",
          sug_meal_prep: "Healthy Meal Prep",
          sug_strength: "Strength Training",
          sug_balance: "Balance Exercise",
          sug_sunlight: "Morning Sunlight (10 min)",
          sug_protein: "High-Protein Meal",
          sug_no_late_eat: "No Food After 8pm",
          sug_read: "Read 30 min",
          sug_meditate: "Meditate",
          sug_journal: "Journal / Reflect",
          sug_deep_work: "Deep Work Session",
          sug_learn: "Learn Something New",
          sug_breathwork: "Breathwork / Box Breathing",
          sug_brain_game: "Brain Training Game",
          sug_no_coffee: "No Coffee before 10am",
          sug_gratitude: "Practice Gratitude",
          sug_no_porn: "No Porn",
          sug_no_scrolling: "No Scrolling",
          sug_offline_day: "Offline Day",
          sug_no_social: "No Social Media",
          sug_screen_free: "Screen-Free Evening",
          sug_phone_room: "Phone in Another Room",
          sug_call_friend: "Call a Friend / Family",
          sug_play_kids: "Play with Kids",
          sug_hug: "Hug Someone",
          sug_date_night: "Date Night",
          sug_thank_you: "Write a Thank You",
          sug_cook: "Cook for Family",
          sug_volunteer: "Volunteer / Give Back",
          sug_plan_tomorrow: "Plan Tomorrow Tonight",
          sug_job_search: "Job Search (1h)",
          sug_side_project: "Side Project",
          sug_finances: "Review Finances",
          sug_savings: "Transfer to Savings",
          sug_clean: "Clean / Organize",
          sug_inbox: "Inbox Zero",
          sug_lang_practice: "Practice Foreign Language",
          sug_driving: "Practice Driving",
          sug_movie_lang: "Watch Movie in Foreign Language",
          cat_micro: "Micro Learning",
          sug_micro_vocab:   "Learn 5 New Words",
          sug_micro_podcast: "Listen to Educational Podcast",
          sug_micro_flash:   "Review Flashcards",
          sug_micro_typing:  "Practice Typing Speed",
          sug_micro_math:    "Mental Math Practice",
          sug_micro_ted:     "Watch a TED Talk",
          sug_micro_wiki:    "Read One Wikipedia Article",
          sug_micro_code:    "Code for 15 Minutes",
          sug_micro_sketch:  "Sketch or Doodle",
          sug_micro_music:   "Practice an Instrument",
          share_app: "Share habit.io",
          share_copied: "Link copied!",
          share_text: "Build better habits with habit.io — free, offline-first habit tracker.",
          analytics_on: "Analytics: On",
          analytics_off: "Analytics: Off",
        },
        de: {
          nav_today: "Heute",
          nav_journal: "Tagebuch",
          nav_stats: "Statistik",
          nav_settings: "Einstellungen",
          no_habits: "Noch keine Gewohnheiten",
          tap_add: "Tippe + um deine erste Gewohnheit hinzuzufügen",
          scheduled: "geplant",
          lbl_icon: "Symbol",
          lbl_cadence: "Rhythmus",
          btn_cancel: "Abbrechen",
          cad_daily: "Täglich",
          cad_specific: "Bestimmte Tage",
          cad_xper: "X mal pro…",
          cad_select_days: "Tage wählen",
          times_per: "mal pro",
          per_week: "Woche",
          per_month: "Monat",
          new_habit: "Neue Gewohnheit",
          edit_habit: "Bearbeiten",
          add_habit: "Hinzufügen",
          save_changes: "Speichern",
          type_own: "Oder eigene eingeben…",
          enter_name: "Name eingeben",
          select_day: "Mindestens einen Tag wählen",
          habit_added: "Hinzugefügt!",
          habit_updated: "Aktualisiert!",
          habit_deleted: "Gelöscht",
          welcome: "Willkommen bei habit.io",
          welcome_sub:
            "Bessere Gewohnheiten aufbauen, Tag für Tag. Lass uns dein Erlebnis personalisieren.",
          your_name: "Dein Vorname",
          your_age: "Dein Alter",
          your_sex: "Geschlecht",
          sex_male: "Männlich",
          sex_female: "Weiblich",
          language: "Sprache",
          lets_go: "Los geht's!",
          age_teen:   "Teenager (13–17)",
          age_young:  "Junger Erwachsener (18–29)",
          age_adult:  "Erwachsener (30–49)",
          age_mid:    "Mittleres Alter (50–64)",
          age_senior: "Senior (65+)",
          onb_title: "Fang klein an. Fang jetzt an.",
          onb_add: "Erste Gewohnheit hinzufügen",
          onb_import: "Aus Backup importieren",
          onb_hint: "Deine Daten bleiben auf diesem Gerät",
          import_title: "Daten importieren",
          import_desc: "Wähle was importiert werden soll.",
          imp_habits_title: "Gewohnheiten & Einstellungen",
          imp_habits_desc: "Gewohnheitsliste, Symbole und Rhythmus",
          imp_tracking_title: "Tracking & Tagebuch",
          imp_tracking_desc:
            "Tägliche Check-ins, Fortschritt und Tagebucheinträge",
          imp_go: "Datei wählen & importieren",
          imported: "Daten importiert!",
          export_backup: "Backup exportieren",
          import_backup: "Backup importieren",
          reset_all: "Alle Daten löschen",
          confirm_delete: "Diese Gewohnheit und ihre Geschichte löschen?",
          confirm_reset: "ALLE Gewohnheiten und Verlauf löschen?",
          confirm_really: "Wirklich? Kann nicht rückgängig gemacht werden.",
          all_cleared: "Alle Daten gelöscht",
          exported: "Backup exportiert!",
          invalid_file: "Ungültige Datei",
          error_file: "Fehler beim Lesen",
          this_week: "Diese Woche",
          best_streak: "Beste Serie",
          habits: "Gewohnheiten",
          last_28: "Letzte 28 Tage",
          performance: "Leistung · 30 Tage",
          no_data: "Noch keine Daten",
          no_data_sub: "Füge Gewohnheiten hinzu und hake sie ab",
          diary_grateful: "Wofür bin ich heute dankbar",
          diary_affirm: "Affirmationen — Ich bin…",
          diary_good: "3 gute Dinge heute",
          diary_better: "Was könnte diesen Tag noch besser machen",
          diary_saved: "Gespeichert",
          diary_next: "Weiter",
          diary_back: "Zurück",
          diary_done: "Fertig",
          diary_complete: "Reflexion abgeschlossen",
          diary_filled: "Antworten gegeben",
          diary_suggest_label: "Gewohnheiten zum Ausprobieren",
          diary_edit: "Bearbeiten",
          diary_ph_grateful: "z.B. mein Morgenkaffee, eine nette Nachricht, ein sonniger Tag…",
          diary_ph_affirm: "z.B. Ich bin stark, ich wachse, ich bin genug…",
          diary_ph_good: "z.B. Kapitel fertig, gutes Training, Freund angerufen…",
          diary_ph_better: "z.B. nach dem Mittagessen spazieren, vor dem Schlafen lesen…",
          habit_added: "als Gewohnheit hinzugefügt",
          settings_habits: "Gewohnheiten",
          settings_data: "Daten",
          settings_profile: "Profil",
          settings_about: "Über",
          greet_morning: "Guten Morgen",
          greet_afternoon: "Guten Tag",
          greet_evening: "Guten Abend",
          greet_night: "Gute Nacht",
          motiv_perfect: ["Heute perfekt! 🏆", "100%! Du hast alles geschafft.", "Ein makelloser Tag — gut gemacht."],
          motiv_great:   ["Fast perfekt — starke Leistung!", "Toller Tag. Bleib dran!", "So nah an 100%!"],
          motiv_good:    ["Guter Fortschritt. Weiter so!", "Du baust Schwung auf 💪", "Jeder Haken zählt."],
          motiv_low:     ["Ein kleiner Schritt ist immer noch ein Schritt.", "Sei nett zu dir — du bist dabei.", "Morgen ist ein neuer Anfang 🌱"],
          phase_learning: "🌱 Lernphase",
          phase_building: "🔨 Aufbau",
          phase_forming:  "⚡ Festigung",
          phase_formed:   "✨ Geformt",
          tip_streak:          "🔥 Aufeinanderfolgende Tage ohne Unterbrechung.\n\nGestern oder heute muss abgehakt sein — ein verpasster Tag setzt auf null zurück.\n\nSerien sind einer der stärksten Motivatoren für Gewohnheiten (Milkman, 2021).",
          tip_best_streak:     "Die längste aktuelle Tagesserie über alle Gewohnheiten.",
          tip_performance:     "% der geplanten Tage, an denen die Gewohnheit in den letzten 30 Tagen abgeschlossen wurde.\n\nEine 3×/Woche-Gewohnheit hat ~12 mögliche Tage — nicht 30.",
          tip_formation:       "Lally et al. (2010): Gewohnheiten brauchen 18–254 Tage, um automatisch zu werden — im Durchschnitt 66 Tage.\n\nEin gelegentlich verpasster Tag stört den Prozess nicht wesentlich.",
          tip_phase_learning:  "🌱 Tage 0–19: Lernen\n\nDas Gehirn beginnt, den Auslöser mit dem Verhalten zu verknüpfen. Fehlende Tage sind normal.\n\nFokus: den Auslöser aufbauen.",
          tip_phase_building:  "🔨 Tage 20–49: Aufbauen\n\nNeuronale Bahnen formen sich. Konsequenz überschreibt automatische Reaktionen.\n\nFokus: die Kette nicht unterbrechen.",
          tip_phase_forming:   "⚡ Tage 50–65: Festigen\n\nDas Verhalten wird zum Reflex. Die letzte entscheidende Phase.\n\nFokus: die Gewohnheit um jeden Preis schützen.",
          tip_phase_formed:    "✨ Ab Tag 66: Geformt\n\nLally et al. (2010): Deine Gewohnheit hat Automatizität erreicht — weniger Willenskraft nötig.",
          tip_diary_grateful:  "Dankbarkeitsjournal\n\nEmmons & McCullough (2003): Wer wöchentlich Dankbarkeit aufschrieb, war 25% glücklicher und optimistischer.",
          tip_diary_affirm:    "Selbstaffirmationen\n\nSteele (1988): Das Bestätigen eigener Werte reduziert die Bedrohungsreaktion des Gehirns und verbessert Entscheidungen.",
          tip_diary_good:      "Drei gute Dinge\n\nSeligman et al. (2005): Täglich 3 gute Dinge aufzuschreiben reduzierte Depressionen signifikant — Wirkung bis zu 6 Monate.",
          tip_diary_better:    "Umsetzungsabsichten\n\nGollwitzer (1999): Wer konkrete Pläne aufschreibt, ist 2–3× wahrscheinlicher, sie umzusetzen.",
          morning_routine: "Morgenroutine",
          for_you: "für dich",
          own_badge: "eigene",
          stat_formation: "Formierungs-Reise · 66 Tage",
          week_sub: "Abschlussrate diese Woche",
          streak_unit: "Tage in Folge",
          heatmap_hint: "Jedes Feld = 1 Tag · Füllhöhe = % erledigter Gewohnheiten",
          hm_none: "Keine",
          hm_all: "Alles",
          perf_sub: "% der geplanten Tage abgeschlossen",
          perf_great: "Gut",
          perf_fair: "Okay",
          perf_low: "Wenig",
          formation_sub: "Studien zeigen: ~66 Tage für eine dauerhafte Gewohnheit",
          formation_of: "/ 66T",
          options_label: "Optionen",
          cat_health: "Gesundheit & Körper",
          cat_mind: "Geist & Fokus",
          cat_social: "Beziehungen",
          cat_prod: "Produktivität",
          cat_detox: "Digital Detox",
          sug_wake_up: "Früh aufstehen",
          sug_morning_workout: "Morgentraining",
          sug_cold_shower: "Kalte Dusche",
          sug_drink_water: "2L Wasser trinken",
          sug_gym: "Fitnessstudio",
          sug_yoga: "Yoga / Dehnen",
          sug_no_alcohol: "Kein Alkohol",
          sug_no_sweets: "Keine Süßigkeiten",
          sug_vitamins: "Vitamine nehmen",
          sug_sleep_11: "Bis 23 Uhr schlafen",
          sug_walk_10k: "10.000 Schritte gehen",
          sug_walk_30: "30 Min. spazieren",
          sug_meal_prep: "Gesundes Meal Prep",
          sug_strength: "Krafttraining",
          sug_balance: "Gleichgewichtstraining",
          sug_sunlight: "Morgensonne (10 Min.)",
          sug_protein: "Proteinreiche Mahlzeit",
          sug_no_late_eat: "Kein Essen nach 20 Uhr",
          sug_read: "30 Min. lesen",
          sug_meditate: "Meditieren",
          sug_journal: "Tagebuch schreiben",
          sug_deep_work: "Fokus-Arbeitssession",
          sug_breathwork: "Atemübungen / Box Breathing",
          sug_brain_game: "Gehirntraining",
          sug_learn: "Etwas Neues lernen",
          sug_no_coffee: "Kein Kaffee vor 10 Uhr",
          sug_gratitude: "Dankbarkeit üben",
          sug_no_porn: "Kein Pornos",
          sug_no_scrolling: "Kein Scrollen",
          sug_offline_day: "Offline-Tag",
          sug_no_social: "Kein Social Media",
          sug_screen_free: "Abend ohne Bildschirm",
          sug_phone_room: "Handy im anderen Zimmer",
          sug_call_friend: "Freund / Familie anrufen",
          sug_play_kids: "Mit Kindern spielen",
          sug_hug: "Jemanden umarmen",
          sug_date_night: "Romantischer Abend",
          sug_thank_you: "Danke schreiben",
          sug_cook: "Für Familie kochen",
          sug_volunteer: "Ehrenamt / Helfen",
          sug_plan_tomorrow: "Morgen heute planen",
          sug_job_search: "Jobsuche (1 Std.)",
          sug_side_project: "Nebenprojekt",
          sug_finances: "Finanzen prüfen",
          sug_savings: "Geld auf Sparkonto überweisen",
          sug_clean: "Aufräumen / Organisieren",
          sug_inbox: "Postfach leeren",
          sug_lang_practice: "Fremdsprache üben",
          sug_driving: "Fahrstunde",
          sug_movie_lang: "Film in Fremdsprache schauen",
          cat_micro: "Mikro-Lernen",
          sug_micro_vocab:   "5 neue Vokabeln lernen",
          sug_micro_podcast: "Lehrreichen Podcast hören",
          sug_micro_flash:   "Karteikarten wiederholen",
          sug_micro_typing:  "Tippgeschwindigkeit üben",
          sug_micro_math:    "Kopfrechenübung",
          sug_micro_ted:     "Einen TED-Talk schauen",
          sug_micro_wiki:    "Einen Wikipedia-Artikel lesen",
          sug_micro_code:    "15 Minuten programmieren",
          sug_micro_sketch:  "Skizzieren oder Kritzeln",
          sug_micro_music:   "Ein Instrument üben",
          share_app: "habit.io teilen",
          share_copied: "Link kopiert!",
          share_text: "Bau bessere Gewohnheiten mit habit.io — kostenloser Habit-Tracker.",
          analytics_on: "Analyse: An",
          analytics_off: "Analyse: Aus",
        },
        pl: {
          nav_today: "Dziś",
          nav_journal: "Dziennik",
          nav_stats: "Statystyki",
          nav_settings: "Ustawienia",
          no_habits: "Brak nawyków",
          tap_add: "Kliknij + aby dodać swój pierwszy nawyk",
          scheduled: "zaplanowane",
          lbl_icon: "Ikona",
          lbl_cadence: "Częstotliwość",
          btn_cancel: "Anuluj",
          cad_daily: "Codziennie",
          cad_specific: "Wybrane dni",
          cad_xper: "X razy na…",
          cad_select_days: "Wybierz dni",
          times_per: "razy na",
          per_week: "Tydzień",
          per_month: "Miesiąc",
          new_habit: "Nowy nawyk",
          edit_habit: "Edytuj nawyk",
          add_habit: "Dodaj nawyk",
          save_changes: "Zapisz zmiany",
          type_own: "Lub wpisz własny…",
          enter_name: "Wpisz nazwę nawyku",
          select_day: "Wybierz przynajmniej jeden dzień",
          habit_added: "Nawyk dodany!",
          habit_updated: "Nawyk zaktualizowany!",
          habit_deleted: "Nawyk usunięty",
          welcome: "Witaj w habit.io",
          welcome_sub:
            "Buduj lepsze nawyki, dzień po dniu. Spersonalizujmy Twoje doświadczenie.",
          your_name: "Twoje imię",
          your_age: "Twój wiek",
          your_sex: "Płeć",
          sex_male: "Mężczyzna",
          sex_female: "Kobieta",
          language: "Język",
          lets_go: "Zaczynajmy!",
          age_teen:   "Nastolatek (13–17)",
          age_young:  "Młody dorosły (18–29)",
          age_adult:  "Dorosły (30–49)",
          age_mid:    "Dojrzały (50–64)",
          age_senior: "Senior (65+)",
          onb_title: "Zacznij od małych kroków. Zacznij teraz.",
          onb_add: "Dodaj pierwszy nawyk",
          onb_import: "Importuj z kopii",
          onb_hint: "Twoje dane pozostają na tym urządzeniu",
          import_title: "Importuj dane",
          import_desc: "Wybierz co chcesz zaimportować.",
          imp_habits_title: "Nawyki i ustawienia",
          imp_habits_desc: "Lista nawyków, ikony i częstotliwość",
          imp_tracking_title: "Śledzenie i dziennik",
          imp_tracking_desc: "Codzienne wpisy, postęp i dziennik",
          imp_go: "Wybierz plik i importuj",
          imported: "Dane zaimportowane!",
          export_backup: "Eksportuj kopię",
          import_backup: "Importuj kopię",
          reset_all: "Usuń wszystkie dane",
          confirm_delete: "Usunąć ten nawyk i całą jego historię?",
          confirm_reset: "Usunąć WSZYSTKIE nawyki i historię?",
          confirm_really: "Na pewno? Tego nie można cofnąć.",
          all_cleared: "Wszystkie dane usunięte",
          exported: "Kopia wyeksportowana!",
          invalid_file: "Nieprawidłowy plik",
          error_file: "Błąd odczytu pliku",
          this_week: "Ten tydzień",
          best_streak: "Najlepsza seria",
          habits: "Nawyki",
          last_28: "Ostatnie 28 dni",
          performance: "Wyniki · 30 dni",
          no_data: "Brak danych",
          no_data_sub: "Dodaj nawyki i zaznaczaj je, aby zobaczyć statystyki",
          diary_grateful: "Za co jestem dziś wdzięczny/a",
          diary_affirm: "Afirmacje — Jestem…",
          diary_good: "3 dobre rzeczy dzisiaj",
          diary_better: "Co mogłoby sprawić, że ten dzień byłby jeszcze lepszy",
          diary_saved: "Zapisano",
          diary_next: "Dalej",
          diary_back: "Wstecz",
          diary_done: "Gotowe",
          diary_complete: "Refleksja gotowa",
          diary_filled: "odpowiedzi",
          diary_suggest_label: "Nawyki warte wypróbowania",
          diary_edit: "Edytuj",
          diary_ph_grateful: "np. poranna kawa, miła wiadomość, słoneczny dzień…",
          diary_ph_affirm: "np. Jestem silny/a, rosnę, wystarczam…",
          diary_ph_good: "np. skończyłem rozdział, dobry trening, zadzwoniłem do mamy…",
          diary_ph_better: "np. spacer po obiedzie, czytanie przed snem, więcej wody…",
          habit_added: "dodano do nawyków",
          settings_habits: "Nawyki",
          settings_data: "Dane",
          settings_profile: "Profil",
          settings_about: "O aplikacji",
          greet_morning: "Dzień dobry",
          greet_afternoon: "Dzień dobry",
          greet_evening: "Dobry wieczór",
          greet_night: "Dobranoc",
          motiv_perfect: ["Dziś perfekcyjnie! 🏆", "100%! Nic Cię nie powstrzyma.", "Idealny dzień — tak trzymaj."],
          motiv_great:   ["Prawie idealnie — świetna robota!", "Mocny dzień. Utrzymaj passę!", "Tak blisko 100%!"],
          motiv_good:    ["Dobry postęp. Krok po kroku.", "Budujesz pęd 💪", "Każde zaznaczenie ma znaczenie."],
          motiv_low:     ["Mały krok to wciąż krok.", "Bądź dla siebie łagodny/a — jesteś tu.", "Jutro nowy start 🌱"],
          phase_learning: "🌱 Nauka",
          phase_building: "🔨 Budowanie",
          phase_forming:  "⚡ Utrwalanie",
          phase_formed:   "✨ Nawyk",
          tip_streak:          "🔥 Kolejne dni bez przerwy.\n\nWczoraj lub dziś musi być odhaczone — jedna przerwa zeruje serię.\n\nSerie to jeden z najsilniejszych motywatorów nawyków (Milkman, 2021).",
          tip_best_streak:     "Najdłuższa aktywna seria dzienna spośród wszystkich nawyków.",
          tip_performance:     "% zaplanowanych dni, w których nawyk został wykonany (ostatnie 30 dni).\n\nNawyk 3×/tydzień ma ~12 możliwych dni — nie 30.",
          tip_formation:       "Lally et al. (2010): nawyki potrzebują 18–254 dni by stać się automatyczne, średnio 66 dni.\n\nOkazjonalne opuszczenie dnia nie psuje procesu.",
          tip_phase_learning:  "🌱 Dni 0–19: Nauka\n\nMózg zaczyna łączyć sygnał z zachowaniem. Opuszczenie dnia jest normalne.\n\nSkup się na budowaniu wyzwalacza.",
          tip_phase_building:  "🔨 Dni 20–49: Budowanie\n\nTworzą się ścieżki neuronowe. Regularność przepisuje automatyczne reakcje.\n\nSkup się na utrzymaniu ciągłości.",
          tip_phase_forming:   "⚡ Dni 50–65: Utrwalanie\n\nZachowanie staje się odruchem. Ostatnia krytyczna faza.\n\nChroń nawyk za wszelką cenę.",
          tip_phase_formed:    "✨ Od dnia 66: Nawyk\n\nLally et al. (2010): Twój nawyk osiągnął automatyczność — wymaga mniej siły woli.",
          tip_diary_grateful:  "Dziennik wdzięczności\n\nEmmons i McCullough (2003): zapisywanie wdzięczności zwiększyło szczęście o 25% i poprawiło optymizm.",
          tip_diary_affirm:    "Afirmacje\n\nSteele (1988): potwierdzanie własnych wartości redukuje reakcję zagrożenia w mózgu i poprawia decyzje.",
          tip_diary_good:      "Trzy dobre rzeczy\n\nSeligman et al. (2005): codzienne zapisywanie 3 dobrych rzeczy znacznie zmniejszyło depresję — efekt do 6 miesięcy.",
          tip_diary_better:    "Intencje implementacyjne\n\nGollwitzer (1999): pisanie konkretnych planów zwiększa prawdopodobieństwo realizacji 2–3×.",
          morning_routine: "Poranny rytuał",
          for_you: "dla Ciebie",
          own_badge: "mój",
          stat_formation: "Droga do nawyku · 66 dni",
          week_sub: "wskaźnik ukończenia w tym tygodniu",
          streak_unit: "dni z rzędu",
          heatmap_hint: "Każde pole = 1 dzień · wysokość = % wykonanych nawyków",
          hm_none: "Brak",
          hm_all: "Wszystko",
          perf_sub: "% zaplanowanych dni z ukończonym nawykiem",
          perf_great: "Świetnie",
          perf_fair: "OK",
          perf_low: "Mało",
          formation_sub: "Badania: ~66 dni potrzeba by nawyk stał się trwały",
          formation_of: "/ 66d",
          options_label: "Opcje",
          cat_health: "Zdrowie i ciało",
          cat_mind: "Umysł i skupienie",
          cat_social: "Relacje",
          cat_prod: "Produktywność",
          cat_detox: "Cyfrowy detoks",
          sug_wake_up: "Wstać wcześnie",
          sug_morning_workout: "Poranny trening",
          sug_cold_shower: "Zimny prysznic",
          sug_drink_water: "Pić 2L wody",
          sug_gym: "Siłownia",
          sug_yoga: "Joga / Rozciąganie",
          sug_no_alcohol: "Bez alkoholu",
          sug_no_sweets: "Bez słodyczy",
          sug_vitamins: "Brać witaminy",
          sug_sleep_11: "Spać przed 23:00",
          sug_walk_10k: "10 tys. kroków",
          sug_walk_30: "Spacer 30 min",
          sug_meal_prep: "Zdrowe gotowanie",
          sug_strength: "Trening siłowy",
          sug_balance: "Trening równowagi",
          sug_sunlight: "Poranne słońce (10 min)",
          sug_protein: "Posiłek bogaty w białko",
          sug_no_late_eat: "Nie jeść po 20:00",
          sug_read: "Czytać 30 min",
          sug_meditate: "Medytować",
          sug_journal: "Pisać dziennik",
          sug_deep_work: "Praca głęboka",
          sug_breathwork: "Ćwiczenia oddechowe",
          sug_brain_game: "Trening mózgu",
          sug_learn: "Uczyć się czegoś nowego",
          sug_no_coffee: "Brak kawy przed 10:00",
          sug_gratitude: "Praktykować wdzięczność",
          sug_no_porn: "Bez pornografii",
          sug_no_scrolling: "Bez scrollowania",
          sug_offline_day: "Dzień offline",
          sug_no_social: "Bez mediów społecznościowych",
          sug_screen_free: "Wieczór bez ekranu",
          sug_phone_room: "Telefon w innym pokoju",
          sug_call_friend: "Zadzwonić do kogoś",
          sug_play_kids: "Bawić się z dziećmi",
          sug_hug: "Przytulić kogoś",
          sug_date_night: "Wieczór we dwoje",
          sug_thank_you: "Napisać podziękowanie",
          sug_cook: "Gotować dla rodziny",
          sug_volunteer: "Wolontariat",
          sug_plan_tomorrow: "Planować jutro wieczorem",
          sug_job_search: "Szukanie pracy (1h)",
          sug_side_project: "Projekt poboczny",
          sug_finances: "Przegląd finansów",
          sug_savings: "Przelew na oszczędności",
          sug_clean: "Sprzątanie",
          sug_inbox: "Opróżnić skrzynkę",
          sug_lang_practice: "Ćwiczyć język obcy",
          sug_driving: "Ćwiczyć jazdę samochodem",
          sug_movie_lang: "Obejrzeć film w obcym języku",
          cat_micro: "Mikronauka",
          sug_micro_vocab:   "Nauczyć się 5 nowych słów",
          sug_micro_podcast: "Słuchać podcastu edukacyjnego",
          sug_micro_flash:   "Powtórzyć fiszki",
          sug_micro_typing:  "Ćwiczyć szybkość pisania",
          sug_micro_math:    "Ćwiczenia z rachunku w pamięci",
          sug_micro_ted:     "Obejrzeć TED Talk",
          sug_micro_wiki:    "Przeczytać artykuł na Wikipedii",
          sug_micro_code:    "Programować przez 15 minut",
          sug_micro_sketch:  "Szkicować lub rysować",
          sug_micro_music:   "Ćwiczyć grę na instrumencie",
          share_app: "Udostępnij habit.io",
          share_copied: "Link skopiowany!",
          share_text: "Buduj lepsze nawyki z habit.io — darmowy tracker nawyków.",
          analytics_on: "Analityka: Wł.",
          analytics_off: "Analityka: Wył.",
        },
        pt: {
          nav_today: "Hoje",
          nav_journal: "Diário",
          nav_stats: "Estatísticas",
          nav_settings: "Configurações",
          no_habits: "Nenhum hábito ainda",
          tap_add: "Toque em + para adicionar seu primeiro hábito",
          scheduled: "agendado",
          lbl_icon: "Ícone",
          lbl_cadence: "Frequência",
          btn_cancel: "Cancelar",
          cad_daily: "Diário",
          cad_specific: "Dias Específicos",
          cad_xper: "X vezes por…",
          cad_select_days: "Selecionar dias",
          times_per: "vezes por",
          per_week: "Semana",
          per_month: "Mês",
          new_habit: "Novo Hábito",
          edit_habit: "Editar Hábito",
          add_habit: "Adicionar Hábito",
          save_changes: "Salvar Alterações",
          type_own: "Ou digite o seu próprio…",
          enter_name: "Digite o nome do hábito",
          select_day: "Selecione pelo menos um dia",
          habit_added: "Hábito adicionado!",
          habit_updated: "Hábito atualizado!",
          habit_deleted: "Hábito excluído",
          welcome: "Bem-vindo ao habit.io",
          welcome_sub: "Construa melhores hábitos, um dia de cada vez. Vamos personalizar sua experiência.",
          your_name: "Seu primeiro nome",
          your_age: "Sua idade",
          your_sex: "Sexo",
          sex_male: "Masculino",
          sex_female: "Feminino",
          language: "Idioma",
          lets_go: "Vamos lá!",
          age_teen:   "Adolescente (13–17)",
          age_young:  "Jovem Adulto (18–29)",
          age_adult:  "Adulto (30–49)",
          age_mid:    "Meia-idade (50–64)",
          age_senior: "Sênior (65+)",
          onb_title: "Comece pequeno. Comece agora.",
          onb_add: "Adicione Seu Primeiro Hábito",
          onb_import: "Importar do Backup",
          onb_hint: "Seus dados ficam neste dispositivo",
          import_title: "Importar Dados",
          import_desc: "Escolha o que importar do seu backup.",
          imp_habits_title: "Hábitos e Configurações",
          imp_habits_desc: "Sua lista de hábitos, ícones e frequência",
          imp_tracking_title: "Acompanhamento e Diário",
          imp_tracking_desc: "Check-ins diários, progresso e entradas do diário",
          imp_go: "Selecionar Arquivo e Importar",
          imported: "Dados importados!",
          export_backup: "Exportar Backup",
          import_backup: "Importar Backup",
          reset_all: "Redefinir Todos os Dados",
          confirm_delete: "Excluir este hábito e todo o seu histórico?",
          confirm_reset: "Excluir TODOS os hábitos e histórico?",
          confirm_really: "Tem certeza? Não pode ser desfeito.",
          all_cleared: "Todos os dados apagados",
          exported: "Backup exportado!",
          invalid_file: "Arquivo inválido",
          error_file: "Erro ao ler arquivo",
          this_week: "Esta Semana",
          best_streak: "Melhor Sequência",
          habits: "Hábitos",
          last_28: "Últimos 28 Dias",
          performance: "Desempenho dos Hábitos · 30 Dias",
          no_data: "Sem dados ainda",
          no_data_sub: "Adicione hábitos e marque-os para ver estatísticas",
          diary_grateful: "Pelo que sou grato hoje",
          diary_affirm: "Afirmações — Eu sou…",
          diary_good: "3 coisas boas hoje",
          diary_better: "O que poderia tornar este dia ainda melhor",
          diary_saved: "Salvo",
          diary_next: "Próximo",
          diary_back: "Voltar",
          diary_done: "Concluído",
          diary_complete: "Reflexão concluída",
          diary_filled: "perguntas respondidas",
          diary_suggest_label: "Hábitos que vale tentar",
          diary_edit: "Editar",
          diary_ph_grateful: "ex. meu café da manhã, uma mensagem gentil, um dia ensolarado…",
          diary_ph_affirm: "ex. Eu sou resiliente, estou crescendo, sou suficiente…",
          diary_ph_good: "ex. terminei um capítulo, tive um ótimo treino, liguei para um amigo…",
          diary_ph_better: "ex. caminhar após o almoço, ler antes de dormir, beber mais água…",
          habit_added: "adicionado aos seus hábitos",
          settings_habits: "Hábitos",
          settings_data: "Dados",
          settings_profile: "Perfil",
          settings_about: "Sobre",
          greet_morning: "Bom dia",
          greet_afternoon: "Boa tarde",
          greet_evening: "Boa tarde",
          greet_night: "Boa noite",
          motiv_perfect: ["Você arrasou hoje! 🏆", "100%! Nada pode te parar.", "Um dia perfeito. Aproveite."],
          motiv_great:   ["Quase lá — grande esforço!", "Dia forte. Mantenha a sequência!", "Tão perto da perfeição!"],
          motiv_good:    ["Bom progresso. Um hábito de cada vez.", "Você está ganhando impulso 💪", "Cada check-in conta."],
          motiv_low:     ["Um pequeno passo ainda é um passo.", "Seja gentil consigo mesmo — você apareceu.", "Amanhã é um novo começo 🌱"],
          phase_learning: "🌱 Aprendendo",
          phase_building: "🔨 Construindo",
          phase_forming:  "⚡ Formando",
          phase_formed:   "✨ Formado",
          tip_streak:         "🔥 Dias consecutivos completos sem interrupção.\n\nOntem ou hoje deve estar marcado — um dia perdido reinicia para zero.\n\nSequências são um dos motivadores de hábito mais fortes (Milkman, 2021).",
          tip_best_streak:    "A maior sequência diária ativa entre todos os seus hábitos.",
          tip_performance:    "% dos dias agendados em que cada hábito foi concluído nos últimos 30 dias.\n\nUm hábito definido para 3×/semana tem ~12 dias possíveis — não 30.",
          tip_formation:      "Phillippa Lally et al. (2010) estudaram 96 pessoas ao longo de 12 semanas e descobriram que os hábitos levam de 18 a 254 dias para se tornarem automáticos, com média de 66 dias.\n\nPerder um dia ocasional não interrompe significativamente o processo.",
          tip_phase_learning: "🌱 Dias 0–19: Aprendendo\n\nO cérebro está começando a associar o estímulo ao comportamento. Perder um dia é normal — continue aparecendo.\n\nFoco: construir o gatilho, não a sequência.",
          tip_phase_building: "🔨 Dias 20–49: Construindo\n\nAs vias neurais estão se formando. A repetição está reconfigurando suas respostas automáticas. A consistência é mais importante aqui.\n\nFoco: não quebre a corrente.",
          tip_phase_forming:  "⚡ Dias 50–65: Formando\n\nO comportamento está se tornando um reflexo. Você está no trecho crítico final antes de o hábito estar verdadeiramente enraizado.\n\nFoco: proteja o hábito a todo custo.",
          tip_phase_formed:   "✨ Dias 66+: Formado\n\nLally et al. (2010): seu hábito atingiu a automaticidade — agora requer menos força de vontade e parece natural.\n\nFoco: mantenha e construa sobre ele.",
          tip_diary_grateful: "Diário de gratidão\n\nEmmons & McCullough (2003): pessoas que escreviam semanalmente sobre coisas pelas quais eram gratas eram 25% mais felizes e otimistas.",
          tip_diary_affirm:   "Autoafirmações\n\nSteele (1988): afirmar seus valores centrais reduz a resposta de ameaça do cérebro, diminui o estresse e melhora a tomada de decisões racionais.",
          tip_diary_good:     "Três Coisas Boas\n\nSeligman et al. (2005): escrever três coisas boas e suas causas por apenas uma semana reduziu significativamente a depressão e aumentou a felicidade por até 6 meses.",
          tip_diary_better:   "Intenções de implementação\n\nGollwitzer (1999): pessoas que escrevem planos específicos 'se X então Y' têm 2–3× mais probabilidade de seguir adiante.",
          morning_routine: "Rotina matinal",
          for_you: "para você",
          own_badge: "meu",
          stat_formation: "Jornada de Formação · 66 dias",
          week_sub: "de todos os hábitos concluídos",
          streak_unit: "dias seguidos",
          heatmap_hint: "Cada célula = 1 dia · altura = % dos hábitos concluídos",
          hm_none: "Nenhum",
          hm_all: "Tudo feito",
          perf_sub: "% dos dias agendados em que cada hábito foi concluído",
          perf_great: "Ótimo",
          perf_fair: "Regular",
          perf_low: "Baixo",
          formation_sub: "Pesquisas mostram que leva ~66 dias para formar um hábito duradouro",
          formation_of: "/ 66d",
          options_label: "Opções",
          cat_health: "Saúde e Corpo",
          cat_mind: "Mente e Foco",
          cat_social: "Relacionamentos",
          cat_prod: "Produtividade",
          cat_detox: "Detox Digital",
          sug_wake_up: "Acordar Cedo",
          sug_morning_workout: "Treino Matinal",
          sug_cold_shower: "Banho Frio",
          sug_drink_water: "Beber 2L de Água",
          sug_gym: "Academia",
          sug_yoga: "Yoga / Alongamento",
          sug_no_alcohol: "Sem Álcool",
          sug_no_sweets: "Sem Doces",
          sug_vitamins: "Tomar Vitaminas",
          sug_sleep_11: "Dormir até 23h",
          sug_walk_10k: "Caminhar 10k Passos",
          sug_walk_30: "Caminhar 30 min",
          sug_meal_prep: "Preparar Refeição Saudável",
          sug_strength: "Treino de Força",
          sug_balance: "Exercício de Equilíbrio",
          sug_sunlight: "Luz Solar Matinal (10 min)",
          sug_protein: "Refeição Rica em Proteína",
          sug_no_late_eat: "Sem Comer Após 20h",
          sug_read: "Ler 30 min",
          sug_meditate: "Meditar",
          sug_journal: "Diário / Reflexão",
          sug_deep_work: "Sessão de Trabalho Profundo",
          sug_learn: "Aprender Algo Novo",
          sug_breathwork: "Respiração / Respiração em Caixa",
          sug_brain_game: "Jogo de Treinamento Cerebral",
          sug_no_coffee: "Sem Café antes das 10h",
          sug_gratitude: "Praticar Gratidão",
          sug_no_porn: "Sem Pornografia",
          sug_no_scrolling: "Sem Rolagem",
          sug_offline_day: "Dia Offline",
          sug_no_social: "Sem Redes Sociais",
          sug_screen_free: "Noite Sem Tela",
          sug_phone_room: "Celular em Outro Cômodo",
          sug_call_friend: "Ligar para Amigo / Família",
          sug_play_kids: "Brincar com as Crianças",
          sug_hug: "Abraçar Alguém",
          sug_date_night: "Noite a Dois",
          sug_thank_you: "Escrever um Obrigado",
          sug_cook: "Cozinhar para a Família",
          sug_volunteer: "Voluntariar / Contribuir",
          sug_plan_tomorrow: "Planejar o Amanhã Esta Noite",
          sug_job_search: "Busca de Emprego (1h)",
          sug_side_project: "Projeto Paralelo",
          sug_finances: "Revisar Finanças",
          sug_savings: "Transferir para Poupança",
          sug_clean: "Limpar / Organizar",
          sug_inbox: "Caixa de Entrada Zero",
          sug_lang_practice: "Praticar Língua Estrangeira",
          sug_driving: "Praticar Direção",
          sug_movie_lang: "Assistir Filme em Língua Estrangeira",
          cat_micro: "Microaprendizado",
          sug_micro_vocab:   "Aprender 5 Palavras Novas",
          sug_micro_podcast: "Ouvir Podcast Educativo",
          sug_micro_flash:   "Revisar Flashcards",
          sug_micro_typing:  "Praticar Velocidade de Digitação",
          sug_micro_math:    "Praticar Matemática Mental",
          sug_micro_ted:     "Assistir uma Palestra TED",
          sug_micro_wiki:    "Ler um Artigo da Wikipédia",
          sug_micro_code:    "Programar por 15 Minutos",
          sug_micro_sketch:  "Esboçar ou Rabiscar",
          sug_micro_music:   "Praticar um Instrumento",
          share_app: "Compartilhar habit.io",
          share_copied: "Link copiado!",
          share_text: "Construa melhores hábitos com habit.io — rastreador de hábitos gratuito e offline.",
          analytics_on: "Análises: Ativadas",
          analytics_off: "Análises: Desativadas",
        },
        ru: {
          nav_today: "Сегодня",
          nav_journal: "Дневник",
          nav_stats: "Статистика",
          nav_settings: "Настройки",
          no_habits: "Нет привычек",
          tap_add: "Нажмите + чтобы добавить первую привычку",
          scheduled: "запланировано",
          lbl_icon: "Иконка",
          lbl_cadence: "Периодичность",
          btn_cancel: "Отмена",
          cad_daily: "Ежедневно",
          cad_specific: "Конкретные дни",
          cad_xper: "X раз в…",
          cad_select_days: "Выбрать дни",
          times_per: "раз в",
          per_week: "Неделю",
          per_month: "Месяц",
          new_habit: "Новая привычка",
          edit_habit: "Редактировать привычку",
          add_habit: "Добавить привычку",
          save_changes: "Сохранить изменения",
          type_own: "Или введите своё…",
          enter_name: "Введите название привычки",
          select_day: "Выберите хотя бы один день",
          habit_added: "Привычка добавлена!",
          habit_updated: "Привычка обновлена!",
          habit_deleted: "Привычка удалена",
          welcome: "Добро пожаловать в habit.io",
          welcome_sub: "Формируйте лучшие привычки, день за днём. Давайте персонализируем ваш опыт.",
          your_name: "Ваше имя",
          your_age: "Ваш возраст",
          your_sex: "Пол",
          sex_male: "Мужской",
          sex_female: "Женский",
          language: "Язык",
          lets_go: "Поехали!",
          age_teen:   "Подросток (13–17)",
          age_young:  "Молодой взрослый (18–29)",
          age_adult:  "Взрослый (30–49)",
          age_mid:    "Средний возраст (50–64)",
          age_senior: "Пожилой (65+)",
          onb_title: "Начни с малого. Начни сейчас.",
          onb_add: "Добавить первую привычку",
          onb_import: "Импорт из резервной копии",
          onb_hint: "Ваши данные остаются на этом устройстве",
          import_title: "Импорт данных",
          import_desc: "Выберите, что импортировать из резервной копии.",
          imp_habits_title: "Привычки и настройки",
          imp_habits_desc: "Список привычек, иконки и периодичность",
          imp_tracking_title: "Отслеживание и дневник",
          imp_tracking_desc: "Ежедневные отметки, прогресс и записи в дневнике",
          imp_go: "Выбрать файл и импортировать",
          imported: "Данные импортированы!",
          export_backup: "Экспорт резервной копии",
          import_backup: "Импорт резервной копии",
          reset_all: "Сбросить все данные",
          confirm_delete: "Удалить эту привычку и всю её историю?",
          confirm_reset: "Удалить ВСЕ привычки и историю?",
          confirm_really: "Точно? Это нельзя отменить.",
          all_cleared: "Все данные удалены",
          exported: "Резервная копия экспортирована!",
          invalid_file: "Неверный файл",
          error_file: "Ошибка чтения файла",
          this_week: "На этой неделе",
          best_streak: "Лучшая серия",
          habits: "Привычки",
          last_28: "Последние 28 дней",
          performance: "Выполнение привычек · 30 дней",
          no_data: "Данных пока нет",
          no_data_sub: "Добавьте привычки и отмечайте их, чтобы увидеть статистику",
          diary_grateful: "За что я благодарен сегодня",
          diary_affirm: "Аффирмации — Я…",
          diary_good: "3 хорошие вещи сегодня",
          diary_better: "Что могло бы сделать этот день ещё лучше",
          diary_saved: "Сохранено",
          diary_next: "Далее",
          diary_back: "Назад",
          diary_done: "Готово",
          diary_complete: "Рефлексия завершена",
          diary_filled: "вопросов отвечено",
          diary_suggest_label: "Привычки, которые стоит попробовать",
          diary_edit: "Редактировать",
          diary_ph_grateful: "напр. мой утренний кофе, доброе сообщение, солнечный день…",
          diary_ph_affirm: "напр. Я стойкий, я расту, мне достаточно…",
          diary_ph_good: "напр. дочитал главу, хорошо потренировался, позвонил другу…",
          diary_ph_better: "напр. прогуляться после обеда, читать перед сном, пить больше воды…",
          habit_added: "добавлено в привычки",
          settings_habits: "Привычки",
          settings_data: "Данные",
          settings_profile: "Профиль",
          settings_about: "О приложении",
          greet_morning: "Доброе утро",
          greet_afternoon: "Добрый день",
          greet_evening: "Добрый вечер",
          greet_night: "Спокойной ночи",
          motiv_perfect: ["Ты покорил этот день! 🏆", "100%! Тебя ничто не остановит.", "Идеальный день. Ощути это."],
          motiv_great:   ["Почти там — отличный результат!", "Сильный день. Держи серию!", "Так близко к идеалу!"],
          motiv_good:    ["Хороший прогресс. Одна привычка за раз.", "Ты набираешь обороты 💪", "Каждая отметка важна."],
          motiv_low:     ["Маленький шаг — это тоже шаг.", "Будь добр к себе — ты пришёл.", "Завтра — новое начало 🌱"],
          phase_learning: "🌱 Обучение",
          phase_building: "🔨 Построение",
          phase_forming:  "⚡ Формирование",
          phase_formed:   "✨ Сформировано",
          tip_streak:         "🔥 Подряд завершённые дни без пропуска.\n\nВчера или сегодня должно быть отмечено — один пропущенный день сбрасывает счётчик до нуля.\n\nСерии — один из самых сильных мотиваторов привычек (Milkman, 2021).",
          tip_best_streak:    "Самая длинная активная ежедневная серия среди всех ваших привычек.",
          tip_performance:    "% запланированных дней, в которые каждая привычка была выполнена за последние 30 дней.\n\nПривычка с расписанием 3×/неделю имеет ~12 возможных дней — не 30.",
          tip_formation:      "Phillippa Lally et al. (2010) изучали 96 человек на протяжении 12 недель и обнаружили, что привычки становятся автоматическими за 18–254 дня, в среднем за 66 дней.\n\nПропуск одного дня не нарушает значительно этот процесс.",
          tip_phase_learning: "🌱 Дни 0–19: Обучение\n\nМозг начинает связывать сигнал с поведением. Пропустить день — нормально, просто продолжай появляться.\n\nФокус: выстроить триггер, а не серию.",
          tip_phase_building: "🔨 Дни 20–49: Построение\n\nНейронные пути формируются. Повторение перепрограммирует автоматические реакции. Здесь важнее всего последовательность.\n\nФокус: не прерывай цепочку.",
          tip_phase_forming:  "⚡ Дни 50–65: Формирование\n\nПоведение становится рефлексом. Ты на последнем критическом отрезке перед тем, как привычка закрепится.\n\nФокус: защищай привычку любой ценой.",
          tip_phase_formed:   "✨ Дни 66+: Сформировано\n\nLally et al. (2010): твоя привычка достигла автоматизма — теперь она требует меньше силы воли и ощущается естественной.\n\nФокус: поддерживай и развивай её.",
          tip_diary_grateful: "Дневник благодарности\n\nEmmons & McCullough (2003): люди, которые еженедельно писали о том, за что они благодарны, были на 25% счастливее и оптимистичнее.",
          tip_diary_affirm:   "Самоаффирмации\n\nSteele (1988): подтверждение своих основных ценностей снижает реакцию угрозы в мозге, уменьшает стресс и улучшает принятие решений.",
          tip_diary_good:     "Три хорошие вещи\n\nSeligman et al. (2005): ежедневная запись трёх хороших вещей всего за одну неделю значительно снизила депрессию и повысила счастье на срок до 6 месяцев.",
          tip_diary_better:   "Намерения реализации\n\nGollwitzer (1999): люди, которые пишут конкретные планы «если X, то Y», в 2–3 раза чаще следуют им.",
          morning_routine: "Утренняя рутина",
          for_you: "для вас",
          own_badge: "моё",
          stat_formation: "Путь формирования · 66 дней",
          week_sub: "всех привычек выполнено",
          streak_unit: "дней подряд",
          heatmap_hint: "Каждая ячейка = 1 день · высота = % выполненных привычек",
          hm_none: "Ничего",
          hm_all: "Всё выполнено",
          perf_sub: "% запланированных дней, в которые каждая привычка была выполнена",
          perf_great: "Отлично",
          perf_fair: "Хорошо",
          perf_low: "Низко",
          formation_sub: "Исследования показывают, что для формирования устойчивой привычки требуется ~66 дней",
          formation_of: "/ 66д",
          options_label: "Параметры",
          cat_health: "Здоровье и тело",
          cat_mind: "Ум и фокус",
          cat_social: "Отношения",
          cat_prod: "Продуктивность",
          cat_detox: "Цифровой детокс",
          sug_wake_up: "Ранний подъём",
          sug_morning_workout: "Утренняя тренировка",
          sug_cold_shower: "Холодный душ",
          sug_drink_water: "Выпить 2л воды",
          sug_gym: "Спортзал",
          sug_yoga: "Йога / Растяжка",
          sug_no_alcohol: "Без алкоголя",
          sug_no_sweets: "Без сладкого",
          sug_vitamins: "Принять витамины",
          sug_sleep_11: "Спать до 23:00",
          sug_walk_10k: "Пройти 10к шагов",
          sug_walk_30: "Прогулка 30 мин",
          sug_meal_prep: "Приготовить здоровую еду",
          sug_strength: "Силовая тренировка",
          sug_balance: "Упражнения на равновесие",
          sug_sunlight: "Утренний солнечный свет (10 мин)",
          sug_protein: "Богатая белком еда",
          sug_no_late_eat: "Не есть после 20:00",
          sug_read: "Читать 30 мин",
          sug_meditate: "Медитация",
          sug_journal: "Дневник / Рефлексия",
          sug_deep_work: "Сеанс глубокой работы",
          sug_learn: "Узнать что-то новое",
          sug_breathwork: "Дыхательные практики / Коробочное дыхание",
          sug_brain_game: "Игра для тренировки мозга",
          sug_no_coffee: "Без кофе до 10:00",
          sug_gratitude: "Практика благодарности",
          sug_no_porn: "Без порнографии",
          sug_no_scrolling: "Без скроллинга",
          sug_offline_day: "День офлайн",
          sug_no_social: "Без соцсетей",
          sug_screen_free: "Вечер без экранов",
          sug_phone_room: "Телефон в другой комнате",
          sug_call_friend: "Позвонить другу / семье",
          sug_play_kids: "Поиграть с детьми",
          sug_hug: "Обнять кого-нибудь",
          sug_date_night: "Романтический вечер",
          sug_thank_you: "Написать благодарность",
          sug_cook: "Готовить для семьи",
          sug_volunteer: "Волонтёрство / Помощь другим",
          sug_plan_tomorrow: "Планировать завтра вечером",
          sug_job_search: "Поиск работы (1 ч)",
          sug_side_project: "Побочный проект",
          sug_finances: "Проверить финансы",
          sug_savings: "Перевести в сбережения",
          sug_clean: "Уборка / Организация",
          sug_inbox: "Очистить входящие",
          sug_lang_practice: "Практика иностранного языка",
          sug_driving: "Практика вождения",
          sug_movie_lang: "Смотреть фильм на иностранном языке",
          cat_micro: "Микрообучение",
          sug_micro_vocab:   "Выучить 5 новых слов",
          sug_micro_podcast: "Слушать образовательный подкаст",
          sug_micro_flash:   "Повторить карточки",
          sug_micro_typing:  "Тренировать скорость набора",
          sug_micro_math:    "Устный счёт",
          sug_micro_ted:     "Посмотреть лекцию TED",
          sug_micro_wiki:    "Прочитать статью в Википедии",
          sug_micro_code:    "Писать код 15 минут",
          sug_micro_sketch:  "Зарисовка или дудл",
          sug_micro_music:   "Практика на инструменте",
          share_app: "Поделиться habit.io",
          share_copied: "Ссылка скопирована!",
          share_text: "Формируйте лучшие привычки с habit.io — бесплатный трекер привычек с поддержкой офлайн.",
          analytics_on: "Аналитика: Вкл",
          analytics_off: "Аналитика: Выкл",
        },
        fr: {
          nav_today: "Aujourd'hui",
          nav_journal: "Journal",
          nav_stats: "Statistiques",
          nav_settings: "Paramètres",
          no_habits: "Aucune habitude",
          tap_add: "Appuyez sur + pour ajouter votre première habitude",
          scheduled: "planifié",
          lbl_icon: "Icône",
          lbl_cadence: "Fréquence",
          btn_cancel: "Annuler",
          cad_daily: "Quotidien",
          cad_specific: "Jours spécifiques",
          cad_xper: "X fois par…",
          cad_select_days: "Sélectionner les jours",
          times_per: "fois par",
          per_week: "Semaine",
          per_month: "Mois",
          new_habit: "Nouvelle habitude",
          edit_habit: "Modifier l'habitude",
          add_habit: "Ajouter une habitude",
          save_changes: "Enregistrer les modifications",
          type_own: "Ou saisissez le vôtre…",
          enter_name: "Entrez un nom d'habitude",
          select_day: "Sélectionnez au moins un jour",
          habit_added: "Habitude ajoutée !",
          habit_updated: "Habitude mise à jour !",
          habit_deleted: "Habitude supprimée",
          welcome: "Bienvenue sur habit.io",
          welcome_sub: "Construisez de meilleures habitudes, un jour à la fois. Personnalisons votre expérience.",
          your_name: "Votre prénom",
          your_age: "Votre âge",
          your_sex: "Sexe",
          sex_male: "Masculin",
          sex_female: "Féminin",
          language: "Langue",
          lets_go: "C'est parti !",
          age_teen:   "Adolescent (13–17)",
          age_young:  "Jeune adulte (18–29)",
          age_adult:  "Adulte (30–49)",
          age_mid:    "Âge mûr (50–64)",
          age_senior: "Senior (65+)",
          onb_title: "Commencez petit. Commencez maintenant.",
          onb_add: "Ajoutez votre première habitude",
          onb_import: "Importer depuis une sauvegarde",
          onb_hint: "Vos données restent sur cet appareil",
          import_title: "Importer des données",
          import_desc: "Choisissez ce que vous souhaitez importer depuis votre sauvegarde.",
          imp_habits_title: "Habitudes et paramètres",
          imp_habits_desc: "Votre liste d'habitudes, icônes et fréquence",
          imp_tracking_title: "Suivi et journal",
          imp_tracking_desc: "Pointages quotidiens, progrès et entrées du journal",
          imp_go: "Sélectionner un fichier et importer",
          imported: "Données importées !",
          export_backup: "Exporter la sauvegarde",
          import_backup: "Importer la sauvegarde",
          reset_all: "Réinitialiser toutes les données",
          confirm_delete: "Supprimer cette habitude et tout son historique ?",
          confirm_reset: "Supprimer TOUTES les habitudes et l'historique ?",
          confirm_really: "Vraiment ? Impossible à annuler.",
          all_cleared: "Toutes les données effacées",
          exported: "Sauvegarde exportée !",
          invalid_file: "Fichier invalide",
          error_file: "Erreur de lecture du fichier",
          this_week: "Cette semaine",
          best_streak: "Meilleure série",
          habits: "Habitudes",
          last_28: "28 derniers jours",
          performance: "Performance des habitudes · 30 jours",
          no_data: "Pas encore de données",
          no_data_sub: "Ajoutez des habitudes et cochez-les pour voir les statistiques",
          diary_grateful: "Ce dont je suis reconnaissant aujourd'hui",
          diary_affirm: "Affirmations — Je suis…",
          diary_good: "3 bonnes choses aujourd'hui",
          diary_better: "Ce qui pourrait rendre cette journée encore meilleure",
          diary_saved: "Enregistré",
          diary_next: "Suivant",
          diary_back: "Retour",
          diary_done: "Terminé",
          diary_complete: "Réflexion terminée",
          diary_filled: "questions répondues",
          diary_suggest_label: "Habitudes à essayer",
          diary_edit: "Modifier",
          diary_ph_grateful: "ex. mon café du matin, un message bienveillant, une journée ensoleillée…",
          diary_ph_affirm: "ex. Je suis résilient, je grandis, je suis suffisant…",
          diary_ph_good: "ex. fini un chapitre, eu un super entraînement, appelé un ami…",
          diary_ph_better: "ex. marcher après le déjeuner, lire avant de dormir, boire plus d'eau…",
          habit_added: "ajouté à vos habitudes",
          settings_habits: "Habitudes",
          settings_data: "Données",
          settings_profile: "Profil",
          settings_about: "À propos",
          greet_morning: "Bonjour",
          greet_afternoon: "Bonne après-midi",
          greet_evening: "Bonsoir",
          greet_night: "Bonne nuit",
          motiv_perfect: ["Tu as tout écrasé aujourd'hui ! 🏆", "100% ! Rien ne peut t'arrêter.", "Une journée parfaite. Savoure-la."],
          motiv_great:   ["Presque là — bel effort !", "Journée solide. Garde la série !", "Si proche de la perfection !"],
          motiv_good:    ["Bon progrès. Une habitude à la fois.", "Tu construis de l'élan 💪", "Chaque pointage compte."],
          motiv_low:     ["Un petit pas est quand même un pas.", "Sois indulgent envers toi-même — tu t'es montré.", "Demain, c'est un nouveau départ 🌱"],
          phase_learning: "🌱 Apprentissage",
          phase_building: "🔨 Construction",
          phase_forming:  "⚡ Formation",
          phase_formed:   "✨ Formé",
          tip_streak:         "🔥 Jours consécutifs complétés sans interruption.\n\nHier ou aujourd'hui doit être coché — un jour manqué remet le compteur à zéro.\n\nLes séries sont l'un des motivateurs d'habitudes les plus puissants (Milkman, 2021).",
          tip_best_streak:    "La plus longue série quotidienne active parmi toutes vos habitudes.",
          tip_performance:    "% des jours planifiés où chaque habitude a été complétée au cours des 30 derniers jours.\n\nUne habitude à 3×/semaine a ~12 jours possibles — pas 30.",
          tip_formation:      "Phillippa Lally et al. (2010) ont étudié 96 personnes sur 12 semaines et ont découvert que les habitudes mettent de 18 à 254 jours à devenir automatiques, avec une moyenne de 66 jours.\n\nManquer un jour occasionnel ne perturbe pas significativement le processus.",
          tip_phase_learning: "🌱 Jours 0–19 : Apprentissage\n\nLe cerveau commence à associer le signal au comportement. Manquer un jour est normal — continuez à vous montrer.\n\nFocus : construire le déclencheur, pas la série.",
          tip_phase_building: "🔨 Jours 20–49 : Construction\n\nLes voies neuronales se forment. La répétition recâble vos réponses automatiques. La constance est primordiale.\n\nFocus : ne brisez pas la chaîne.",
          tip_phase_forming:  "⚡ Jours 50–65 : Formation\n\nLe comportement devient un réflexe. Vous êtes dans la dernière ligne droite critique avant que l'habitude soit vraiment ancrée.\n\nFocus : protégez l'habitude à tout prix.",
          tip_phase_formed:   "✨ Jours 66+ : Formé\n\nLally et al. (2010) : votre habitude a atteint l'automaticité — elle demande désormais moins de volonté et semble naturelle.\n\nFocus : maintenez-la et développez-la.",
          tip_diary_grateful: "Journal de gratitude\n\nEmmons & McCullough (2003) : les personnes qui écrivaient chaque semaine sur ce dont elles étaient reconnaissantes étaient 25 % plus heureuses et optimistes.",
          tip_diary_affirm:   "Auto-affirmations\n\nSteele (1988) : affirmer vos valeurs fondamentales réduit la réponse de menace du cerveau, diminue le stress et améliore la prise de décision.",
          tip_diary_good:     "Trois bonnes choses\n\nSeligman et al. (2005) : écrire trois bonnes choses chaque jour pendant une seule semaine a significativement réduit la dépression et augmenté le bonheur pendant jusqu'à 6 mois.",
          tip_diary_better:   "Intentions d'implémentation\n\nGollwitzer (1999) : les personnes qui écrivent des plans 'si X alors Y' sont 2–3 fois plus susceptibles de les suivre.",
          morning_routine: "Routine matinale",
          for_you: "pour vous",
          own_badge: "mien",
          stat_formation: "Parcours de formation · 66 jours",
          week_sub: "de toutes les habitudes complétées",
          streak_unit: "jours d'affilée",
          heatmap_hint: "Chaque cellule = 1 jour · hauteur = % d'habitudes complétées",
          hm_none: "Aucun",
          hm_all: "Tout fait",
          perf_sub: "% des jours planifiés où chaque habitude a été complétée",
          perf_great: "Excellent",
          perf_fair: "Correct",
          perf_low: "Faible",
          formation_sub: "Les recherches montrent qu'il faut ~66 jours pour former une habitude durable",
          formation_of: "/ 66j",
          options_label: "Options",
          cat_health: "Santé et corps",
          cat_mind: "Esprit et concentration",
          cat_social: "Relations",
          cat_prod: "Productivité",
          cat_detox: "Détox numérique",
          sug_wake_up: "Se lever tôt",
          sug_morning_workout: "Entraînement matinal",
          sug_cold_shower: "Douche froide",
          sug_drink_water: "Boire 2L d'eau",
          sug_gym: "Salle de sport",
          sug_yoga: "Yoga / Étirements",
          sug_no_alcohol: "Sans alcool",
          sug_no_sweets: "Sans sucreries",
          sug_vitamins: "Prendre des vitamines",
          sug_sleep_11: "Au lit à 23h",
          sug_walk_10k: "Marcher 10k pas",
          sug_walk_30: "Marcher 30 min",
          sug_meal_prep: "Préparer un repas sain",
          sug_strength: "Musculation",
          sug_balance: "Exercice d'équilibre",
          sug_sunlight: "Soleil matinal (10 min)",
          sug_protein: "Repas riche en protéines",
          sug_no_late_eat: "Ne pas manger après 20h",
          sug_read: "Lire 30 min",
          sug_meditate: "Méditer",
          sug_journal: "Journal / Réflexion",
          sug_deep_work: "Session de travail en profondeur",
          sug_learn: "Apprendre quelque chose de nouveau",
          sug_breathwork: "Respiration / Cohérence cardiaque",
          sug_brain_game: "Jeu de stimulation cérébrale",
          sug_no_coffee: "Pas de café avant 10h",
          sug_gratitude: "Pratiquer la gratitude",
          sug_no_porn: "Sans pornographie",
          sug_no_scrolling: "Sans défilement",
          sug_offline_day: "Journée hors ligne",
          sug_no_social: "Sans réseaux sociaux",
          sug_screen_free: "Soirée sans écran",
          sug_phone_room: "Téléphone dans une autre pièce",
          sug_call_friend: "Appeler un ami / la famille",
          sug_play_kids: "Jouer avec les enfants",
          sug_hug: "Faire un câlin",
          sug_date_night: "Soirée en amoureux",
          sug_thank_you: "Écrire un remerciement",
          sug_cook: "Cuisiner pour la famille",
          sug_volunteer: "Bénévolat / Donner en retour",
          sug_plan_tomorrow: "Planifier demain ce soir",
          sug_job_search: "Recherche d'emploi (1h)",
          sug_side_project: "Projet parallèle",
          sug_finances: "Vérifier les finances",
          sug_savings: "Transférer vers l'épargne",
          sug_clean: "Nettoyer / Organiser",
          sug_inbox: "Zéro boîte de réception",
          sug_lang_practice: "Pratiquer une langue étrangère",
          sug_driving: "Pratiquer la conduite",
          sug_movie_lang: "Regarder un film en langue étrangère",
          cat_micro: "Micro-apprentissage",
          sug_micro_vocab:   "Apprendre 5 nouveaux mots",
          sug_micro_podcast: "Écouter un podcast éducatif",
          sug_micro_flash:   "Réviser des fiches",
          sug_micro_typing:  "Pratiquer la vitesse de frappe",
          sug_micro_math:    "Calcul mental",
          sug_micro_ted:     "Regarder une conférence TED",
          sug_micro_wiki:    "Lire un article Wikipédia",
          sug_micro_code:    "Coder 15 minutes",
          sug_micro_sketch:  "Dessiner ou gribouiller",
          sug_micro_music:   "Pratiquer un instrument",
          share_app: "Partager habit.io",
          share_copied: "Lien copié !",
          share_text: "Construisez de meilleures habitudes avec habit.io — suivi d'habitudes gratuit et hors ligne.",
          analytics_on: "Analytique : Activé",
          analytics_off: "Analytique : Désactivé",
        },
        hi: {
          nav_today: "आज",
          nav_journal: "डायरी",
          nav_stats: "आँकड़े",
          nav_settings: "सेटिंग्स",
          no_habits: "अभी कोई आदत नहीं",
          tap_add: "अपनी पहली आदत जोड़ने के लिए + दबाएं",
          scheduled: "निर्धारित",
          lbl_icon: "आइकन",
          lbl_cadence: "आवृत्ति",
          btn_cancel: "रद्द करें",
          cad_daily: "दैनिक",
          cad_specific: "विशिष्ट दिन",
          cad_xper: "X बार प्रति…",
          cad_select_days: "दिन चुनें",
          times_per: "बार प्रति",
          per_week: "सप्ताह",
          per_month: "महीना",
          new_habit: "नई आदत",
          edit_habit: "आदत संपादित करें",
          add_habit: "आदत जोड़ें",
          save_changes: "बदलाव सहेजें",
          type_own: "या अपना लिखें…",
          enter_name: "आदत का नाम दर्ज करें",
          select_day: "कम से कम एक दिन चुनें",
          habit_added: "आदत जोड़ी गई!",
          habit_updated: "आदत अपडेट की गई!",
          habit_deleted: "आदत हटाई गई",
          welcome: "habit.io में आपका स्वागत है",
          welcome_sub: "एक दिन में एक बेहतर आदत बनाएं। आइए आपका अनुभव व्यक्तिगत बनाएं।",
          your_name: "आपका पहला नाम",
          your_age: "आपकी उम्र",
          your_sex: "लिंग",
          sex_male: "पुरुष",
          sex_female: "महिला",
          language: "भाषा",
          lets_go: "चलिए शुरू करते हैं!",
          age_teen:   "किशोर (13–17)",
          age_young:  "युवा वयस्क (18–29)",
          age_adult:  "वयस्क (30–49)",
          age_mid:    "मध्यम आयु (50–64)",
          age_senior: "वरिष्ठ (65+)",
          onb_title: "छोटे से शुरू करें। अभी शुरू करें।",
          onb_add: "अपनी पहली आदत जोड़ें",
          onb_import: "बैकअप से आयात करें",
          onb_hint: "आपका डेटा इस डिवाइस पर रहता है",
          import_title: "डेटा आयात करें",
          import_desc: "अपने बैकअप से क्या आयात करना है चुनें।",
          imp_habits_title: "आदतें और सेटिंग्स",
          imp_habits_desc: "आपकी आदतों की सूची, आइकन और आवृत्ति",
          imp_tracking_title: "ट्रैकिंग और डायरी",
          imp_tracking_desc: "दैनिक चेक-इन, प्रगति और डायरी प्रविष्टियाँ",
          imp_go: "फ़ाइल चुनें और आयात करें",
          imported: "डेटा आयात किया गया!",
          export_backup: "बैकअप निर्यात करें",
          import_backup: "बैकअप आयात करें",
          reset_all: "सभी डेटा रीसेट करें",
          confirm_delete: "इस आदत और इसका सारा इतिहास हटाएं?",
          confirm_reset: "सभी आदतें और इतिहास हटाएं?",
          confirm_really: "सच में? यह पूर्ववत नहीं किया जा सकता।",
          all_cleared: "सभी डेटा साफ़ किया गया",
          exported: "बैकअप निर्यात किया गया!",
          invalid_file: "अमान्य फ़ाइल",
          error_file: "फ़ाइल पढ़ने में त्रुटि",
          this_week: "इस सप्ताह",
          best_streak: "सर्वश्रेष्ठ लकीर",
          habits: "आदतें",
          last_28: "पिछले 28 दिन",
          performance: "आदत प्रदर्शन · 30 दिन",
          no_data: "अभी कोई डेटा नहीं",
          no_data_sub: "आँकड़े देखने के लिए आदतें जोड़ें और उन्हें चेक करें",
          diary_grateful: "आज मैं किस बात के लिए आभारी हूँ",
          diary_affirm: "सकारात्मक विचार — मैं हूँ…",
          diary_good: "आज की 3 अच्छी बातें",
          diary_better: "इस दिन को और बेहतर क्या बना सकता था",
          diary_saved: "सहेजा गया",
          diary_next: "आगे",
          diary_back: "पीछे",
          diary_done: "पूर्ण",
          diary_complete: "चिंतन पूर्ण हुआ",
          diary_filled: "प्रश्नों के उत्तर दिए",
          diary_suggest_label: "आज़माने लायक आदतें",
          diary_edit: "संपादित करें",
          diary_ph_grateful: "जैसे मेरी सुबह की चाय, एक दयालु संदेश, धूप भरा दिन…",
          diary_ph_affirm: "जैसे मैं मजबूत हूँ, मैं बढ़ रहा हूँ, मैं पर्याप्त हूँ…",
          diary_ph_good: "जैसे एक अध्याय पूरा किया, अच्छा व्यायाम किया, दोस्त को फोन किया…",
          diary_ph_better: "जैसे दोपहर के बाद टहलना, सोने से पहले पढ़ना, अधिक पानी पीना…",
          habit_added: "आपकी आदतों में जोड़ा गया",
          settings_habits: "आदतें",
          settings_data: "डेटा",
          settings_profile: "प्रोफ़ाइल",
          settings_about: "के बारे में",
          greet_morning: "सुप्रभात",
          greet_afternoon: "नमस्कार",
          greet_evening: "शुभ संध्या",
          greet_night: "शुभ रात्रि",
          motiv_perfect: ["आपने आज कमाल किया! 🏆", "100%! आपको कोई नहीं रोक सकता।", "परफेक्ट दिन। इसे महसूस करें।"],
          motiv_great:   ["लगभग वहाँ — शानदार प्रयास!", "मजबूत दिन। लकीर जारी रखें!", "परफेक्ट के बहुत करीब!"],
          motiv_good:    ["अच्छी प्रगति। एक समय में एक आदत।", "आप गति बना रहे हैं 💪", "हर चेक-इन मायने रखता है।"],
          motiv_low:     ["छोटा कदम भी एक कदम है।", "खुद के साथ दयालु रहें — आप आए तो।", "कल एक नई शुरुआत है 🌱"],
          phase_learning: "🌱 सीखना",
          phase_building: "🔨 निर्माण",
          phase_forming:  "⚡ गठन",
          phase_formed:   "✨ बन गई",
          tip_streak:         "🔥 बिना किसी अंतराल के लगातार पूरे किए गए दिन।\n\nकल या आज चेक किया होना चाहिए — एक छूटा हुआ दिन इसे शून्य पर रीसेट कर देता है।\n\nलकीरें आदत के सबसे मजबूत प्रेरकों में से एक हैं (Milkman, 2021)।",
          tip_best_streak:    "आपकी सभी आदतों में सबसे लंबी सक्रिय दैनिक लकीर।",
          tip_performance:    "पिछले 30 दिनों में प्रत्येक आदत को निर्धारित दिनों में से कितने % दिन पूरा किया गया।\n\n3×/सप्ताह वाली आदत के ~12 संभावित दिन होते हैं — 30 नहीं।",
          tip_formation:      "Phillippa Lally et al. (2010) ने 12 हफ्तों में 96 लोगों का अध्ययन किया और पाया कि आदतें स्वचालित होने में 18–254 दिन लेती हैं, औसतन 66 दिन।\n\nकभी-कभार एक दिन चूकना इस प्रक्रिया को महत्वपूर्ण रूप से बाधित नहीं करता।",
          tip_phase_learning: "🌱 दिन 0–19: सीखना\n\nमस्तिष्क संकेत को व्यवहार से जोड़ना शुरू कर रहा है। एक दिन चूकना सामान्य है — बस आते रहें।\n\nफोकस: ट्रिगर बनाएं, लकीर नहीं।",
          tip_phase_building: "🔨 दिन 20–49: निर्माण\n\nन्यूरल पाथवे बन रहे हैं। दोहराव आपकी स्वचालित प्रतिक्रियाओं को पुनर्कनेक्ट कर रहा है। यहाँ निरंतरता सबसे ज़रूरी है।\n\nफोकस: श्रृंखला न तोड़ें।",
          tip_phase_forming:  "⚡ दिन 50–65: गठन\n\nव्यवहार एक प्रतिवर्त बनता जा रहा है। आप आदत के स्थापित होने से पहले अंतिम महत्वपूर्ण खिंचाव में हैं।\n\nफोकस: हर कीमत पर आदत की रक्षा करें।",
          tip_phase_formed:   "✨ दिन 66+: बन गई\n\nLally et al. (2010): आपकी आदत स्वचालितता तक पहुँच गई है — अब इसमें कम इच्छाशक्ति लगती है और यह स्वाभाविक लगती है।\n\nफोकस: इसे बनाए रखें और आगे बढ़ाएं।",
          tip_diary_grateful: "कृतज्ञता डायरी\n\nEmmons & McCullough (2003): जो लोग साप्ताहिक रूप से आभारी बातें लिखते थे, वे 25% अधिक खुश और आशावादी थे।",
          tip_diary_affirm:   "आत्म-सकारात्मकता\n\nSteele (1988): अपने मूल मूल्यों की पुष्टि करना मस्तिष्क की खतरे की प्रतिक्रिया को कम करता है और तर्कसंगत निर्णय लेना बेहतर बनाता है।",
          tip_diary_good:     "तीन अच्छी बातें\n\nSeligman et al. (2005): केवल एक सप्ताह तक प्रतिदिन तीन अच्छी बातें लिखने से अवसाद काफी कम हुआ और 6 महीने तक खुशी बढ़ी।",
          tip_diary_better:   "कार्यान्वयन इरादे\n\nGollwitzer (1999): जो लोग विशिष्ट 'यदि X तो Y' सुधार योजनाएं लिखते हैं, वे 2–3 गुना अधिक उन्हें पूरा करते हैं।",
          morning_routine: "सुबह की दिनचर्या",
          for_you: "आपके लिए",
          own_badge: "मेरी",
          stat_formation: "गठन यात्रा · 66 दिन",
          week_sub: "सभी आदतें पूरी की गईं",
          streak_unit: "दिन लगातार",
          heatmap_hint: "प्रत्येक सेल = 1 दिन · भरण ऊँचाई = % आदतें पूरी की गईं",
          hm_none: "कोई नहीं",
          hm_all: "सब पूरा",
          perf_sub: "% निर्धारित दिन जिनमें प्रत्येक आदत पूरी की गई",
          perf_great: "बेहतरीन",
          perf_fair: "ठीक-ठाक",
          perf_low: "कम",
          formation_sub: "शोध बताता है कि स्थायी आदत बनाने में ~66 दिन लगते हैं",
          formation_of: "/ 66दिन",
          options_label: "विकल्प",
          cat_health: "स्वास्थ्य और शरीर",
          cat_mind: "मन और फोकस",
          cat_social: "रिश्ते",
          cat_prod: "उत्पादकता",
          cat_detox: "डिजिटल डिटॉक्स",
          sug_wake_up: "जल्दी उठना",
          sug_morning_workout: "सुबह का व्यायाम",
          sug_cold_shower: "ठंडा स्नान",
          sug_drink_water: "2 लीटर पानी पीना",
          sug_gym: "जिम",
          sug_yoga: "योग / स्ट्रेचिंग",
          sug_no_alcohol: "शराब नहीं",
          sug_no_sweets: "मिठाई नहीं",
          sug_vitamins: "विटामिन लेना",
          sug_sleep_11: "रात 11 बजे तक सोना",
          sug_walk_10k: "10,000 कदम चलना",
          sug_walk_30: "30 मिनट टहलना",
          sug_meal_prep: "स्वस्थ भोजन तैयार करना",
          sug_strength: "शक्ति प्रशिक्षण",
          sug_balance: "संतुलन व्यायाम",
          sug_sunlight: "सुबह की धूप (10 मिनट)",
          sug_protein: "प्रोटीन युक्त भोजन",
          sug_no_late_eat: "रात 8 बजे के बाद खाना नहीं",
          sug_read: "30 मिनट पढ़ना",
          sug_meditate: "ध्यान करना",
          sug_journal: "डायरी / चिंतन",
          sug_deep_work: "गहन कार्य सत्र",
          sug_learn: "कुछ नया सीखना",
          sug_breathwork: "श्वास अभ्यास / बॉक्स ब्रीदिंग",
          sug_brain_game: "मस्तिष्क प्रशिक्षण खेल",
          sug_no_coffee: "सुबह 10 बजे से पहले कॉफी नहीं",
          sug_gratitude: "कृतज्ञता अभ्यास",
          sug_no_porn: "अश्लील सामग्री नहीं",
          sug_no_scrolling: "स्क्रॉलिंग नहीं",
          sug_offline_day: "ऑफलाइन दिन",
          sug_no_social: "सोशल मीडिया नहीं",
          sug_screen_free: "स्क्रीन-मुक्त शाम",
          sug_phone_room: "फोन दूसरे कमरे में",
          sug_call_friend: "दोस्त / परिवार को फोन करना",
          sug_play_kids: "बच्चों के साथ खेलना",
          sug_hug: "किसी को गले लगाना",
          sug_date_night: "रोमांटिक शाम",
          sug_thank_you: "धन्यवाद पत्र लिखना",
          sug_cook: "परिवार के लिए खाना बनाना",
          sug_volunteer: "स्वयंसेवा / वापस देना",
          sug_plan_tomorrow: "आज रात कल की योजना बनाना",
          sug_job_search: "नौकरी की तलाश (1 घंटा)",
          sug_side_project: "साइड प्रोजेक्ट",
          sug_finances: "वित्त की समीक्षा करना",
          sug_savings: "बचत में स्थानांतरण",
          sug_clean: "सफाई / व्यवस्थित करना",
          sug_inbox: "इनबॉक्स शून्य",
          sug_lang_practice: "विदेशी भाषा का अभ्यास",
          sug_driving: "ड्राइविंग का अभ्यास",
          sug_movie_lang: "विदेशी भाषा में फिल्म देखना",
          cat_micro: "माइक्रो लर्निंग",
          sug_micro_vocab:   "5 नए शब्द सीखना",
          sug_micro_podcast: "शैक्षिक पॉडकास्ट सुनना",
          sug_micro_flash:   "फ्लैशकार्ड की समीक्षा करना",
          sug_micro_typing:  "टाइपिंग गति का अभ्यास",
          sug_micro_math:    "मानसिक गणित का अभ्यास",
          sug_micro_ted:     "TED टॉक देखना",
          sug_micro_wiki:    "विकिपीडिया का एक लेख पढ़ना",
          sug_micro_code:    "15 मिनट कोडिंग करना",
          sug_micro_sketch:  "स्केच या डूडल बनाना",
          sug_micro_music:   "कोई वाद्य यंत्र बजाना",
          share_app: "habit.io साझा करें",
          share_copied: "लिंक कॉपी हो गया!",
          share_text: "habit.io के साथ बेहतर आदतें बनाएं — मुफ्त, ऑफलाइन-फर्स्ट आदत ट्रैकर।",
          analytics_on: "विश्लेषण: चालू",
          analytics_off: "विश्लेषण: बंद",
        },
      };
      function t(k) {
        return (T[state.lang] || T.en)[k] || T.en[k] || k;
      }
      // Set GA4 user-scoped properties — called once on consent and whenever
      // profile changes. User properties persist for the whole session and are
      // attached to every subsequent event automatically.
      function updateUserProperties() {
        if (!state.consentAnalytics) return;
        gtag("set", "user_properties", {
          age_group:    state.profile.ageGroup || null,
          sex:          state.profile.sex       || null,
          ui_language:  state.lang              || null,
        });
      }
      function trackEvent(name, params) {
        if (!state.consentAnalytics) return;
        // Event-level params allow per-event segmentation in addition to user props
        gtag("event", name, Object.assign({
          age_group:   state.profile.ageGroup || "unknown",
          sex:         state.profile.sex       || "unknown",
          ui_language: state.lang              || "unknown",
        }, params));
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
      const DN_I = {
        en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        de: ["Mo",  "Di",  "Mi",  "Do",  "Fr",  "Sa",  "So"],
        pl: ["Pn",  "Wt",  "Śr",  "Cz",  "Pt",  "So",  "Nd"],
        pt: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        ru: ["Пн",  "Вт",  "Ср",  "Чт",  "Пт",  "Сб",  "Вс"],
        fr: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        hi: ["सोम", "मंग", "बुध", "गुर", "शुक", "शनि", "रवि"],
      };
      const MN_I = {
        en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        de: ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],
        pl: ["Sty","Lut","Mar","Kwi","Maj","Cze","Lip","Sie","Wrz","Paź","Lis","Gru"],
        pt: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
        ru: ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"],
        fr: ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"],
        hi: ["जन", "फर", "मार","अप्र","मई","जून","जुल","अग", "सित","अक्त","नव","दिस"],
      };
      function DN() {
        return DN_I[state.lang] || DN_I.en;
      }
      function MN() {
        return MN_I[state.lang] || MN_I.en;
      }

      // ---------------------------------------------------------------------------
      // Habit kits — contextual resource suggestions shown after first check-off
      // Amazon affiliate tag: habitio-21 (amazon.de)
      // amzn.to short links already carry the tag — do not modify them.
      // For new amazon.de links append: ?tag=habitio-21
      // ---------------------------------------------------------------------------
      const AMZ_TAG = "habitio-21";
      const amzDE = (path) => "https://www.amazon.de" + path + (path.includes("?") ? "&" : "?") + "tag=" + AMZ_TAG;

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
        const entry = HABIT_FACTS.find(f => f.match.test(h.name));
        if (!entry) return null;
        // Deterministic daily rotation: seed by date string + habit id
        const seed = (date + h.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
        return entry.facts[seed % entry.facts.length];
      }

      const ATOMIC_HABITS    = { icon: "📗", name: "Atomic Habits",     hook: "The #1 book on habit science · James Clear",          url: "https://amzn.to/3NCIaoC",          cta: "Get the book →"    };
      const KINDLE_UNLIMITED = { icon: "📚", name: "Kindle Unlimited",   hook: "Zugang zu Millionen Büchern · 30 Tage kostenlos",     url: amzDE("/kindle-dbs/hz/signup"),     cta: "Kostenlos testen →" };
      const KINDLE_PW        = { icon: "📖", name: "Kindle Paperwhite", hook: "E-Reader · wasserdicht, wochenlange Akkulaufzeit",     url: "https://amzn.to/4shY1bp",          cta: "Auf Amazon →"      };
      const AUDIBLE          = { icon: "🎧", name: "Audible",            hook: "1 Hörbuch gratis zum Start",                          url: "https://www.amazon.de/hz/audible/mlp?tag=" + AMZ_TAG, cta: "Gratis starten →"  };

      const HABIT_KITS = [
        {
          match: /read|book|librar/i,
          label: "📚 Your reading kit",
          items: [
            ATOMIC_HABITS,
            KINDLE_UNLIMITED,
          ],
        },
        {
          match: /run|jog|walk|gym|sport|fit|train|workout|exercise|step/i,
          label: "🏃 Your fitness kit",
          items: [
            { icon: "📊", name: "Strava", hook: "Track every run, ride & swim free", url: "https://www.strava.com", cta: "Join Strava →" },
            AUDIBLE,
          ],
        },
        {
          match: /meditat|mindful|breath|calm|relax|stress/i,
          label: "🧘 Your mindfulness kit",
          items: [
            { icon: "🌿", name: "Calm", hook: "7-day free trial · sleep & meditation", url: "https://www.calm.com", cta: "Try Calm →" },
            ATOMIC_HABITS,
          ],
        },
        {
          match: /sleep|rest|nap/i,
          label: "💤 Your sleep kit",
          items: [
            { icon: "📱", name: "Sleep Cycle", hook: "Smart alarm + sleep quality analysis", url: "https://www.sleepcycle.com", cta: "Download free →" },
            ATOMIC_HABITS,
          ],
        },
        {
          match: /eat|diet|nutrit|vegetar|vegan|cook|meal|food/i,
          label: "🥗 Your nutrition kit",
          items: [
            { icon: "🥘", name: "HelloFresh", hook: "Fresh recipes delivered · first box discount", url: "https://www.hellofresh.com", cta: "Claim offer →" },
            ATOMIC_HABITS,
          ],
        },
        {
          match: /water|drink|hydrat/i,
          label: "💧 Your hydration kit",
          items: [
            { icon: "📱", name: "WaterMinder", hook: "Smart daily water intake tracker", url: "https://waterminder.com", cta: "Try free →" },
            ATOMIC_HABITS,
          ],
        },
        {
          match: /journal|writ|diary|reflect/i,
          label: "✍️ Your writing kit",
          items: [
            { icon: "📓", name: "Day One", hook: "Beautiful journaling · private & secure", url: "https://dayoneapp.com", cta: "Try Day One →" },
            KINDLE_PW,
          ],
        },
        {
          match: /learn|study|language|course|skill/i,
          label: "🎓 Your learning kit",
          items: [
            KINDLE_UNLIMITED,
            ATOMIC_HABITS,
          ],
        },
      ];

      function getHabitKit(h) {
        return HABIT_KITS.find(k => k.match.test(h.name)) || null;
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
            .map((item) => ({ ...item, name: t(item.nameKey), _p: sugPriority(item.nameKey, state.profile) }))
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
        if (days >= 66) return { key: "phase_formed",   cls: "phase-formed",   days };
        if (days >= 50) return { key: "phase_forming",  cls: "phase-forming",  days };
        if (days >= 20) return { key: "phase_building", cls: "phase-building", days };
        return              { key: "phase_learning", cls: "phase-learning", days };
      }
      function toggleModalMorning() {
        modalMorning = !modalMorning;
        const chip = document.getElementById("morning-chip");
        if (chip) chip.classList.toggle("selected", modalMorning);
      }
      let importOpts = { habits: true, tracking: true };
      let welcomeAgeGroup = "";

      const AGE_GROUPS = [
        { key: "teen",   age: 15 },
        { key: "young",  age: 25 },
        { key: "adult",  age: 40 },
        { key: "mid",    age: 55 },
        { key: "senior", age: 70 },
      ];
      function renderAgeChips() {
        const cur = welcomeAgeGroup || state.profile.ageGroup || "";
        document.getElementById("welcome-age-chips").innerHTML =
          AGE_GROUPS.map(g =>
            '<div class="age-chip' + (cur === g.key ? " selected" : "") +
            '" onclick="setAgeGroup(\'' + g.key + '\')">' + t("age_" + g.key) + '</div>'
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
        localStorage.setItem("habitio_v4", JSON.stringify(state));
      }
      function load() {
        try {
          // Migration: read from older keys if current key is absent
          const raw =
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
            localStorage.setItem("habitio_v4", JSON.stringify(state));
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
        if (c.type === "specific_days")
          return (c.days || []).includes(dIdx(date));
        return true;
      }
      function cadenceLabel(c) {
        if (!c || c.type === "daily") return "";
        if (c.type === "specific_days")
          return (c.days || []).map((i) => DN()[i]).join(" · ");
        if (c.type === "x_per")
          return (
            c.count +
            "x / " +
            (c.period === "week" ? t("per_week") : t("per_month"))
          );
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
        const key = h >= 5 && h < 12 ? "greet_morning"
                  : h >= 12 && h < 17 ? "greet_afternoon"
                  : h >= 17 && h < 21 ? "greet_evening"
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
        banner.innerHTML = '<div class="motiv-card"><span class="motiv-emoji">' + emoji + '</span><span class="motiv-text">' + msg + '</span></div>';
        if (pct === 100) document.querySelector(".ring-container").classList.add("ring-celebrate");
        clearTimeout(motivTimer);
        motivTimer = setTimeout(() => {
          const card = banner.querySelector(".motiv-card");
          if (card) {
            card.classList.add("hide");
            setTimeout(() => { banner.innerHTML = ""; }, 350);
          }
          document.querySelector(".ring-container")?.classList.remove("ring-celebrate");
        }, 3500);
      }

      function sugPriority(nameKey, profile) {
        const age = parseInt(profile.age) || 30;
        const sex = profile.sex || "male";
        // Five distinct age bands matching AGE_GROUPS
        const isTeen   = age < 20;
        const isYoung  = age >= 20 && age < 30;
        const isAdult  = age >= 30 && age < 50;
        const isMid    = age >= 50 && age < 65;
        const isSenior = age >= 65;
        const isM = sex === "male", isF = sex === "female";
        // Scores are evidence-based: higher = more relevant for that group.
        // Sources: Lally 2010 (habit formation), Haidt 2023 (teen screen harm),
        // Holt-Lunstad 2015 (social isolation), Lally/Layne Norton (sarcopenia),
        // Harvard Study of Adult Development (relationships), Walker 2017 (sleep).
        const P = {
          // ── Health & Body ──────────────────────────────────────────────
          sug_wake_up:         { teen:1, young:2, adult:2 },
          sug_morning_workout: { teen:2, young:3, adult:2, F:1 },
          sug_cold_shower:     { teen:2, young:3, M:2 },
          sug_drink_water:     { teen:2, young:2, adult:2, mid:2, senior:2 },
          sug_gym:             { teen:1, young:3, adult:2, M:2 },
          // Strength training — sarcopenia prevention, critical 30+, peak urgency 50+
          sug_strength:        { adult:3, mid:4, senior:3, M:1 },
          sug_yoga:            { F:2, mid:2, senior:2 },
          // Balance — fall prevention becomes critical after 50
          sug_balance:         { mid:2, senior:4 },
          sug_no_alcohol:      { teen:4, young:3, adult:2, mid:2, M:2 },
          sug_no_sweets:       { young:2, adult:2, mid:2 },
          // Metabolism slows with age; late eating disrupts insulin — esp. women
          sug_no_late_eat:     { adult:2, mid:3, F:2 },
          sug_vitamins:        { F:2, mid:2, senior:3 },
          // Protein intake — muscle preservation from 30+ (Layne Norton research)
          sug_protein:         { adult:2, mid:3, senior:3, M:1 },
          sug_sleep_11:        { teen:4, young:3, adult:1 },
          // Morning sunlight — circadian regulation, vitamin D (all ages; critical senior)
          sug_sunlight:        { teen:2, young:1, adult:2, mid:2, senior:3 },
          // Walking — #1 evidence-based longevity habit for 50+
          sug_walk_10k:        { adult:1, mid:2, senior:3 },
          sug_walk_30:         { mid:2, senior:4, F:1 },
          sug_meal_prep:       { young:3, adult:2, M:2 },

          // ── Mind & Focus ───────────────────────────────────────────────
          sug_read:            { teen:3, young:2, mid:1, senior:2 },
          sug_meditate:        { young:2, adult:3, mid:2, F:2 },
          sug_journal:         { teen:2, young:2, F:3 },
          sug_deep_work:       { young:3, adult:2 },
          // Breathwork — stress management; most needed in high-pressure adult years
          sug_breathwork:      { young:2, adult:3, mid:2, F:2 },
          sug_learn:           { teen:2, young:2, adult:1, senior:2 },
          // Brain training — cognitive reserve building; critical 50+
          sug_brain_game:      { mid:3, senior:4 },
          sug_no_coffee:       { teen:3, young:1 },
          sug_gratitude:       { teen:2, adult:1, mid:2, senior:2, F:2 },
          sug_no_porn:         { teen:4, young:2, M:3 },

          // ── Digital Detox ──────────────────────────────────────────────
          // Haidt 2023: social media most harmful to teen girls
          sug_no_scrolling:    { teen:4, young:2, F:3 },
          sug_offline_day:     { teen:3, young:2, F:2 },
          sug_no_social:       { teen:4, young:2, F:3 },
          sug_screen_free:     { teen:3, young:1, adult:1, F:2 },
          sug_phone_room:      { teen:3, adult:1 },

          // ── Social ─────────────────────────────────────────────────────
          // Holt-Lunstad: isolation = 15 cigarettes/day; most dangerous for seniors
          sug_call_friend:     { young:1, adult:1, mid:2, senior:4 },
          sug_play_kids:       { adult:3 },
          sug_hug:             { adult:2, mid:1, senior:2, F:1 },
          sug_date_night:      { adult:2, mid:1 },
          sug_thank_you:       { adult:1, mid:2, senior:2 },
          sug_cook:            { young:2, adult:2, M:1 },
          // Volunteering — sense of purpose linked to longevity (Blue Zones)
          sug_volunteer:       { mid:3, senior:4 },

          // ── Productivity ───────────────────────────────────────────────
          sug_plan_tomorrow:   { teen:2, young:3, adult:2 },
          sug_job_search:      { teen:1, young:3 },
          sug_side_project:    { young:3, adult:2 },
          sug_finances:        { adult:3, mid:2 },
          // Savings — compound interest window is widest in 20s-30s
          sug_savings:         { young:4, adult:3 },
          sug_clean:           { teen:1, young:1, adult:1 },
          sug_inbox:           { young:2, adult:2 },
          sug_lang_practice:   { teen:3, young:3, adult:1 },
          sug_driving:         { teen:3, young:1 },
          sug_movie_lang:      { teen:2, young:2 },

          // ── Micro Learning ─────────────────────────────────────────────
          sug_micro_vocab:     { teen:3, young:2, senior:1 },
          sug_micro_podcast:   { young:2, adult:2, mid:2 },
          sug_micro_flash:     { teen:4, young:2 },
          sug_micro_typing:    { teen:2, young:1 },
          sug_micro_math:      { teen:2, young:1, senior:2 },
          sug_micro_ted:       { young:2, adult:2, mid:1 },
          sug_micro_wiki:      { adult:1, mid:1, senior:2 },
          sug_micro_code:      { teen:3, young:3, M:1 },
          sug_micro_sketch:    { teen:2, mid:1, senior:2 },
          sug_micro_music:     { teen:2, senior:3 },
        };
        const p = P[nameKey] || {};
        return (p.M&&isM?p.M:0)+(p.F&&isF?p.F:0)+
               (p.teen&&isTeen?p.teen:0)+(p.young&&isYoung?p.young:0)+
               (p.adult&&isAdult?p.adult:0)+(p.mid&&isMid?p.mid:0)+
               (p.senior&&isSenior?p.senior:0);
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
        document.getElementById("ring-fill").style.strokeDashoffset =
          circ - (circ * pct) / 100;
        document.getElementById("ring-fill").style.stroke =
          pct === 100 ? "var(--success)" : "var(--accent)";
        document.getElementById("ring-text").textContent = pct + "%";
        if (!state.habits.length) {
          document.getElementById("progress-title").textContent =
            t("no_habits");
          document.getElementById("progress-subtitle").textContent =
            t("tap_add");
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
        const k = fmt(selectedDate), ch = state.checks[k] || {};
        const sorted = [...state.habits].sort((a, b) => (b.morning ? 1 : 0) - (a.morning ? 1 : 0));
        const hasMorning = sorted.some(h => h.morning);
        let html = "", morningHeaderShown = false, restHeaderShown = false;
        sorted.forEach(h => {
          if (h.morning && !morningHeaderShown) {
            html += '<div class="habit-section-label">☀️ ' + t("morning_routine") + '</div>';
            morningHeaderShown = true;
          }
          if (!h.morning && hasMorning && !restHeaderShown) {
            html += '<div class="habit-section-label" style="color:var(--text-muted)">· ' + t("habits") + '</div>';
            restHeaderShown = true;
          }
          const sched = isScheduled(h, selectedDate),
            checked = !!ch[h.id],
            streak = getStreak(h.id),
            cL = cadenceLabel(h.cadence),
            pp = periodProg(h, selectedDate),
            phase = getFormationPhase(h);
          let meta = "";
          if (streak > 0) meta += '<span class="streak-tag" onclick="event.stopPropagation();showTip(this,t(\'tip_streak\'))">' + streak + "d 🔥</span>";
          if (cL) meta += '<span class="cadence-tag">' + cL + "</span>";
          if (pp) meta += '<span class="cadence-tag">' + pp.done + "/" + pp.target + "</span>";
          if (phase) meta += '<span class="phase-tag ' + phase.cls + '" onclick="event.stopPropagation();showTip(this,t(\'tip_' + phase.cls.replace('phase-','phase_') + '\'))">' + t(phase.key) + ' ' + phase.days + 'd</span>';
          if (h.source === "custom") meta += '<span class="own-badge">' + t("own_badge") + '</span>';
          if (!meta) meta = '<span style="opacity:.4">—</span>';
          const cls = "habit-card" + (checked ? " checked" : "") + (!sched && h.cadence?.type === "specific_days" ? " off-day" : "");
          html += '<div class="' + cls + '" onclick="toggleHabit(\'' + h.id + '\')"><div class="habit-emoji">' + h.emoji + '</div><div class="habit-info"><div class="habit-name">' + esc(h.name) + '</div><div class="habit-meta">' + meta + '</div></div><div class="habit-check"><span class="check-icon">✓</span></div></div>';
          // Micro-fact: shown every time this habit is checked today (rotates daily)
          const isTodaySelected = fmt(selectedDate) === fmt(new Date());
          if (checked && isTodaySelected) {
            const fact = getHabitFact(h, fmt(selectedDate));
            if (fact) {
              html += '<div class="habit-fact">💡 ' + esc(fact) + '</div>';
            }
          }
          // Habit kit: show once after first check-off today, if not dismissed
          const kit = getHabitKit(h);
          if (checked && isToday && kit && !(state.kitsDismissed || {})[h.id]) {
            html += '<div class="habit-kit" id="kit-' + h.id + '">' +
              '<div class="hk-header"><span class="hk-label">' + kit.label + '</span>' +
              '<button class="hk-dismiss" onclick="event.stopPropagation();dismissKit(\'' + h.id + '\')" aria-label="Dismiss">×</button></div>' +
              kit.items.map(item =>
                '<div class="hk-item"><span class="hk-icon">' + item.icon + '</span>' +
                '<div class="hk-info"><div class="hk-name">' + esc(item.name) + '</div>' +
                '<div class="hk-hook">' + esc(item.hook) + '</div></div>' +
                '<a class="hk-cta" href="' + item.url + '" target="_blank" rel="noopener sponsored" onclick="event.stopPropagation()">' + esc(item.cta) + '</a></div>'
              ).join('') +
              '</div>';
          }
        });
        c.innerHTML = html;
        if (state.habits.length === 1) {
          const k = fmt(selectedDate), ch = state.checks[k] || {};
          const allUnchecked = state.habits.every(h => !ch[h.id]);
          if (allUnchecked) {
            c.insertAdjacentHTML("beforeend",
              '<div class="first-habit-cta">' +
              '<div class="fhc-icon">👆</div>' +
              '<div class="fhc-text">Tap the habit above to log your first check-in!</div>' +
              '</div>'
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
        const card = document.querySelector('[onclick="toggleHabit(\'' + id + '\')"]');
        if (card && state.checks[k]?.[id]) {
          card.classList.add("just-checked");
          setTimeout(() => card.classList.remove("just-checked"), 400);
        }
        // motivational banner on today
        if (isToday(selectedDate) && state.habits.length) {
          const ch = state.checks[k] || {};
          const sched = state.habits.filter(h => isScheduled(h, selectedDate));
          const pct = sched.length ? Math.round(sched.filter(h => ch[h.id]).length / sched.length * 100) : 0;
          showMotivation(pct);
        }
      }
      function changeWeek(dir) {
        weekOffset += dir;
        if (weekOffset > 0) weekOffset = 0;
        selectedDate =
          weekOffset === 0
            ? new Date()
            : getMon(addD(new Date(), weekOffset * 7));
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
        setSex(state.profile.sex || "male");
        document.getElementById("wl-lang-label").textContent = t("language");
        document.getElementById("welcome-go-btn").textContent = t("lets_go");
        welcomeAgeGroup = state.profile.ageGroup || "";
        renderAgeChips();
        const lc = document.getElementById("welcome-lang-chips");
        const LANGS = { en: "🇬🇧 English", de: "🇩🇪 Deutsch", pl: "🇵🇱 Polski", pt: "🇧🇷 Português", fr: "🇫🇷 Français", ru: "🇷🇺 Русский", hi: "🇮🇳 हिन्दी" };
        lc.innerHTML = '<select class="lang-select" onchange="setWelcomeLang(this.value)">' +
          Object.keys(LANGS).map(l =>
            '<option value="' + l + '"' + (state.lang === l ? ' selected' : '') + '>' + LANGS[l] + '</option>'
          ).join("") +
          '</select>';
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
      }
      function finishWelcome() {
        const n = document.getElementById("welcome-name").value.trim();
        const g = welcomeAgeGroup;
        state.profile.name = n;
        state.profile.ageGroup = g;
        state.profile.age = g ? String((AGE_GROUPS.find(x => x.key === g) || {}).age || "") : "";
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
          modalMorning = !!(h.morning);
          document.getElementById("modal-title").textContent = t("edit_habit");
          document.getElementById("modal-save-btn").textContent =
            t("save_changes");
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
          document.getElementById("modal-save-btn").textContent =
            t("add_habit");
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
        if (!editId)
          setTimeout(
            () => document.getElementById("habit-name-input").focus(),
            300,
          );
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
            modalAddedCount === 1 ? "1 habit added ✓" : modalAddedCount + " habits added ✓";
          cancelBtn.textContent = "Done · " + modalAddedCount + " added ✓";
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
          const items = cat.items.filter(
            (s) => !existing.has(s.name.toLowerCase()),
          );
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
              '</span><span class="s-name">' +
              esc(s.name) +
              '</span><span class="s-cad">' +
              cL +
              '</span>' +
              (s._p > 0 ? '<span class="s-for-you">★ ' + t("for_you") + '</span>' : '') +
              '<span class="s-add">+</span></div>';
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
        trackEvent("habit_add", { habit_name: name, habit_emoji: emoji, cadence_type: cadence.type, source: "suggestion" });
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
            "</div>",
        ).join("");
      }
      function pickEmoji(el, e) {
        modalEmoji = e;
        document
          .querySelectorAll(".emoji-option")
          .forEach((x) => x.classList.remove("selected"));
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
              "</div>",
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
                  "</div>",
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
      const DIARY_ICONS  = { grateful: "🙏", affirm: "💪", good: "⭐", better: "🚀" };

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
          '<span class="diary-date">' + dn + "</span>" +
          '<button class="nav-btn" onclick="changeDiaryDay(1)" ' + (isToday(diaryDate) ? "disabled" : "") + ">&rsaquo;</button>" +
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
          ).filter((s) => !state.habits.find((h) => h.name === s.name)).slice(0, 3);

          c.innerHTML = dateNav + progress +
            '<div class="diary-summary">' +
              '<div class="diary-summary-icon">✨</div>' +
              '<div class="diary-summary-title">' + t("diary_complete") + "</div>" +
              '<div class="diary-summary-meta">' + filled + " / " + DIARY_FIELDS.length + " " + t("diary_filled") + "</div>" +
              (suggestions.length
                ? '<div class="diary-suggest-wrap">' +
                    '<div class="diary-suggest-lbl">' + t("diary_suggest_label") + "</div>" +
                    suggestions.map((s) =>
                      '<button class="diary-habit-chip" onclick="addFromDiary(\'' +
                      s.nameKey + "'," + '"' + s.emoji + '"' + ')">' +
                      s.emoji + " " + esc(s.name) + ' <span class="chip-add">+ Add</span></button>'
                    ).join("") +
                  "</div>"
                : "") +
              '<button class="diary-edit-btn" onclick="diaryStep=0;renderDiary()">← ' + t("diary_edit") + "</button>" +
            "</div>";
          return;
        }

        // ── Single prompt step ──
        const field = DIARY_FIELDS[diaryStep];
        c.innerHTML = dateNav + progress +
          '<div class="diary-step-card">' +
            '<div class="diary-step-icon">' + DIARY_ICONS[field] + "</div>" +
            '<div class="diary-step-label">' + esc(t("diary_" + field)) + tipBtn("tip_diary_" + field) + "</div>" +
            '<textarea class="diary-textarea diary-textarea-lg" placeholder="' +
              esc(t("diary_ph_" + field)) + '" ' +
              'oninput="saveDiary(\'' + k + "','" + field + '\',this.value)" id="d_' + field + '">' +
              esc(entry[field] || "") +
            "</textarea>" +
            '<div class="diary-saved" id="ds_' + field + '">' + t("diary_saved") + " ✓</div>" +
          "</div>" +
          '<div class="diary-step-nav">' +
            (diaryStep > 0
              ? '<button class="diary-back-btn" onclick="diaryStepGo(-1)">← ' + t("diary_back") + "</button>"
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
        state.habits.push({ id: uid(), name, emoji, cadence: { type: "daily" }, morning: false, createdAt: fmt(new Date()), source: "suggested" });
        save();
        showToast(emoji + " " + name + " — " + t("habit_added"));
        renderDiary();
      }
      function saveDiary(k, field, val) {
        if (!state.diary[k])
          state.diary[k] = { grateful: "", affirm: "", good: "", better: "" };
        const wasEmpty = !state.diary[k][field]?.trim();
        state.diary[k][field] = val;
        if (wasEmpty && val.trim()) trackEvent("journal_write", { section: field, date: k });
        save();
        clearTimeout(diaryTimers[field]);
        const el = document.getElementById("ds_" + field);
        el.classList.add("show");
        diaryTimers[field] = setTimeout(
          () => el.classList.remove("show"),
          1500,
        );
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
        document
          .getElementById("imp-" + k)
          .classList.toggle("selected", importOpts[k]);
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
                const existing = new Set(
                  state.habits.map((h) => h.name.toLowerCase()),
                );
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
                          (h) => h.name.toLowerCase() === oh.name.toLowerCase(),
                        );
                        if (nh && d.checks[day][hid])
                          state.checks[day][nh.id] = true;
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
              trackEvent("data_import", { imported_habits: importOpts.habits, imported_tracking: importOpts.tracking });
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
          navigator.share({ title: "habit.io", text: t("share_text"), url })
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
          const fill = pct === 0 ? ''
            : '<div class="hm-fill" style="height:' + pct + '%;background:' +
              (pct === 100 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : 'var(--warn)') +
              '"></div>';
          hm += '<div class="heatmap-cell hm-level">' + fill + '</div>';
        }
        // Legend: three sample cups showing none / partial / full
        const hmLegend =
          '<div class="heatmap-legend">' +
          '<span class="hm-legend-lbl">' + t("hm_none") + '</span>' +
          '<div class="heatmap-cell hm-level hm-dot"></div>' +
          '<div class="heatmap-cell hm-level hm-dot"><div class="hm-fill" style="height:40%;background:var(--warn)"></div></div>' +
          '<div class="heatmap-cell hm-level hm-dot"><div class="hm-fill" style="height:75%;background:var(--accent)"></div></div>' +
          '<div class="heatmap-cell hm-level hm-dot"><div class="hm-fill" style="height:100%;background:var(--success)"></div></div>' +
          '<span class="hm-legend-lbl">' + t("hm_all") + '</span>' +
          '</div>';

        // Performance color legend
        const perfLegend =
          '<div class="stat-legend">' +
          '<span><span class="stat-dot" style="background:var(--success)"></span>' + t("perf_great") + ' ≥70%</span>' +
          '<span><span class="stat-dot" style="background:var(--warn)"></span>' + t("perf_fair") + ' 40–69%</span>' +
          '<span><span class="stat-dot" style="background:var(--danger)"></span>' + t("perf_low") + ' &lt;40%</span>' +
          '</div>';

        c.innerHTML =
          '<div class="stats-grid">' +
          '<div class="stats-grid-item">' +
            '<div class="stat-big">' + wP + '%</div>' +
            '<div class="stat-big-label">' + t("this_week") + '</div>' +
            '<div class="stat-big-sub">' + t("week_sub") + '</div>' +
          '</div>' +
          '<div class="stats-grid-item">' +
            '<div class="stat-big">' + bS + (bS ? '<span class="stat-big-unit">d</span>' : '') + ' ' + bE + '</div>' +
            '<div class="stat-big-label">' + t("best_streak") + tipBtn("tip_best_streak") + '</div>' +
            '<div class="stat-big-sub">' + t("streak_unit") + '</div>' +
          '</div>' +
          '<div class="stats-grid-item">' +
            '<div class="stat-big">' + state.habits.length + '</div>' +
            '<div class="stat-big-label">' + t("habits") + '</div>' +
          '</div>' +
          '</div>' +
          '<div class="stat-card">' +
            '<div class="stat-card-title">' + t("last_28") + '</div>' +
            '<div class="stat-card-sub">' + t("heatmap_hint") + '</div>' +
            '<div class="heatmap">' + hm + '</div>' +
            '<div class="heatmap-dir"><span>← 28 days ago</span><span>today →</span></div>' +
            hmLegend +
          '</div>' +
          '<div class="stat-card">' +
            '<div class="stat-card-title">' + t("performance") + tipBtn("tip_performance") + '</div>' +
            '<div class="stat-card-sub">' + t("perf_sub") + '</div>' +
            hs.map((h) =>
              '<div class="stat-row">' +
              '<span class="stat-label">' + h.emoji + ' <span>' + esc(h.name) + '</span></span>' +
              '<div class="stat-bar-bg"><div class="stat-bar-fill" style="width:' + h.pct + '%;background:' +
                (h.pct >= 70 ? "var(--success)" : h.pct >= 40 ? "var(--warn)" : "var(--danger)") +
              '"></div></div>' +
              '<span class="stat-value">' + h.pct + '%</span>' +
              '</div>'
            ).join("") +
            perfLegend +
          '</div>' +
          '<div class="stat-card">' +
            '<div class="stat-card-title">' + t("stat_formation") + tipBtn("tip_formation") + '</div>' +
            '<div class="stat-card-sub">' + t("formation_sub") + '</div>' +
            state.habits.map(h => {
              const days = h.createdAt ? Math.floor((new Date() - new Date(h.createdAt)) / 86400000) : 0;
              const pct = Math.min(100, Math.round(days / 66 * 100));
              const phase = days >= 66 ? { key: "phase_formed",   cls: "phase-formed" }
                          : days >= 50 ? { key: "phase_forming",  cls: "phase-forming" }
                          : days >= 20 ? { key: "phase_building", cls: "phase-building" }
                          :              { key: "phase_learning", cls: "phase-learning" };
              const barColor = days >= 50 ? "var(--success)" : days >= 20 ? "var(--accent)" : "var(--warn)";
              return '<div class="stat-row">' +
                '<span class="stat-label">' + h.emoji + ' <span>' + esc(h.name) + '</span></span>' +
                '<div class="stat-bar-bg"><div class="stat-bar-fill" style="width:' + pct + '%;background:' + barColor + '"></div></div>' +
                '<span class="phase-tag ' + phase.cls + '">' + t(phase.key).split(' ')[0] + ' ' + days + ' ' + t("formation_of") + '</span>' +
                '</div>';
            }).join("") +
          '</div>';
      }

      // ═══ SETTINGS ═══
      function renderSettings() {
        const c = document.getElementById("settings-content");
        document.getElementById("settings-header").textContent =
          t("nav_settings");
        c.innerHTML =
          '<div class="settings-section"><div class="settings-title">' +
          t("settings_profile") +
          '</div><div class="settings-list"><div class="setting-item" style="flex-wrap:wrap;gap:8px" onclick="showWelcome()"><div class="setting-left" style="width:100%"><span class="setting-emoji">👤</span><span class="setting-label">' +
          (state.profile.name || "—") +
          (state.profile.age ? ", " + state.profile.age : "") +
          (state.profile.sex ? " · " + t("sex_" + ({ m: "male", f: "female" }[state.profile.sex] || state.profile.sex)) : "") +
          '</span><span class="setting-action" style="margin-left:auto">›</span></div><div style="width:100%;padding-left:32px;padding-top:6px">' +
          '<select class="lang-select" onclick="event.stopPropagation()" onchange="event.stopPropagation();changeLang(this.value)">' +
          [["en","🇬🇧 English"],["de","🇩🇪 Deutsch"],["pl","🇵🇱 Polski"],["pt","🇧🇷 Português"],["fr","🇫🇷 Français"],["ru","🇷🇺 Русский"],["hi","🇮🇳 हिन्दी"]].map(([l, label]) =>
            '<option value="' + l + '"' + (state.lang === l ? ' selected' : '') + '>' + label + '</option>'
          ).join("") +
          '</select></div></div></div></div></div>' +
          '<div class="settings-section"><div class="settings-title" style="display:flex;align-items:center;justify-content:space-between">' +
          '<span>' + t("settings_habits") + ' (' + state.habits.length + ')</span>' +
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
                    "')\">✕</button></div>",
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
          '</span></div><span class="setting-action">›</span></div><div class="setting-item" onclick="setConsent(' + (!state.consentAnalytics) + ')"><div class="setting-left"><span class="setting-emoji">' + (state.consentAnalytics ? "📊" : "🚫") + '</span><span class="setting-label">' +
          t(state.consentAnalytics ? "analytics_on" : "analytics_off") +
          '</span></div><span class="setting-action">›</span></div></div></div>';
      }
      function delHabit(id) {
        if (!confirm(t("confirm_delete"))) return;
        const dh = state.habits.find((h) => h.id === id);
        trackEvent("habit_remove", { habit_name: dh?.name, habit_emoji: dh?.emoji, cadence_type: dh?.cadence?.type });
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
        document
          .querySelectorAll(".page")
          .forEach((x) => x.classList.remove("active"));
        document.getElementById("page-" + p).classList.add("active");
        setFabVisible(p === "tracker");
        document
          .querySelectorAll(".nav-tab")
          .forEach((t, i) =>
            t.classList.toggle(
              "active",
              ["tracker", "diary", "stats", "settings"][i] === p,
            ),
          );
        if (p === "diary") { diaryStep = calcDiaryStep(); renderDiary(); }
        if (p === "stats") renderStats();
        if (p === "settings") renderSettings();
        // SPA page_view — fires only when consent has been granted
        if (state.consentAnalytics) {
          const titles = { tracker: "Today", diary: "Journal", stats: "Stats", settings: "Settings" };
          gtag("event", "page_view", {
            page_title:    "habit.io · " + (titles[p] || p),
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
        return '<button class="tt-btn" onclick="event.stopPropagation();showTip(this,t(\'' + key + '\'))">ⓘ</button>';
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
      document
        .getElementById("welcome-modal")
        .addEventListener("click", () => {});
      document
        .getElementById("habit-name-input")
        .addEventListener("keydown", (e) => {
          if (e.key === "Enter") saveHabit();
        });

      load();
      render();
      setFabVisible(true);
      if (!state.profile.name && !state.habits.length) showWelcome();
      if (state.consentAnalytics === null) {
        const b = document.createElement("div");
        b.id = "consent-banner";
        b.className = "consent-banner";
        b.innerHTML =
          '<span class="consent-text">We use analytics to improve the app. No personal data is shared.</span>' +
          '<div class="consent-btns">' +
          '<button class="consent-btn accept" onclick="setConsent(true)">Accept</button>' +
          '<button class="consent-btn decline" onclick="setConsent(false)">Decline</button>' +
          '</div>';
        document.body.appendChild(b);
      } else if (state.consentAnalytics) {
        // Returning user — restore consent and set user properties
        gtag("consent", "update", { analytics_storage: "granted" });
        updateUserProperties();
        gtag("event", "page_view", { page_title: "habit.io", page_location: location.href });
      }
      if ("serviceWorker" in navigator)
        navigator.serviceWorker.register("sw.js").catch(() => {});
