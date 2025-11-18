import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import DiscoBall3D from './DiscoBall3D'
import './DiscoBallScene.css'

interface DiscoBallSceneProps {
  rotationSpeed: number
  onClick: () => void
  isMaxSpeed: boolean
}

function DiscoBallScene({ rotationSpeed, onClick, isMaxSpeed }: DiscoBallSceneProps) {
  return (
    <div 
      className={`disco-scene-wrapper ${isMaxSpeed ? 'max-speed' : ''}`}
      onClick={onClick}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
      >
        <Suspense fallback={null}>
          {/* Основное освещение */}
          <ambientLight intensity={0.5} />
          
          {/* Направленные источники света */}
          <directionalLight position={[5, 8, 5]} intensity={2} color="#ffffff" />
          <directionalLight position={[-5, 3, -3]} intensity={1} color="#ff9a9e" />
          <directionalLight position={[0, -5, 2]} intensity={1.5} color="#ff6ec4" />
          
          {/* Spot light */}
          <spotLight
            position={[0, 10, 0]}
            angle={0.6}
            penumbra={1}
            intensity={isMaxSpeed ? 4 : 2.5}
            color="#ffa9d8"
          />
          
          {/* Дискошар */}
          <DiscoBall3D rotationSpeed={rotationSpeed} isMaxSpeed={isMaxSpeed} />
          
          {/* Контролы */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      
      {/* Световые лучи */}
      <div className="light-rays">
        <div className="light-ray ray-1"></div>
        <div className="light-ray ray-2"></div>
        <div className="light-ray ray-3"></div>
        <div className="light-ray ray-4"></div>
      </div>
    </div>
  )
}

export default DiscoBallScene
