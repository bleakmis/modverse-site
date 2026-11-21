import { Link } from 'react-router-dom'
import { Compass, Database, ShieldCheck } from 'lucide-react'
import Breadcrumbs from '@/components/Breadcrumbs'
import Reveal from '@/components/Reveal'
import { usePageMeta } from '@/hooks/usePageMeta'

const blocks = [
  {
    icon: Compass,
    title: 'Discovery, not distribution',
    text: 'MODVERSE helps you find and compare tModLoader mods. Every download happens on the official Steam Workshop — we never host files.',
  },
  {
    icon: ShieldCheck,
    title: 'Honest data',
    text: 'Links are checked against official Workshop pages. Numbers we cannot verify (downloads, versions, community ratings) are left out instead of invented, and demo content is labelled.',
  },
  {
    icon: Database,
    title: 'Built to grow',
    text: 'The catalog is a local data module today, structured so it can move to an API, Supabase or PostgreSQL later without rewriting the interface.',
  },
]

export default function About() {
  usePageMeta('About', 'About MODVERSE, an unofficial discovery platform for Terraria tModLoader mods.')
  return (
    <div className="container-x max-w-4xl pb-10 pt-28">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
      <h1 className="font-display text-3xl font-black uppercase tracking-wide sm:text-5xl">
        About <span className="text-gradient">MODVERSE</span>
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        MODVERSE is a fan-made platform for exploring the best Terraria modifications through tModLoader: a catalog with instant search, filters, side-by-side
        comparison and a personal favorites list.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {blocks.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.08}>
            <div className="glass h-full rounded-2xl p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-neon/20 to-violet/20 text-neon">
                <b.icon size={22} />
              </span>
              <h2 className="mt-4 font-display text-sm font-bold uppercase tracking-wide">{b.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="glass mt-10 rounded-2xl p-5 text-sm leading-relaxed text-muted">
          MODVERSE is an unofficial project and is not affiliated with or endorsed by Re-Logic, the tModLoader team, Valve or any mod author. Terraria is a trademark of
          Re-Logic. All mod names and content belong to their respective authors.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/mods" className="btn-primary">
            Explore mods
          </Link>
          <Link to="/faq" className="btn-ghost">
            Read the FAQ
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
