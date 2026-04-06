"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Edges } from "@react-three/drei"
import type { Group } from "three"

interface TriangleProps {
  scale?: number
  color?: string
}

export function Triangle({ scale = 1, color = "#ffffff" }: TriangleProps) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.3
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25
    }
  })

  return (
    <group ref={groupRef} scale={scale}>
      <mesh>
        <tetrahedronGeometry args={[1.8, 0]} />
        <meshBasicMaterial transparent opacity={0} />
        <Edges color={color} lineWidth={2} />
      </mesh>
    </group>
  )
}
