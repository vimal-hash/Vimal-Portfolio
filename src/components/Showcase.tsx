'use client'
import { Canvas } from '@react-three/fiber'
import { Portfolio3 } from '@/components/Portfolio3'
import {  OrbitControls, Environment, PerspectiveCamera, CubeCamera } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { useState, useEffect } from 'react'
import CameraRig from '@/components/CameraRig'
import Link from 'next/link'

export default function Showcase() {
  const [cameraSwayActive, setCameraSwayActive] = useState(false)
    const [showHero, setShowHero] = useState(false)

 // Delay hero text by 8s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHero(true)
    }, 8000) // 8 seconds

    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#fff6ee]">
      {/* HERO TEXT OVERLAY */}
      {showHero && (
      <div className="pointer-events-none absolute left-[-220] top-30 z-20 flex h-full w-full items-center">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="pointer-events-auto max-w-xl">
            {/* <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
              Portfolio
            </p> */}
            <h1 className="leading-tight text-slate-900">
              <span className="block text-3xl font-semibold sm:text-4xl md:text-5xl text-white">
                Hi, my
              </span>
              <span className="block text-4xl font-extrabold sm:text-5xl md:text-6xl text-white">
                name is <span className="text-white">Vimal.</span>
              </span>
            </h1>
            {/* <p className="mt-4 max-w-lg text-base text-slate-600 sm:text-lg text-white">
              I love creating beautiful user experiences.
            </p> */}

            <div className="mt-6 flex gap-3">
              <Link
                 href="#contact"
                className="inline-flex items-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:translate-y-[-1px] hover:bg-orange-600 active:translate-y-0"
              >
                Get in touch
              </Link>
              <Link
                  href="./resume/vimal-frontend-dev.pdf"
  target="_blank"
  rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:translate-y-[-1px] hover:bg-orange-600 active:translate-y-0"
              >
                Resume
              </Link>
              {/* <Link
                href="#work"
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                See my work
              </Link> */}
            </div>
          </div>
        </div>
      </div>
      )}
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


      <EffectComposer enableNormalPass>
        <Bloom luminanceThreshold={0.01} intensity={0.005} mipmapBlur />
        <ToneMapping />
      </EffectComposer>


      <CameraRig active={cameraSwayActive} />
    </Canvas>
   
    </div >
  )
}
