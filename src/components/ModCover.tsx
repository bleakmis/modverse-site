import type { Mod } from '@/types/mod'

/**
 * Generated placeholder cover (crystal on a gradient). Real cover art from the official mod pages
 * replaces this in Stage 3 — we deliberately don't use random stock images.
 */
export default function ModCover({ mod, className = '' }: { mod: Pick<Mod, 'hue' | 'name'>; className?: string }) {
  const a = `hsl(${mod.hue} 85% 55%)`
  const b = `hsl(${(mod.hue + 60) % 360} 80% 35%)`
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${b}, rgb(var(--c-bg)) 85%)` }}
      role="img"
      aria-label={`${mod.name} cover placeholder`}
    >
      <div
        className="absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-40 blur-3xl"
        style={{ background: a }}
      />
      <svg viewBox="0 0 100 100" className="absolute inset-0 m-auto h-3/5 w-3/5 drop-shadow-2xl" aria-hidden>
        <path d="M50 6 82 50 50 94 18 50Z" fill={a} opacity=".92" />
        <path d="M50 6 62 50 50 94 38 50Z" fill="#fff" opacity=".3" />
        <path d="M18 50H82" stroke="#fff" strokeOpacity=".25" />
      </svg>
    </div>
  )
}
