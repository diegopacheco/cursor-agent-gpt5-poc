import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

type Toast = { id: number; text: string }
const Ctx = createContext<{ add: (text: string) => void } | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  const add = useCallback((text: string) => {
    const id = Date.now()
    setItems(s => [...s, { id, text }])
    setTimeout(() => setItems(s => s.filter(i => i.id !== id)), 3000)
  }, [])
  return (
    <Ctx.Provider value={{ add }}>
      {children}
      <div style={{ position: 'fixed', right: 16, bottom: 16, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 1000 }}>
        {items.map(t => (
          <div key={t.id} className="card" style={{ background: 'rgba(108,161,255,.2)' }}>{t.text}</div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('toast')
  return ctx
}
