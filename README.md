# a

This repo deploys to GitHub Pages at `https://harelmoyal053-stack.github.io/a/`. It holds two sites:

| Path | Site |
| --- | --- |
| `/a/` | DropPrice – group-buying prototype (`index.html`, `src/`) |
| `/a/festivals/` | **FestiChat** – WhatsApp groups for festivals worldwide (`festivals/index.html`, `src/festivals/`) |

## FestiChat

A community app for festivals worldwide, in seven languages (Hebrew, English, Spanish, French, German, Russian, Arabic). The language follows the visitor's phone on first visit and can be changed from the menu or the profile tab; the layout flips between right-to-left (Hebrew, Arabic) and left-to-right. Translations live in `src/festivals/i18n/` (one file per language, same keys as `he.js`). Users find a festival or party, join its group chats (general, Israelis at the festival, rides, camping/lodging, ticket swaps, solo travelers), and chat in real time. Joined groups appear on the home screen and in the chats tab. Anyone can read a group; only members can write.

### Event suggestions and problem reports

"Add an event" and "Report a problem" in the site menu open a short form. Entries are stored in the Firestore `inbox` collection and listed at the top of the admin page, where they can be marked as handled or deleted. Only the admin account (its uid is listed in `isAdmin()` in `firestore.rules`) can read them, so the rules must be republished after changing that list.

### Accounts and chat (Firebase)

Users sign in with Google and get a public profile (photo, name, short bio, Instagram link) that other group members can open from the chat. If `FIREBASE_CONFIG` in `src/festivals/chat/firebaseConfig.js` is set to `null`, the site runs in preview mode: sign-in asks only for a name, and accounts and messages stay in the visitor's browser. To make it live:

1. Create a project at https://console.firebase.google.com (the free Spark plan is enough).
2. **Build → Authentication → Sign-in method**: enable **Google**.
3. **Authentication → Settings → Authorized domains**: add `harelmoyal053-stack.github.io`.
4. **Build → Firestore Database**: create a database, then paste `firestore.rules` into the **Rules** tab and publish.
5. **Project settings → Your apps → Web app**: register an app and copy its `firebaseConfig` object into `FIREBASE_CONFIG` in `src/festivals/chat/firebaseConfig.js`.

The web config is not a secret; access is controlled by `firestore.rules`. Profiles are public; each user can edit only their own. Profile photos are resized to 256px and stored in the profile document.

### Automatic event updates

`.github/workflows/update-events.yml` runs daily, on demand from the Actions tab, and whenever an event submission is approved. `scripts/fetch-events.mjs` collects upcoming festivals and parties from every configured source, merges duplicates across sources, and writes `festivals/events.json` to the `gh-pages` branch. The site loads that file at startup, and every event gets its own group chats.

| Source | Module | Setup |
| --- | --- | --- |
| Ticketmaster Discovery API | `scripts/events/ticketmaster.mjs` | Free key from https://developer-acct.ticketmaster.com → repo secret `TICKETMASTER_API_KEY` |
| SeatGeek Platform API | `scripts/events/seatgeek.mjs` | Free client ID from https://seatgeek.com/account/develop → repo secret `SEATGEEK_CLIENT_ID` |
| Organizer submissions | `scripts/events/community.mjs` | Organizers fill the "add an event" issue form; label an issue `event-approved` to publish it |
| Partner promoter feeds | `scripts/events/partners.mjs` | Add `{ "name", "url" }` entries to `scripts/partner-feeds.json` |

Sources without a key are skipped. If a source fails, its events from the previous run are kept.

**De-duplication** (`scripts/events/merge.mjs`): listings are first folded within a source (day passes, weekends, VIP), then matched across sources by country, city or venue, overlapping dates (±1 day), and shared name words. A merged event keeps every source's ticket link (cheapest first) and credits all sources. Each event reuses the id it had in the previous `events.json`, so its chats survive name or source changes. Tests: `npm run test:events`.

### Event catalog

The site lists only events from the automatic feed above; there is no hand-maintained list. Shared labels (continents, genres, months) live in `src/festivals/data/festivals.js`.

## Development

```bash
npm install
npm run dev     # http://localhost:5173/a/festivals/
npm run build
```

GitHub Pages serves the `gh-pages` branch. To publish FestiChat, build and copy `dist/festivals/index.html` and every `dist/assets/` file except DropPrice's `main-*` into that branch. The Firebase code is a lazily loaded chunk that `index.html` doesn't reference directly, so copy the whole folder, not just the files the page links to.
