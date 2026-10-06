export const REPO_URL = 'https://github.com/harelmoyal053-stack/a'

function issueUrl(title, body) {
  const params = new URLSearchParams({ title, body, labels: 'festival-groups' })
  return `${REPO_URL}/issues/new?${params}`
}

export function addGroupLinkUrl(festival, group) {
  return issueUrl(
    `קישור לקבוצה: ${festival.name} – ${group.title}`,
    [
      `פסטיבל: ${festival.name} (${festival.id})`,
      `סוג קבוצה: ${group.title} (${group.type})`,
      '',
      'קישור הזמנה לוואטסאפ (https://chat.whatsapp.com/...):',
      '',
      'אני מנהל/ת את הקבוצה ומאשר/ת לפרסם את הקישור: כן',
    ].join('\n'),
  )
}

export function suggestFestivalUrl() {
  return issueUrl(
    'הצעת פסטיבל חדש',
    ['שם הפסטיבל:', 'עיר ומדינה:', 'חודש:', 'ז׳אנרים:', 'אתר רשמי:'].join('\n'),
  )
}

export function whatsappShareUrl(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
