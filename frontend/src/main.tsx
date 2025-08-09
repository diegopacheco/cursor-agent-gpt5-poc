import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { StoreProvider } from './state/store'
import { ToastProvider } from './components/Toast'

const container = document.getElementById('root')
if (!container) throw new Error('Root container not found')
createRoot(container).render(
  <StrictMode>
    <StoreProvider>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </StoreProvider>
  </StrictMode>
)
