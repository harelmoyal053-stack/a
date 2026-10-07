export const REPO_URL = 'https://github.com/harelmoyal053-stack/a'

export function whatsappShareUrl(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function addEventUrl() {
  return `${REPO_URL}/issues/new?template=event.yml`
}
