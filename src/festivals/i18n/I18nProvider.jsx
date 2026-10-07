import { createContext, Fragment, useContext, useEffect, useState } from 'react'
import { applyToDocument, getLang, LANGUAGES, setLang } from '.'

const I18nContext = createContext(null)

// Changing language remounts the app under a new key, so every string, date,
// and country name is rebuilt in the new language.
export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getLang)

  useEffect(() => {
    applyToDocument()
  }, [lang])

  const change = (code) => {
    setLang(code)
    setLangState(code)
  }

  return (
    <I18nContext.Provider value={{ lang, setLang: change, languages: LANGUAGES }}>
      <Fragment key={lang}>{children}</Fragment>
    </I18nContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  return useContext(I18nContext)
}
