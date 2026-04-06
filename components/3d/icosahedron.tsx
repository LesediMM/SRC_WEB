"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Edges } from "@react-three/drei"
import type { Group } from "three"

interface IcosahedronProps {
  scale?: number
  color?: string
}

export function Icosahedron({ scale = 1, color = "#ffffff" }: IcosahedronProps) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.2
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.35
    }
  })

  return (
    <group ref={groupRef} scale={scale}>
      <mesh>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial transparent opacity={0} />
        <Edges color={color} lineWidth={2} />
      </mesh>
    </group>
  )
}
