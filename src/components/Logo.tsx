import { Link } from 'react-router-dom'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" aria-label="MODVERSE home" className={`group flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-8 w-8 transition-transform duration-500 group-hover:rotate-12" aria-hidden>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path d="M32 4 56 32 32 60 8 32Z" fill="url(#lg)" />
        <path d="M32 4 41 32 32 60 23 32Z" fill="#fff" opacity=".28" />
      </svg>
      <span className="font-display text-lg font-black tracking-[0.18em] text-ink">
        MOD<span className="text-gradient">VERSE</span>
      </span>
    </Link>
  )
}
