import { useRef, useMemo } from 'react'
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

  // Создаем плитки ВПЛОТНУЮ друг к другу - рассчитываем точный размер
  const tiles = useMemo(() => {
    const tilesArray = []
    const radius = 2.5
    const rows = 28 // Меньше рядов, но крупнее плитки
    const cols = 38 // Меньше колонок, но крупнее плитки

    for (let row = 1; row < rows - 1; row++) {
      for (let col = 0; col < cols; col++) {
        const phi = (row / rows) * Math.PI
        const theta = (col / cols) * Math.PI * 2

        // БЕЗ рандомизации - плитки точно на своих местах
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)

        const normal = new THREE.Vector3(x, y, z).normalize()

        // Розово-фиолетовая гамма с вариациями
        const hue = 310 + Math.random() * 40
        const saturation = 70 + Math.random() * 25
        const lightness = 50 + Math.random() * 30

        tilesArray.push({ 
          position: new THREE.Vector3(x, y, z),
          normal: normal,
          color: new THREE.Color().setHSL(hue / 360, saturation / 100, lightness / 100)
        })
      }
    }

    return tilesArray
  }, [])

  // Рассчитываем размер плитки чтобы покрыть сферу вплотную
  // Размер плитки = окружность на экваторе / количество плиток
  const tileSize = (2 * Math.PI * 2.5) / 38 * 1.02 // Чуть больше для перекрытия

  return (
    <group ref={groupRef}>
      {/* Основная сфера-основа (немного меньше, чтобы плитки выступали) */}
      <mesh>
        <sphereGeometry args={[2.47, 128, 128]} />
        <meshStandardMaterial
          color="#c94ba0"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Крупные зеркальные плитки ВПЛОТНУЮ друг к другу */}
      {tiles.map((tile, i) => {
        const quaternion = new THREE.Quaternion()
        quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          tile.normal
        )
        const euler = new THREE.Euler().setFromQuaternion(quaternion)

        return (
          <mesh 
            key={i}
            position={tile.position}
            rotation={euler}
          >
            {/* Крупные квадратные плитки, плотно прилегающие */}
            <boxGeometry args={[tileSize, tileSize, 0.015]} />
            <meshPhysicalMaterial
              color={tile.color}
              metalness={1}
              roughness={0.05}
              emissive={isMaxSpeed ? tile.color : new THREE.Color(0, 0, 0)}
              emissiveIntensity={isMaxSpeed ? 1.5 : 0}
              envMapIntensity={5}
              clearcoat={1}
              clearcoatRoughness={0}
              reflectivity={1}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default DiscoBall3D
