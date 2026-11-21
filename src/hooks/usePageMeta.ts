import { useEffect } from 'react'

const BASE = 'MODVERSE'

/** Per-page <title> and meta description (SEO for the SPA). */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — Discover the Best Terraria tModLoader Mods`
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    }
  }, [title, description])
}
