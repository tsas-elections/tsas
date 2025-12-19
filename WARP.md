# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview
This repo is a small static frontend (no Node/TS toolchain):
- Multiple static HTML pages (home + section pages) using Bootstrap via CDN.
- `styles.css` contains the site theme (civic/academic look, Telangana-inspired accents).
- `js/*.js` are small “loader” scripts that fetch content from the TSAS backend and render into specific DOM containers.

There is no build step, package manager, linting, or test runner configured in this repository.

## Common commands
### Run locally (static file server)
Because `fetch()` calls the backend API, open `index.html` via a local HTTP server (not `file://`) to avoid browser/CORS quirks.

From repo root:
- `python3 -m http.server 5173`

Then open:
- `http://localhost:5173/`

If you prefer Node:
- `npx http-server -p 5173 .`

### “Build”, “lint”, “test”
Not present in this repo.
- Build: N/A (static assets served as-is)
- Lint: N/A
- Tests: N/A

## High-level architecture
### Page composition
This repo is a static, multi-page site:
- `index.html`: Home (hero + previews of notices/announcements + quick links)
- `notices.html`: Notice board page (renders notices + announcements)
- `election-details.html`: Static key dates / election details
- `guidelines.html`: Static student voting rules / conduct
- `contact.html`: Static contact / reporting info

Dynamic content rendering:
- Home previews:
  - Notices preview: `#home-notice-container` via `js/loadHomeNotices.js`
  - Announcements preview: `#home-announcement-container` via `js/loadHomeAnnouncements.js`
- Notice board:
  - Notices: `#notice-container` via `js/loadNotices.js`
  - Announcements: `#announcement-container` via `js/loadAnnouncements.js`

### Backend integration (hard-coded URLs)
The loader scripts call a hosted backend at `https://tsas-backend.onrender.com`.

Endpoints used:
- Notices: `GET /api/notices` (`js/loadNotices.js`, `js/loadHomeNotices.js`)
  - Expected fields used by the UI: `title`, `createdAt`, `fileUrl`
  - Optional fields (if backend provides them): `description` / `summary` (used for snippets)
- Announcements: `GET /api/announcements` (`js/loadAnnouncements.js`, `js/loadHomeAnnouncements.js`)
  - Expected fields used by the UI: `title`, `createdAt`
  - Optional fields: `description` / `summary`

When developing against a local backend:
- `js/loadNotices.js` and `js/loadAnnouncements.js` currently hard-code the full URL in the `fetch(...)` call.

If you want a single source of truth for the backend URL, consider refactoring both loaders to consume the same constant.

### “NEW” badge logic
- Notices + announcements: compute `diffHours` from `createdAt`; show `NEW` if `<= 24` hours.

## Where to make changes
- Layout/content structure:
  - Home: `index.html`
  - Notice board: `notices.html`
  - Election details: `election-details.html`
  - Guidelines: `guidelines.html`
  - Contact: `contact.html`
- Styling/theme: `styles.css`
- Backend rendering behavior:
  - Notices: `js/loadNotices.js`, `js/loadHomeNotices.js`
  - Announcements: `js/loadAnnouncements.js`, `js/loadHomeAnnouncements.js`
