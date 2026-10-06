# a

This repo deploys to GitHub Pages at `https://harelmoyal053-stack.github.io/a/`. It holds two sites:

| Path | Site |
| --- | --- |
| `/a/` | DropPrice – group-buying prototype (`index.html`, `src/`) |
| `/a/festivals/` | **FestiChat** – WhatsApp groups for festivals worldwide (`festivals/index.html`, `src/festivals/`) |

## FestiChat

A Hebrew (RTL) community app for festivals worldwide. Users find a festival, join its group chats (general, Israelis at the festival, rides, camping/lodging, ticket swaps, solo travelers), and chat in real time. Joined groups appear on the home screen and in the chats tab. Anyone can read a group; only members can write.

### Connecting the chat to Firebase

Until `src/festivals/chat/firebaseConfig.js` holds a config, the chat runs in preview mode: messages are stored only in the visitor's browser. To make it live:

1. Create a project at https://console.firebase.google.com (the free Spark plan is enough).
2. **Build → Authentication → Sign-in method**: enable **Anonymous**.
3. **Build → Firestore Database**: create a database, then paste `firestore.rules` into the **Rules** tab and publish.
4. **Project settings → Your apps → Web app**: register an app and copy its `firebaseConfig` object into `FIREBASE_CONFIG` in `src/festivals/chat/firebaseConfig.js`.
5. **Authentication → Settings → Authorized domains**: add `harelmoyal053-stack.github.io`.

The web config is not a secret; access is controlled by `firestore.rules`.

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

When an event matches a curated festival, it fills in the festival's real dates, photo, and ticket links instead of being listed twice.

### Adding a festival

Append an entry to `FESTIVALS` in `src/festivals/data/festivals.js`. Each festival gets the group chats listed in `src/festivals/data/groups.js`.

## Development

```bash
npm install
npm run dev     # http://localhost:5173/a/festivals/
npm run build
```

GitHub Pages serves the `gh-pages` branch. To publish FestiChat, build and copy `dist/festivals/` plus its `dist/assets/` files into that branch.
