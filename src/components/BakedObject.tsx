// src/components/BakedObject.tsx
'use client'
import { useGLTF, useTexture, OrbitControls } from '@react-three/drei'

export default function BakedObject() {
  const { nodes } = useGLTF('/Portfolio1.glb') // update if needed
  const bakedTexture = useTexture('/Bake7.jpg')
  bakedTexture.flipY = false // fix upside-down texture
console.log(nodes)
  return (
    <>
      
      <OrbitControls makeDefault />

      <mesh geometry={nodes.Scene.geometry}> {/* Or your exact mesh name */}
        <meshBasicMaterial map={bakedTexture} />
      </mesh>
    </>
  )
}
