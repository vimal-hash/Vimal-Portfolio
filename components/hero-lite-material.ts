import * as THREE from 'three';

// Phones get one small shader for the whole hero instead of the full PBR material on every
// mesh. Blinn-Phong stands in for GGX, a formula for the environment map, and there are no shadows.

const vertexShader = /* glsl */ `
  uniform vec2 uRepeat;
  varying vec3 vN, vWorld;
  varying vec2 vUv;
  void main() {
    vUv = uv * uRepeat;
    vN = mat3(modelMatrix) * normal;
    vec4 w = modelMatrix * vec4(position, 1.);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor, uEmissive, uLights[LIGHTS];
  uniform float uMetal, uRough, uOpacity;
  #ifdef USE_ALBEDO
    uniform sampler2D uMap;
  #endif
  varying vec3 vN, vWorld;
  varying vec2 vUv;

  const vec3 LIGHT_COLOR = vec3(.3, .72, 1.);
  const vec3 SUN = vec3(-.894, .447, 0.);

  void main() {
    vec3 albedo = uColor;
    #ifdef USE_ALBEDO
      albedo *= texture2D(uMap, vUv).rgb;
    #endif
    vec3 N = normalize(vN) * (gl_FrontFacing ? 1. : -1.);
    vec3 V = normalize(cameraPosition - vWorld);

    float a = max(uRough * uRough, .02);
    float shine = 2. / (a * a) - 2.;
    float specNorm = (shine + 8.) * .0398;

    vec3 diffuse = vec3(1.) + vec3(.5) * max(dot(N, SUN), 0.);
    vec3 spec = vec3(0.);
    for (int i = 0; i < LIGHTS; i++) {
      vec3 L = uLights[i] - vWorld;
      float d2 = dot(L, L);
      L /= sqrt(d2);
      vec3 radiance = LIGHT_COLOR * 10. * max(dot(N, L), 0.) / d2;
      diffuse += radiance;
      spec += radiance * pow(max(dot(N, normalize(L + V)), 0.), shine) * specNorm;
    }

    // What metal mirrors in this room: a dim wall broken up by the row of lit pillars.
    vec3 R = reflect(-V, N);
    float pillars = pow(abs(sin(atan(R.x, R.z) * 7.)), 10.);
    vec3 room = vec3(.2, .3, .34) * (.45 + 1.3 * pillars) * smoothstep(-.5, .5, R.y);

    vec3 F0 = mix(vec3(.04), albedo, uMetal);
    vec3 col = albedo * (1. - uMetal) * diffuse * .3183 + F0 * (spec + room * (1. - uRough * .6)) + uEmissive;
    gl_FragColor = vec4(col, uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** Swaps every lit material under `roots` for the phone shader. Unlit ones are already cheap. */
export function applyLiteMaterials(roots: THREE.Object3D[]) {
  const each = (visit: (object: THREE.Object3D) => void) => roots.forEach((root) => root.traverse(visit));
  roots.forEach((root) => root.updateWorldMatrix(true, true));

  const lights: THREE.Vector3[] = [];
  each((object) => {
    if ((object as THREE.PointLight).isPointLight) lights.push(object.getWorldPosition(new THREE.Vector3()));
  });
  const defines = { LIGHTS: lights.length };

  const cache = new Map<THREE.Material, THREE.ShaderMaterial>();
  const convert = (base: THREE.MeshStandardMaterial) => {
    let material = cache.get(base);
    if (!material) {
      const map = base.map;
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        defines: map ? { ...defines, USE_ALBEDO: 1 } : defines,
        transparent: base.transparent,
        side: base.side,
        uniforms: {
          uColor: { value: base.color },
          uEmissive: { value: base.emissive.clone().multiplyScalar(base.emissiveIntensity) },
          // The wood's metalness comes from a map this shader doesn't read, and it's mostly not metal.
          uMetal: { value: base.metalnessMap ? 0 : Math.min(base.metalness, 1) },
          uRough: { value: base.roughness },
          uOpacity: { value: base.opacity },
          uMap: { value: map },
          uRepeat: { value: map ? map.repeat : new THREE.Vector2(1, 1) },
          uLights: { value: lights },
        },
      });
      cache.set(base, material);
    }
    return material;
  };

  each((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.isMesh && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
      mesh.material = convert(mesh.material as THREE.MeshStandardMaterial);
    }
  });

  return () => cache.forEach((material) => material.dispose());
}
