'use client'
import { Canvas } from '@react-three/fiber'
import { Portfolio3 } from '@/components/Portfolio3'
import {  OrbitControls, Environment, PerspectiveCamera, CubeCamera } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import {  useState } from 'react'
import CameraRig from '@/components/CameraRig'
import SecondSec from '@/components/secondsec'

export default function Showcase() {
  const [cameraSwayActive, setCameraSwayActive] = useState(false)

  return (
    <div className="h-screen w-screen">
    <Canvas shadows camera={{ position: [7, 2.5, -5] }} className="h-screen w-screen">
      <ambientLight color="#ffffff" />

      {/* Key lighting for reflections */}

      <directionalLight
        position={[-20, 10, 0]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={10}
        color="#ffffff"
      />
      <OrbitControls enabled={false} target={[0, 0.35, 0]} maxPolarAngle={1.45} />
      <PerspectiveCamera makeDefault fov={50} position={[-4, 3, -9]} />
      <color args={[0, 0, 0]} attach="background" />

      <CubeCamera resolution={256} frames={Infinity}>
        {(texture) => (
          <>
            <Environment map={texture} />
            <Portfolio3 onAnimationComplete={() => setCameraSwayActive(true)} />
          </>
        )}
      </CubeCamera>


      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.01} intensity={0.005} mipmapBlur />
        <ToneMapping />
      </EffectComposer>


      <CameraRig active={cameraSwayActive} />
    </Canvas>
    <SecondSec/>
    </div >
  )
}
