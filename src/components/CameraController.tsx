import { useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

function CameraController({ shouldAnimate }) {
  const { camera } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);
  const targetLookAt = new THREE.Vector3(0, 0, -2); // Center of the scene

  useEffect(() => {
    if (!camera) return;

    // Initial camera setup
    camera.position.set(0, 10, 0);
    camera.lookAt(targetLookAt);
    camera.updateProjectionMatrix();
  }, []);

  useEffect(() => {
    if (!shouldAnimate || !camera) return;

    setIsAnimating(true);

    const finalPosition = new THREE.Vector3(-3, 2.5, -8); // Move up

    const timeline = gsap.timeline({
      onUpdate: () => camera.updateProjectionMatrix(),
      onComplete: () => {
        setIsAnimating(false);

       
      },
    });

    timeline.to(camera.position, {
      duration: 2,
      x: finalPosition.x,
      y: finalPosition.y,
      z: finalPosition.z,
      ease: 'power2.out',
      onUpdate: () => {
        const currentPos = new THREE.Vector3().copy(camera.position);
        const targetQuat = new THREE.Quaternion().setFromRotationMatrix(
          new THREE.Matrix4().lookAt(currentPos, targetLookAt, new THREE.Vector3(0, 0, 0))
        );
        camera.quaternion.slerp(targetQuat, 0.1);
      },
    });

    return () => {
      gsap.killTweensOf(camera.position);
    };
  }, [shouldAnimate]);

  useFrame(() => {
    // Optional live updates
  });

  return null;
}

export default CameraController;
