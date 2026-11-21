// Generates public/sitemap.xml and public/robots.txt from the mod slugs in src/data/mods.ts.
// Domain: SITE_URL, else Vercel's VERCEL_PROJECT_PRODUCTION_URL. With neither (local build)
// no sitemap is written, because a sitemap needs absolute URLs and a fake domain would hurt SEO.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'

const raw = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
const site = raw.replace(/\/$/, '')
const out = (f) => new URL(`../public/${f}`, import.meta.url)

if (!site) {
  rmSync(out('sitemap.xml'), { force: true })
  writeFileSync(out('robots.txt'), 'User-agent: *\nAllow: /\n')
  console.log('sitemap: skipped (set SITE_URL or deploy on Vercel to generate it)')
} else {
  const src = readFileSync(new URL('../src/data/mods.ts', import.meta.url), 'utf8')
  const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
  const paths = ['/', '/mods', '/top', '/compare', '/about', '/faq', ...slugs.map((s) => `/mods/${s}`)]
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    paths.map((p) => `  <url><loc>${site}${p}</loc></url>`).join('\n') +
    `\n</urlset>\n`
  writeFileSync(out('sitemap.xml'), xml)
  writeFileSync(out('robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`)
  console.log(`sitemap: ${paths.length} URLs for ${site}`)
}
