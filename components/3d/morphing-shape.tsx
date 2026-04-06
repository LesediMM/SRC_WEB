"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import gsap from "gsap"

interface MorphingShapeProps {
  shapeIndex: number
  targetX: number
  color?: string
}

// Define vertex positions for each shape (normalized to fit similar bounding boxes)
function getShapeGeometry(index: number): THREE.BufferGeometry {
  switch (index) {
    case 0: // Cube
      return new THREE.BoxGeometry(2, 2, 2)
    case 1: // Icosahedron
      return new THREE.IcosahedronGeometry(1.3, 0)
    case 2: // Tetrahedron (triangular pyramid/prism-like)
      return new THREE.TetrahedronGeometry(1.5, 0)
    case 3: // Octahedron
      return new THREE.OctahedronGeometry(1.4, 0)
    case 4: // Dodecahedron
      return new THREE.DodecahedronGeometry(1.2, 0)
    default:
      return new THREE.BoxGeometry(2, 2, 2)
  }
}

export function MorphingShape({ shapeIndex, targetX, color = "#000000" }: MorphingShapeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)
  const currentShapeRef = useRef(shapeIndex)
  const targetXRef = useRef(targetX)
  const scrollRotationRef = useRef({ x: 0, y: 0 })
  const lastScrollYRef = useRef(0)

  // Create edge geometry from shape
  const createEdges = (geometry: THREE.BufferGeometry) => {
    return new THREE.EdgesGeometry(geometry)
  }

  // Initialize with first shape
  const initialGeometry = useMemo(() => getShapeGeometry(0), [])
  const initialEdges = useMemo(() => createEdges(initialGeometry), [initialGeometry])

  // Animate position sliding
  useEffect(() => {
    if (!groupRef.current) return
    
    gsap.to(groupRef.current.position, {
      x: targetX,
      duration: 0.8,
      ease: "power2.out"
    })
    targetXRef.current = targetX
  }, [targetX])

  // Animate shape morphing with sliding and falling
  useEffect(() => {
    if (!meshRef.current || !edgesRef.current || !groupRef.current) return
    if (currentShapeRef.current === shapeIndex) return

    const newGeometry = getShapeGeometry(shapeIndex)
    const newEdges = createEdges(newGeometry)

    // Timeline: slide down, morph, slide back up with settling
    const tl = gsap.timeline()

    // Phase 1: Slide down while rotating
    tl.to(
      groupRef.current.position,
      {
        y: -3,
        duration: 0.5,
        ease: "power2.in",
      },
      0
    )

    // Phase 2: While sliding, scale down and morph (happens during slide)
    tl.to(
      groupRef.current.scale,
      {
        x: 0.3,
        y: 0.3,
        z: 0.3,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          if (meshRef.current) {
            meshRef.current.geometry.dispose()
            meshRef.current.geometry = newGeometry
          }
          if (edgesRef.current) {
            edgesRef.current.geometry.dispose()
            edgesRef.current.geometry = newEdges
          }
        },
      },
      0.1
    )

    // Phase 3: Scale back up while sliding into position
    tl.to(
      groupRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      },
      0.5
    )

    // Phase 4: Slide back up into resting position
    tl.to(
      groupRef.current.position,
      {
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      },
      0.5
    )

    currentShapeRef.current = shapeIndex
  }, [shapeIndex])



  // Add scroll listener for rotation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - lastScrollYRef.current
      
      // Apply scroll rotation - user scrolling rotates the object
      scrollRotationRef.current.y += scrollDelta * 0.005
      
      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Floating animation combined with scroll rotation
  useFrame((state) => {
    if (groupRef.current) {
      // Apply scroll-based rotation
      groupRef.current.rotation.y = scrollRotationRef.current.y
      
      // Add slight floating motion to y position
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={[targetX, 0, 0]}>
      <mesh ref={meshRef} geometry={initialGeometry}>
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <lineSegments ref={edgesRef} geometry={initialEdges}>
        <lineBasicMaterial color={color} linewidth={2} />
      </lineSegments>
    </group>
  )
}
