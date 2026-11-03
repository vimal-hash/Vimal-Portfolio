'use client';

import * as React from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  CubeCamera,
  PerformanceMonitor,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Download } from 'lucide-react';
import type { DirectionalLight } from 'three';

import { Portfolio3 } from '@/components/Portfolio3';
import CameraRig from '@/components/CameraRig';
import { hasWebGL2, WebGLBoundary } from '@/components/webgl-boundary';
import { hero } from '@/lib/content';

const ease = [0.16, 1, 0.3, 1] as const;
const SCENE_BG = '#000000';
const INTRO_MS = 5000;

const detectMobile = () => window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function Showcase() {
  const [cameraSwayActive, setCameraSwayActive] = React.useState(false);
  const [showHero, setShowHero] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [noScene, setNoScene] = React.useState(false);
  const [posterFaded, setPosterFaded] = React.useState(false);
  const [sceneInView, setSceneInView] = React.useState(true);
  const [quality, setQuality] = React.useState(1);
  const dirLightRef = React.useRef<DirectionalLight>(null);
  const rootRef = React.useRef<HTMLDivElement>(null!);

  // Nothing draws while the hero is off screen, so it can't compete with scrolling further down.
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setSceneInView(entry.isIntersecting),
      { rootMargin: '200px 0px' }
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // The scene is static, so its shadow map only has to be drawn once it has loaded.
  React.useEffect(() => {
    const light = dirLightRef.current;
    if (!light) return;
    light.shadow.autoUpdate = false;
    light.shadow.needsUpdate = true;
    const t = setTimeout(() => {
      light.shadow.needsUpdate = true;
    }, 200);
    return () => clearTimeout(t);
  }, [mounted, isMobile]);

  // A short delay, so the poster never dissolves into a black frame.
  React.useEffect(() => {
    if (!cameraSwayActive) return;
    const t = setTimeout(() => setPosterFaded(true), 250);
    return () => clearTimeout(t);
  }, [cameraSwayActive]);

  React.useEffect(() => {
    if (!hasWebGL2()) {
      setNoScene(true);
      setShowHero(true);
      return;
    }

    const mobile = detectMobile();
    setMounted(true);
    setIsMobile(mobile);
    const onResize = () => setIsMobile(detectMobile());
    window.addEventListener('resize', onResize);

    // The text waits for the desktop intro. Phones have no intro to wait for.
    const timer = mobile ? undefined : setTimeout(() => setShowHero(true), INTRO_MS);
    if (mobile) setShowHero(true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const onSceneError = React.useCallback(() => {
    setNoScene(true);
    setShowHero(true);
  }, []);

  // A slow device trades sharpness for frame rate, down to a limit that still looks clean.
  const dpr = Math.max(isMobile ? 0.85 : 1, Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75) * quality);

  return (
    <div
      ref={rootRef}
      className="relative h-[100svh] w-full overflow-hidden"
      style={{ background: SCENE_BG }}
    >
      {(isMobile || noScene) && (
        <picture>
          <source media="(min-width: 768px)" srcSet="/hero-poster-wide.jpg" />
          <img
            src="/hero-poster-phone.jpg"
            alt=""
            aria-hidden
            decoding="async"
            className="pointer-events-none absolute inset-0 z-[5] h-full w-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: posterFaded && !noScene ? 0 : 1 }}
          />
        </picture>
      )}

      {/* Keeps the text readable when the scene's bright lights pass behind it. */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden
        style={{
          background:
            'linear-gradient(to right, rgba(0, 0, 0, 0.23) 0%, rgba(0, 0, 0, 0.17) 20%, rgba(0, 0, 0, 0) 45%, transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2"
        aria-hidden
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        }}
      />

      <AnimatePresence>
        {showHero && (
          <motion.div
            key="hero-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease }}
            className="pointer-events-none absolute inset-0 z-20 flex items-end"
          >
            <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 md:px-10 md:pb-28 [@media(max-height:480px)]:pb-6">
              <div className="pointer-events-auto max-w-xl">
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease, delay: 0.35 }}
                  className="font-sans font-semibold text-[clamp(2.5rem,6.5vw,5rem)] leading-[1.02] tracking-tight text-white text-balance [@media(max-height:480px)]:text-[2rem]"
                  style={{
                    textShadow:
                      '0 1px 2px rgba(0,0,0,0.9), 0 2px 16px rgba(0,0,0,0.7), 0 4px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  {hero.headline.line1}{' '}
                  <span className="font-display font-normal text-white/80">
                    {hero.headline.line1Italic}
                  </span>
                  <br />
                  {hero.headline.line2}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease, delay: 0.55 }}
                  className="mt-5 max-w-md text-sm sm:text-base leading-relaxed text-white/85 text-pretty [@media(max-height:480px)]:mt-2"
                  style={{
                    textShadow:
                      '0 1px 2px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.6)',
                  }}
                >
                  {hero.subhead}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease, delay: 0.75 }}
                  className="mt-7 flex flex-wrap items-center gap-3 [@media(max-height:480px)]:mt-3"
                >
                  <a
                    href={hero.primaryCta.href}
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-lg shadow-white/10 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/20"
                  >
                    {hero.primaryCta.label}
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.75}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                  <a
                    href={hero.secondaryCta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/30 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/10 md:backdrop-blur-sm"
                  >
                    {hero.secondaryCta.label}
                    <Download size={14} strokeWidth={1.75} />
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHero && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease, delay: 1.5 }}
            className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] text-white/60 lg:bottom-8 [@media(max-height:480px)]:hidden"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              Scroll ↓
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {mounted && !noScene && (
        <WebGLBoundary onError={onSceneError}>
          <Canvas
            shadows={!isMobile}
            camera={{ position: [7, 2.5, -5] }}
            className="!h-full !w-full"
            dpr={dpr}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
              alpha: false,
              stencil: false,
            }}
            // Nothing moves on a phone without a mouse, so it draws only when something changes.
            frameloop={!sceneInView ? 'never' : isMobile ? 'demand' : 'always'}
          >
            <PerformanceMonitor flipflops={2} onDecline={() => setQuality((q) => Math.max(0.7, q - 0.15))} />
            <ambientLight color="#ffffff" />

            {!isMobile && (
              <directionalLight
                ref={dirLightRef}
                position={[-20, 10, 0]}
                intensity={0.5}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={1}
                shadow-camera-far={10}
                color="#ffffff"
              />
            )}
            <OrbitControls
              enabled={false}
              target={[0, 0.35, 0]}
              maxPolarAngle={1.45}
            />
            <PerspectiveCamera makeDefault fov={50} position={[-4, 3, -9]} />
            <color args={[SCENE_BG]} attach="background" />

            <React.Suspense fallback={null}>
              {isMobile ? (
                <Portfolio3 isMobile onAnimationComplete={() => setCameraSwayActive(true)} />
              ) : (
                <CubeCamera resolution={256} frames={1}>
                  {(texture) => (
                    <>
                      <Environment map={texture} />
                      <Portfolio3 isMobile={false} onAnimationComplete={() => setCameraSwayActive(true)} />
                    </>
                  )}
                </CubeCamera>
              )}
            </React.Suspense>

            {!isMobile && (
              <EffectComposer>
                <Bloom
                  luminanceThreshold={0.1}
                  intensity={0.005}
                  mipmapBlur
                />
                <ToneMapping />
              </EffectComposer>
            )}

            <CameraRig active={cameraSwayActive} />
          </Canvas>
        </WebGLBoundary>
      )}
    </div>
  );
}
