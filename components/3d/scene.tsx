"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import { MorphingShape } from "./morphing-shape"

interface SceneProps {
  activeSection: number
  position?: "left" | "right" | "center"
}

function SceneContent({ activeSection, position = "center" }: SceneProps) {
  const xOffset = position === "left" ? -3 : position === "right" ? 3 : 0

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      <MorphingShape 
        shapeIndex={activeSection} 
        targetX={xOffset} 
        color="#000000" 
      />
    </>
  )
}

export function Scene({ activeSection, position = "center" }: SceneProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContent activeSection={activeSection} position={position} />
        </Suspense>
      </Canvas>
    </div>
  )
}
