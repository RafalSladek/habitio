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

## Development

No build tooling required — edit `index.html` directly. Deploy by pushing to `main` (GitHub Pages auto-builds).
