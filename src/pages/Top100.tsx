import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Crown, Info } from 'lucide-react'
import Breadcrumbs from '@/components/Breadcrumbs'
import ModCover from '@/components/ModCover'
import FavoriteButton from '@/components/FavoriteButton'
import CompareButton from '@/components/CompareButton'
import { StarDisplay } from '@/components/StarRating'
import { mods } from '@/data/mods'
import { categories } from '@/data/categories'
import { useRatings } from '@/hooks/useRatings'
import { usePageMeta } from '@/hooks/usePageMeta'
import { countByCategory } from '@/utils/catalog'
import type { CategoryId, Mod } from '@/types/mod'

const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id

const medals = [
  { ring: 'from-amber-300 to-yellow-600', text: 'text-amber-300', label: '1st place' },
  { ring: 'from-slate-200 to-slate-500', text: 'text-slate-300', label: '2nd place' },
  { ring: 'from-orange-400 to-amber-800', text: 'text-orange-400', label: '3rd place' },
]

export default function Top100() {
  usePageMeta('TOP 100', 'An editorial ranking of the best Terraria tModLoader mods, filterable by category.')
  const [tab, setTab] = useState<'all' | CategoryId>('all')
  const { ratings } = useRatings()

  const tabs = [{ id: 'all' as const, label: 'All', count: mods.length }, ...categories.filter((c) => countByCategory(mods, c.id) > 0).map((c) => ({ id: c.id, label: c.label, count: countByCategory(mods, c.id) }))]
  // Ranking order = editorial order of the catalog (not votes, not downloads).
  const ranked: Mod[] = tab === 'all' ? mods : mods.filter((m) => m.categories.includes(tab))
  const podium = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  return (
    <div className="container-x pb-10 pt-28">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'TOP 100' }]} />
      <h1 className="font-display text-3xl font-black uppercase tracking-wide sm:text-5xl">
        Top <span className="text-gradient">100</span>
      </h1>

      <p className="mt-5 flex max-w-3xl gap-3 rounded-xl border border-neon/30 bg-neon/10 p-4 text-sm">
        <Info size={18} className="mt-0.5 shrink-0 text-neon" />
        <span>
          This is an <strong>editorial list, not an official or community ranking</strong> — no votes or download numbers are used. The catalog currently
          holds {mods.length} mods, so only those places are filled; the list grows as verified mods are added.
        </span>
      </p>

      {/* Category switch */}
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Ranking category">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              tab === t.id ? 'border-neon bg-neon/20 text-neon' : 'border-line/15 hover:border-neon/50'
            }`}
          >
            {t.label} <span className="text-xs text-muted">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {podium.map((m, i) => (
          <motion.article
            key={`${tab}-${m.id}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-3xl bg-gradient-to-br p-[2px] ${medals[i].ring} ${i === 0 ? 'md:-mt-3 md:mb-3' : ''}`}
          >
            <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] bg-surface">
              <div className="relative">
                <ModCover mod={m} className="aspect-[16/10]" />
                <span className={`absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-bg/80 px-3 py-1 font-display text-sm font-black backdrop-blur ${medals[i].text}`}>
                  {i === 0 && <Crown size={15} />} #{i + 1}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-lg font-bold tracking-wide">
                  <span className="sr-only">{medals[i].label}: </span>
                  {m.name}
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.categories.map((c) => (
                    <span key={c} className="rounded-full bg-violet/15 px-2.5 py-0.5 text-[11px] font-medium text-violet">
                      {catLabel(c)}
                    </span>
                  ))}
                </div>
                <p className="mt-3 line-clamp-3 flex-1 text-sm text-muted">{m.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <StarDisplay value={ratings[m.id]} size={14} /> {ratings[m.id] ? 'your rating' : 'not rated by you'}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to={`/mods/${m.slug}`} className="btn-primary flex-1 !px-3 !py-2.5 text-xs">
                    DETAILS
                  </Link>
                  <FavoriteButton mod={m} />
                  <CompareButton mod={m} />
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Places 4+ */}
      {rest.length > 0 && (
        <ol start={4} className="mt-8 space-y-3">
          {rest.map((m, i) => (
            <motion.li
              key={`${tab}-${m.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className="glass flex min-w-0 items-center gap-3 rounded-2xl p-3 pr-4 transition hover:border-neon/50 sm:gap-4"
            >
              <span className="w-10 shrink-0 text-center font-display text-xl font-black text-muted sm:w-12 sm:text-2xl">{i + 4}</span>
              <ModCover mod={m} className="hidden h-16 w-24 shrink-0 rounded-xl sm:block" />
              <div className="min-w-0 flex-1">
                <Link to={`/mods/${m.slug}`} className="block truncate font-display text-sm font-bold tracking-wide hover:text-neon">
                  {m.name}
                </Link>
                <p className="mt-0.5 truncate text-xs text-muted">{m.categories.map(catLabel).join(' · ')}</p>
                <div className="mt-1.5 sm:hidden">
                  <StarDisplay value={ratings[m.id]} size={13} />
                </div>
              </div>
              <div className="hidden shrink-0 sm:block">
                <StarDisplay value={ratings[m.id]} size={15} />
                <p className="mt-0.5 text-[11px] text-muted">{ratings[m.id] ? 'your rating' : 'not rated by you'}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <FavoriteButton mod={m} />
                <CompareButton mod={m} />
                <Link to={`/mods/${m.slug}`} aria-label={`${m.name} details`} className="hidden p-2 text-muted hover:text-neon sm:block">
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.li>
          ))}
        </ol>
      )}

      <p className="mt-8 text-center text-sm text-muted">
        Showing {ranked.length} of 100 planned places. Remaining places open as more mods are verified and added.
      </p>
    </div>
  )
}
