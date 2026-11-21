import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'

type ToastType = 'success' | 'info' | 'error'
interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastCtx {
  show: (message: string, type?: ToastType) => void
}

const Ctx = createContext<ToastCtx | null>(null)
const MAX_VISIBLE = 3
const DURATION = 3200

const icons = {
  success: <CheckCircle2 size={18} className="text-teal" />,
  info: <Info size={18} className="text-neon" />,
  error: <TriangleAlert size={18} className="text-rose-400" />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const show = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = nextId.current++
      setToasts((t) => [...t.slice(-(MAX_VISIBLE - 1)), { id, message, type }])
      setTimeout(() => dismiss(id), DURATION)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ show }), [show])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-20 z-[90] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="glass-strong pointer-events-auto flex items-start gap-3 rounded-xl p-3.5 pr-2 text-sm shadow-lg shadow-black/30"
            >
              <span className="mt-0.5 shrink-0">{icons[t.type]}</span>
              <span className="flex-1">{t.message}</span>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="rounded-lg p-1 text-muted transition hover:text-ink"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
