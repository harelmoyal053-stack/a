// Festival catalog. `month` is the month the festival usually takes place (1-12).
// Add a festival by appending an object with a unique `id`.
export const CONTINENTS = {
  europe: 'אירופה',
  northAmerica: 'צפון אמריקה',
  southAmerica: 'דרום אמריקה',
  asia: 'אסיה',
  oceania: 'אוקיאניה',
  africa: 'אפריקה',
  israel: 'ישראל',
}

export const GENRES = {
  electronic: 'אלקטרוני',
  psytrance: 'טראנס ופסיכדלי',
  rock: 'רוק',
  pop: 'פופ',
  hiphop: 'היפ-הופ',
  indie: 'אינדי',
  jazz: "ג'אז",
  metal: 'מטאל',
  afro: 'אפרו',
  art: 'אמנות וקהילה',
}

export const MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
]

export const FESTIVALS = [
  { id: 'tomorrowland', name: 'Tomorrowland', city: 'בום', country: 'בלגיה', flag: '🇧🇪', continent: 'europe', month: 7, genres: ['electronic'], emoji: '🦋', colors: ['#7c3aed', '#db2777'], website: 'https://www.tomorrowland.com' },
  { id: 'glastonbury', name: 'Glastonbury', city: 'פילטון', country: 'אנגליה', flag: '🇬🇧', continent: 'europe', month: 6, genres: ['rock', 'pop', 'indie'], emoji: '🎪', colors: ['#16a34a', '#ca8a04'], website: 'https://www.glastonburyfestivals.co.uk' },
  { id: 'coachella', name: 'Coachella', city: 'אינדיו, קליפורניה', country: 'ארה"ב', flag: '🇺🇸', continent: 'northAmerica', month: 4, genres: ['pop', 'indie', 'hiphop', 'electronic'], emoji: '🌴', colors: ['#f97316', '#ec4899'], website: 'https://www.coachella.com' },
  { id: 'burning-man', name: 'Burning Man', city: 'מדבר בלאק רוק, נבדה', country: 'ארה"ב', flag: '🇺🇸', continent: 'northAmerica', month: 8, genres: ['art', 'electronic'], emoji: '🔥', colors: ['#ea580c', '#78350f'], website: 'https://burningman.org' },
  { id: 'primavera', name: 'Primavera Sound', city: 'ברצלונה', country: 'ספרד', flag: '🇪🇸', continent: 'europe', month: 6, genres: ['indie', 'rock', 'pop'], emoji: '🌸', colors: ['#0ea5e9', '#f43f5e'], website: 'https://www.primaverasound.com' },
  { id: 'sonar', name: 'Sónar', city: 'ברצלונה', country: 'ספרד', flag: '🇪🇸', continent: 'europe', month: 6, genres: ['electronic'], emoji: '🔊', colors: ['#facc15', '#1f2937'], website: 'https://sonar.es' },
  { id: 'roskilde', name: 'Roskilde', city: 'רוסקילדה', country: 'דנמרק', flag: '🇩🇰', continent: 'europe', month: 7, genres: ['rock', 'indie', 'hiphop'], emoji: '🧡', colors: ['#f97316', '#b91c1c'], website: 'https://www.roskilde-festival.dk' },
  { id: 'sziget', name: 'Sziget', city: 'בודפשט', country: 'הונגריה', flag: '🇭🇺', continent: 'europe', month: 8, genres: ['pop', 'rock', 'electronic'], emoji: '🏝️', colors: ['#06b6d4', '#a855f7'], website: 'https://szigetfestival.com' },
  { id: 'ozora', name: 'Ozora', city: 'דאדפוסטה', country: 'הונגריה', flag: '🇭🇺', continent: 'europe', month: 7, genres: ['psytrance', 'art'], emoji: '🍄', colors: ['#22c55e', '#7c3aed'], website: 'https://ozorafestival.eu' },
  { id: 'boom', name: 'Boom Festival', city: 'אידניה-א-נובה', country: 'פורטוגל', flag: '🇵🇹', continent: 'europe', month: 7, genres: ['psytrance', 'art'], emoji: '🌀', colors: ['#14b8a6', '#eab308'], website: 'https://www.boomfestival.org' },
  { id: 'exit', name: 'EXIT', city: 'נובי סאד', country: 'סרביה', flag: '🇷🇸', continent: 'europe', month: 7, genres: ['electronic', 'rock'], emoji: '🏰', colors: ['#dc2626', '#111827'], website: 'https://www.exitfest.org' },
  { id: 'untold', name: 'Untold', city: "קלוז'", country: 'רומניה', flag: '🇷🇴', continent: 'europe', month: 8, genres: ['electronic', 'pop'], emoji: '✨', colors: ['#4f46e5', '#0f172a'], website: 'https://untold.com' },
  { id: 'awakenings', name: 'Awakenings', city: 'הילווארנבק', country: 'הולנד', flag: '🇳🇱', continent: 'europe', month: 7, genres: ['electronic'], emoji: '⚡', colors: ['#18181b', '#ef4444'], website: 'https://www.awakenings.com' },
  { id: 'creamfields', name: 'Creamfields', city: "דרסברי, צ'שייר", country: 'אנגליה', flag: '🇬🇧', continent: 'europe', month: 8, genres: ['electronic'], emoji: '🎧', colors: ['#2563eb', '#ec4899'], website: 'https://www.creamfields.com' },
  { id: 'wacken', name: 'Wacken Open Air', city: 'ואקן', country: 'גרמניה', flag: '🇩🇪', continent: 'europe', month: 8, genres: ['metal', 'rock'], emoji: '🤘', colors: ['#3f3f46', '#a16207'], website: 'https://www.wacken.com' },
  { id: 'montreux', name: 'Montreux Jazz', city: 'מונטרה', country: 'שווייץ', flag: '🇨🇭', continent: 'europe', month: 7, genres: ['jazz'], emoji: '🎷', colors: ['#0369a1', '#0f766e'], website: 'https://www.montreuxjazzfestival.com' },
  { id: 'afro-nation', name: 'Afro Nation', city: 'פורטימאו', country: 'פורטוגל', flag: '🇵🇹', continent: 'europe', month: 7, genres: ['afro', 'hiphop'], emoji: '🌍', colors: ['#f59e0b', '#059669'], website: 'https://www.afronation.com' },
  { id: 'ultra', name: 'Ultra Music Festival', city: 'מיאמי', country: 'ארה"ב', flag: '🇺🇸', continent: 'northAmerica', month: 3, genres: ['electronic'], emoji: '🌊', colors: ['#0284c7', '#c026d3'], website: 'https://ultramusicfestival.com' },
  { id: 'edc', name: 'EDC Las Vegas', city: 'לאס וגאס', country: 'ארה"ב', flag: '🇺🇸', continent: 'northAmerica', month: 5, genres: ['electronic'], emoji: '🎡', colors: ['#d946ef', '#22d3ee'], website: 'https://lasvegas.electricdaisycarnival.com' },
  { id: 'lollapalooza', name: 'Lollapalooza', city: 'שיקגו', country: 'ארה"ב', flag: '🇺🇸', continent: 'northAmerica', month: 8, genres: ['pop', 'rock', 'hiphop'], emoji: '🏙️', colors: ['#ef4444', '#3b82f6'], website: 'https://www.lollapalooza.com' },
  { id: 'rock-in-rio', name: 'Rock in Rio', city: "ריו דה ז'ניירו", country: 'ברזיל', flag: '🇧🇷', continent: 'southAmerica', month: 9, genres: ['rock', 'pop'], emoji: '🎸', colors: ['#16a34a', '#facc15'], website: 'https://rockinrio.com' },
  { id: 'fuji-rock', name: 'Fuji Rock', city: 'יוזאווה, ניגאטה', country: 'יפן', flag: '🇯🇵', continent: 'asia', month: 7, genres: ['rock', 'indie'], emoji: '🗻', colors: ['#0ea5e9', '#15803d'], website: 'https://www.fujirockfestival.com' },
  { id: 'sunburn', name: 'Sunburn', city: 'גואה', country: 'הודו', flag: '🇮🇳', continent: 'asia', month: 12, genres: ['electronic'], emoji: '☀️', colors: ['#f97316', '#facc15'], website: 'https://sunburn.in' },
  { id: 'splendour', name: 'Splendour in the Grass', city: 'ביירון ביי', country: 'אוסטרליה', flag: '🇦🇺', continent: 'oceania', month: 7, genres: ['indie', 'pop'], emoji: '🌿', colors: ['#65a30d', '#0891b2'], website: 'https://splendourinthegrass.com' },
  { id: 'rhythm-and-vines', name: 'Rhythm and Vines', city: 'גיסבורן', country: 'ניו זילנד', flag: '🇳🇿', continent: 'oceania', month: 12, genres: ['electronic', 'hiphop'], emoji: '🍇', colors: ['#7e22ce', '#16a34a'], website: 'https://www.rhythmandvines.co.nz' },
  { id: 'mawazine', name: 'Mawazine', city: 'רבאט', country: 'מרוקו', flag: '🇲🇦', continent: 'africa', month: 6, genres: ['pop', 'afro'], emoji: '🕌', colors: ['#b91c1c', '#15803d'], website: 'https://www.festivalmawazine.ma' },
  { id: 'indnegev', name: 'InDNegev', city: 'מצפה גבולות', country: 'ישראל', flag: '🇮🇱', continent: 'israel', month: 10, genres: ['indie', 'rock'], emoji: '🏜️', colors: ['#d97706', '#2563eb'], website: 'https://www.indnegev.co.il' },
  { id: 'red-sea-jazz', name: "פסטיבל הג'אז של ים סוף", city: 'אילת', country: 'ישראל', flag: '🇮🇱', continent: 'israel', month: 8, genres: ['jazz'], emoji: '🐠', colors: ['#0e7490', '#f59e0b'], website: 'https://www.redseajazz.co.il' },
]
