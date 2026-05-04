/* Main entry point for the application - renders the root React component */
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('SW registration failed: ', err)
    })
  })
}

// Inject manifest if not present
if (!document.querySelector('link[rel="manifest"]')) {
  const manifestLink = document.createElement('link')
  manifestLink.rel = 'manifest'
  manifestLink.href = '/manifest.json'
  document.head.appendChild(manifestLink)
}

// @skip-protected: Do not remove. Required for React rendering.
createRoot(document.getElementById('root')!).render(<App />)
