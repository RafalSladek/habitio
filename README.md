# habit.io

A habit tracker app — offline-first PWA, no account required.

**Live app:** https://rafalsladek.github.io/habitio/

## Architecture

Single-page app with no build step — pure HTML/CSS/JS.

- `index.html` — all app logic, styles, and markup
- `suggestions.js` — smart habit suggestion data
- `sw.js` — service worker for offline/PWA support
- `manifest.json` — PWA manifest

## Data Storage

All data is stored **client-side only** using the browser's `localStorage` API.

- Storage key: `habitio_v2`, format: JSON
- No backend, no server, no database — works fully offline
- Data is local to the device/browser; clearing browser storage deletes all data

**Backup & restore:** Use the export button to download your data as a JSON file, and import it on any device to restore or migrate.

## Research & Science

The app's personalisation logic and habit formation features are grounded in the following research:

### Habit Formation
- **Median formation time is 59–66 days**, not 21 — [Lally et al., 2010, European Journal of Social Psychology](https://doi.org/10.1002/ejsp.674) via [StudyFinds](https://studyfinds.org/breaking-a-habit/)
- **Missing a day does not break formation** — the same Lally study confirmed one missed opportunity has no material effect
- **Morning routines show 43% higher success rates** — [Coach Pedro Pinto research synthesis](https://coachpedropinto.com)
- **Self-selected habits have 37% higher success** than externally imposed ones — habit autonomy research
- **Prefrontal cortex → basal ganglia handoff**: as habits form, the brain shifts control to automatic systems — [Journal WJARR](https://wjarr.com)

### Demographic Habit Patterns
- **Physical activity**: 80% of adolescents don't meet WHO guidelines; inactivity worsens after 60 — WHO Global Action Plan
- **Diet**: Women consistently lead; young men (18–29) have the worst diets — nutrition survey data
- **Sleep & screens**: 45% of US teens say social media hurts sleep; girls more affected than boys — [Pew Research Center](https://pewresearch.org)
- **Screen time**: 8th/10th graders averaged 3.5h/day on social media in 2021 — [SingleCare](https://singlecare.com)
- **Substances & gambling**: Males report higher prevalence across all categories; rates drop after 60 — [PubMed Central](https://pmc.ncbi.nlm.nih.gov)
- **Mental health habits**: Women more proactive (therapy, mindfulness); men 30+ show lower distress scores — [ScienceDirect](https://sciencedirect.com)
- **Reading gap**: 23% of Americans haven't read a book in the past year; men less likely to read than women — [The Weary Educator](https://thewearyeducator.com)

## Development

No build tooling required — edit `index.html` directly. Deploy by pushing to `main` (GitHub Pages auto-builds).
