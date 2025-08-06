'use client'
import { Canvas } from '@react-three/fiber'
import { Portfolio3 } from '@/components/Portfolio3'
import { useGLTF, useTexture, OrbitControls, Environment, PerspectiveCamera, CubeCamera, SpotLight } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { useLoader, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useLayoutEffect, useState } from 'react'
import CameraRig from '@/components/CameraRig'
import { easing } from 'maath'
import * as THREE from 'three'
import ShowCase from "@/components/Showcase"
import SecondSec from '@/components/secondsec'
import ContactForm from '@/components/ContactForm'

export default function Home() {
  const [cameraSwayActive, setCameraSwayActive] = useState(false)

  return (
    <>
   <ShowCase />
    <SecondSec/>
    <ContactForm/>
    </>
  )
}
