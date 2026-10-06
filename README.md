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

`.github/workflows/update-events.yml` runs daily (and on demand from the Actions tab). It calls the Ticketmaster Discovery API through `scripts/fetch-events.mjs`, collecting music festivals and dance/electronic parties for the next 12 months across ~25 countries, and writes `festivals/events.json` to the `gh-pages` branch. The site loads that file at startup. Every event gets its own group chats automatically. When an event matches a curated festival, it fills in the festival's real dates, photo, and ticket link instead of being listed twice.

Setup: create a free key at https://developer-acct.ticketmaster.com, add it as the repository secret `TICKETMASTER_API_KEY` (Settings → Secrets and variables → Actions), then run the workflow once from the Actions tab.

Event ids are derived from the event's name, venue, country, and year (festivals) or date (parties), so a group keeps its chat across daily refreshes.

### Adding a festival

Append an entry to `FESTIVALS` in `src/festivals/data/festivals.js`. Each festival gets the group chats listed in `src/festivals/data/groups.js`.

## Development

```bash
npm install
npm run dev     # http://localhost:5173/a/festivals/
npm run build
```

GitHub Pages serves the `gh-pages` branch. To publish FestiChat, build and copy `dist/festivals/` plus its `dist/assets/` files into that branch.
