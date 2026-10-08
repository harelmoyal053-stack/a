export function whatsappShareUrl(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

// "Add an event" / "Report a problem" forms. Off until the inbox rules in
// firestore.rules are published in the Firebase console.
export const CONTACT_FORMS = false
