import { useMemo, useState, type MutableRefObject, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { MathUtils } from 'three'
import Crystal, { type CrystalProps } from './Crystal'
import Island from './Island'
import Artifact from './Artifact'
import Particles from './Particles'
import { getQuality, type Quality } from '@/utils/device'

interface Props {
  /** Element that receives pointer events (the hero section), so the canvas can sit behind the text. */
  eventSource: RefObject<HTMLElement>
  /** Pause rendering when the hero is off-screen. */
  active: boolean
  /** Called if the WebGL context is lost so the page can swap to the CSS fallback. */
  onFail: () => void
}

const CRYSTALS: CrystalProps[] = [
  { position: [-5.2, 2.0, -1], scale: 0.55, color: '#22d3ee', speed: 0.5 },
  { position: [5.4, 2.4, -2], scale: 0.7, color: '#8b5cf6', speed: 0.35 },
  { position: [4.6, -2.3, 0], scale: 0.42, color: '#2dd4bf', speed: 0.6 },
  { position: [-4.4, -2.5, -1], scale: 0.6, color: '#a78bfa', speed: 0.4 },
  { position: [0.4, 3.3, -3], scale: 0.35, color: '#38bdf8', speed: 0.7 },
  { position: [-2.2, -3.2, 1], scale: 0.3, color: '#c084fc', speed: 0.55 },
  { position: [2.6, 0.2, -4], scale: 0.4, color: '#22d3ee', speed: 0.45 },
]

/** Camera parallax: follows the pointer on desktop, idles with a slow drift on touch devices. */
function Rig({ pointerParallax }: { pointerParallax: boolean }) {
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const tx = pointerParallax ? state.pointer.x * 0.9 : Math.sin(t * 0.15) * 0.6
    const ty = pointerParallax ? state.pointer.y * 0.55 : Math.cos(t * 0.12) * 0.3
    state.camera.position.x = MathUtils.damp(state.camera.position.x, tx, 3, dt)
    state.camera.position.y = MathUtils.damp(state.camera.position.y, ty, 3, dt)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function World({ quality }: { quality: Quality }) {
  const vw = useThree((s) => s.viewport.width)
  const narrow = vw < 9 // phones / small tablets in portrait
  // Keep the centre clear for the headline: side objects hug the edges, scaled to the viewport.
  const f = narrow ? Math.max(0.55, vw / 9) : Math.min(1, vw / 14)
  const low = quality === 'low'

  const crystals = useMemo(() => (low ? CRYSTALS.slice(0, 4) : CRYSTALS), [low])
  const spread = (p: [number, number, number]): [number, number, number] => [p[0] * f, p[1], p[2]]

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#e0f2fe" />
      <pointLight position={[-6, -2, 3]} intensity={26} color="#8b5cf6" distance={20} />
      {!low && <pointLight position={[6, 3, 2]} intensity={22} color="#22d3ee" distance={20} />}

      {narrow ? (
        <>
          <Artifact position={[0, 3.6, -4]} scale={0.7} />
          <Island position={[-1.4, -3.5, -1]} scale={0.45} tilt={0.6} />
        </>
      ) : (
        <>
          <Artifact position={[7.6 * f, -1.4, -3]} scale={low ? 0.7 : 0.8} />
          <Island position={[-6.8 * f, -0.4, -2.5]} scale={low ? 0.55 : 0.7} tilt={0.6} />
          {!low && <Island position={[3.4 * f, -3.7, -3]} scale={0.45} tilt={-0.5} />}
        </>
      )}
      {crystals.map((c, i) => (
        <Crystal key={i} {...c} position={spread(c.position)} />
      ))}
      <Particles count={low ? 180 : 650} />
    </>
  )
}

export default function HeroScene({ eventSource, active, onFail }: Props) {
  const quality = useMemo(getQuality, [])
  const maxDpr = quality === 'low' ? 1 : 1.75
  const [dpr, setDpr] = useState(maxDpr)

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 9], fov: 50 }}
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      eventSource={eventSource as MutableRefObject<HTMLElement>}
      eventPrefix="client"
      gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onFail()
        })
      }}
    >
      {/* Adaptive resolution: drop pixel ratio if the frame rate sags, restore if it recovers. */}
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(maxDpr, d + 0.25))}
      />
      <Rig pointerParallax={quality === 'high'} />
      <World quality={quality} />
    </Canvas>
  )
}
