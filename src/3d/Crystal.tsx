import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { MathUtils, type Group, type Mesh, type MeshStandardMaterial } from 'three'

export interface CrystalProps {
  position: [number, number, number]
  scale?: number
  color: string
  speed?: number
}

const REPEL_RADIUS = 2.6

/** Floating faceted crystal. Glows on hover, spins up on click, and gently drifts away from the cursor. */
export default function Crystal({ position, scale = 1, color, speed = 0.4 }: CrystalProps) {
  const group = useRef<Group>(null)
  const mesh = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [kick, setKick] = useState(0)

  useFrame((state, dt) => {
    const g = group.current
    const m = mesh.current
    if (!g || !m) return

    // Cursor repel (pointer mapped onto the z=0 plane).
    const px = (state.pointer.x * state.viewport.width) / 2
    const py = (state.pointer.y * state.viewport.height) / 2
    const dx = position[0] - px
    const dy = position[1] - py
    const dist = Math.hypot(dx, dy) || 0.0001
    const push = dist < REPEL_RADIUS ? ((REPEL_RADIUS - dist) / REPEL_RADIUS) * 0.9 : 0
    g.position.x = MathUtils.damp(g.position.x, position[0] + (dx / dist) * push, 4, dt)
    g.position.y = MathUtils.damp(g.position.y, position[1] + (dy / dist) * push, 4, dt)
    g.position.z = position[2]

    // Spin, with a short burst after a click.
    m.rotation.y += dt * (speed + kick * 6)
    if (kick > 0) setKick(Math.max(0, kick - dt * 1.6))

    const target = scale * (hovered ? 1.18 : 1)
    m.scale.x = MathUtils.damp(m.scale.x, target, 6, dt)
    m.scale.y = MathUtils.damp(m.scale.y, target * 1.7, 6, dt)
    m.scale.z = MathUtils.damp(m.scale.z, target, 6, dt)

    const mat = m.material as MeshStandardMaterial
    mat.emissiveIntensity = MathUtils.damp(mat.emissiveIntensity, hovered ? 1.6 : 0.45, 6, dt)
  })

  return (
    <group ref={group} position={position}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={1.1}>
        <mesh
          ref={mesh}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = ''
          }}
          onClick={(e) => {
            e.stopPropagation()
            setKick(1)
          }}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.45}
            metalness={0.35}
            roughness={0.18}
            flatShading
          />
        </mesh>
      </Float>
    </group>
  )
}
