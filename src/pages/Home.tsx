import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Boxes, Compass, Layers, Sparkles, Swords, Users, Wand2, Wrench, Zap, Skull, type LucideIcon } from 'lucide-react'
import Hero3D from '@/components/Hero3D'
import SectionHeading from '@/components/SectionHeading'
import Reveal from '@/components/Reveal'
import ModCard from '@/components/ModCard'
import ModCover from '@/components/ModCover'
import AnimatedCounter from '@/components/AnimatedCounter'
import { mods } from '@/data/mods'
import { categories } from '@/data/categories'
import type { CategoryId } from '@/types/mod'

const catIcons: Record<CategoryId, LucideIcon> = {
  bosses: Skull,
  content: Layers,
  magic: Wand2,
  qol: Sparkles,
  adventure: Compass,
  difficulty: Zap,
  utility: Wrench,
  weapons: Swords,
  exploration: Boxes,
  multiplayer: Users,
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const top10 = mods.slice(0, 10)
  const editors = mods.filter((m) => m.editorsChoice)

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section ref={heroRef} className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-16">
        <Hero3D eventSource={heroRef} />
        <div className="container-x relative z-10 py-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-widest text-neon"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" /> TERRARIA · TMODLOADER
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-5xl font-display text-4xl font-black uppercase leading-[1.08] tracking-wide sm:text-6xl lg:text-7xl"
          >
            Discover the best of <span className="text-gradient">Terraria modding</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.7 }}
            className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg"
          >
            Explore the ultimate collection of tModLoader mods.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.7 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/mods" className="btn-primary w-full sm:w-auto">
              EXPLORE MODS <ArrowRight size={16} />
            </Link>
            <a href="#top10" className="btn-ghost w-full sm:w-auto">
              VIEW TOP 10
            </a>
          </motion.div>
        </div>
      </section>

      {/* ---------- TOP 10 ---------- */}
      <section id="top10" className="section container-x scroll-mt-20">
        <SectionHeading
          eyebrow="Curated list"
          title="Top 10 best mods"
          subtitle="An editorial selection of must-try mods. This is not an official ranking — community-driven rankings arrive with the TOP 100 page."
        />
        <ol className="grid min-w-0 gap-4 sm:grid-cols-2">
          {top10.map((m, i) => (
            <li key={m.id} className="min-w-0 list-none">
              <Reveal delay={(i % 2) * 0.08}>
                <Link
                  to={`/mods/${m.slug}`}
                  className="glass group flex min-w-0 items-center gap-4 rounded-2xl p-3 pr-5 transition duration-300 hover:-translate-y-1 hover:border-neon/50 hover:shadow-glow"
                >
                  <span
                    className={`w-10 shrink-0 text-center font-display text-2xl font-black ${
                      i < 3 ? 'text-gradient' : 'text-muted'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <ModCover mod={m} className="h-16 w-24 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-sm font-bold tracking-wide">{m.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{m.description}</p>
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-neon" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- TRENDING / NEW / COMMUNITY (honest placeholders) ---------- */}
      <section className="section container-x">
        <SectionHeading
          eyebrow="Coming next"
          title="Trending · New · Community favorites"
          subtitle="These sections need real community data (a backend with shared ratings and download stats), so they stay placeholders instead of showing made-up numbers."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {['Trending mods', 'New mods', 'Community favorites'].map((t, i) => (
            <Reveal key={t} delay={i * 0.1}>
              <div className="glass relative overflow-hidden rounded-2xl p-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-widest">{t}</h3>
                <div className="mt-5 space-y-3" aria-hidden>
                  {[0, 1, 2].map((r) => (
                    <div key={r} className="relative h-12 overflow-hidden rounded-xl bg-line/5">
                      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-line/10 to-transparent" />
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted">Demo placeholder — no real data yet.</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- CATEGORIES ---------- */}
      <section className="section container-x">
        <SectionHeading eyebrow="Browse" title="Popular categories" subtitle="Find mods by the kind of experience you want." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => {
            const Icon = catIcons[c.id]
            return (
              <Reveal key={c.id} delay={(i % 5) * 0.05}>
                <Link
                  to={`/mods?cat=${c.id}`}
                  className="glass group flex h-full flex-col rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-violet/60 hover:shadow-glowViolet"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-neon/20 to-violet/20 text-neon transition group-hover:scale-110">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 font-display text-sm font-bold tracking-wide">{c.label}</h3>
                  <p className="mt-1 text-xs text-muted">{c.blurb}</p>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ---------- EDITOR'S CHOICE ---------- */}
      <section className="section container-x">
        <SectionHeading
          eyebrow="Hand-picked"
          title="Editor's choice"
          subtitle="Our editorial picks — chosen by the MODVERSE team, not by user votes."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {editors.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.08}>
              <ModCard mod={m} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="section container-x">
        <Reveal>
          <div className="glass-strong grid gap-8 rounded-3xl p-8 text-center sm:grid-cols-3 sm:p-12">
            {[
              { n: mods.length, l: 'Mods in the catalog' },
              { n: categories.length, l: 'Categories' },
              { n: 5, l: 'Development stages planned' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-gradient font-display text-5xl font-black">
                  <AnimatedCounter to={s.n} />
                </div>
                <p className="mt-2 text-sm text-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <p className="mt-4 text-center text-xs text-muted">
          Real counts from the local catalog. No user, view or download numbers are shown until verified data exists.
        </p>
      </section>
    </>
  )
}
