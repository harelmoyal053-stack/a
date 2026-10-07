import { t } from '../i18n'

// Labels shared by the event catalog, filters, and cards. Getters, so each
// read is in the current language.
const labels = (prefix, keys) =>
  Object.defineProperties({}, Object.fromEntries(keys.map((key) => [key, { enumerable: true, get: () => t(`${prefix}.${key}`) }])))

export const CONTINENTS = labels('continent', ['europe', 'northAmerica', 'southAmerica', 'asia', 'oceania', 'africa', 'israel'])

export const GENRES = labels('genre', ['electronic', 'rock', 'pop', 'hiphop', 'indie', 'jazz', 'metal', 'afro'])
