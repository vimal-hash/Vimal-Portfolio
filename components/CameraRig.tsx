'use client'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef } from 'react'
import { easing } from 'maath'

// Pre-allocated vectors — never GC'd
const _initialPosition = new THREE.Vector3(-4, 3, -9)
const _lookAtTarget = new THREE.Vector3(0, 0.5, 0)
const _currentLookAt = new THREE.Vector3()
const _targetLookAt = new THREE.Vector3()

export default function CameraRig({ active }: { active: boolean }) {
    // Smooth mouse tracking state
    const smoothMouse = useRef({ x: 0, y: 0 })
    const velocity = useRef({ x: 0, y: 0 })
    

    useFrame((state, delta) => {
        const camera = state.camera

        if (!active) {
            // Keep camera locked until animation ends
            easing.damp3(camera.position, _initialPosition, 0.2, delta)
            camera.lookAt(_lookAtTarget)
            return
        }

        // Ultra-smooth mouse interpolation (like david-hckh.com)
        const targetMouseX = state.pointer.x
        const targetMouseY = state.pointer.y
        
        // Smooth the mouse movement with inertia
        const smoothness = 0.02 // Lower = smoother but slower response
        const velocityDamping = 0.85 // Inertia effect
        
        // Calculate velocity
        velocity.current.x += (targetMouseX - smoothMouse.current.x) * smoothness
        velocity.current.y += (targetMouseY - smoothMouse.current.y) * smoothness
        
        // Apply damping to velocity for natural deceleration
        velocity.current.x *= velocityDamping
        velocity.current.y *= velocityDamping
        
        // Update smooth mouse position
        smoothMouse.current.x += velocity.current.x
        smoothMouse.current.y += velocity.current.y
        
        // Apply the smooth movement to camera
        const swayStrengthX = 0.1 // Horizontal sway intensity
        const swayStrengthY = 0.2 // Vertical sway intensity
        const swayStrengthZ = 0.2 // Depth sway intensity
        
        const swayX = -4 + (smoothMouse.current.x * swayStrengthX)
        const swayY = 3 + (smoothMouse.current.y * swayStrengthY)
        const swayZ = -9 + (smoothMouse.current.x * swayStrengthZ)
        
        // Extra smooth camera interpolation
        easing.damp3(camera.position, [swayX, swayY, swayZ], 0.15, delta)
        
        // Smooth look-at target with slight offset — reuse pre-allocated vectors
        _targetLookAt.set(
            smoothMouse.current.x * 0.1,
            0.5 + (smoothMouse.current.y * 0.1),
            0
        )
        
        camera.getWorldDirection(_currentLookAt)
        easing.damp3(_currentLookAt, _targetLookAt, 0.1, delta)
        camera.lookAt(_targetLookAt)
    })

    return null
}