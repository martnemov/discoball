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

  // Создаем ПЛОТНУЮ сетку мелких зеркальных плиток (50x65 = 3250 плиток)
  const tiles = useMemo(() => {
    const tilesArray = []
    const radius = 2.5
    const rows = 50 // Очень плотная сетка
    const cols = 65 // Много плиток по окружности

    for (let row = 1; row < rows - 1; row++) {
      for (let col = 0; col < cols; col++) {
        const phi = (row / rows) * Math.PI
        const theta = (col / cols) * Math.PI * 2

        // Небольшая рандомизация для естественного вида
        const randomOffset = 0.002
        const phiRand = phi + (Math.random() - 0.5) * randomOffset
        const thetaRand = theta + (Math.random() - 0.5) * randomOffset

        const x = radius * Math.sin(phiRand) * Math.cos(thetaRand)
        const y = radius * Math.cos(phiRand)
        const z = radius * Math.sin(phiRand) * Math.sin(thetaRand)

        const normal = new THREE.Vector3(x, y, z).normalize()

        // Розово-фиолетовая гамма с вариациями
        const hue = 310 + Math.random() * 40 // 310-350 (розовый-пурпурный-фиолетовый)
        const saturation = 70 + Math.random() * 25
        const lightness = 50 + Math.random() * 30

        // Небольшая рандомизация поворота плитки
        const rotRandom = (Math.random() - 0.5) * 0.1

        tilesArray.push({ 
          position: new THREE.Vector3(x, y, z),
          normal: normal,
          color: new THREE.Color().setHSL(hue / 360, saturation / 100, lightness / 100),
          rotationOffset: rotRandom
        })
      }
    }

    return tilesArray
  }, [])

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

      {/* ПЛОТНАЯ СЕТКА мелких зеркальных плиток */}
      {tiles.map((tile, i) => {
        const quaternion = new THREE.Quaternion()
        quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          tile.normal
        )
        const euler = new THREE.Euler().setFromQuaternion(quaternion)
        euler.z += tile.rotationOffset // Добавляем рандомизацию

        return (
          <mesh 
            key={i}
            position={tile.position}
            rotation={euler}
          >
            {/* Очень маленькие тонкие плитки */}
            <boxGeometry args={[0.08, 0.08, 0.01]} />
            <meshPhysicalMaterial
              color={tile.color}
              metalness={1} // Максимальная металличность
              roughness={0.05} // Очень низкая шероховатость = зеркальность
              emissive={isMaxSpeed ? tile.color : new THREE.Color(0, 0, 0)}
              emissiveIntensity={isMaxSpeed ? 1.5 : 0}
              envMapIntensity={5} // Сильные отражения
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
