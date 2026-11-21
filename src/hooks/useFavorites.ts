import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStore } from '@/utils/localStore'

const store = createLocalStore<string[]>('modverse:favorites', [], (v) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : null,
)

/** Favorites persisted in LocalStorage, shared by every component that uses the hook. */
export function useFavorites() {
  const ids = useSyncExternalStore(store.subscribe, store.get)
  const has = useCallback((id: string) => ids.includes(id), [ids])
  const toggle = useCallback((id: string) => {
    const cur = store.get()
    store.set(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])
  }, [])
  const clear = useCallback(() => store.set([]), [])
  return { ids, has, toggle, clear }
}
