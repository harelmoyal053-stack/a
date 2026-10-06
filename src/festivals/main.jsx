import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './festivals.css'
import App from './App.jsx'
import { ChatProvider } from './chat/ChatContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChatProvider>
      <App />
    </ChatProvider>
  </StrictMode>,
)
