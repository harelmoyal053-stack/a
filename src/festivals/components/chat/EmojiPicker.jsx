import { useState } from 'react'

const CATEGORIES = [
  { label: '😀', name: 'פרצופים', emojis: '😀 😃 😄 😁 😆 😅 🤣 😂 🙂 😉 😊 😇 🥰 😍 🤩 😘 😋 😛 😜 🤪 😎 🥳 🤗 🤭 🤫 🤔 😐 😏 😴 🤤 😮 😲 🥺 😢 😭 😤 😡 🤯 😱 🥵 🥶 🤮 🤠 🤓 😈 💀 👻 👽 🤖 💩'.split(' ') },
  { label: '👍', name: 'ידיים', emojis: '👍 👎 👌 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 👇 ☝️ ✋ 👋 👏 🙌 👐 🤲 🙏 💪 🫶 🤝 ✍️ 💅 🫡 🫠 🙋 🤷 🙆 🙅 💃 🕺 🧘'.split(' ') },
  { label: '🎉', name: 'מסיבה', emojis: '🎉 🎊 🥳 🎶 🎵 🎧 🎤 🎸 🥁 🎷 🎺 🎹 🪩 🔊 💥 ✨ 🌟 ⭐ 🔥 ⚡ 🌈 🎪 🎡 🎢 🎆 🎇 🍾 🥂 🍻 🍺 🍹 🍸 🍕 🌮 🍔 🍟 🍦'.split(' ') },
  { label: '❤️', name: 'לבבות', emojis: '❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💯 💢 💫 💦 💤'.split(' ') },
  { label: '🏕️', name: 'טיול', emojis: '✈️ 🚗 🚌 🚐 🚕 🚆 🛫 🛬 🧳 🎒 🏕️ ⛺ 🏖️ 🏝️ 🏜️ 🌋 🗻 🌅 🌄 🌃 🌌 🗺️ 📍 🧭 🎟️ 🎫 💸 💰 🛒 🔋 📱 📸 🧴 🕶️ 👙 🩴'.split(' ') },
  { label: '🌴', name: 'טבע', emojis: '🌴 🌵 🌲 🌳 🌿 🍀 🌸 🌺 🌻 🌼 🍄 🌙 ☀️ 🌤️ ⛅ 🌧️ ⛈️ 🌊 💧 🔥 🦋 🐬 🐳 🐢 🦄 🐶 🐱 🦁 🐸 🐵'.split(' ') },
]

export default function EmojiPicker({ onPick, className = '' }) {
  const [category, setCategory] = useState(0)
  return (
    <div className={`bg-ink-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden ${className}`}>
      <div className="flex border-b border-white/10">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setCategory(i)}
            className={`flex-1 py-2 text-xl ${i === category ? 'bg-white/10' : ''}`}
            aria-label={c.name}
            aria-pressed={i === category}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-0.5 p-2 h-52 overflow-y-auto">
        {CATEGORIES[category].emojis.map((emoji) => (
          <button key={emoji} type="button" onClick={() => onPick(emoji)} className="text-2xl h-10 rounded-lg hover:bg-white/10">
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
