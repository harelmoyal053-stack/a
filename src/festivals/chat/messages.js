// Shared helpers for chat message payloads.

export const REACTIONS = ['👍', '❤\ufe0f', '😂', '😮', '😢', '🙏']
export const MAX_TEXT = 1000
// Firestore documents are capped at 1 MiB; keep images well below that.
export const MAX_IMAGE_CHARS = 700_000

// One-line preview used for "last message", replies and pins.
export function preview(message) {
  if (message.deleted) return 'ההודעה נמחקה'
  switch (message.type) {
    case 'image':
      return `📷 ${message.caption || 'תמונה'}`
    case 'poll':
      return `📊 ${message.poll.question}`
    case 'location':
      return '📍 מיקום'
    default:
      return message.text
  }
}

// Builds the stored message from what the composer produced.
export function buildMessage(user, payload) {
  const message = { uid: user.uid, name: user.name, type: payload.type ?? 'text', reactions: {}, votes: {} }
  if (payload.text) message.text = payload.text.slice(0, MAX_TEXT)
  if (payload.image) message.image = payload.image
  if (payload.caption) message.caption = payload.caption.slice(0, MAX_TEXT)
  if (payload.poll) message.poll = payload.poll
  if (payload.location) message.location = payload.location
  if (payload.replyTo) message.replyTo = payload.replyTo
  return message
}

export function replyRef(message) {
  return { id: message.id, name: message.name, text: preview(message).slice(0, 120) }
}

const EMOJI_ONLY = /^(?:\p{Extended_Pictographic}|\p{Emoji_Component}|\u200d|\ufe0f|\s)+$/u

// Up to three emoji with no text are shown large, like WhatsApp.
export function isBigEmoji(text) {
  if (!text || !EMOJI_ONLY.test(text) || /^[\d#*\s]+$/.test(text)) return false
  const graphemes = [...new Intl.Segmenter().segment(text.replace(/\s/g, ''))]
  return graphemes.length <= 3
}
