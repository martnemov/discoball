import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'

interface DiscoBall3DProps {
  rotationSpeed: number
  isMaxSpeed: boolean
}

function DiscoBall3D({ rotationSpeed, isMaxSpeed }: DiscoBall3DProps) {
  const groupRef = useRef<THREE.Group>(null!)

  // Анимация вращения
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += (rotationSpeed * delta * 0.1) + 0.01
    }
  })

  // Генерация плиток на сфере (увеличено количество для большей реалистичности)
  const tiles = []
  const radius = 2.5
  const rows = 16
  const cols = 20

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const phi = (row / rows) * Math.PI
      const theta = (col / cols) * Math.PI * 2

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi)
      const z = radius * Math.sin(phi) * Math.sin(theta)

      // Варьируем цвет плиток в розово-пурпурной гамме
      const hue = 318 + Math.random() * 24 // от розового до пурпурного
      const saturation = 70 + Math.random() * 25
      const lightness = 62 + Math.random() * 18

      tiles.push({ 
        id: `${row}-${col}`, 
        x, y, z, 
        phi, theta,
        color: new THREE.Color().setHSL(hue / 360, saturation / 100, lightness / 100)
      })
    }
  }

  return (
    <group ref={groupRef}>
      {/* Основная сфера (розовая основа) */}
      <Sphere args={[2.2, 64, 64]}>
        <meshStandardMaterial
          color="#d946a6"
          metalness={0.85}
          roughness={0.15}
        />
      </Sphere>

      {/* Зеркальные плитки */}
      {tiles.map((tile) => (
        <Box 
          key={tile.id}
          args={[0.23, 0.23, 0.07]}
          position={[tile.x, tile.y, tile.z]}
          rotation={[tile.phi, tile.theta, 0]}
        >
          <meshStandardMaterial
            color={tile.color}
            metalness={0.97}
            roughness={0.03}
            emissive={isMaxSpeed ? tile.color : new THREE.Color(0, 0, 0)}
            emissiveIntensity={isMaxSpeed ? 0.6 : 0}
          />
        </Box>
      ))}

      {/* Внутреннее свечение (усилено) */}
      <pointLight position={[0, 0, 0]} intensity={isMaxSpeed ? 4 : 2.5} color="#ff6ec4" distance={12} />
      <pointLight position={[3, 3, 0]} intensity={1.8} color="#ffb3d9" />
      <pointLight position={[-3, -3, 0]} intensity={1.2} color="#d946a6" />
      <pointLight position={[0, 3, 3]} intensity={1.3} color="#ffa9d8" />
    </group>
  )
}

export default DiscoBall3D
