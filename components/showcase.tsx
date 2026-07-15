'use client';

import * as React from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  CubeCamera,
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
import { hero } from '@/lib/content';

const ease = [0.16, 1, 0.3, 1] as const;
const SCENE_BG = '#000000';

export default function Showcase() {
  const [cameraSwayActive, setCameraSwayActive] = React.useState(false);
  const [showHero, setShowHero] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  // Poster crossfade — only matters on mobile (CSS-gated below). When the 3D
  // scene becomes interactive (cameraSwayActive fires) we fade out the static
  // poster so the live Canvas takes over.
  const [posterFaded, setPosterFaded] = React.useState(false);
  const dirLightRef = React.useRef<DirectionalLight>(null!);

  // The scene is a static diorama — only the camera sways, nothing casting a
  // shadow ever moves. Three.js recomputes the shadow map every frame by
  // default (`shadow.autoUpdate`), which is one of the most expensive parts
  // of a frame and pure waste here. Turn it off and refresh it manually the
  // couple of times visibility/content actually changes during mount.
  React.useEffect(() => {
    const light = dirLightRef.current;
    if (!light) return;
    light.shadow.autoUpdate = false;
    light.shadow.needsUpdate = true;
    const t = setTimeout(() => {
      light.shadow.needsUpdate = true;
    }, 200);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (!cameraSwayActive) return;
    // Tiny delay lets the first 3D frame paint before the poster dissolves,
    // avoiding a single-frame flash of black between poster fade-out and
    // first live render.
    const t = setTimeout(() => setPosterFaded(true), 250);
    return () => clearTimeout(t);
  }, [cameraSwayActive]);

  React.useEffect(() => {
    setMounted(true);
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);

    // Hero reveal:
    //   - Desktop/tablet: 5s wait matches the GSAP intro choreography
    //     (objects fly in t=3-5.5s, lights fade up t=3-4s).
    //   - Mobile: GSAP timeline is skipped (objects snap to final position),
    //     so the wait is dead time — reveal text immediately.
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (mobile) {
      setShowHero(true);
    } else {
      timer = setTimeout(() => setShowHero(true), 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      className="relative h-[100svh] w-full overflow-hidden"
      style={{ background: SCENE_BG }}
    >
      {/* --- MOBILE POSTER — INSTANT HERO ------------------------------
          A pre-rendered JPEG of the 3D scene. Visible from the moment HTML
          parses, so mobile users see a "loaded" hero in ~1s instead of
          staring at black while the GLB/KTX2 stream in. Fades out once the
          live Canvas reports the scene is interactive.
          CSS-gated to <768px so desktop never pays the bandwidth cost. */}
      <img
        src="/hero-poster.jpg"
        alt=""
        aria-hidden
        decoding="async"
        className="md:hidden pointer-events-none absolute inset-0 h-full w-full object-cover z-[5] transition-opacity duration-700 ease-out"
        style={{ opacity: posterFaded ? 0 : 1 }}
      />

      {/* --- LEFT-SIDE GRADIENT SCRIM -----------------------------------
          Dark gradient behind the text so it's always readable, even when
          the 3D scene's bright neon lights pass behind. The scrim is
          weighted to the left where the text sits, fading to transparent
          on the right so the scene reads cleanly. */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden
        style={{
          background:
            'linear-gradient(to right, rgba(0, 0, 0, 0.23) 0%, rgba(0, 0, 0, 0.17) 20%, rgba(0, 0, 0, 0) 45%, transparent 60%)',
        }}
      />
      {/* Bottom fade for the scroll hint + meta strip */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2"
        aria-hidden
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        }}
      />

      {/* --- EDITORIAL OVERLAY — BOTTOM-LEFT LAYOUT ---------------------- */}
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
            <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10 pb-20 md:pb-28">
              <div className="pointer-events-auto max-w-xl">
                {/* Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.2 }}
                  className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.25em] text-white/70"
                >
                  {/* <span className="inline-block h-px w-8 bg-white/70" /> */}
                  {/* <span>{hero.eyebrow}</span> */}
                </motion.div>

                {/* Headline — SANS-SERIF, BOLD, TIGHT for readability */}
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease, delay: 0.35 }}
                  className="mt-5 font-sans font-semibold text-[clamp(2.5rem,6.5vw,5rem)] leading-[1.02] tracking-tight text-white text-balance"
                  style={{
                    // Layered shadow: tight black halo + soft black bloom
                    // ensures legibility on any background colour the scene
                    // throws behind.
                    textShadow:
                      '0 1px 2px rgba(0,0,0,0.9), 0 2px 16px rgba(0,0,0,0.7), 0 4px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  {hero.headline.line1}{' '}
                  <span className="font-display italic font-normal text-white/80">
                    {hero.headline.line1Italic}
                  </span>
                  <br />
                  {hero.headline.line2}
                </motion.h1>

                {/* Subhead */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease, delay: 0.55 }}
                  className="mt-5 max-w-md text-sm sm:text-base leading-relaxed text-white/85 text-pretty"
                  style={{
                    textShadow:
                      '0 1px 2px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.6)',
                  }}
                >
                  {hero.subhead}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease, delay: 0.75 }}
                  className="mt-7 flex flex-wrap items-center gap-3"
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
                    className="group inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
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

      {/* Bottom-right meta strip — separate column, doesn't fight headline */}
      <AnimatePresence>
        {showHero && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease, delay: 1 }}
            className="pointer-events-auto absolute bottom-8 right-6 md:right-10 z-20 hidden lg:grid grid-cols-3 gap-6 max-w-md"
          >
            {/* {hero.meta.map((item) => (
              <div key={item.label} className="text-[10px]">
                <div className="font-mono uppercase tracking-[0.22em] text-white/50">
                  {item.label}
                </div>
                <div className="mt-1.5 text-xs text-white/90">{item.value}</div>
              </div>
            ))} */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll hint — center-bottom */}
      <AnimatePresence>
        {showHero && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease, delay: 1.5 }}
            className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] font-mono uppercase tracking-[0.25em] text-white/60 lg:bottom-8"
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

      {/* --- 3D SCENE -- ORIGINAL CAMERA SETUP (matches working old project) -- */}
      {mounted ? (
        <Canvas
          shadows
          camera={{ position: [7, 2.5, -5] }}
          className="!h-full !w-full"
          dpr={isMobile ? [1, 1.5] : [1, 1.75]}
          performance={{ min: 0.5 }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false,
            stencil: false,
            depth: true,
            preserveDrawingBuffer: false,
          }}
          frameloop="always"
        >
          <ambientLight color="#ffffff" />

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
          <OrbitControls
            enabled={false}
            target={[0, 0.35, 0]}
            maxPolarAngle={1.45}
          />
          {/* CAMERA: exact values from your working old project — DO NOT CHANGE */}
          <PerspectiveCamera makeDefault fov={50} position={[-4, 3, -9]} />
          <color args={[SCENE_BG]} attach="background" />

          {/* Suspense boundary: useGLTF/useKTX2 suspend while the GLB/textures
              stream in. R3F's Canvas does not provide an implicit boundary —
              without one, a slow/failed asset fetch has no defined fallback
              inside the scene graph. fallback={null} is fine here: the poster
              (mobile) / HeroPlaceholder (all sizes, pre-mount) already cover
              the screen during this window. */}
          <React.Suspense fallback={null}>
            <CubeCamera resolution={isMobile ? 128 : 256} frames={1}>
              {(texture) => (
                <>
                  <Environment map={texture} />
                  <Portfolio3
                    onAnimationComplete={() => setCameraSwayActive(true)}
                  />
                </>
              )}
            </CubeCamera>
          </React.Suspense>

          {/* Post-processing — Bloom makes the emissive ceiling strip lights
              and floor neon glow with proper haloes. Matches your original
              Showcase exactly. Skipped on mobile to keep 60fps. */}
          {!isMobile && (
            <EffectComposer enableNormalPass>
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
      ) : (
        <LoadingDots />
      )}
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{
                background: 'rgba(255,255,255,0.4)',
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
          Loading scene
        </p>
      </div>
    </div>
  );
}
