import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Scale, X } from 'lucide-react'
import { useCompare } from '@/hooks/useCompare'
import { mods } from '@/data/mods'

/** Floating bar listing the mods picked for comparison. */
export default function CompareBar() {
  const { ids, toggle, clear } = useCompare()
  const { pathname } = useLocation()
  const selected = ids.map((id) => mods.find((m) => m.id === id)).filter((m): m is NonNullable<typeof m> => !!m)
  const visible = selected.length > 0 && pathname !== '/compare'

  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="glass-strong pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-2xl p-3 shadow-glow sm:mr-16"
          role="region"
          aria-label="Compare selection"
        >
          <Scale size={18} className="ml-1 hidden shrink-0 text-neon sm:block" aria-hidden />
          <ul className="no-scrollbar flex min-w-0 flex-1 gap-1.5 overflow-x-auto sm:flex-wrap sm:overflow-visible">
            {selected.map((m) => (
              <li key={m.id} className="flex max-w-full shrink-0 items-center gap-1 rounded-full bg-neon/15 py-1 pl-3 pr-1 text-xs font-medium text-neon">
                <span className="truncate whitespace-nowrap">{m.name}</span>
                <button type="button" onClick={() => toggle(m.id)} aria-label={`Remove ${m.name} from compare`} className="rounded-full p-1 hover:bg-neon/20">
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={clear} className="hidden text-xs text-muted hover:text-ink sm:block">
            Clear
          </button>
          <Link to="/compare" className="btn-primary shrink-0 !px-4 !py-2.5 text-xs">
            COMPARE ({selected.length})
          </Link>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
