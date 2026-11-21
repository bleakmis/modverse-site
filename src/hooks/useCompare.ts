import { useSyncExternalStore } from 'react'
import { createLocalStore } from '@/utils/localStore'

export const COMPARE_MAX = 4

const store = createLocalStore<string[]>('modverse:compare', [], (v) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, COMPARE_MAX) : null,
)

export type CompareResult = 'added' | 'removed' | 'full'

export function useCompare() {
  const ids = useSyncExternalStore(store.subscribe, store.get)

  const toggle = (id: string): CompareResult => {
    const cur = store.get()
    if (cur.includes(id)) {
      store.set(cur.filter((x) => x !== id))
      return 'removed'
    }
    if (cur.length >= COMPARE_MAX) return 'full'
    store.set([...cur, id])
    return 'added'
  }
  const clear = () => store.set([])

  return { ids, has: (id: string) => ids.includes(id), toggle, clear }
}
