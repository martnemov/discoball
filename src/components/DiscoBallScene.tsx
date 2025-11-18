import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
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
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          {/* Яркое освещение с розово-фиолетовым оттенком */}
          <ambientLight intensity={0.6} color="#ff9bd4" />
          
          {/* Верхний неоновый свет */}
          <directionalLight
            position={[0, 10, 0]}
            intensity={3}
            color="#ff6ec4"
          />
          
          {/* Боковые неоновые источники */}
          <pointLight position={[8, 0, 0]} intensity={4} color="#ff6ec4" distance={20} />
          <pointLight position={[-8, 0, 0]} intensity={4} color="#c94ba0" distance={20} />
          <pointLight position={[0, 0, 8]} intensity={3} color="#ff9bd4" distance={20} />
          <pointLight position={[0, 0, -8]} intensity={3} color="#e05bb5" distance={20} />
          
          {/* Нижний свет для подсветки снизу */}
          <pointLight position={[0, -8, 0]} intensity={3} color="#ff80c4" distance={20} />
          
          {/* Дополнительные акцентные точечные источники */}
          <spotLight
            position={[5, 10, 5]}
            angle={0.5}
            penumbra={1}
            intensity={isMaxSpeed ? 8 : 5}
            color="#ffffff"
          />
          
          <spotLight
            position={[-5, 10, -5]}
            angle={0.5}
            penumbra={1}
            intensity={isMaxSpeed ? 6 : 4}
            color="#ff6ec4"
          />
          
          {/* Дискошар */}
          <DiscoBall3D rotationSpeed={rotationSpeed} isMaxSpeed={isMaxSpeed} />
          
          {/* HDR Environment с розово-фиолетовым оттенком */}
          <Environment preset="sunset" background={false} />
          
          {/* Bloom эффект для сияния и ярких бликов */}
          <EffectComposer>
            <Bloom
              intensity={isMaxSpeed ? 3 : 1.8}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              mipmapBlur
              radius={1}
            />
          </EffectComposer>
          
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
      
      {/* Световые лучи (CSS overlay) */}
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
