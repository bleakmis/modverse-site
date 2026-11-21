import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useCompare } from '@/hooks/useCompare'

/** Resets scroll on route change and shows a floating scroll-to-top button. */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  const { ids } = useCompare()
  const lifted = ids.length > 0 && pathname !== '/compare'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className={`glass-strong fixed right-5 z-40 grid h-12 w-12 place-items-center rounded-2xl text-neon shadow-glow transition hover:-translate-y-1 ${lifted ? 'bottom-24 sm:bottom-5' : 'bottom-5'}`}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
