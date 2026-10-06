import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './festivals.css'
import App from './App.jsx'
import { ChatProvider } from './chat/ChatContext'
import { CatalogProvider } from './data/CatalogContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CatalogProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </CatalogProvider>
  </StrictMode>,
)
