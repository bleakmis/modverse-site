import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Preloader() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1100)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading MODVERSE"
          className="fixed inset-0 z-[100] grid place-items-center bg-bg"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-6">
            <motion.svg
              viewBox="0 0 64 64"
              className="h-16 w-16 drop-shadow-[0_0_18px_rgb(var(--c-neon)/0.8)]"
              animate={{ rotateY: 360 }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
            >
              <defs>
                <linearGradient id="pl" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#22d3ee" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path d="M32 4 56 32 32 60 8 32Z" fill="url(#pl)" />
              <path d="M32 4 41 32 32 60 23 32Z" fill="#fff" opacity=".28" />
            </motion.svg>
            <div className="h-1 w-44 overflow-hidden rounded-full bg-line/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon to-violet"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </div>
            <span className="font-display text-xs tracking-[0.4em] text-muted">LOADING</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
