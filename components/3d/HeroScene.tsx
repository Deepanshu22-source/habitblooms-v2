'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

function MainOrb() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.15
    meshRef.current.rotation.y = t * 0.2
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.4 + Math.sin(t * 1.5) * 0.2
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#8b5cf6"
        roughness={0.1}
        metalness={0.9}
        emissive="#6d28d9"
        emissiveIntensity={0.4}
      />
    </mesh>
  )
}

function OrbitingOrb({
  radius,
  speed,
  offset,
  color,
  size = 0.18,
}: {
  radius: number
  speed: number
  offset: number
  color: string
  size?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime() * speed + offset
    meshRef.current.position.x = Math.cos(t) * radius
    meshRef.current.position.y = Math.sin(t * 0.6) * radius * 0.4
    meshRef.current.position.z = Math.sin(t) * radius
  })

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          roughness={0}
          metalness={1}
          toneMapped={false}
        />
      </mesh>
    </Float>
  )
}

function Particles() {
  const count = 150
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25
    }
    return pos
  }, [])

  const ref = useRef<THREE.Points>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.01
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a78bfa"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  )
}

function Ring() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.1
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.05
    }
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[3.5, 0.03, 16, 100]} />
      <meshStandardMaterial
        color="#ec4899"
        emissive="#ec4899"
        emissiveIntensity={1}
        transparent
        opacity={0.6}
        toneMapped={false}
      />
    </mesh>
  )
}

function Ring2() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2 + state.clock.getElapsedTime() * 0.07
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.12
    }
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[4.5, 0.02, 16, 100]} />
      <meshStandardMaterial
        color="#10b981"
        emissive="#10b981"
        emissiveIntensity={0.8}
        transparent
        opacity={0.4}
        toneMapped={false}
      />
    </mesh>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#8b5cf6" />
        <pointLight position={[-10, -5, -10]} intensity={1} color="#ec4899" />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#10b981" />

        <MainOrb />
        <Ring />
        <Ring2 />

        <OrbitingOrb radius={3.5} speed={0.5} offset={0} color="#ec4899" size={0.22} />
        <OrbitingOrb radius={3.5} speed={0.5} offset={2.094} color="#10b981" size={0.18} />
        <OrbitingOrb radius={3.5} speed={0.5} offset={4.189} color="#f59e0b" size={0.2} />
        <OrbitingOrb radius={4.5} speed={0.3} offset={1} color="#6366f1" size={0.15} />
        <OrbitingOrb radius={4.5} speed={0.3} offset={3.5} color="#f43f5e" size={0.17} />

        <Particles />
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      </Suspense>
    </Canvas>
  )
}
