import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import Breadcrumbs from '@/components/Breadcrumbs'
import ModCard from '@/components/ModCard'
import { mods } from '@/data/mods'
import { useFavorites } from '@/hooks/useFavorites'
import { useToast } from '@/hooks/useToast'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function Favorites() {
  usePageMeta('Favorites', 'Your saved Terraria tModLoader mods.')
  const { ids, clear } = useFavorites()
  const { show } = useToast()
  const favs = ids.map((id) => mods.find((m) => m.id === id)).filter((m): m is NonNullable<typeof m> => !!m)

  return (
    <div className="container-x pb-10 pt-28">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Favorites' }]} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black uppercase tracking-wide sm:text-5xl">
            Your <span className="text-gradient">favorites</span>
          </h1>
          <p className="mt-3 text-muted">Saved in this browser (LocalStorage). They stay after you reload or close the tab.</p>
        </div>
        {favs.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clear()
              show('Favorites cleared', 'info')
            }}
            className="btn-ghost !py-2.5 text-xs"
          >
            <Trash2 size={14} /> CLEAR ALL
          </button>
        )}
      </div>

      {favs.length === 0 ? (
        <div className="glass mt-10 grid place-items-center rounded-3xl px-6 py-20 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-rose-400/10 text-rose-400">
            <Heart size={28} />
          </span>
          <h2 className="mt-5 font-display text-xl font-bold uppercase tracking-wide">No favorites yet</h2>
          <p className="mt-2 max-w-sm text-sm text-muted">Tap the heart on any mod to save it here.</p>
          <Link to="/mods" className="btn-primary mt-7">
            Browse mods
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favs.map((m) => (
            <div key={m.id} className="min-w-0">
              <ModCard mod={m} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
