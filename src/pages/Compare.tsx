import { Link } from 'react-router-dom'
import { ExternalLink, Scale } from 'lucide-react'
import type { ReactNode } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import ModCover from '@/components/ModCover'
import { StarDisplay } from '@/components/StarRating'
import { mods } from '@/data/mods'
import { categories } from '@/data/categories'
import { COMPARE_MAX, useCompare } from '@/hooks/useCompare'
import { useModActions } from '@/hooks/useModActions'
import { useRatings } from '@/hooks/useRatings'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { Mod } from '@/types/mod'

const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id
const NOT_VERIFIED = <span className="text-muted">Not verified yet</span>

const modType = (m: Mod): string => {
  if (m.categories.includes('content')) return 'Content expansion'
  if (m.categories.includes('difficulty')) return 'Difficulty add-on'
  if (m.categories.includes('qol') || m.categories.includes('utility')) return 'Utility / quality of life'
  return '—'
}

export default function Compare() {
  usePageMeta('Compare Mods', 'Compare Terraria tModLoader mods side by side.')
  const { ids, clear } = useCompare()
  const { toggleCompare } = useModActions()
  const { ratings } = useRatings()
  const selected = ids.map((id) => mods.find((m) => m.id === id)).filter((m): m is Mod => !!m)

  const rows: { label: string; render: (m: Mod) => ReactNode }[] = [
    { label: 'Categories', render: (m) => <div className="flex flex-wrap gap-1.5">{m.categories.map((c) => <span key={c} className="rounded-full bg-violet/15 px-2.5 py-0.5 text-[11px] font-medium text-violet">{catLabel(c)}</span>)}</div> },
    { label: 'Type', render: modType },
    { label: 'Difficulty', render: (m) => (m.categories.includes('difficulty') ? 'Adds or reshapes difficulty' : 'No dedicated difficulty focus') },
    { label: 'Features', render: (m) => <ul className="list-disc space-y-1 pl-4">{m.features.map((f) => <li key={f}>{f}</li>)}</ul> },
    { label: 'Number of bosses', render: () => NOT_VERIFIED },
    { label: 'Requires', render: (m) => (m.requires?.length ? m.requires.join(', ') : 'No other mod required') },
    { label: 'Compatibility', render: () => 'tModLoader — check the Workshop page for supported versions' },
    { label: 'Your rating', render: (m) => <StarDisplay value={ratings[m.id]} size={15} /> },
    { label: 'Steam Workshop', render: (m) => <a href={m.steamUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-neon hover:underline">Open <ExternalLink size={13} /></a> },
  ]

  return (
    <div className="container-x pb-10 pt-28">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Compare' }]} />
      <h1 className="font-display text-3xl font-black uppercase tracking-wide sm:text-5xl">
        Compare <span className="text-gradient">mods</span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted">Pick two to {COMPARE_MAX} mods. Your selection is saved on this device.</p>

      {/* Picker */}
      <div className="glass mt-8 rounded-2xl p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted">
            Selected {selected.length}/{COMPARE_MAX}
          </span>
          {selected.length > 0 && (
            <button type="button" onClick={clear} className="text-sm text-neon hover:underline">
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {mods.map((m) => {
            const on = ids.includes(m.id)
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleCompare(m)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${on ? 'border-neon bg-neon/20 text-neon' : 'border-line/15 hover:border-neon/50'}`}
              >
                {m.name}
              </button>
            )
          })}
        </div>
      </div>

      {selected.length < 2 ? (
        <div className="glass mt-8 grid place-items-center rounded-3xl px-6 py-16 text-center" role="status">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-neon/20 to-violet/20 text-neon">
            <Scale size={26} />
          </span>
          <p className="mt-4 font-display text-lg font-bold">Select at least two mods</p>
          <p className="mt-1 text-sm text-muted">Choose them above, or use the scale button on any mod card.</p>
        </div>
      ) : (
        <>
          <div className="glass mt-8 overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">Side-by-side comparison of selected mods</caption>
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 z-10 w-36 bg-surface p-4" />
                  {selected.map((m) => (
                    <th key={m.id} scope="col" className="min-w-[200px] p-4 align-top">
                      <ModCover mod={m} className="mb-3 aspect-[16/9] rounded-xl" />
                      <Link to={`/mods/${m.slug}`} className="font-display text-base font-bold tracking-wide hover:text-neon">
                        {m.name}
                      </Link>
                      <button type="button" onClick={() => toggleCompare(m)} className="mt-1 block text-xs font-normal text-muted hover:text-rose-400">
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-line/10">
                    <th scope="row" className="sticky left-0 z-10 bg-surface p-4 align-top text-xs font-bold uppercase tracking-wider text-muted">
                      {r.label}
                    </th>
                    {selected.map((m) => (
                      <td key={m.id} className="p-4 align-top">
                        {r.render(m)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted">
            “Type” and “Difficulty” are derived from each mod’s categories. Rows marked “Not verified yet” are filled in once verified data is available.
          </p>
        </>
      )}
    </div>
  )
}
