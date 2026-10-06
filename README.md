# a

This repo deploys to GitHub Pages at `https://harelmoyal053-stack.github.io/a/`. It holds two sites:

| Path | Site |
| --- | --- |
| `/a/` | DropPrice – group-buying prototype (`index.html`, `src/`) |
| `/a/festivals/` | **FestiChat** – WhatsApp groups for festivals worldwide (`festivals/index.html`, `src/festivals/`) |

## FestiChat

A Hebrew (RTL) directory of WhatsApp groups for festivals around the world. Users search and filter festivals by continent, genre, and month, save favorites, and open a festival page (shareable as `#/festival/<id>`) to join its groups.

Every festival comes with six group types: general, Israelis at the festival, rides, camping/lodging, ticket swaps, and solo travelers.

### Adding a WhatsApp group link

Add the invite link to `INVITES` in `src/festivals/data/groups.js`:

```js
export const INVITES = {
  'tomorrowland:general': 'https://chat.whatsapp.com/AbCdEfGhIjKlMnOpQrStUv',
}
```

The key is `<festival id>:<group type>`. The site only accepts `https://chat.whatsapp.com/...` links. Until a group has a link, its "הוספת קישור" button opens a pre-filled GitHub issue, so group admins can submit links for review.

### Adding a festival

Append an entry to `FESTIVALS` in `src/festivals/data/festivals.js`. Visitors can suggest festivals through the "הצעת פסטיבל" button, which also opens a GitHub issue.

## Development

```bash
npm install
npm run dev     # http://localhost:5173/a/festivals/
npm run build
```

Pushes to `master` deploy automatically (`.github/workflows/deploy.yml`).
