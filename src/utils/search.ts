import type { Mod } from '@/types/mod'
import { categories } from '@/data/categories'

const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id

/** Lowercase, strip accents and apostrophes so "fargos" matches "Fargo's". */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’`]/g, '')

export const tokenize = (q: string) => normalize(q).split(/\s+/).filter(Boolean)

export type MatchField = 'name' | 'description' | 'category' | 'features'

export interface SearchHit {
  mod: Mod
  score: number
  matched: MatchField[]
}

/**
 * Instant client-side search: case-insensitive, partial matches, every word must match somewhere
 * (name, description, category or features). Name matches rank highest.
 */
export function searchMods(query: string, list: Mod[]): SearchHit[] {
  const tokens = tokenize(query)
  if (!tokens.length) return []

  const hits: SearchHit[] = []
  list.forEach((mod, index) => {
    const name = normalize(mod.name)
    const desc = normalize(mod.description)
    const cats = mod.categories.map((c) => normalize(catLabel(c))).join(' ')
    const feats = normalize(mod.features.join(' '))

    let score = 0
    const matched = new Set<MatchField>()
    for (const t of tokens) {
      let s = 0
      if (name.startsWith(t) || name.split(' ').some((w) => w.startsWith(t))) (s = 10), matched.add('name')
      else if (name.includes(t)) (s = 6), matched.add('name')
      if (cats.includes(t)) (s = Math.max(s, 4)), matched.add('category')
      if (feats.includes(t)) (s = Math.max(s, 2)), matched.add('features')
      if (desc.includes(t)) (s = Math.max(s, 1)), matched.add('description')
      if (s === 0) return // this word matched nothing → mod is excluded
      score += s
    }
    hits.push({ mod, score: score * 1000 - index, matched: [...matched] })
  })
  return hits.sort((a, b) => b.score - a.score)
}

const escapeRe = (c: string) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Regex source for a token that also tolerates apostrophes inside the text ("fargos" → "Fargo's"). */
export const tokenPattern = (token: string) =>
  token
    .split('')
    .map(escapeRe)
    .join("['’`]?")
