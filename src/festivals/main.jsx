import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './festivals.css'
import App from './App.jsx'
import { ChatProvider } from './chat/ChatContext'
import { CatalogProvider } from './data/CatalogContext'
import { applyToDocument } from './i18n'
import { I18nProvider } from './i18n/I18nProvider'

// Set the page language and direction before the first paint.
applyToDocument()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <CatalogProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </CatalogProvider>
    </I18nProvider>
  </StrictMode>,
)
