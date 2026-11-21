import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { Mod } from '@/types/mod'
import { categories } from '@/data/categories'
import ModCover from './ModCover'
import Highlight from './Highlight'
import FavoriteButton from './FavoriteButton'
import CompareButton from './CompareButton'

const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id

interface Props {
  mod: Mod
  /** Current search text, used to highlight matches. */
  query?: string
}

export default function ModCard({ mod, query }: Props) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="glass group relative flex h-full flex-col overflow-hidden rounded-2xl transition-shadow duration-300 hover:border-neon/50 hover:shadow-glow"
    >
      <Link to={`/mods/${mod.slug}`} aria-label={`${mod.name} details`} tabIndex={-1}>
        <ModCover mod={mod} className="aspect-[16/10] transition-transform duration-500 group-hover:scale-[1.03]" />
      </Link>
      <div className="absolute right-3 top-3 flex gap-2">
        <CompareButton mod={mod} />
        <FavoriteButton mod={mod} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-1.5">
          {mod.categories.slice(0, 3).map((c) => (
            <span key={c} className="rounded-full bg-violet/15 px-2.5 py-0.5 text-[11px] font-medium text-violet">
              {catLabel(c)}
            </span>
          ))}
        </div>
        <h3 className="mt-3 font-display text-base font-bold tracking-wide">
          <Highlight text={mod.name} query={query} />
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          <Highlight text={mod.description} query={query} />
        </p>
        <div className="mt-5 grid grid-cols-[1fr_1.6fr] gap-2">
          <Link to={`/mods/${mod.slug}`} className="btn-primary !px-3 !py-2.5 text-xs">
            DETAILS
          </Link>
          <a href={mod.steamUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost whitespace-nowrap !px-3 !py-2.5 text-xs">
            STEAM WORKSHOP <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </motion.article>
  )
}
