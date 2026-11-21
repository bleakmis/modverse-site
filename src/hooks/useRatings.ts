import { useSyncExternalStore } from 'react'
import { createLocalStore } from '@/utils/localStore'

type Ratings = Record<string, number>

const store = createLocalStore<Ratings>('modverse:ratings', {}, (v) => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null
  const out: Ratings = {}
  for (const [k, n] of Object.entries(v)) {
    if (typeof n === 'number' && n >= 1 && n <= 5) out[k] = Math.round(n)
  }
  return out
})

/**
 * The visitor's OWN ratings, stored on this device only.
 * These are never presented as community ratings — a backend is required for those.
 */
export function useRatings() {
  const ratings = useSyncExternalStore(store.subscribe, store.get)
  const rate = (id: string, value: number) => store.set({ ...store.get(), [id]: value })
  const clear = (id: string) => {
    const next = { ...store.get() }
    delete next[id]
    store.set(next)
  }
  return { ratings, rate, clear }
}
