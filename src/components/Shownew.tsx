"use client"; // <--- ADD THIS LINE FIRST!

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
// import Testcase from './Testcase';
 
export default function R3fScene() { // Exported as a named component
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        {/* <Testcase /> */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}