import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Breadcrumbs from '@/components/Breadcrumbs'
import { usePageMeta } from '@/hooks/usePageMeta'

const items = [
  {
    q: 'What is tModLoader?',
    a: 'tModLoader is a free modding framework for Terraria. It lets the game load community-made mods that add bosses, items, biomes, difficulty modes and quality-of-life tools. You need to own Terraria to use it.',
  },
  {
    q: 'How do I install a mod?',
    a: 'Open the mod’s Steam Workshop page (every MODVERSE mod page has a button for it) and subscribe. Then start tModLoader and enable the mod in the Mods menu. Some mods require others — the mod page tells you when that is the case.',
  },
  {
    q: 'Does MODVERSE host or download mods?',
    a: 'No. MODVERSE is a discovery site. Every download button leads to the official Steam Workshop page, which is the only place files come from.',
  },
  {
    q: 'Is the TOP 100 an official ranking?',
    a: 'No. It is an editorial list. No votes, download counts or other metrics are used, and it only contains the mods that are currently in the catalog. More places fill in as verified mods are added.',
  },
  {
    q: 'Are the star ratings real community ratings?',
    a: 'No. Without a backend there is no shared rating data, so the ratings you give are saved only in your own browser and shown as “your rating”. Community ratings are planned for when a database is connected.',
  },
  {
    q: 'Why are there no download counts or versions?',
    a: 'They change constantly and could not be verified reliably, so MODVERSE does not show them rather than showing outdated numbers. The Workshop page always has the current values.',
  },
  {
    q: 'Where are my favorites and compare list stored?',
    a: 'In your browser’s LocalStorage on this device. They persist after reloads, but they are not synced between devices and disappear if you clear site data.',
  },
  {
    q: 'Are there keyboard shortcuts?',
    a: 'Yes. Press “/” or Ctrl/Cmd+K to open search, use the arrow keys and Enter to pick a result, and Esc to close. Everything else is reachable with Tab.',
  },
]

export default function Faq() {
  usePageMeta('FAQ', 'Answers about tModLoader, installing mods, and how MODVERSE works.')
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="container-x max-w-3xl pb-10 pt-28">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
      <h1 className="font-display text-3xl font-black uppercase tracking-wide sm:text-5xl">
        <span className="text-gradient">FAQ</span>
      </h1>
      <div className="mt-10 space-y-3">
        {items.map((it, i) => {
          const isOpen = open === i
          return (
            <div key={it.q} className="glass overflow-hidden rounded-2xl">
              <h2>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold"
                >
                  {it.q}
                  <ChevronDown size={18} className={`shrink-0 text-neon transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </h2>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 leading-relaxed text-muted">{it.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
