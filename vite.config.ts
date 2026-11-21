import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

/** Public site URL: SITE_URL, else Vercel's production domain, else empty (local builds). */
function siteUrl() {
  const raw = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  return raw.replace(/\/$/, '')
}

/** Fills absolute og:image and, when the domain is known, canonical + og:url. */
function siteMeta(): Plugin {
  const site = siteUrl()
  return {
    name: 'modverse-site-meta',
    transformIndexHtml(html) {
      const tags = site ? `<link rel="canonical" href="${site}/" />\n    <meta property="og:url" content="${site}/" />` : ''
      return html.replace(/%SITE%/g, site).replace('<!--SITE_TAGS-->', tags)
    },
  }
}

export default defineConfig({
  plugins: [react(), siteMeta()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    // The only large chunk is the lazy-loaded 3D scene (three.js); it never blocks first paint.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Code splitting: vendor chunks cached separately.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/node_modules\/framer-motion\//.test(id)) return 'motion'
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|@remix-run)\//.test(id)) return 'react'
        },
      },
    },
  },
})
