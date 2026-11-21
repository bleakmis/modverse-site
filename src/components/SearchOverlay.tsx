import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SearchBar from './SearchBar'

/** Full-screen search opened from the navbar (or with "/" or Ctrl/Cmd+K). */
export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-bg/80 px-4 pb-10 pt-[12vh] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="w-full max-w-2xl"
            initial={{ y: -16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <SearchBar autoFocus onDone={onClose} onEscape={onClose} />
            <p className="mt-3 text-center text-xs text-muted">
              <kbd className="rounded border border-line/20 px-1.5">↑</kbd> <kbd className="rounded border border-line/20 px-1.5">↓</kbd> to
              navigate · <kbd className="rounded border border-line/20 px-1.5">Enter</kbd> to open ·{' '}
              <kbd className="rounded border border-line/20 px-1.5">Esc</kbd> to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
