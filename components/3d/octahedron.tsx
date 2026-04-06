"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Edges } from "@react-three/drei"
import type { Group } from "three"

interface OctahedronProps {
  scale?: number
  color?: string
}

export function Octahedron({ scale = 1, color = "#ffffff" }: OctahedronProps) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.35
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef} scale={scale}>
      <mesh>
        <octahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial transparent opacity={0} />
        <Edges color={color} lineWidth={2} />
      </mesh>
    </group>
  )
}
