# habit.io — Claude Instructions

## Project Overview

**habit.io** is an offline-first PWA habit tracker. Single-page app with no build step — pure HTML/CSS/JS in `index.html`.

**Live app:** https://rafalsladek.github.io/habitio/
**Repo:** https://github.com/RafalSladek/habitio
**Deployed via:** GitHub Pages from `main` branch, root `/`

## Architecture

- Single file app: all logic, styles, and markup live in `index.html`
- `suggestions.js` — smart habit suggestion data
- `sw.js` — service worker for offline/PWA support
- `manifest.json` — PWA manifest

## Data Storage

All user data is stored **client-side only**:

- API: `localStorage`
- Key: `habitio_v2`
- Format: JSON-serialized state object
- No backend, no sync, no accounts

Export/import via JSON file is the only cross-device migration path. Do not introduce a backend unless explicitly requested.

## Development Notes

- No build tooling — edit `index.html` directly, changes are immediately deployable
- Deploy by pushing to `main` (GitHub Pages auto-builds)
- Keep the single-file architecture unless explicitly asked to split it
