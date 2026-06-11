# Landing Page Spec — making-first-habit/index.html

This page lives at `habitio.rafal-sladek.com/making-first-habit/`.
It targets someone who has never heard of habit tracking apps and wants to understand
why building habits is hard, what the science says, and how habit.io helps.

---

## Page Goal

Onboard a curious visitor into the *concept* of deliberate habit building — then show
them the tool. Not a product pitch up front. Lead with philosophy and science, arrive at the app.

**Conversion target:** Click through to the live app at `habitio.rafal-sladek.com`

---

## Design System (match main app)

```css
/* Tokens */
--bg:          #12121f;
--surface:     #1a1a2e;
--primary:     #c0c0e8;
--muted:       #7878a0;
--accent:      #7c6fff;
--accent-glow: rgba(124,111,255,0.15);

/* Typography */
font-family: 'Inter', system-ui, sans-serif;
/* Load same way as index.html: preconnect + preload with onload swap */

/* Layout */
max-width: 640px;
margin: 0 auto;
padding: 0 1.5rem;
```

The page should feel like an extension of the app — same dark purple palette, same Inter font, same rounded card style. A visitor who clicks through to the app should feel continuity.

---

## HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- SEO: title, description, canonical, og:image (use screenshot-tracker.png) -->
  <!-- Same non-blocking font load as index.html -->
</head>
<body>
  <nav>           <!-- Minimal: logo/wordmark + "Open App" CTA -->
  <main>
    <section id="hero">
    <section id="why-habits-fail">
    <section id="science">
    <section id="the-journey">
    <section id="features">
    <section id="philosophy">
    <section id="cta">
  </main>
  <footer>        <!-- Link back to app, GitHub, privacy note -->
</body>
```

---

## Section Content

### Hero
**Headline:** "Build habits that actually stick"
**Subline:** "Most people quit after a few days. Science explains why — and how to beat it."
**Visual:** Autoplay muted looping video (`../docs/marketing/user-journey.mp4`) with GIF fallback (`../docs/user-journey.gif`). Show at 393px wide, centered, with device frame or as-is.
**CTA button:** "Start building habits →" → `https://habitio.rafal-sladek.com`

```html
<video autoplay muted loop playsinline width="393">
  <source src="../docs/marketing/user-journey.mp4" type="video/mp4">
  <img src="../docs/user-journey.gif" alt="habit.io user journey" width="393">
</video>
```

---

### Why Habits Fail

**Heading:** "Why 95% of people give up"

Key points (short paragraphs, no bullet lists):

1. **The 21-day myth** — Popularised by a 1960s plastic surgeon's self-observation about phantom limbs, the "21 days to form a habit" claim has no scientific basis. It spread because it feels reassuringly short.

2. **Identity vs behaviour** — Most people try to change their actions without changing their identity. "I want to run" vs "I am someone who runs." The behaviour eventually collapses back.

3. **Motivation fades** — Initial motivation is emotion-driven. Emotion peaks, then fades. The people who build lasting habits don't rely on motivation — they rely on systems and environment design.

4. **Missing one day causes quitting** — People treat a missed day as failure and abandon entirely ("the all-or-nothing trap"). Research shows missing one day has zero measurable effect on habit formation.

---

### The Science

**Heading:** "What the research actually says"

Present as a stats grid (2 columns on desktop, 1 on mobile):

```
66 days        Median time to form an automatic habit
               [Lally et al., 2010 — European Journal of Social Psychology]

Missing 1 day  Has no measurable effect on habit formation
               [same study — 96 participants, 12 weeks]

43%            Higher success rate for morning routines vs. evening habits
               [habit timing research — implementation intention studies]

37%            Higher completion rate for self-chosen vs. externally assigned habits
               [habit autonomy research — self-determination theory]
```

Add a small note: "habit.io's 66-day journey is grounded in this research — not marketing copy."

---

### The Journey

**Heading:** "The three phases of habit formation"

Explain the brain science simply:

**Phase 1 — Effort (🌱 days 1–10):** The prefrontal cortex handles every repetition consciously. It's cognitively expensive. This is why it feels hard — you're literally building new neural pathways.

**Phase 2 — Groove (🔨 days 10–40):** Repetition is carving a pattern. The basal ganglia starts to take over from the prefrontal cortex. You're burning fewer calories on the decision. The habit is becoming automatic.

**Phase 3 — Flow (⚡ days 40–66+):** The basal ganglia now owns the behaviour. It fires before conscious thought. This is the "handoff" — what neuroscientists call "automaticity."

**What the app shows:** Include `../docs/marketing/framed/screenshot-tracker.png` with caption explaining the phase emojis.

---

### Features

**Heading:** "Everything you need to make it stick"

4-card grid (2×2 on mobile, 4×1 on wider):

| Feature | Screenshot | Description |
|---------|-----------|-------------|
| Track daily | `screenshot-tracker.png` | Check off habits. See your streak. The act of tracking creates a feedback loop that reinforces behaviour. |
| Reflect in journal | `screenshot-journal.png` | Daily gratitude, affirmations, wins, and mood. Reflection strengthens memory consolidation — what you write down, you remember. |
| See your progress | `screenshot-stats.png` | Streaks, heatmaps, 30-day bars per habit. Progress visibility raises accountability without requiring anyone else. |
| Build your profile | `screenshot-settings.png` | Habits are personalized by age group and sex based on demographic habit research. Your suggestions aren't random. |

Use framed versions from `../docs/marketing/framed/`.

---

### Philosophy

**Heading:** "A different kind of productivity app"

3 short paragraphs:

**Privacy first.** Everything stays on your device. No account, no backend, no data leaving your browser. Clearing your browser storage deletes everything. The AI coach is opt-in and sends only a compact summary — never your raw data.

**No streaks pressure.** Missing a day won't break your habit scientifically. habit.io doesn't punish missed days with broken streaks — it shows your pattern honestly. You decide what it means.

**Offline always.** Works without internet. Installs on your home screen like a native app. No subscription, no paywalls, no upsells. The same app — forever.

---

### CTA Section

**Heading:** "Start your first habit today"
**Body:** "Free, private, and works on any device. No sign-up required."
**Button:** "Open habit.io →" → `https://habitio.rafal-sladek.com`
**Secondary:** "View on GitHub →" → `https://github.com/RafalSladek/habitio`

---

## SEO / Meta

```html
<title>How to Build Your First Habit — habit.io</title>
<meta name="description" content="The science of habit formation: why 21 days is a myth, how the 66-day journey works, and how to build habits that stick. Free offline-first habit tracker.">
<link rel="canonical" href="https://habitio.rafal-sladek.com/making-first-habit/">
<meta property="og:image" content="https://habitio.rafal-sladek.com/docs/desktop-preview.png">
<meta property="og:title" content="How to Build Your First Habit — habit.io">
<meta property="og:type" content="article">
```

---

## Sitemap Entry

Add to `sitemap.xml`:
```xml
<url>
  <loc>https://habitio.rafal-sladek.com/making-first-habit/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## What to Keep vs Replace on Updates

When updating the landing page (e.g., after new screenshots):
- **Replace:** `<video>` and `<img>` src paths if filenames changed
- **Replace:** Feature screenshots in the cards section
- **Keep:** All copy and philosophy text unless facts changed
- **Keep:** Science citations — these don't change
- **Add:** New features to the features grid if they're significant enough (reminders, AI coach)
