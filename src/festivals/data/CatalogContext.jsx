import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { buildCatalog, loadFeed } from './catalog'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [feed, setFeed] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadFeed().then((data) => {
      setFeed(data)
      setLoaded(true)
    })
  }, [])

  const value = useMemo(() => {
    const items = buildCatalog(feed)
    return { items, byId: new Map(items.map((item) => [item.id, item])), loaded, updatedAt: feed?.updatedAt ?? null }
  }, [feed, loaded])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() {
  return useContext(CatalogContext)
}
