import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Search as SearchIcon, SearchX } from 'lucide-react'
import Breadcrumbs from '@/components/Breadcrumbs'
import Highlight from '@/components/Highlight'
import ModCover from '@/components/ModCover'
import { mods } from '@/data/mods'
import { categories } from '@/data/categories'
import { usePageMeta } from '@/hooks/usePageMeta'
import { searchMods, type MatchField } from '@/utils/search'

const fieldLabel: Record<MatchField, string> = {
  name: 'Name',
  description: 'Description',
  category: 'Category',
  features: 'Features',
}
const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const hits = useMemo(() => searchMods(q, mods), [q])
  usePageMeta(q ? `Search: ${q}` : 'Search', 'Search results for Terraria tModLoader mods.')

  return (
    <div className="container-x pb-10 pt-28">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
      <h1 className="font-display text-3xl font-black uppercase tracking-wide sm:text-5xl">
        Search <span className="text-gradient">results</span>
      </h1>

      <label className="glass-strong mt-8 flex max-w-2xl items-center gap-3 rounded-2xl px-4 focus-within:border-neon/70 focus-within:shadow-glow">
        <SearchIcon size={20} className="text-muted" aria-hidden />
        <span className="sr-only">Search mods</span>
        <input
          value={q}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
          placeholder="Search mods, categories, features…"
          autoFocus
          autoComplete="off"
          className="h-14 min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
        />
      </label>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {q.trim() ? `${hits.length} result${hits.length === 1 ? '' : 's'} for “${q.trim()}”` : 'Type to search the catalog.'}
      </p>

      {q.trim() && hits.length === 0 && (
        <div className="glass mt-6 grid place-items-center rounded-2xl px-6 py-16 text-center" role="status">
          <SearchX size={32} className="text-muted" />
          <p className="mt-4 font-display text-lg font-bold">Nothing found</p>
          <p className="mt-1 max-w-md text-sm text-muted">No mod matches “{q.trim()}”. Check the spelling or browse by category instead.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.slice(0, 5).map((c) => (
              <Link key={c.id} to={`/mods?cat=${c.id}`} className="rounded-full border border-line/15 px-3.5 py-1.5 text-sm hover:border-neon/50 hover:text-neon">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {hits.map((h, i) => (
          <motion.li
            key={h.mod.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.3) }}
          >
            <Link
              to={`/mods/${h.mod.slug}`}
              className="glass group flex flex-col gap-4 rounded-2xl p-3 pr-5 transition duration-300 hover:border-neon/50 hover:shadow-glow sm:flex-row sm:items-center"
            >
              <ModCover mod={h.mod} className="aspect-[16/9] w-full shrink-0 rounded-xl sm:aspect-auto sm:h-24 sm:w-40" />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-base font-bold tracking-wide">
                  <Highlight text={h.mod.name} query={q} />
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  <Highlight text={h.mod.description} query={q} />
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {h.mod.categories.map((c) => (
                    <span key={c} className="rounded-full bg-violet/15 px-2.5 py-0.5 text-[11px] font-medium text-violet">
                      <Highlight text={catLabel(c)} query={q} />
                    </span>
                  ))}
                  <span className="ml-1 text-[11px] text-muted">Matched in: {h.matched.map((f) => fieldLabel[f]).join(', ')}</span>
                </div>
              </div>
              <ArrowRight size={18} className="hidden shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-neon sm:block" />
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
