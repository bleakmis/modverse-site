import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FilterX, Search, SearchX } from 'lucide-react'
import Breadcrumbs from '@/components/Breadcrumbs'
import ModCard from '@/components/ModCard'
import { mods } from '@/data/mods'
import { categories } from '@/data/categories'
import { usePageMeta } from '@/hooks/usePageMeta'
import { countByCategory, isSortAvailable, queryCatalog, sortOptions, type MatchMode, type SortKey } from '@/utils/catalog'
import type { CategoryId } from '@/types/mod'

const validCats = new Set<string>(categories.map((c) => c.id))

export default function Catalog() {
  usePageMeta('Mod Catalog', 'Browse, search, filter and sort the best Terraria tModLoader mods.')
  const [params, setParams] = useSearchParams()

  // All filter state lives in the URL, so results are shareable and survive reloads.
  const q = params.get('q') ?? ''
  const cats = (params.get('cat') ?? '').split(',').filter((c): c is CategoryId => validCats.has(c))
  const match: MatchMode = params.get('match') === 'all' ? 'all' : 'any'
  const rawSort = params.get('sort') as SortKey | null
  const sort: SortKey = rawSort && sortOptions.some((s) => s.key === rawSort) && isSortAvailable(rawSort, mods) ? rawSort : 'featured'

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) v ? next.set(k, v) : next.delete(k)
    setParams(next, { replace: true })
  }

  const toggleCat = (id: CategoryId) => {
    const next = cats.includes(id) ? cats.filter((c) => c !== id) : [...cats, id]
    update({ cat: next.join(',') || null })
  }

  const results = useMemo(() => queryCatalog(mods, { q, cats, match, sort }), [q, cats.join(','), match, sort]) // eslint-disable-line react-hooks/exhaustive-deps
  const filtersActive = q !== '' || cats.length > 0

  return (
    <div className="container-x pb-10 pt-28">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Mods' }]} />
      <h1 className="font-display text-3xl font-black uppercase tracking-wide sm:text-5xl">
        Mod <span className="text-gradient">catalog</span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted">Filter by category, search by name or description, and sort the way you like.</p>

      {/* Controls */}
      <div className="glass mt-8 space-y-5 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="glass-strong flex flex-1 items-center gap-3 rounded-xl px-4 focus-within:border-neon/70">
            <Search size={18} className="text-muted" aria-hidden />
            <span className="sr-only">Search the catalog</span>
            <input
              value={q}
              onChange={(e) => update({ q: e.target.value || null })}
              placeholder="Search the catalog…"
              className="h-12 min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
              autoComplete="off"
            />
          </label>
          <label className="glass-strong flex items-center gap-3 rounded-xl px-4">
            <span className="text-sm text-muted">Sort</span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value === 'featured' ? null : e.target.value })}
              className="h-12 min-w-0 flex-1 cursor-pointer bg-transparent text-sm font-medium outline-none"
            >
              {sortOptions.map((o) => {
                const ok = isSortAvailable(o.key, mods)
                return (
                  <option key={o.key} value={o.key} disabled={!ok} className="bg-surface text-ink">
                    {o.label}
                    {ok ? '' : ' (needs verified data)'}
                  </option>
                )
              })}
            </select>
          </label>
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted">Categories</span>
            <div role="group" aria-label="Category match mode" className="flex rounded-lg border border-line/15 p-0.5 text-xs">
              {(['any', 'all'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => update({ match: m === 'any' ? null : m })}
                  aria-pressed={match === m}
                  className={`rounded-md px-3 py-1.5 font-medium transition ${match === m ? 'bg-neon/20 text-neon' : 'text-muted hover:text-ink'}`}
                >
                  Match {m}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const count = countByCategory(mods, c.id)
              const on = cats.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCat(c.id)}
                  disabled={count === 0 && !on}
                  aria-pressed={on}
                  title={count === 0 ? 'No mods in the catalog yet' : c.blurb}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    on ? 'border-neon bg-neon/20 text-neon' : 'border-line/15 text-ink hover:border-neon/50'
                  }`}
                >
                  {c.label} <span className="text-xs text-muted">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-5 mt-8 flex items-center justify-between" aria-live="polite">
        <p className="text-sm text-muted">
          {results.length} mod{results.length === 1 ? '' : 's'}
        </p>
        {filtersActive && (
          <button type="button" onClick={() => setParams({}, { replace: true })} className="inline-flex items-center gap-1.5 text-sm text-neon hover:underline">
            <FilterX size={15} /> Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="glass grid place-items-center rounded-2xl px-6 py-16 text-center" role="status">
          <SearchX size={32} className="text-muted" />
          <p className="mt-4 font-display text-lg font-bold">No mods match these filters</p>
          <p className="mt-1 text-sm text-muted">Try removing a category or switching to “Match any”.</p>
          <button type="button" onClick={() => setParams({}, { replace: true })} className="btn-primary mt-6">
            Reset filters
          </button>
        </div>
      ) : (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="min-w-0"
              >
                <ModCard mod={m} query={q} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
