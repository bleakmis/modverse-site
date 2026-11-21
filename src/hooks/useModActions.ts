import type { Mod } from '@/types/mod'
import { useFavorites } from './useFavorites'
import { useCompare, COMPARE_MAX } from './useCompare'
import { useToast } from './useToast'

/** Favorite / compare actions with toast feedback, shared by cards and the mod page. */
export function useModActions() {
  const fav = useFavorites()
  const compare = useCompare()
  const { show } = useToast()

  const toggleFavorite = (mod: Mod) => {
    const wasFav = fav.has(mod.id)
    fav.toggle(mod.id)
    show(wasFav ? `${mod.name} removed from favorites` : `${mod.name} added to favorites`, wasFav ? 'info' : 'success')
  }

  const toggleCompare = (mod: Mod) => {
    const r = compare.toggle(mod.id)
    if (r === 'added') show(`${mod.name} added to compare`)
    else if (r === 'removed') show(`${mod.name} removed from compare`, 'info')
    else show(`You can compare up to ${COMPARE_MAX} mods at once`, 'error')
  }

  return { isFavorite: fav.has, isComparing: compare.has, toggleFavorite, toggleCompare }
}
