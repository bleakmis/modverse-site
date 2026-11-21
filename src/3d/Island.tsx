import { Float } from '@react-three/drei'

interface Props {
  position: [number, number, number]
  scale?: number
  tilt?: number
}

const trees: Array<[number, number, number, number]> = [
  [-0.7, 0.5, 0.2, 0.9],
  [0.1, 0.55, -0.6, 1.2],
  [0.8, 0.45, 0.4, 0.75],
]

/** A Terraria-style floating island built from primitives: grass top, rocky underside, tiny trees, a crystal. */
export default function Island({ position, scale = 1, tilt = 0 }: Props) {
  return (
    <Float speed={1.1} floatIntensity={1.4} rotationIntensity={0.12}>
      <group position={position} scale={scale} rotation={[0, tilt, 0]}>
        <mesh>
          <cylinderGeometry args={[1.5, 1.35, 0.32, 7]} />
          <meshStandardMaterial color="#14b8a6" emissive="#0f766e" emissiveIntensity={0.35} flatShading />
        </mesh>
        <mesh position={[0, -1.28, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[1.35, 2.2, 7]} />
          <meshStandardMaterial color="#3b2a6e" emissive="#2e1065" emissiveIntensity={0.3} flatShading />
        </mesh>
        {trees.map(([x, y, z, s], i) => (
          <group key={i} position={[x, y, z]} scale={s}>
            <mesh position={[0, -0.12, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 0.25, 5]} />
              <meshStandardMaterial color="#5b3a1e" flatShading />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <coneGeometry args={[0.24, 0.6, 6]} />
              <meshStandardMaterial color="#22c55e" emissive="#14532d" emissiveIntensity={0.4} flatShading />
            </mesh>
          </group>
        ))}
        <mesh position={[0.3, 0.5, -0.1]} scale={[0.14, 0.26, 0.14]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} flatShading />
        </mesh>
      </group>
    </Float>
  )
}
