import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
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

  // Создаем КРУПНЫЕ плитки как на фото
  const tiles = []
  const radius = 2.5
  const rows = 12
  const cols = 16

  for (let row = 1; row < rows - 1; row++) {
    for (let col = 0; col < cols; col++) {
      const phi = (row / rows) * Math.PI
      const theta = (col / cols) * Math.PI * 2

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi)
      const z = radius * Math.sin(phi) * Math.sin(theta)

      const normal = new THREE.Vector3(x, y, z).normalize()

      // Создаем очень разные цвета - от почти белого до темного фиолетового
      const rand = Math.random()
      let hue, saturation, lightness
      
      if (rand < 0.2) {
        // 20% - почти белые/очень светлые плитки
        hue = 320 + Math.random() * 20
        saturation = 20 + Math.random() * 30
        lightness = 80 + Math.random() * 15
      } else if (rand < 0.5) {
        // 30% - светло-розовые
        hue = 315 + Math.random() * 25
        saturation = 60 + Math.random() * 30
        lightness = 65 + Math.random() * 20
      } else if (rand < 0.8) {
        // 30% - средние розово-фиолетовые
        hue = 310 + Math.random() * 30
        saturation = 65 + Math.random() * 25
        lightness = 50 + Math.random() * 20
      } else {
        // 20% - темные фиолетовые
        hue = 280 + Math.random() * 30
        saturation = 70 + Math.random() * 25
        lightness = 30 + Math.random() * 20
      }

      tiles.push({ 
        id: `${row}-${col}`, 
        position: new THREE.Vector3(x, y, z),
        normal: normal,
        color: new THREE.Color().setHSL(hue / 360, saturation / 100, lightness / 100)
      })
    }
  }

  return (
    <group ref={groupRef}>
      {/* Основная розовая стеклянная сфера */}
      <mesh>
        <sphereGeometry args={[2.42, 64, 64]} />
        <meshPhysicalMaterial
          color="#e05bb5"
          metalness={0.7}
          roughness={0.2}
          transparent={true}
          opacity={0.95}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* КРУПНЫЕ зеркальные плитки с золотистыми рамками */}
      {tiles.map((tile) => {
        const quaternion = new THREE.Quaternion()
        quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          tile.normal
        )
        const euler = new THREE.Euler().setFromQuaternion(quaternion)

        return (
          <group key={tile.id}>
            {/* Золотистая рамка/граница плитки */}
            <mesh 
              position={tile.position}
              rotation={euler}
            >
              <boxGeometry args={[0.38, 0.38, 0.015]} />
              <meshStandardMaterial
                color="#b8860b"
                metalness={0.95}
                roughness={0.2}
              />
            </mesh>
            
            {/* Сама зеркальная плитка с сильным блеском */}
            <mesh 
              position={tile.position}
              rotation={euler}
            >
              <boxGeometry args={[0.34, 0.34, 0.02]} />
              <meshPhysicalMaterial
                color={tile.color}
                metalness={1}
                roughness={0}
                emissive={isMaxSpeed ? tile.color : new THREE.Color(0, 0, 0)}
                emissiveIntensity={isMaxSpeed ? 1 : 0}
                envMapIntensity={4}
                clearcoat={1}
                clearcoatRoughness={0}
                reflectivity={1}
              />
            </mesh>
          </group>
        )
      })}

      {/* Очень яркое освещение для бликов */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={isMaxSpeed ? 7 : 5} 
        color="#ffffff" 
        distance={25} 
      />
      <pointLight position={[5, 5, 3]} intensity={3} color="#ffffff" />
      <pointLight position={[-5, -5, -3]} intensity={2.5} color="#ff9bc4" />
      <pointLight position={[3, -3, 5]} intensity={2} color="#ffcce6" />
      <pointLight position={[-3, 3, -5]} intensity={2} color="#ff6ec4" />
    </group>
  )
}

export default DiscoBall3D
