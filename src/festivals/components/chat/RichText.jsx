const URL_PATTERN = /(https?:\/\/[^\s]+)/g
// Message text with clickable links and highlighted search matches.
export default function RichText({ text, highlight }) {
  return text.split(URL_PATTERN).map((part, i) => {
    if (i % 2 === 1) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline text-sky-300 break-all" dir="ltr">
          {part}
        </a>
      )
    }
    if (!highlight) return part
    const q = highlight.toLowerCase()
    const pieces = []
    let from = 0
    let at = part.toLowerCase().indexOf(q)
    while (at !== -1) {
      pieces.push(part.slice(from, at), <mark key={`${i}-${at}`} className="bg-accent/40 text-white rounded px-0.5">{part.slice(at, at + q.length)}</mark>)
      from = at + q.length
      at = part.toLowerCase().indexOf(q, from)
    }
    pieces.push(part.slice(from))
    return pieces
  })
}
