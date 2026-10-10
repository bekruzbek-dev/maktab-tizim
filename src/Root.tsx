import App from './App'
import Admin from './Admin'

// Vite'da /admin yo'li admin panelini, boshqa yo'llar ommaviy saytni ochadi.
export default function Root() {
  const path = window.location.pathname.replace(/\/+$/, '')
  return path === '/admin' ? <Admin /> : <App />
}
