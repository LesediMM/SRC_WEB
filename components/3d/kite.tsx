"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Edges } from "@react-three/drei"
import type { Group } from "three"
import * as THREE from "three"

interface KiteProps {
  scale?: number
  color?: string
}

export function Kite({ scale = 1, color = "#ffffff" }: KiteProps) {
  const groupRef = useRef<Group>(null)

  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 2)
    shape.lineTo(1.2, 0.5)
    shape.lineTo(0, -2)
    shape.lineTo(-1.2, 0.5)
    shape.closePath()

    const extrudeSettings = {
      depth: 0.3,
      bevelEnabled: false,
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.25
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={groupRef} scale={scale}>
      <mesh geometry={geometry}>
        <meshBasicMaterial transparent opacity={0} />
        <Edges color={color} lineWidth={2} />
      </mesh>
    </group>
  )
}
