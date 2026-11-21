import { lazy, Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import HeroBackdrop from './HeroBackdrop'
import SceneBoundary from '@/3d/SceneBoundary'
import { hasWebGL, prefersReducedMotion } from '@/utils/device'

// The whole 3D stack (three + R3F + drei) is a separate chunk, loaded only when needed.
const HeroScene = lazy(() => import('@/3d/HeroScene'))

/**
 * Hero background. Uses the WebGL scene when available; otherwise (no WebGL, reduced motion,
 * runtime error, lost context) falls back to the lightweight CSS/SVG backdrop.
 */
export default function Hero3D({ eventSource }: { eventSource: RefObject<HTMLElement> }) {
  const supported = useMemo(() => hasWebGL() && !prefersReducedMotion(), [])
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(true)
  const wrap = useRef<HTMLDivElement>(null)

  // Stop rendering when the hero scrolls out of view or the tab is hidden.
  useEffect(() => {
    const el = eventSource.current
    if (!el || !supported) return
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [eventSource, supported])

  // Scroll-linked fade + slight parallax of the whole scene.
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 650], [1, 0.15])
  const y = useTransform(scrollY, [0, 650], [0, 110])

  if (!supported || failed) return <HeroBackdrop crystals />

  return (
    <>
      <HeroBackdrop crystals={false} />
      <motion.div
        ref={wrap}
        style={{ opacity, y }}
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <SceneBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            <HeroScene eventSource={eventSource} active={active} onFail={() => setFailed(true)} />
          </Suspense>
        </SceneBoundary>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </>
  )
}
