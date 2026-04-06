"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Edges } from "@react-three/drei"
import type { Group } from "three"

interface WireCubeProps {
  scale?: number
  color?: string
}

export function WireCube({ scale = 1, color = "#ffffff" }: WireCubeProps) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.3
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4
    }
  })

  return (
    <group ref={groupRef} scale={scale}>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial transparent opacity={0} />
        <Edges color={color} lineWidth={2} />
      </mesh>
    </group>
  )
}
