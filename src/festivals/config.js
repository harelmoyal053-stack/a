export const REPO_URL = 'https://github.com/harelmoyal053-stack/a'

function issueUrl(title, body) {
  const params = new URLSearchParams({ title, body, labels: 'festival-groups' })
  return `${REPO_URL}/issues/new?${params}`
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

export function addEventUrl() {
  return `${REPO_URL}/issues/new?template=event.yml`
}
