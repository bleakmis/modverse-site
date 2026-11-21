import type { CategoryId, Mod } from '@/types/mod'
import { searchMods } from './search'

export type SortKey = 'featured' | 'popularity' | 'rating' | 'alpha' | 'recent' | 'downloads'
export type MatchMode = 'any' | 'all'

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'popularity', label: 'Popularity' },
  { key: 'rating', label: 'Highest Rated' },
  { key: 'alpha', label: 'Alphabetical' },
  { key: 'recent', label: 'Recently Added' },
  { key: 'downloads', label: 'Most Downloaded' },
]

/** Metric-based sorts are only offered when at least one mod actually has that metric. */
export function isSortAvailable(key: SortKey, list: Mod[]): boolean {
  switch (key) {
    case 'popularity':
      return list.some((m) => m.popularity !== undefined)
    case 'rating':
      return list.some((m) => m.rating !== undefined)
    case 'downloads':
      return list.some((m) => m.downloads !== undefined)
    default:
      return true
  }
}

const byMetric = (get: (m: Mod) => number | undefined) => (a: Mod, b: Mod) =>
  (get(b) ?? -Infinity) - (get(a) ?? -Infinity)

export interface CatalogQuery {
  q: string
  cats: CategoryId[]
  match: MatchMode
  sort: SortKey
}

/** Pure filter + search + sort over the catalog (all filters combine). */
export function queryCatalog(list: Mod[], { q, cats, match, sort }: CatalogQuery): Mod[] {
  let out = list.slice()

  if (cats.length) {
    out = out.filter((m) => (match === 'all' ? cats.every((c) => m.categories.includes(c)) : cats.some((c) => m.categories.includes(c))))
  }

  const searching = q.trim().length > 0
  if (searching) {
    const order = new Map(searchMods(q, out).map((h, i) => [h.mod.id, i]))
    out = out.filter((m) => order.has(m.id))
    if (sort === 'featured') out.sort((a, b) => order.get(a.id)! - order.get(b.id)!) // best match first
  }

  switch (sort) {
    case 'alpha':
      out.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'recent':
      out.sort((a, b) => b.addedAt.localeCompare(a.addedAt) || list.indexOf(b) - list.indexOf(a))
      break
    case 'rating':
      out.sort(byMetric((m) => m.rating))
      break
    case 'popularity':
      out.sort(byMetric((m) => m.popularity))
      break
    case 'downloads':
      out.sort(byMetric((m) => m.downloads))
      break
  }
  return out
}

export const countByCategory = (list: Mod[], id: CategoryId) => list.filter((m) => m.categories.includes(id)).length

/** Mods sharing the most categories with the given one. */
export function similarMods(list: Mod[], mod: Mod, limit = 3): Mod[] {
  return list
    .filter((m) => m.id !== mod.id)
    .map((m) => ({ m, overlap: m.categories.filter((c) => mod.categories.includes(c)).length }))
    .filter((x) => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((x) => x.m)
}
