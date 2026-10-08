import ar from './ar'
import de from './de'
import en from './en'
import es from './es'
import fr from './fr'
import he from './he'
import ru from './ru'

export const LANGUAGES = [
  { code: 'he', name: 'עברית', dir: 'rtl', locale: 'he-IL' },
  { code: 'en', name: 'English', dir: 'ltr', locale: 'en' },
  { code: 'es', name: 'Español', dir: 'ltr', locale: 'es' },
  { code: 'fr', name: 'Français', dir: 'ltr', locale: 'fr' },
  { code: 'de', name: 'Deutsch', dir: 'ltr', locale: 'de' },
  { code: 'ru', name: 'Русский', dir: 'ltr', locale: 'ru' },
  // Latin digits keep numbers consistent with the mono font.
  { code: 'ar', name: 'العربية', dir: 'rtl', locale: 'ar-u-nu-latn' },
]

const DICTIONARIES = { he, en, es, fr, de, ru, ar }
const STORAGE_KEY = 'festichat:lang'

function savedLang() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

// The visitor's saved choice, else English. Everyone starts in English and
// picks another language from the menu or profile.
function detectLang() {
  const saved = savedLang()
  if (DICTIONARIES[saved]) return saved
  return 'en'
}

let current = detectLang()
const meta = () => LANGUAGES.find((l) => l.code === current)

export const getLang = () => current
export const locale = () => meta().locale
export const dir = () => meta().dir

export function setLang(code) {
  if (!DICTIONARIES[code]) return
  current = code
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    // Not saved; the choice still applies until the page reloads.
  }
  applyToDocument()
}

export function applyToDocument() {
  document.documentElement.lang = current
  document.documentElement.dir = dir()
  document.title = t('meta.title')
}

const pluralRules = {}

// t('members', { count: 3 }) → "3 חברים". Plural entries are objects keyed by
// Intl.PluralRules categories, plus an optional `zero`. `{n}` is the count,
// formatted for the current language.
export function t(key, vars = {}) {
  let value = DICTIONARIES[current][key] ?? DICTIONARIES.en[key] ?? DICTIONARIES.he[key] ?? key
  if (typeof value === 'object') {
    const count = vars.count ?? 0
    pluralRules[current] ??= new Intl.PluralRules(locale())
    value = (count === 0 && value.zero) || value[pluralRules[current].select(count)] || value.other
  }
  const all = vars.count != null ? { n: new Intl.NumberFormat(locale()).format(vars.count), ...vars } : vars
  return value.replace(/\{(\w+)\}/g, (_, name) => all[name] ?? '')
}
