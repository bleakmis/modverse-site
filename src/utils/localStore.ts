/**
 * Tiny LocalStorage-backed store for useSyncExternalStore.
 * Swap `get/set` for API calls later (Supabase/PostgreSQL) without touching the components.
 */
export function createLocalStore<T>(key: string, fallback: T, validate: (value: unknown) => T | null) {
  const read = (): T => {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return fallback
      return validate(JSON.parse(raw)) ?? fallback
    } catch {
      return fallback
    }
  }

  let cache = read()
  const listeners = new Set<() => void>()

  const set = (next: T) => {
    cache = next
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      /* storage unavailable — state lives for this session only */
    }
    listeners.forEach((l) => l())
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        cache = read()
        listener()
      }
    }
    window.addEventListener('storage', onStorage) // keep other tabs in sync
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  return { get: () => cache, set, subscribe }
}
