import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

/** A glowing rune-ring artifact: a core crystal wrapped in two counter-rotating rings. */
export default function Artifact({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ringA = useRef<Group>(null)
  const ringB = useRef<Group>(null)
  const core = useRef<Group>(null)

  useFrame((state, dt) => {
    if (ringA.current) ringA.current.rotation.z += dt * 0.35
    if (ringB.current) {
      ringB.current.rotation.x += dt * 0.28
      ringB.current.rotation.y -= dt * 0.18
    }
    if (core.current) {
      core.current.rotation.y += dt * 0.5
      core.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.05)
    }
  })

  return (
    <group position={position} scale={scale}>
      <group ref={core}>
        <mesh>
          <icosahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.1} flatShading transparent opacity={0.9} />
        </mesh>
        <mesh scale={0.55}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#e0f2fe" emissive="#22d3ee" emissiveIntensity={1.5} flatShading />
        </mesh>
      </group>
      <group ref={ringA} rotation={[Math.PI / 2.4, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.8, 0.03, 8, 96]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.4} />
        </mesh>
      </group>
      <group ref={ringB} rotation={[0.4, 0.8, 0]}>
        <mesh>
          <torusGeometry args={[2.3, 0.022, 8, 96]} />
          <meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  )
}
