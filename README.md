# MODVERSE

Discovery platform for Terraria **tModLoader** mods. React + TypeScript + Vite + Tailwind CSS + Framer Motion.

> Status: **v1.0 — all 5 stages complete** (foundation, 3D hero, catalog, search, filters, mod pages, TOP 100, favorites, ratings, compare, toasts, QA, Vercel-ready). See "Roadmap".

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # generates sitemap, type-checks, builds to dist/
SITE_URL=https://your-domain.com npm run build   # sitemap, robots.txt, canonical and og:url for your domain
npm run preview    # serve the production build
```

Requires Node 20+ (tested on Node 22).

## Deploy to Vercel (HTTPS included)

1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New → Project**, import the repo. Framework preset: **Vite** (auto-detected from `vercel.json`).
3. Click **Deploy**. Vercel serves the site over HTTPS with a free SSL certificate automatically.
4. Custom domain: Project → **Settings → Domains → Add**, then set the DNS records Vercel shows. SSL is issued automatically.
5. Optional: set `SITE_URL` (Project → Settings → Environment Variables) to your custom domain. Without it the build uses Vercel's production domain automatically; with neither (local build) no sitemap is written, because a sitemap needs real absolute URLs.
6. Check after deploy: open `/mods/calamity-mod` directly (SPA rewrite), `/nope` (404 page), `/sitemap.xml`, and the padlock in the address bar (HTTPS).

SPA routing is handled by the rewrite rule in `vercel.json`. Note: `npm run dev` / `preview` run on plain HTTP locally; HTTPS exists only on the hosted site.

## Structure

```
src/
  components/  reusable UI (Navbar, Footer, ModCard, Reveal, ...)
  pages/       route pages (Home, Catalog, Search, ModDetail, Top100, Favorites, Compare, About, Faq, NotFound)
  layouts/     MainLayout (navbar + outlet + footer)
  hooks/       useTheme, useFavorites, useRatings, useCompare, useToast, useModActions, ...
  data/        mods.ts, categories.ts (local DB; swap for API/Supabase later)
  types/       shared TypeScript types
  utils/       steam links, search.ts (instant search + scoring), catalog.ts (filter/sort)
  3d/          Three.js scene: HeroScene, Crystal, Island, Artifact, Particles
  styles/      Tailwind + theme CSS variables
```

## Data honesty

- No ratings, downloads or user counts are invented; those fields are empty until verified data exists.
- Steam links are direct Workshop item links; each ID was checked against the official Workshop page title (Nov 2026).
- Versions and compatibility are not shown (they change often and were not reliably verifiable); mod pages point to the Workshop for them.
- Sorting by Popularity / Highest Rated / Most Downloaded is implemented but disabled until the data exists. "Recently Added" means date added to MODVERSE, not release date.
- Magic and Multiplayer categories are empty on purpose (no verified mod assigned yet) and shown disabled.
- Cover images are generated placeholders until official art is added.

- **TOP 100 is an editorial list**, not a popularity ranking: it shows only the mods verified so far ("Showing N of 100 planned places").
- **Ratings are local**: "Your rating" is stored in your browser (LocalStorage) and is never presented as a community rating.
- Favorites and the compare list (max 4) are also stored locally in LocalStorage.
- "Number of bosses" and compatibility rows in Compare say "Not verified yet" until verified data exists.

## Features

- Premium dark/neon UI with light theme, animated page transitions, preloader, skeleton loading, toasts
- Lazy-loaded 3D hero (React Three Fiber) with WebGL / reduced-motion / error / context-loss fallbacks
- Catalog with category filters (match any/all), text search, sorting; state lives in the URL (shareable)
- Instant search overlay (`/` or Ctrl/Cmd+K): scoring, typo-tolerant normalization, highlighting, keyboard control
- Mod pages with direct Steam Workshop links, features, similar mods, breadcrumbs, SEO titles
- TOP 100 (editorial), Favorites, Compare (up to 4), local "Your rating" — all in LocalStorage
- About and FAQ pages, 404 page, accessible markup (aria labels, focus states, skip link)
- Vercel-ready: SPA rewrite, immutable asset caching, security headers, sitemap/robots/OG tags

## Dependencies

Runtime: react, react-dom, react-router-dom, framer-motion, three, @react-three/fiber, @react-three/drei, lucide-react.
Dev: vite, @vitejs/plugin-react, typescript, tailwindcss, postcss, autoprefixer, @types/*.
External services: Google Fonts (Inter, Orbitron; the site works with fallback fonts if blocked). No backend, no API keys.

## Tests run (headless Chrome, 1440px and 390px)

- 288 crawl checks: every route and mod page — no horizontal scroll, one h1, title set, safe external links, alt text, no console errors.
- 53 functional checks: all internal links resolve, 404, theme persistence, search overlay (Ctrl+K, instant results, empty state, Esc, keyboard select), catalog filters/match mode/URL state/empty category/sorting, Steam links, ratings, favorites, compare (limit 4, persistence), TOP 100 tabs, FAQ, mobile menu, history.
- `tsc` strict typecheck and production build pass; `npm audit --omit=dev` reports 0 vulnerabilities (react-router 7.18).

## Roadmap

1. Foundation & design ✅
2. 3D scene (Three.js / React Three Fiber) ✅
3. Catalog, search, filters, mod pages ✅
4. TOP 100, favorites, ratings, compare, toasts ✅
5. Final QA and production polish ✅

Next (not built yet): real backend (Supabase/PostgreSQL) for community ratings and accounts, verified versions/downloads, more mods.

## 3D notes

- The 3D stack is lazy-loaded (separate ~830 kB / ~224 kB gzip chunk), so first paint does not wait for it.
- Fallback to a CSS/SVG backdrop when WebGL is unavailable, `prefers-reduced-motion` is on, the scene throws, or the GL context is lost.
- Low-power devices (phones, <=4 cores, <=4 GB RAM) get fewer objects/particles, no antialiasing, DPR 1 and no pointer parallax.
- Rendering pauses when the hero is off-screen; DPR adapts automatically if FPS drops.
