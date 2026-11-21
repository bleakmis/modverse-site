import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Stage 1 hero backdrop: aurora + grid + mouse-parallax floating crystals (pure CSS/SVG, zero WebGL).
 * Stage 2 replaces/augments this with the Three.js scene from src/3d/ and keeps this as the WebGL fallback.
 */
const crystals = [
  { x: '8%', y: '22%', s: 70, h: 190, d: 0.03 },
  { x: '86%', y: '18%', s: 96, h: 275, d: 0.05 },
  { x: '78%', y: '70%', s: 58, h: 170, d: 0.025 },
  { x: '16%', y: '74%', s: 84, h: 300, d: 0.04 },
  { x: '48%', y: '12%', s: 40, h: 210, d: 0.06 },
]

export default function HeroBackdrop({ crystals: showCrystals = true }: { crystals?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const el = wrap.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const cx = e.clientX - window.innerWidth / 2
      const cy = e.clientY - window.innerHeight / 2
      el.querySelectorAll<HTMLElement>('[data-depth]').forEach((n) => {
        const d = Number(n.dataset.depth)
        n.style.transform = `translate3d(${cx * d}px, ${cy * d}px, 0)`
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduce])

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="aurora absolute inset-0" />
      <div className="grid-lines absolute inset-0" />
      {showCrystals && crystals.map((c, i) => (
        <div
          key={i}
          data-depth={c.d}
          className="absolute transition-transform duration-300 ease-out"
          style={{ left: c.x, top: c.y }}
        >
          <svg
            viewBox="0 0 100 100"
            width={c.s}
            height={c.s}
            className="animate-float drop-shadow-[0_0_24px_rgba(139,92,246,0.7)]"
            style={{ animationDelay: `${i * 0.9}s` }}
          >
            <path d="M50 4 84 50 50 96 16 50Z" fill={`hsl(${c.h} 85% 60%)`} opacity=".75" />
            <path d="M50 4 62 50 50 96 38 50Z" fill="#fff" opacity=".28" />
          </svg>
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </div>
  )
}
