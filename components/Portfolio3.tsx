"use client"
import * as THREE from 'three'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MeshReflectorMaterial, useGLTF, useKTX2 } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { applyLiteMaterials } from './hero-lite-material'

const DRACO_DECODER_PATH = '/decoders/draco/'
const BASIS_TRANSCODER_PATH = '/decoders/basis/'

const SHELF_LIGHT = { intensity: 10, color: '#96DCFF' }

type GLTFResult = {
  nodes: Record<string, THREE.Mesh>
  materials: Record<string, THREE.Material>
}

interface Portfolio3Props {
  onAnimationComplete?: () => void
  isMobile: boolean
}

export function Portfolio3({ onAnimationComplete, isMobile }: Portfolio3Props) {
  const { nodes, materials } = useGLTF(isMobile ? '/Portfolio3-mobile.glb' : '/Portfolio3-draco.glb', DRACO_DECODER_PATH) as unknown as GLTFResult

  const cdiffuse = useKTX2('/Cw/diffuse.ktx2', BASIS_TRANSCODER_PATH)
  const wdiffuse = useKTX2('/Wood/diff.ktx2', BASIS_TRANSCODER_PATH)
  const warm = useKTX2('/Wood/arm.ktx2', BASIS_TRANSCODER_PATH)

  const groupRef = useRef<THREE.Group>(null!)
  const groupRef1 = useRef<THREE.Group>(null!)
  const shelftoplight = useRef<THREE.MeshBasicMaterial>(null!)
  const Lefttoplight = useRef<THREE.MeshBasicMaterial>(null!)
  const tri7 = useRef<THREE.MeshBasicMaterial>(null!)
  const tri8 = useRef<THREE.MeshBasicMaterial>(null!)
  const tri9 = useRef<THREE.MeshBasicMaterial>(null!)

  const [ready, setReady] = useState(false)
  const { camera, gl, scene, invalidate } = useThree()

  // Camera sway starts once the desktop intro has settled. Phones have no intro.
  useEffect(() => {
    if (isMobile) {
      onAnimationComplete?.()
      return
    }
    const timeout = setTimeout(() => onAnimationComplete?.(), 8000)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  useEffect(() => {
    cdiffuse.wrapS = cdiffuse.wrapT = THREE.RepeatWrapping
    cdiffuse.repeat.set(2, 2)
    cdiffuse.needsUpdate = true
    cdiffuse.colorSpace = THREE.SRGBColorSpace
    wdiffuse.colorSpace = THREE.SRGBColorSpace
    warm.colorSpace = THREE.SRGBColorSpace
  }, [cdiffuse, wdiffuse, warm])

  useEffect(() => {
    tri7.current.color.set(120, 120, 120)
    tri8.current.color.set(120, 120, 120)
    tri9.current.color.set(120, 120, 120)
    const shelf = setTimeout(() => shelftoplight.current?.color.set(60, 60, 60), 1400)
    const left = setTimeout(() => Lefttoplight.current?.color.set(229, 204, 167), 1600)
    return () => {
      clearTimeout(shelf)
      clearTimeout(left)
    }
  }, [])

  // The logos are tiny details, and the camera barely moves, so their shadows only cost time.
  useEffect(() => {
    if (isMobile) return
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name.includes('Curve')) {
        child.castShadow = false
        child.receiveShadow = false
      }
    })
  }, [isMobile])

  // Compile up front, so about 80 materials don't freeze the first frames of the intro.
  useEffect(() => {
    if (isMobile) return
    gl.compileAsync(scene, camera).catch(() => {})
  }, [gl, scene, camera, isMobile])

  useLayoutEffect(() => {
    const show = setTimeout(() => setReady(true), 50)
    if (isMobile) return () => clearTimeout(show)

    const lights: THREE.PointLight[] = []
    groupRef1.current.traverse((child) => {
      if ((child as THREE.PointLight).isPointLight) lights.push(child as THREE.PointLight)
    })
    const intro = gsap.timeline()
    intro.fromTo(lights, { intensity: 0 }, { intensity: SHELF_LIGHT.intensity, duration: 1, ease: 'power2.out' }, 3)
    return () => {
      clearTimeout(show)
      intro.kill()
    }
  }, [isMobile])

  useEffect(() => {
    if (!isMobile) return
    const dispose = applyLiteMaterials([groupRef.current, groupRef1.current])
    invalidate()
    return dispose
  }, [isMobile, invalidate, cdiffuse, wdiffuse])

  return (
    <>
      <group ref={groupRef} visible={ready}>
        <mesh castShadow name="Cube007" geometry={nodes.Cube007.geometry} position={[-0.019, 0.122, 3.471]} rotation={[0, Math.PI / 2, 0]} >
          <meshBasicMaterial  ref={tri7} toneMapped={false} />
        </mesh>
        <mesh castShadow name="Cube008" geometry={nodes.Cube008.geometry} position={[-2.096, 0.122, -1.017]} rotation={[0, -0.402, 0]} >
          <meshBasicMaterial ref={tri8} toneMapped={false} />
        </mesh>
        <mesh castShadow name="Cube009" geometry={nodes.Cube009.geometry} position={[2.058, 0.122, -1.036]} rotation={[0, 0.402, 0]} >
          <meshBasicMaterial ref={tri9} toneMapped={false} />
        </mesh>
        <mesh name="Cylinder" geometry={nodes.Cylinder.geometry} material={materials['Material.019']} position={[0, 0.519, 0]} rotation={[0, -0.178, 0]} />
        <mesh name="Cylinder003" geometry={nodes.Cylinder003.geometry} material={materials['Material.020']} position={[0, 0.667, 0]} />
        <mesh castShadow receiveShadow name="Cylinder002" geometry={nodes.Cylinder002.geometry} material={materials['Material.003']} position={[0, 0.087, -0.056]} scale={[5.607, 0.067, 5.607]} />
      </group>
      <group ref={groupRef1} visible={ready}>
        <mesh name="Cube002" geometry={nodes.Cube002.geometry} material={materials['Material.009']} position={[7.048, 0.664, -1.984]} />
        <mesh name="Cube003" geometry={nodes.Cube003.geometry} material={materials['Material.014']} position={[7.124, 1.23, -2.215]} rotation={[0, 0.365, 0]} />
        <mesh name="Cube005" geometry={nodes.Cube005.geometry} material={materials['Material.014']} position={[7.313, 1.238, -0.467]} />
        <mesh name="Cube010" geometry={nodes.Cube010.geometry} material={materials['Material.007']} position={[0.044, 1.902, 6.812]} />
        <mesh name="Cube011" geometry={nodes.Cube011.geometry} material={materials['Material.007']} position={[-1.475, 1.902, 6.749]} />
        <mesh name="Cube012" geometry={nodes.Cube012.geometry} material={materials['Material.007']} position={[-2.946, 1.902, 6.527]} />
        <mesh name="Cube013" geometry={nodes.Cube013.geometry} material={materials['Material.007']} position={[-4.401, 1.902, 6.16]} rotation={[0, -0.085, 0]} />
        <mesh name="Cube014" geometry={nodes.Cube014.geometry} material={materials['Material.007']} position={[-5.801, 1.902, 5.657]} rotation={[0, -0.085, 0]} />
        <mesh name="Cube015" geometry={nodes.Cube015.geometry} material={materials['Material.007']} position={[1.554, 1.902, 6.767]} />
        <mesh name="Cube016" geometry={nodes.Cube016.geometry} material={materials['Material.007']} position={[3.049, 1.902, 6.528]} />
        <mesh name="Cube017" geometry={nodes.Cube017.geometry} material={materials['Material.007']} position={[4.486, 1.902, 6.137]} />
        <mesh name="Cube018" geometry={nodes.Cube018.geometry} material={materials['Material.007']} position={[5.88, 1.902, 5.587]} />
        <mesh name="Cube019" geometry={nodes.Cube019.geometry} position={[0, 3.69, 7.153]} >
          <meshBasicMaterial ref={shelftoplight} toneMapped={false} />
        </mesh>
        <mesh name="Cube021" geometry={nodes.Cube021.geometry} position={[0, 1.772, 7.305]} scale={[1.04, 1, 1]} >
          <meshStandardMaterial
            map={wdiffuse}
            metalnessMap={warm}
            displacementScale={0.03}
            displacementBias={-0.05}
            aoMapIntensity={1}
            roughness={0.5}
            metalness={100}
            color="#ffffff"
          />
        </mesh>
        <mesh name="Cube024" geometry={nodes.Cube024.geometry} position={[7.431, 3.606, -1.007]} rotation={[0.003, 0, 0]} >
          <meshBasicMaterial ref={Lefttoplight} toneMapped={false} />
        </mesh>
        <mesh castShadow receiveShadow name="Cylinder001" geometry={nodes.Cylinder001.geometry} material={materials['Material.021']} position={[0, 0.314, 0]} >
        </mesh>
        <mesh name="Plane004" geometry={nodes.Plane004.geometry} material={materials['Material.015']} position={[7.287, 1.233, -0.466]} rotation={[0, 0, -Math.PI / 2]} />
        <mesh name="Plane005" geometry={nodes.Plane005.geometry} material={materials['Material.015']} position={[7.083, 1.226, -1.947]} rotation={[-Math.PI, 0.45, Math.PI / 2]} />
        <mesh name="books" geometry={nodes.books.geometry} material={materials['Material.034']} position={[7.486, 2.345, -2.989]} rotation={[-1.571, 0.004, 0.011]} />
        <mesh name="Catcus" geometry={nodes.Catcus.geometry} material={materials['Material.033']} position={[7.486, 2.345, -2.989]} rotation={[-1.571, 0.004, 0.011]} />
        <mesh name="chair" geometry={nodes.chair.geometry} material={materials['Material.010']} position={[5.701, 0.224, -0.663]} rotation={[Math.PI, -0.011, Math.PI]} />
        <mesh name="mouse" geometry={nodes.mouse.geometry} material={materials['Material.013']} position={[6.368, 0.013, 1.149]} rotation={[Math.PI, -0.011, Math.PI]} />
        <mesh name="penguin" geometry={nodes.penguin.geometry} material={nodes.penguin.material} position={[6.303, 0.828, -2.613]} rotation={[Math.PI, -1.186, Math.PI]}>
          <mesh name="penguin-wing-0" geometry={nodes['penguin-wing-0'].geometry} material={nodes['penguin-wing-0'].material} />
          <mesh name="penguin-wing-1" geometry={nodes['penguin-wing-1'].geometry} material={nodes['penguin-wing-1'].material} />
        </mesh>
        <mesh name="picture" geometry={nodes.picture.geometry} material={materials['Material.018']} position={[7.638, 2.13, 0.711]} rotation={[Math.PI, -0.011, Math.PI]} />
        <mesh name="picture001" geometry={nodes.picture001.geometry} material={materials['Material.017']} position={[7.621, 2.165, 0.711]} rotation={[Math.PI, -0.011, Math.PI]} />
        <mesh name="plant" geometry={nodes.plant.geometry} material={materials['Material.016']} position={[6.833, 0.18, 1.463]} rotation={[Math.PI, -0.011, Math.PI]} />
        <mesh name="plant001" geometry={nodes.plant001.geometry} material={materials['Material.011']} position={[6.833, 0.18, 1.463]} rotation={[Math.PI, -0.011, Math.PI]} />
        <mesh name="speaker" geometry={nodes.speaker.geometry} material={nodes.speaker.material} position={[5.844, 0.732, -2.568]} rotation={[0, -1, 0.049]} />
        <mesh name="Table_small" geometry={nodes.Table_small.geometry} material={nodes.Table_small.material} position={[7.486, 2.345, -2.989]} rotation={[-1.571, 0.004, 0.011]} />
        <mesh name="Catcus_leaf" geometry={nodes.Catcus_leaf.geometry} material={materials['Material.032']} position={[7.486, 2.345, -2.989]} rotation={[-1.571, 0.004, 0.011]} />
        <mesh name="Cube" geometry={nodes.Cube.geometry} position={[0.087, 1.863, 7.487]} scale={[7.081, 1.809, 0.058]} >
          <meshStandardMaterial
            map={cdiffuse}
            roughness={1}
            metalness={0.8}
            color="#111111"
          />
        </mesh>
        <mesh name="Cube027" geometry={nodes.Cube027.geometry} position={[7.692, 1.904, -0.998]} scale={[0.032, 1.856, 6.427]} >
          <meshStandardMaterial color="#101010" roughness={0.8} />
        </mesh>
        <mesh
          
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.001, 0]}
         
        >
          <planeGeometry args={[30, 30]} />
          {isMobile ? (
            <meshStandardMaterial color="#101010" roughness={0.8} metalness={0.7} />
          ) : (
          <MeshReflectorMaterial
            mirror={1}
            blur={[300, 250]}
            resolution={512}
            mixBlur={1}
            mixStrength={10}
            roughness={1}
            depthScale={0.5}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.25}
            color="#101010"
            metalness={0.7}
          />
          )}
        </mesh>
                <mesh name="Cube006" geometry={nodes.Cube006.geometry} material={materials['Material.005']} position={[6.805, 0.753, -0.41]} rotation={[-Math.PI, 0, -Math.PI]} scale={[-0.17, -0.026, -0.539]} />
        <mesh name="Cube028" geometry={nodes.Cube028.geometry} material={materials['Material.036']} position={[0.042, 1.857, 7.129]} scale={[0.047, 1.771, 0.263]} />
        <mesh name="Cube030" geometry={nodes.Cube030.geometry} material={materials['Material.036']} position={[-1.547, 1.857, 7.08]} rotation={[0, -0.201, 0]} scale={[0.047, 1.771, 0.263]} />
        <mesh name="Cube031" geometry={nodes.Cube031.geometry} material={materials['Material.036']} position={[-3.026, 1.857, 6.808]} rotation={[0, -0.375, 0]} scale={[0.047, 1.771, 0.263]} />
        <mesh name="Cube032" geometry={nodes.Cube032.geometry} material={materials['Material.036']} position={[-4.501, 1.857, 6.452]} rotation={[0, -0.395, 0]} scale={[0.047, 1.771, 0.263]} />
        <mesh name="Cube033" geometry={nodes.Cube033.geometry} material={materials['Material.036']} position={[-5.962, 1.857, 5.961]} rotation={[0, -0.435, 0]} scale={[0.047, 1.771, 0.263]} />
        <mesh name="Cube034" geometry={nodes.Cube034.geometry} material={materials['Material.036']} position={[1.599, 1.857, 7.063]} rotation={[0, 0.038, 0]} scale={[0.047, 1.771, 0.263]} />
        <mesh name="Cube035" geometry={nodes.Cube035.geometry} material={materials['Material.036']} position={[3.094, 1.857, 6.843]} rotation={[0, 0.261, 0]} scale={[0.047, 1.771, 0.263]} />
        <mesh name="Cube036" geometry={nodes.Cube036.geometry} material={materials['Material.036']} position={[4.566, 1.857, 6.454]} rotation={[0, 0.357, 0]} scale={[0.047, 1.771, 0.263]} />
        <mesh name="Cube037" geometry={nodes.Cube037.geometry} material={materials['Material.036']} position={[5.984, 1.857, 5.895]} rotation={[0, 0.361, 0]} scale={[0.047, 1.771, 0.263]} />
        <mesh name="Cube038" geometry={nodes.Cube038.geometry} material={materials['Material.036']} position={[-7.661, 1.857, 5.185]} rotation={[0, -0.435, 0]} scale={[0.047, 1.771, 0.263]} />
        <mesh name="Cube039" geometry={nodes.Cube039.geometry} position={[-7.623, 1.904, -0.998]} rotation={[Math.PI, -0.001, Math.PI]} scale={[0.032, 1.856, 6.427]} >
         <meshStandardMaterial color="#101010" roughness={0.8} />
        </mesh>
        <mesh name="Face_new" geometry={nodes.Face_new.geometry} material={materials['Material.030']} position={[5.777, 1.751, 0.932]} rotation={[1.549, -0.036, -2.124]} />
        <mesh name="Hair" geometry={nodes.Hair.geometry} material={materials['Material.027']} position={[5.725, 0.407, 0.964]} rotation={[-Math.PI, 0.94, -Math.PI]} />
        <mesh name="Hand" geometry={nodes.Hand.geometry} material={materials['Material.026']} position={[5.729, 0.322, 0.961]} rotation={[-Math.PI, 0.94, -Math.PI]} />
        <mesh name="Leg" geometry={nodes.Leg.geometry} material={materials['Material.028']} position={[5.722, 0.322, 0.966]} rotation={[-Math.PI, 0.94, -Math.PI]} />
        <mesh name="Pant" geometry={nodes.Pant.geometry} material={materials['Material.025']} position={[5.722, 0.322, 0.966]} rotation={[-Math.PI, 0.94, -Math.PI]} />
        <mesh name="Shirt" geometry={nodes.Shirt.geometry} material={materials['Material.024']} position={[5.722, 0.322, 0.966]} rotation={[-Math.PI, 0.94, -Math.PI]} />
        <mesh name="Curve" geometry={nodes.Curve.geometry} material={materials['SVGMat.001']} position={[3.838, 2.434, 6.611]} rotation={[-1.58, -0.004, 0.434]} >
          <pointLight  intensity={10} color="#96DCFF" position={[0, -0.2, 1.2]} />
        </mesh>
        <group name="Curve001" position={[-2.178, 2.56, 7.079]} rotation={[1.585, 0.001, -3.139]}>
          <mesh name="Curve002_1" geometry={nodes.Curve002_1.geometry} material={materials['Material.006']} >
        </mesh>
          <mesh name="Curve002_2" geometry={nodes.Curve002_2.geometry} material={materials['Material.023']} />
          <pointLight  intensity={10} color="#96DCFF" position={[0.15, 0, -1.1]} />
        </group>
        <mesh name="Curve002" geometry={nodes.Curve002.geometry} material={materials['Material.031']} position={[-0.728, 2.526, 7.038]} rotation={[-1.551, 0, 0]} >
          <pointLight   intensity={10} color="#96DCFF" position={[-0.1, 0, 1.2]} />
        </mesh>
        <group name="Curve003" position={[-3.833, 2.53, 6.689]} rotation={[1.568, -0.006, -2.725]}>
          <mesh name="Curve008_1" geometry={nodes.Curve008_1.geometry} material={materials['SVGMat.009']} />
          <mesh name="Curve008_2" geometry={nodes.Curve008_2.geometry} material={materials['SVGMat.010']} />
          <mesh name="Curve008_3" geometry={nodes.Curve008_3.geometry} material={materials['SVGMat.011']} />
          <pointLight  intensity={10} color="#96DCFF" position={[0, 0, -1.1]} />
        </group>
        <group name="Curve004" position={[-6.78, 0.804, 5.681]} rotation={[1.571, -0.002, -2.743]}>
                    <mesh name="Curve011_1" geometry={nodes.Curve011_1.geometry} material={materials['SVGMat.013']} />
          <mesh name="Curve011_2" geometry={nodes.Curve011_2.geometry} material={materials['SVGMat.014']} />
          <mesh name="Curve011_3" geometry={nodes.Curve011_3.geometry} material={materials['SVGMat.015']} />
          <mesh name="Curve011_4" geometry={nodes.Curve011_4.geometry} material={materials['SVGMat.016']} />
          <mesh name="Curve011_5" geometry={nodes.Curve011_5.geometry} material={materials['SVGMat.017']} />
          <mesh name="Curve011_6" geometry={nodes.Curve011_6.geometry} material={materials['SVGMat.018']} />
          <mesh name="Curve011_7" geometry={nodes.Curve011_7.geometry} material={materials['SVGMat.019']} />
          <mesh name="Curve011_8" geometry={nodes.Curve011_8.geometry} material={materials['SVGMat.020']} />
          <mesh name="Curve011_9" geometry={nodes.Curve011_9.geometry} material={materials['SVGMat.021']} />
          <mesh name="Curve011_10" geometry={nodes.Curve011_10.geometry} material={materials['SVGMat.022']} />
          <mesh name="Curve011_11" geometry={nodes.Curve011_11.geometry} material={materials['SVGMat.023']} />
          <mesh name="Curve011_12" geometry={nodes.Curve011_12.geometry} material={materials['SVGMat.024']} />
          <mesh name="Curve011_13" geometry={nodes.Curve011_13.geometry} material={materials['SVGMat.025']} />
          <mesh name="Curve011_14" geometry={nodes.Curve011_14.geometry} material={materials['SVGMat.026']} />
          <mesh name="Curve011_15" geometry={nodes.Curve011_15.geometry} material={materials['SVGMat.027']} />
          <mesh name="Curve011_16" geometry={nodes.Curve011_16.geometry} material={materials['SVGMat.028']} />
          <mesh name="Curve011_17" geometry={nodes.Curve011_17.geometry} material={materials['SVGMat.029']} />
          <mesh name="Curve011_18" geometry={nodes.Curve011_18.geometry} material={materials['SVGMat.030']} />
          <mesh name="Curve011_19" geometry={nodes.Curve011_19.geometry} material={materials['SVGMat.031']} />
          <mesh name="Curve011_20" geometry={nodes.Curve011_20.geometry} material={materials['SVGMat.032']} />
          <mesh name="Curve011_21" geometry={nodes.Curve011_21.geometry} material={materials['SVGMat.033']} />
          <mesh name="Curve011_22" geometry={nodes.Curve011_22.geometry} material={materials['SVGMat.034']} />
          <mesh name="Curve011_23" geometry={nodes.Curve011_23.geometry} material={materials['SVGMat.035']} />
          <mesh name="Curve011_24" geometry={nodes.Curve011_24.geometry} material={materials['SVGMat.036']} />
          <mesh name="Curve011_25" geometry={nodes.Curve011_25.geometry} material={materials['SVGMat.037']} />
          <mesh name="Curve011_26" geometry={nodes.Curve011_26.geometry} material={materials['SVGMat.038']} />
          <mesh name="Curve011_27" geometry={nodes.Curve011_27.geometry} material={materials['SVGMat.039']} />
          <mesh name="Curve011_28" geometry={nodes.Curve011_28.geometry} material={materials['SVGMat.040']} />
          <mesh name="Curve011_29" geometry={nodes.Curve011_29.geometry} material={materials['SVGMat.041']} />
          <mesh name="Curve011_30" geometry={nodes.Curve011_30.geometry} material={materials['SVGMat.042']} />
          <mesh name="Curve011_31" geometry={nodes.Curve011_31.geometry} material={materials['SVGMat.043']} />
          <mesh name="Curve011_32" geometry={nodes.Curve011_32.geometry} material={materials['SVGMat.044']} />
          <mesh name="Curve011_33" geometry={nodes.Curve011_33.geometry} material={materials['SVGMat.045']} />
          <mesh name="Curve011_34" geometry={nodes.Curve011_34.geometry} material={materials['SVGMat.046']} />
          <mesh name="Curve011_35" geometry={nodes.Curve011_35.geometry} material={materials['SVGMat.047']} />
          <mesh name="Curve011_36" geometry={nodes.Curve011_36.geometry} material={materials['SVGMat.048']} />
          <mesh name="Curve011_37" geometry={nodes.Curve011_37.geometry} material={materials['SVGMat.049']} />
          <mesh name="Curve011_38" geometry={nodes.Curve011_38.geometry} material={materials['SVGMat.050']} />
          <mesh name="Curve011_39" geometry={nodes.Curve011_39.geometry} material={materials['SVGMat.051']} />
        </group>
        <group name="Curve007" position={[6.588, 2.439, 5.444]} rotation={[1.58, 0.038, 2.34]}>
          <mesh name="Curve275" geometry={nodes.Curve275.geometry} material={materials['SVGMat.055']} />
          <mesh name="Curve275_1" geometry={nodes.Curve275_1.geometry} material={materials['SVGMat.053']} />
          <mesh name="Curve275_2" geometry={nodes.Curve275_2.geometry} material={materials['SVGMat.054']} />
          <pointLight intensity={10} color="#96DCFF" position={[0, 0, -1.1]} />
        </group>
        <mesh name="Curve005" geometry={nodes.Curve005.geometry} material={materials['Material.035']} position={[5.482, 2.376, 6.267]} rotation={[1.567, 0.006, 2.678]} >
          <pointLight intensity={10} color="#96DCFF" position={[0.2, 0, -1.2]} />
        </mesh>
        <group name="Curve011" position={[2.334, 2.416, 6.917]} rotation={[1.58, 0.018, 2.792]}>
          <mesh name="Curve281" geometry={nodes.Curve281.geometry} material={materials['SVGMat.060']} />
          <mesh name="Curve281_1" geometry={nodes.Curve281_1.geometry} material={materials['SVGMat.058']} />
          <mesh name="Curve281_2" geometry={nodes.Curve281_2.geometry} material={materials['SVGMat.059']} />
          <mesh name="Curve281_3" geometry={nodes.Curve281_3.geometry} material={materials['SVGMat.061']} />
          <mesh name="Curve281_4" geometry={nodes.Curve281_4.geometry} material={materials['SVGMat.062']} />
          <pointLight  intensity={10} color="#96DCFF" position={[0, -0.2, -1.15]} />
        </group>
        <group name="Curve008" position={[1.02, 2.523, 6.909]} rotation={[1.579, 0.004, 2.995]}>
          <mesh name="Curve291" geometry={nodes.Curve291.geometry} material={materials['SVGMat.066']} />
          <mesh name="Curve291_1" geometry={nodes.Curve291_1.geometry} material={materials['SVGMat.068']} />
          <pointLight  intensity={10} color="#96DCFF" position={[0.2, -0.2, -1.1]} />
        </group>
        <mesh name="Curve006" geometry={nodes.Curve006.geometry} material={materials['SVGMat.075']} position={[-5.289, 0.781, 6.297]} rotation={[1.551, 0.124, -3.024]} >
                  </mesh>
        <group name="Curve009" position={[-5.215, 2.578, 6.324]} rotation={[1.554, 0.016, -2.878]}>
          <mesh name="Curve304" geometry={nodes.Curve304.geometry} material={materials['SVGMat.077']} />
          <mesh name="Curve304_1" geometry={nodes.Curve304_1.geometry} material={materials['SVGMat.078']} />
          <pointLight  intensity={10} color="#96DCFF" position={[0.1, 0, -1.1]} />
        </group>
        <mesh name="Curve010" geometry={nodes.Curve010.geometry} material={materials['SVGMat.079']} position={[-6.959, 2.883, 5.636]} rotation={[2.068, -0.544, -2.511]} >
          <pointLight  intensity={10} color="#96DCFF" position={[0.33, 0.2, -0.65]} />
        </mesh>
      </group>
    </>
  )
}
