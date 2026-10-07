import { Check } from 'lucide-react'

// One row per language, each written in its own language and direction.
export default function LanguageList({ value, languages, onChange }) {
  return (
    <ul>
      {languages.map((l) => (
        <li key={l.code}>
          <button
            type="button"
            onClick={() => onChange(l.code)}
            aria-pressed={value === l.code}
            className={`w-full flex items-center justify-between py-2.5 text-[15px] ${value === l.code ? 'text-white font-medium' : 'text-white/75 hover:text-white'}`}
          >
            <span lang={l.code} dir={l.dir}>{l.name}</span>
            {value === l.code && <Check size={16} className="text-accent" />}
          </button>
        </li>
      ))}
    </ul>
  )
}
