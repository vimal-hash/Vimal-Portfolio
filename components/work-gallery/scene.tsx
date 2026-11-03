'use client';

import * as React from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { PerformanceMonitor, useGLTF, useKTX2 } from '@react-three/drei';
import type { Project } from '@/lib/content';
import { asset, DRACO_PATH, KTX2_PATH, themeFor, type GalleryMotion } from './config';
import { createCardTextures } from './card-art';
import {
  barFragment,
  barVertex,
  cardFragment,
  cardVertex,
  glareFragment,
  glareVertex,
  particleFragment,
  particleVertex,
  roomFragment,
  roomVertex,
} from './shaders';

const { clamp, damp, smoothstep } = THREE.MathUtils;

// The position is measured from the Blender viewport the room was modelled in. The aim and
// vertical field of view are solved so the wall, floor edge to ceiling edge, fills the frame.
const CAM_POS = new THREE.Vector3(0, 0.58, 2.96);
const CAM_FORWARD = new THREE.Vector3(0, -0.1771, -0.9842).normalize();
const FIT_HALF_FOV = 18.1;
const FLOOR_Y = -1;

// Sized so that, seen from the POV, the active card covers the marked area of the wall.
const CARD_W = 0.98;
const CARD_H = 0.49;
const CARD_D = 0.05;
const CARD_Y = 0.464;
const CARD_Z = 1.1;

const TEX_NAMES = ['plaster_basecolor', 'plaster_normal', 'plaster_orh', 'floor_basecolor', 'floor_normal', 'floor_orh'];
const urlsFor = (tier: '1k' | '4k') => TEX_NAMES.map((n) => asset(`${n}_${tier}.ktx2`));

function prepTextures(textures: THREE.Texture[], aniso: number) {
  textures.forEach((t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = aniso;
    t.needsUpdate = true;
  });
}

/** A thick glass slab. Unlike RoundedBox, its corner radius is independent of its bevel. */
function createSlabGeometry(w: number, h: number, d: number, corner: number, bevel: number) {
  const cornerSegs = 10;
  const bevelSegs = 6;
  const hd = d / 2;
  const contour: { x: number; y: number; dx: number; dy: number }[] = [];
  const centers: [number, number][] = [
    [w / 2 - corner, h / 2 - corner],
    [-w / 2 + corner, h / 2 - corner],
    [-w / 2 + corner, -h / 2 + corner],
    [w / 2 - corner, -h / 2 + corner],
  ];
  centers.forEach(([cx, cy], c) => {
    for (let k = 0; k <= cornerSegs; k++) {
      const a = (c + k / cornerSegs) * (Math.PI / 2);
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      contour.push({ x: cx + dx * (corner - bevel), y: cy + dy * (corner - bevel), dx, dy });
    }
  });

  const profile: { off: number; z: number; sin: number; cos: number }[] = [];
  for (let i = 0; i <= bevelSegs; i++) {
    const a = (i / bevelSegs) * (Math.PI / 2);
    profile.push({ off: bevel * Math.sin(a), z: hd - bevel + bevel * Math.cos(a), sin: Math.sin(a), cos: Math.cos(a) });
  }
  for (let i = 0; i <= bevelSegs; i++) {
    const a = Math.PI / 2 + (i / bevelSegs) * (Math.PI / 2);
    profile.push({ off: bevel * Math.sin(a), z: -(hd - bevel) + bevel * Math.cos(a), sin: Math.sin(a), cos: Math.cos(a) });
  }

  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  const M = contour.length;
  profile.forEach((p) => {
    contour.forEach((c) => {
      pos.push(c.x + c.dx * p.off, c.y + c.dy * p.off, p.z);
      nor.push(c.dx * p.sin, c.dy * p.sin, p.cos);
    });
  });
  for (let r = 0; r < profile.length - 1; r++) {
    for (let j = 0; j < M; j++) {
      const n = (j + 1) % M;
      const a = r * M + j;
      const b = r * M + n;
      const c = (r + 1) * M + j;
      const e = (r + 1) * M + n;
      idx.push(a, c, b, b, c, e);
    }
  }
  const front = pos.length / 3;
  pos.push(0, 0, hd);
  nor.push(0, 0, 1);
  const back = front + 1;
  pos.push(0, 0, -hd);
  nor.push(0, 0, -1);
  const lastRing = (profile.length - 1) * M;
  for (let j = 0; j < M; j++) {
    const n = (j + 1) % M;
    idx.push(front, j, n);
    idx.push(back, lastRing + n, lastRing + j);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  return g;
}

function createParticleGeometry(count: number) {
  const rnd = new Float32Array(count * 4);
  const kind = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    rnd[i * 4] = Math.random();
    rnd[i * 4 + 1] = Math.random();
    rnd[i * 4 + 2] = Math.random();
    rnd[i * 4 + 3] = Math.random();
    kind[i] = i / count < 0.8 ? 0 : 1;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 4));
  g.setAttribute('aKind', new THREE.BufferAttribute(kind, 1));
  return g;
}

/** Layout of a card from its distance t to the centre of the carousel. */
function layoutCard(t: number, spread: number) {
  const s = Math.sign(t);
  const u = Math.abs(t);
  const e = Math.sin(Math.min(u, 1) * (Math.PI / 2));
  return {
    x: s * (spread * e + Math.max(0, u - 1) * 1.7),
    z: CARD_Z - 0.7 * (1 - Math.cos(Math.min(u, 1) * (Math.PI / 2))),
    yaw: s * 0.55 * e,
    active: 1 - smoothstep(u, 0, 0.55),
    fade: 1 - smoothstep(u, 1.35, 1.95),
    transit: Math.sin(Math.min(u, 1) * Math.PI),
  };
}

type SceneProps = {
  projects: Project[];
  motion: React.MutableRefObject<GalleryMotion>;
  lite: boolean;
  onReady: () => void;
  onSelect: (index: number) => void;
};

function GalleryScene({ projects, motion, lite, onReady, onSelect }: SceneProps) {
  const gl = useThree((s) => s.gl);
  const maxAniso = gl.capabilities.getMaxAnisotropy();

  const { nodes } = useGLTF(asset('gallery.glb'), DRACO_PATH) as unknown as { nodes: Record<string, THREE.Mesh> };
  const pbr = useKTX2(urlsFor('1k'), KTX2_PATH) as THREE.Texture[];
  const lightmaps = useLoader(
    THREE.TextureLoader,
    ['GalleryWall', 'GalleryFloor', 'GalleryCeiling'].map((name) => asset(`${name}_lm${lite ? '_sm' : ''}.webp`)),
  );

  const themes = React.useMemo(() => projects.map((p) => themeFor(p.slug)), [projects]);
  const defines = React.useMemo((): Record<string, number> => (lite ? { LITE: 1 } : {}), [lite]);

  const shared = React.useMemo(() => {
    prepTextures(pbr, Math.min(8, maxAniso));
    lightmaps.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      // glTF UVs start at the top-left of the image.
      t.flipY = false;
      t.needsUpdate = true;
    });
    return {
      uTime: { value: 0 },
      uBreath: { value: 1 },
      uTheme: { value: 0 },
      uCardPos: { value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] },
      uCardYaw: { value: [0, 0, 0] },
      uCardW: { value: [0, 0, 0] },
      uCardTint: { value: [new THREE.Color(), new THREE.Color(), new THREE.Color()] },
      uCardSize: { value: new THREE.Vector2(CARD_W, CARD_H) },
      uReflect: { value: null as THREE.Texture | null },
      uReflectMat: { value: new THREE.Matrix4() },
      uHasReflect: { value: lite ? 0 : 1 },
      uBehind: { value: null as THREE.Texture | null },
      uRes: { value: new THREE.Vector2(1, 1) },
    };
  }, [pbr, lightmaps, maxAniso, lite]);

  const room = React.useMemo(() => {
    const make = (set: 0 | 1, lm: THREE.Texture, isFloor: boolean) =>
      new THREE.ShaderMaterial({
        defines,
        vertexShader: roomVertex,
        fragmentShader: roomFragment,
        uniforms: {
          ...shared,
          uAlbedo: { value: pbr[set * 3] },
          uNormal: { value: pbr[set * 3 + 1] },
          uOrh: { value: pbr[set * 3 + 2] },
          uLM: { value: lm },
          uTile: { value: 3.2 },
          uIsFloor: { value: isFloor ? 1 : 0 },
          uNormalAmt: { value: isFloor ? 0.2 : 0.45 },
          uBump: { value: isFloor ? 0.5 : 1.8 },
        },
      });
    return { wall: make(0, lightmaps[0], false), floor: make(1, lightmaps[1], true), ceiling: make(0, lightmaps[2], false) };
  }, [shared, pbr, lightmaps, defines]);

  const barMat = React.useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: barVertex, fragmentShader: barFragment, uniforms: shared }),
    [shared],
  );

  const glareMat = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: glareVertex,
        fragmentShader: glareFragment,
        uniforms: shared,
        transparent: true,
        depthWrite: false,
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
      }),
    [shared],
  );

  const slab = React.useMemo(() => createSlabGeometry(CARD_W, CARD_H, CARD_D, 0.034, 0.018), []);

  const cards = React.useMemo(
    () =>
      projects.map((p, i) => {
        const tex = createCardTextures(p, themes[i], maxAniso, lite ? 1024 : 1536, lite);
        const material = new THREE.ShaderMaterial({
          defines,
          vertexShader: cardVertex,
          fragmentShader: cardFragment,
          transparent: true,
          uniforms: {
            uTime: shared.uTime,
            uTheme: shared.uTheme,
            uBehind: shared.uBehind,
            uRes: shared.uRes,
            uArt: { value: tex.art },
            uFront: { value: tex.front },
            uSize: { value: new THREE.Vector3(CARD_W, CARD_H, CARD_D) },
            uTint: { value: new THREE.Color(themes[i].tint) },
            uActive: { value: 0 },
            uFade: { value: 1 },
            uScatter: { value: 0 },
            uVel: { value: 0 },
            uHover: { value: 0 },
            uIndex: { value: i },
          },
        });
        return { material, tex };
      }),
    [projects, themes, shared, maxAniso, lite, defines],
  );

  const particleCount = lite ? 600 : 2200;
  const particleGeo = React.useMemo(() => createParticleGeometry(particleCount), [particleCount]);
  const pigments = React.useMemo(() => themes.map((t) => t.pigment.map((c) => new THREE.Color(c))), [themes]);
  const particleMat = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
        uniforms: {
          uTime: shared.uTime,
          uTheme: shared.uTheme,
          uScatter: { value: 0 },
          uVel: { value: 0 },
          uPx: { value: 600 },
          uFocus: { value: CAM_POS.z - CARD_Z },
          uCardCenter: { value: new THREE.Vector3(0, CARD_Y, CARD_Z) },
          uPalA: { value: [new THREE.Color(), new THREE.Color(), new THREE.Color()] },
          uPalB: { value: [new THREE.Color(), new THREE.Color(), new THREE.Color()] },
          uCardSize: { value: new THREE.Vector2(CARD_W, CARD_H) },
          uMouse: { value: new THREE.Vector2(10, 10) },
          uMix: { value: 0 },
        },
      }),
    [shared],
  );

  const targets = React.useMemo(() => {
    const type = gl.extensions.has('EXT_color_buffer_float') && !lite ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const opts: THREE.RenderTargetOptions = {
      type,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
    };
    return { behind: new THREE.WebGLRenderTarget(4, 4, opts), reflect: new THREE.WebGLRenderTarget(4, 4, opts) };
  }, [gl, lite]);
  const virtualCam = React.useMemo(() => new THREE.PerspectiveCamera(), []);

  React.useEffect(() => {
    shared.uBehind.value = targets.behind.texture;
    shared.uReflect.value = targets.reflect.texture;
    return () => {
      targets.behind.dispose();
      targets.reflect.dispose();
    };
  }, [targets, shared]);

  React.useEffect(
    () => () => {
      slab.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      barMat.dispose();
      glareMat.dispose();
      room.wall.dispose();
      room.floor.dispose();
      room.ceiling.dispose();
      cards.forEach((c) => {
        c.material.dispose();
        c.tex.art.dispose();
        c.tex.front.dispose();
      });
    },
    [slab, particleGeo, particleMat, barMat, glareMat, room, cards],
  );

  const floorRef = React.useRef<THREE.Mesh>(null);
  const glareRef = React.useRef<THREE.Group>(null);
  const cardsRef = React.useRef<THREE.Group>(null);
  const pointsRef = React.useRef<THREE.Points>(null);
  const hovered = React.useRef(-1);

  const live = React.useRef({
    p: motion.current.target,
    vel: 0,
    enter: 0,
    mx: 0,
    my: 0,
    frame: 0,
    painted: false,
    frames: 0,
  });

  React.useEffect(() => {
    let alive = true;
    Promise.all(cards.map((c) => c.tex.ready)).then(() => {
      if (alive) live.current.painted = true;
    });
    return () => {
      alive = false;
    };
  }, [cards]);

  const v = React.useMemo(
    () => ({
      size: new THREE.Vector2(),
      forward: new THREE.Vector3(),
      up: new THREE.Vector3(),
      look: new THREE.Vector3(),
      bias: new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1),
    }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const { gl: renderer, scene, camera: cam, clock } = state;
    const camera = cam as THREE.PerspectiveCamera;
    const m = motion.current;
    const L = live.current;
    const n = projects.length;

    /* Motion ------------------------------------------------------- */
    const prevP = L.p;
    L.p = damp(L.p, m.target, 5.2, dt);
    const rawVel = dt > 0 ? (L.p - prevP) / dt : 0;
    L.vel = damp(L.vel, rawVel, 6, dt);
    L.enter = damp(L.enter, m.enter, 4, dt);
    L.mx = damp(L.mx, m.pointerX, 2.6, dt);
    L.my = damp(L.my, m.pointerY, 2.6, dt);

    const time = clock.elapsedTime;
    shared.uTime.value = time;
    shared.uBreath.value = 1 + Math.sin(time * 0.55) * 0.018;
    shared.uTheme.value = damp(shared.uTheme.value, m.dark ? 1 : 0, 4, dt);

    /* Camera ------------------------------------------------------- */
    // Below landscape the width is fixed instead, so a phone still frames the card and both bars.
    const aspect = state.size.width / Math.max(1, state.size.height);
    const portrait = 1 - smoothstep(aspect, 0.8, 1.35);
    const landscapeTan = Math.tan(THREE.MathUtils.degToRad(FIT_HALF_FOV));
    const portraitTan = 0.38 / Math.max(aspect, 0.3);
    // On a short screen the nav takes a real share of the height, so the card sits lower and smaller.
    const short = 1 - smoothstep(state.size.height, 400, 640);
    const tanV = THREE.MathUtils.lerp(landscapeTan, portraitTan, portrait) * (1 + short * 0.2);
    const fov = THREE.MathUtils.radToDeg(Math.atan(tanV)) * 2;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    const cardScale = 1 + portrait * 0.15;
    // Side cards sit at the edge of the frame on any screen width, so they always peek in.
    const spread = clamp(tanV * aspect * (CAM_POS.z - 0.4) * 0.98, 1.2, 2.1);

    const undocked = 1 - L.enter;
    const frac = L.p - Math.floor(L.p);
    camera.position.set(
      CAM_POS.x + L.mx * 0.085 + L.vel * 0.05,
      CAM_POS.y + L.my * 0.03 - undocked * 0.1,
      CAM_POS.z + undocked * 0.55 - Math.sin(frac * Math.PI) * 0.06,
    );
    v.look.copy(CAM_POS).addScaledVector(CAM_FORWARD, 3);
    v.look.x += L.mx * 0.025;
    v.look.y += L.my * 0.012 + short * tanV * 0.75;
    camera.up.set(0, 1, 0);
    camera.lookAt(v.look);
    camera.updateMatrixWorld();

    /* Cards -------------------------------------------------------- */
    const group = cardsRef.current;
    const slots: { t: number; i: number }[] = [];
    if (group) {
      for (let i = 0; i < n; i++) {
        const mesh = group.children[i] as THREE.Mesh | undefined;
        if (!mesh) continue;
        const t = i - L.p;
        const c = layoutCard(t, spread);
        const u = cards[i].material.uniforms;
        mesh.visible = c.fade > 0.002;
        mesh.position.set(c.x, CARD_Y, c.z);
        mesh.rotation.set(-L.my * 0.035 * c.active, c.yaw + L.mx * 0.05 * c.active, 0);
        mesh.scale.setScalar(cardScale);
        mesh.renderOrder = 2 + c.active;
        u.uActive.value = c.active;
        u.uFade.value = c.fade;
        u.uScatter.value = c.transit;
        u.uVel.value = L.vel;
        u.uHover.value = damp(u.uHover.value, hovered.current === i ? 1 : 0, 6, dt);
        if (mesh.visible) slots.push({ t, i });
      }
    }
    slots.sort((a, b) => Math.abs(a.t) - Math.abs(b.t));
    for (let s = 0; s < 3; s++) {
      const slot = slots[s];
      if (!slot) {
        shared.uCardW.value[s] = 0;
        continue;
      }
      const mesh = group!.children[slot.i] as THREE.Mesh;
      shared.uCardPos.value[s].copy(mesh.position);
      shared.uCardYaw.value[s] = mesh.rotation.y;
      shared.uCardW.value[s] = layoutCard(slot.t, spread).fade;
      shared.uCardTint.value[s].copy(cards[slot.i].material.uniforms.uTint.value);
    }
    shared.uCardSize.value.set(CARD_W * cardScale, CARD_H * cardScale);

    /* Particles ---------------------------------------------------- */
    const pu = particleMat.uniforms;
    const low = clamp(Math.floor(L.p), 0, n - 1);
    const high = clamp(low + 1, 0, n - 1);
    renderer.getDrawingBufferSize(v.size);
    pu.uScatter.value = Math.sin(frac * Math.PI);
    pu.uVel.value = L.vel;
    pu.uPx.value = v.size.y / (2 * tanV);
    pu.uFocus.value = camera.position.z - CARD_Z;
    pu.uMix.value = frac;
    pu.uCardCenter.value.set(0, CARD_Y, CARD_Z);
    pu.uCardSize.value.copy(shared.uCardSize.value);
    pu.uMouse.value.set(L.mx * 1.05, L.my * 0.55 + 0.42);
    for (let s = 0; s < 3; s++) {
      pu.uPalA.value[s].copy(pigments[low][s]);
      pu.uPalB.value[s].copy(pigments[high][s]);
    }

    /* Passes ------------------------------------------------------- */
    renderer.setClearColor(m.dark ? 0x0a0a0a : 0xffffff, 1);
    const glare = glareRef.current;
    const floor = floorRef.current;
    const points = pointsRef.current;
    if (!group || !floor || !glare || !points) return;

    const bw = Math.max(4, Math.round(v.size.x * (lite ? 0.33 : 0.5)));
    const bh = Math.max(4, Math.round(v.size.y * (lite ? 0.33 : 0.5)));
    if (targets.behind.width !== bw || targets.behind.height !== bh) {
      targets.behind.setSize(bw, bh);
      if (!lite) targets.reflect.setSize(Math.round(v.size.x / 3), Math.round(v.size.y / 3));
    }

    // 1. Floor reflection. A blurred reflection hides a one-frame lag, so it updates every other frame.
    L.frame++;
    // Once docked on a landscape screen the floor is out of frame, so the pass is skipped.
    const floorInFrame = portrait > 0.001 || undocked > 0.01;
    if (!lite && floorInFrame && L.frame % 2 === 0) {
      camera.getWorldDirection(v.forward);
      v.up.set(0, 1, 0).applyQuaternion(camera.quaternion);
      virtualCam.fov = camera.fov;
      virtualCam.aspect = camera.aspect;
      virtualCam.near = camera.near;
      virtualCam.far = camera.far;
      virtualCam.updateProjectionMatrix();
      virtualCam.position.set(camera.position.x, 2 * FLOOR_Y - camera.position.y, camera.position.z);
      virtualCam.up.set(v.up.x, -v.up.y, v.up.z);
      v.look.set(v.forward.x, -v.forward.y, v.forward.z).add(virtualCam.position);
      virtualCam.lookAt(v.look);
      virtualCam.updateMatrixWorld();
      shared.uReflectMat.value.copy(v.bias).multiply(virtualCam.projectionMatrix).multiply(virtualCam.matrixWorldInverse);

      floor.visible = false;
      glare.visible = false;
      points.visible = false;
      shared.uRes.value.set(targets.reflect.width, targets.reflect.height);
      renderer.setRenderTarget(targets.reflect);
      renderer.clear();
      renderer.render(scene, virtualCam);
      floor.visible = true;
      glare.visible = true;
      points.visible = true;
    }

    // 2. Everything behind the glass, for the cards to refract. On phones it can lag a frame while nothing moves.
    if (!lite || L.frame % 2 === 0 || Math.abs(L.vel) > 0.01) {
      group.visible = false;
      renderer.setRenderTarget(targets.behind);
      renderer.clear();
      renderer.render(scene, camera);
      group.visible = true;
    }

    // 3. Final image.
    shared.uRes.value.copy(v.size);
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(scene, camera);

    if (L.painted && L.frames < 3 && ++L.frames === 3) onReady();
  }, 1);

  return (
    <>
      <mesh geometry={nodes.GalleryWall.geometry} material={room.wall} />
      <mesh ref={floorRef} geometry={nodes.GalleryFloor.geometry} material={room.floor} />
      <mesh geometry={nodes.GalleryCeiling.geometry} material={room.ceiling} />
      <mesh geometry={nodes.LightBar_L.geometry} material={barMat} />
      <mesh geometry={nodes.LightBar_R.geometry} material={barMat} />

      <group ref={glareRef}>
        {[-0.983, 0.983].map((x) => (
          <mesh key={x} position={[x, 0, 0.27]} material={glareMat} renderOrder={1}>
            <planeGeometry args={[0.85, 2.3]} />
          </mesh>
        ))}
      </group>

      <group ref={cardsRef}>
        {cards.map((c, i) => (
          <mesh
            key={projects[i].slug}
            geometry={slab}
            material={c.material}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(i);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              hovered.current = i;
              // The active card opens its link, a side card comes to the front.
              const clickable = !!projects[i].href || i !== Math.round(motion.current.target);
              document.body.style.cursor = clickable ? 'pointer' : '';
            }}
            onPointerOut={() => {
              hovered.current = -1;
              document.body.style.cursor = '';
            }}
          />
        ))}
      </group>

      <points ref={pointsRef} geometry={particleGeo} material={particleMat} frustumCulled={false} renderOrder={4} />

      {!lite && <HighResTextures room={room} maxAniso={maxAniso} />}
    </>
  );
}

/** Upgrades the room to 4K when the browser is idle; the 1K set stays on screen until then. */
function HighResTextures({ room, maxAniso }: { room: Record<'wall' | 'floor' | 'ceiling', THREE.ShaderMaterial>; maxAniso: number }) {
  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    if (memory < 4 || window.innerWidth < 1024) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () => setGo(true);
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 2500 });
    else setTimeout(start, 1500);
  }, []);
  if (!go) return null;
  return (
    <React.Suspense fallback={null}>
      <HighResLoader room={room} maxAniso={maxAniso} />
    </React.Suspense>
  );
}

function HighResLoader({ room, maxAniso }: { room: Record<'wall' | 'floor' | 'ceiling', THREE.ShaderMaterial>; maxAniso: number }) {
  const tex = useKTX2(urlsFor('4k'), KTX2_PATH) as THREE.Texture[];
  React.useEffect(() => {
    prepTextures(tex, Math.min(12, maxAniso));
    const set = (m: THREE.ShaderMaterial, base: number) => {
      m.uniforms.uAlbedo.value = tex[base];
      m.uniforms.uNormal.value = tex[base + 1];
      m.uniforms.uOrh.value = tex[base + 2];
    };
    set(room.wall, 0);
    set(room.ceiling, 0);
    set(room.floor, 3);
  }, [tex, room, maxAniso]);
  return null;
}

export default function Scene({
  active,
  ...props
}: SceneProps & {
  active: boolean;
}) {
  const [dpr, setDpr] = React.useState(() => Math.min(window.devicePixelRatio || 1, props.lite ? 1.25 : 1.5));
  const minDpr = props.lite ? 0.85 : 1;
  return (
    <Canvas
      flat
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: false, stencil: false, powerPreference: 'high-performance' }}
      camera={{ fov: 44, near: 0.05, far: 40, position: [CAM_POS.x, CAM_POS.y, CAM_POS.z] }}
      style={{ touchAction: 'pan-y' }}
    >
      <PerformanceMonitor flipflops={2} onDecline={() => setDpr((d) => Math.max(minDpr, d - 0.2))} />
      <React.Suspense fallback={null}>
        <GalleryScene {...props} />
      </React.Suspense>
    </Canvas>
  );
}
