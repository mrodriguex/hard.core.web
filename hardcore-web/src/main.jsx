import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { env } from './config';
import './index.css'
import App from './App.jsx'

if (import.meta.env.DEV) {
  console.info("Config loaded:", {
    apiBaseUrl: env.VITE_API_BASE_URL,
    signalrHubUrl: env.VITE_SIGNALR_HUB_URL,
    signalrSkipNegotiation: env.VITE_SIGNALR_SKIP_NEGOTIATION,
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
