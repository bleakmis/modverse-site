import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ExternalLink, Image as ImageIcon, Info } from 'lucide-react'
import Breadcrumbs from '@/components/Breadcrumbs'
import FavoriteButton from '@/components/FavoriteButton'
import CompareButton from '@/components/CompareButton'
import StarRating from '@/components/StarRating'
import ModCard from '@/components/ModCard'
import ModCover from '@/components/ModCover'
import Reveal from '@/components/Reveal'
import NotFound from '@/pages/NotFound'
import { getModBySlug, mods } from '@/data/mods'
import { categories } from '@/data/categories'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useRatings } from '@/hooks/useRatings'
import { useToast } from '@/hooks/useToast'
import { similarMods } from '@/utils/catalog'

const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id

export default function ModDetail() {
  const { slug = '' } = useParams()
  const mod = getModBySlug(slug)
  usePageMeta(mod?.name, mod?.description)
  const { ratings, rate, clear } = useRatings()
  const { show } = useToast()

  if (!mod) return <NotFound />
  const similar = similarMods(mods, mod, 3)

  return (
    <div className="container-x pb-10 pt-28">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Mods', to: '/mods' }, { label: mod.name }]} />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass relative overflow-hidden rounded-3xl"
      >
        <ModCover mod={mod} className="aspect-[21/9] min-h-[200px] w-full sm:min-h-[280px]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent p-5 pt-24 sm:p-8 sm:pt-32">
          <div className="flex flex-wrap gap-1.5">
            {mod.categories.map((c) => (
              <Link
                key={c}
                to={`/mods?cat=${c}`}
                className="rounded-full bg-violet/20 px-3 py-1 text-xs font-medium text-violet transition hover:bg-violet/30"
              >
                {catLabel(c)}
              </Link>
            ))}
          </div>
          <h1 className="mt-3 font-display text-3xl font-black uppercase tracking-wide sm:text-5xl">{mod.name}</h1>
        </div>
      </motion.section>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={mod.steamUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
          STEAM WORKSHOP <ExternalLink size={16} />
        </a>
        <FavoriteButton mod={mod} labeled />
        <CompareButton mod={mod} labeled />
        <Link to="/mods" className="btn-ghost">
          <ArrowLeft size={16} /> All mods
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <Reveal>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide">About</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted">{mod.description}</p>
            {mod.note && (
              <p className="mt-4 flex gap-3 rounded-xl border border-neon/30 bg-neon/10 p-4 text-sm">
                <Info size={18} className="mt-0.5 shrink-0 text-neon" />
                <span>{mod.note}</span>
              </p>
            )}
          </Reveal>

          <Reveal>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide">Features</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {mod.features.map((f) => (
                <li key={f} className="glass flex items-start gap-3 rounded-xl p-4 text-sm">
                  <Check size={18} className="mt-0.5 shrink-0 text-teal" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide">Screenshots &amp; video</h2>
            <div className="glass mt-4 flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-neon/20 to-violet/20 text-neon">
                <ImageIcon size={22} />
              </span>
              <p className="flex-1 text-sm text-muted">
                Official screenshots and videos live on the mod’s Steam Workshop page. MODVERSE does not copy or hotlink third-party media.
              </p>
              <a href={mod.steamUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost shrink-0">
                View media <ExternalLink size={14} />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Info panel */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em]">Details</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-muted">Platform</dt>
                <dd className="mt-0.5 font-medium">tModLoader (Steam Workshop)</dd>
              </div>
              <div>
                <dt className="text-muted">Version</dt>
                <dd className="mt-0.5 font-medium">{mod.version ?? 'See the Workshop page for the latest version'}</dd>
              </div>
              <div>
                <dt className="text-muted">Compatibility</dt>
                <dd className="mt-0.5 font-medium">Check the Workshop page for supported tModLoader versions</dd>
              </div>
              <div>
                <dt className="text-muted">Community rating</dt>
                <dd className="mt-0.5 font-medium">No community ratings yet</dd>
              </div>
              <div>
                <dt className="text-muted">Your rating</dt>
                <dd className="mt-1.5">
                  <StarRating
                    size={26}
                    value={ratings[mod.id]}
                    onChange={(n) => {
                      rate(mod.id, n)
                      show(`You rated ${mod.name} ${n}/5 — saved on this device`)
                    }}
                  />
                  <p className="mt-1.5 text-xs text-muted">
                    {ratings[mod.id] ? (
                      <>
                        Only you can see this.{' '}
                        <button
                          type="button"
                          className="text-neon hover:underline"
                          onClick={() => {
                            clear(mod.id)
                            show('Rating removed', 'info')
                          }}
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      'Saved on this device only — not a community score.'
                    )}
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-muted">Steam Workshop ID</dt>
                <dd className="mt-0.5 font-mono text-xs">{mod.workshopId}</dd>
              </div>
            </dl>
            {mod.extraLinks?.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-5 w-full !text-xs">
                {l.label} <ExternalLink size={13} />
              </a>
            ))}
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <Reveal>
            <h2 className="mb-6 font-display text-xl font-bold uppercase tracking-wide">Similar mods</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((m) => (
              <Reveal key={m.id}>
                <ModCard mod={m} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
