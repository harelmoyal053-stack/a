# a

This repo deploys to GitHub Pages at `https://harelmoyal053-stack.github.io/a/`. It holds two sites:

| Path | Site |
| --- | --- |
| `/a/` | DropPrice – group-buying prototype (`index.html`, `src/`) |
| `/a/festivals/` | **FestiChat** – WhatsApp groups for festivals worldwide (`festivals/index.html`, `src/festivals/`) |

## FestiChat

A Hebrew (RTL) community app for festivals worldwide. Users find a festival or party, join its group chats (general, Israelis at the festival, rides, camping/lodging, ticket swaps, solo travelers), and chat in real time. Joined groups appear on the home screen and in the chats tab. Anyone can read a group; only members can write.

### Accounts and chat (Firebase)

Users sign in with Google and get a public profile (photo, name, short bio, Instagram link) that other group members can open from the chat. Until `src/festivals/chat/firebaseConfig.js` holds a config, the site runs in preview mode: sign-in asks only for a name, and accounts and messages stay in the visitor's browser. To make it live:

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

GitHub Pages serves the `gh-pages` branch. To publish FestiChat, build and copy `dist/festivals/` plus its `dist/assets/` files into that branch.
