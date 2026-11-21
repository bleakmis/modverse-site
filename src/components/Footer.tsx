import { Link } from 'react-router-dom'
import Logo from './Logo'

const cols = [
  {
    title: 'Explore',
    items: [
      { label: 'All Mods', to: '/mods' },
      { label: 'Top 100', to: '/top' },
      { label: 'Compare', to: '/compare' },
      { label: 'Favorites', to: '/favorites' },
    ],
  },
  {
    title: 'MODVERSE',
    items: [
      { label: 'About', to: '/about' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-line/10">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            A discovery platform for Terraria tModLoader mods. Mod pages link out to the official Steam
            Workshop — downloads always happen there.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ink">{c.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {c.items.map((i) => (
                <li key={i.to}>
                  <Link to={i.to} className="text-sm text-muted transition hover:text-neon">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line/10">
        <p className="container-x py-6 text-xs leading-relaxed text-muted">
          © {new Date().getFullYear()} MODVERSE. An unofficial fan project — not affiliated with or endorsed
          by Re-Logic, the tModLoader team, Valve or any mod author. Terraria is a trademark of Re-Logic.
        </p>
      </div>
    </footer>
  )
}
