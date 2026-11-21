import { Heart } from 'lucide-react'
import type { Mod } from '@/types/mod'
import { useModActions } from '@/hooks/useModActions'

interface Props {
  mod: Mod
  /** Show the text label next to the icon. */
  labeled?: boolean
}

export default function FavoriteButton({ mod, labeled = false }: Props) {
  const { isFavorite, toggleFavorite } = useModActions()
  const active = isFavorite(mod.id)
  return (
    <button
      type="button"
      onClick={() => toggleFavorite(mod)}
      aria-pressed={active}
      aria-label={active ? `Remove ${mod.name} from favorites` : `Add ${mod.name} to favorites`}
      className={`btn glass ${labeled ? '' : '!px-3.5'} ${
        active ? 'border-rose-400/60 text-rose-400' : 'text-ink hover:border-rose-400/60 hover:text-rose-400'
      }`}
    >
      <Heart size={16} className={active ? 'fill-current' : ''} />
      {labeled && (active ? 'In favorites' : 'Add to favorites')}
    </button>
  )
}
