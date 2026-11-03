// GLSL for the Work gallery. Three.js compiles these as GLSL 300 es on WebGL2,
// so texture()/textureLod()/fwidth() are all available without extensions.

const COMMON = /* glsl */ `
  #define PI 3.14159265
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  // Linear up to .8, then a soft shoulder, so the glow near the bars rolls off
  // to white instead of clipping into a hard edge.
  vec3 softClip(vec3 c) {
    vec3 x = max(c - .8, 0.);
    return min(c, vec3(.8)) + .2 * (1. - exp(-x / .2));
  }
  float sdRR(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r;
  }
  // Representative-point GGX for a vertical line light (the light bars).
  float barSpec(vec3 P, vec3 N, vec3 V, float rough, float bx) {
    vec3 A = vec3(bx, -1., .255) - P;
    vec3 AB = vec3(0., 2., 0.);
    vec3 R = reflect(-V, N);
    float rAB = dot(R, AB);
    float t = clamp((dot(R, A) * rAB - dot(A, AB)) / max(dot(AB, AB) - rAB * rAB, 1e-4), 0., 1.);
    vec3 L = normalize(A + AB * t);
    vec3 H = normalize(L + V);
    float a = max(rough * rough, .006);
    float NH = max(dot(N, H), 0.);
    float d = NH * NH * (a * a - 1.) + 1.;
    float D = min(a * a / (PI * d * d), 40.);
    float F = .04 + .96 * pow(1. - max(dot(V, H), 0.), 5.);
    return D * F * max(dot(N, L), 0.);
  }
`;

const THEME = /* glsl */ `
  uniform float uTheme; // 0 = light, 1 = dark
`;

/* ------------------------------------------------------------------ *
 * Room: wall / floor / ceiling
 * Baked light × 4K PBR. The bars add live raking light that reveals the
 * plaster relief; each glass card casts a soft, tinted shadow onto the room.
 * ------------------------------------------------------------------ */
export const roomVertex = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vN;
  varying vec2 vLM;
  void main() {
    vLM = uv;
    vN = normal;
    vec4 w = modelMatrix * vec4(position, 1.);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

export const roomFragment = /* glsl */ `
  ${COMMON}
  ${THEME}
  uniform sampler2D uAlbedo, uNormal, uOrh, uLM, uReflect;
  uniform mat4 uReflectMat;
  uniform float uTile, uIsFloor, uHasReflect, uTime, uBreath, uNormalAmt, uBump;
  uniform vec3 uCardPos[3];
  uniform float uCardYaw[3];
  uniform float uCardW[3];
  uniform vec3 uCardTint[3];
  uniform vec2 uCardSize;
  varying vec3 vWorld;
  varying vec3 vN;
  varying vec2 vLM;

  void main() {
    vec3 Ng = normalize(vN);
    vec3 an = abs(Ng);
    vec2 tuv; vec3 T, B;
    if (an.y > .7)      { tuv = vWorld.xz; T = vec3(1.,0.,0.); B = vec3(0.,0.,1.); }
    else if (an.x > .7) { tuv = vWorld.zy; T = vec3(0.,0.,1.); B = vec3(0.,1.,0.); }
    else                { tuv = vWorld.xy; T = vec3(1.,0.,0.); B = vec3(0.,1.,0.); }
    tuv /= uTile;

    vec3 albedo = texture(uAlbedo, tuv).rgb;
    vec3 orh = texture(uOrh, tuv).rgb;
    vec2 nt = texture(uNormal, tuv).xy * 2. - 1.;
    float he = .0014;
    #ifdef LITE
      vec2 dh = vec2(0.);
    #else
      vec2 dh = vec2(texture(uOrh, tuv + vec2(he, 0.)).b, texture(uOrh, tuv + vec2(0., he)).b) - orh.b;
    #endif
    vec3 N = normalize(Ng + (T * nt.x - B * nt.y) * uNormalAmt - (T * dh.x + B * dh.y) * uBump);
    vec3 V = normalize(cameraPosition - vWorld);

    vec3 raw = texture(uLM, vLM).rgb * 4.;
    vec3 lm = min(raw, vec3(1.)) * .66 + .13 * (1. - exp(-max(raw - 1., vec3(0.)) * .6));

    // Raking light from the two bars: only the *difference* the normal map
    // makes is added, because the bars' base light is already in the bake.
    float rake = 0.;
    float nearBar = 0.;
    for (int i = 0; i < 2; i++) {
      float bx = i == 0 ? -.983 : .983;
      vec3 C = vec3(bx, clamp(vWorld.y, -.95, .95), .25) - vWorld;
      float d2 = dot(C, C);
      vec3 Ln = C / sqrt(max(d2, 1e-4));
      float k = 1. / (.45 + d2 * 1.5);
      rake += (dot(N, Ln) - dot(Ng, Ln)) * k;
      nearBar += k;
    }
    vec3 col = albedo * lm * mix(1., orh.r, .75);
    col *= 1. + rake * .55;
    col *= 1. + (uBreath - 1.) * clamp(nearBar * .5, 0., 1.);

    #ifndef LITE
      float spec = barSpec(vWorld, N, V, orh.g, -.983) + barSpec(vWorld, N, V, orh.g, .983);
      col += vec3(.95, .98, 1.) * spec * (uIsFloor > .5 ? .05 : .035);
    #endif

    // Glass cards: soft shadow plus tinted light, as if light passed through.
    vec3 Lc = normalize(vec3(0., .5, .87));
    for (int i = 0; i < 3; i++) {
      float w = uCardW[i];
      if (w < .002) continue;
      float cy = cos(uCardYaw[i]), sy = sin(uCardYaw[i]);
      vec3 n = vec3(sy, 0., cy), r = vec3(cy, 0., -sy);
      vec3 rel = vWorld - uCardPos[i];
      float dn = dot(Lc, n);
      float t = -dot(rel, n) / dn;
      if (t < 0.) continue;
      vec3 Q = rel + Lc * t;
      float blur = .05 + t * .34;
      float d = sdRR(vec2(dot(Q, r), Q.y), uCardSize * .5, .03);
      float s = 1. - smoothstep(-blur, blur, d);
      vec3 tinted = mix(vec3(.62), uCardTint[i] * 1.1, .34);
      col *= mix(vec3(1.), tinted, s * w * .55);
    }

    if (uIsFloor > .5 && uHasReflect > .5) {
      vec4 pr = uReflectMat * vec4(vWorld, 1.);
      vec2 ruv = pr.xy / pr.w + nt * .012;
      float rough = orh.g;
      vec3 refl = textureLod(uReflect, ruv, 1.4 + rough * 7.).rgb;
      float fres = .1 + .9 * pow(1. - max(dot(N, V), 0.), 4.);
      col = mix(col, refl, clamp(fres * (1. - rough * 1.1) * 1.05, 0., .72));
    }

    col *= mix(1., .13, uTheme);
    col = softClip(col);
    col += (hash12(gl_FragCoord.xy + fract(uTime) * 91.) - .5) * .018;
    gl_FragColor = vec4(col, 1.);
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------------------ *
 * Light bars: reeded (fluted) opal glass with a hot core seen through the
 * ribs. Ribs fade out with distance so they never shimmer.
 * ------------------------------------------------------------------ */
export const barVertex = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vN;
  void main() {
    vN = normal;
    vec4 w = modelMatrix * vec4(position, 1.);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

export const barFragment = /* glsl */ `
  ${COMMON}
  ${THEME}
  uniform float uTime, uBreath;
  uniform vec3 uCardTint[3];
  varying vec3 vWorld;
  varying vec3 vN;

  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(cameraPosition - vWorld);
    float cx = vWorld.x < 0. ? -.983 : .983;
    float u = (vWorld.x - cx) / .164;
    float y = vWorld.y;

    float phase = u * 3.14159 * 21.;
    float aa = clamp(1. - fwidth(phase) * .85, 0., 1.);
    float rib = sin(phase) * aa;

    // Light seen through a rib is pushed sideways, which is what makes reeded
    // glass read as glass rather than as flat white.
    float refr = u + rib * .13 + (V.x - cx * .04) * .22;
    float core = exp(-refr * refr * 2.1);
    float side = smoothstep(.72, .2, N.z);

    float drift = .5 + .5 * sin(y * 1.6 + uTime * .35 + cx * 2.) * sin(y * .7 - uTime * .21);
    float ends = smoothstep(1.02, .78, abs(y));

    float lum = mix(.88, 1.7, core) + drift * .08;
    lum *= mix(.86, 1., ends);
    lum += rib * .07;
    lum *= mix(1., .86, side);
    lum *= uBreath;

    vec3 edge = mix(vec3(.82, .9, 1.), uCardTint[0] * 1.05 + .15, .12);
    vec3 col = mix(edge, vec3(1.), smoothstep(.75, 1.45, lum)) * lum;

    float fres = pow(1. - max(dot(N, V), 0.), 4.);
    col += fres * .18;
    col = softClip(col * mix(1.02, 1.12, uTheme));
    col += (hash12(gl_FragCoord.xy + fract(uTime) * 91.) - .5) * .012;
    gl_FragColor = vec4(col, 1.);
    #include <colorspace_fragment>
  }
`;

/* Soft bloom veil that overlaps the bar silhouette. Costs one quad per bar,
 * where a real bloom pass would wash a white room out anyway. */
export const glareVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
`;

export const glareFragment = /* glsl */ `
  uniform float uBreath, uTheme;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - .5) * 2.;
    float x = abs(p.x);
    float g = exp(-x * x * 7.) * smoothstep(1., .55, abs(p.y));
    float a = g * mix(.16, .5, uTheme) * uBreath;
    gl_FragColor = vec4(.86, .93, 1., 1.);
    #include <colorspace_fragment>
    gl_FragColor = vec4(gl_FragColor.rgb * a, a * .25);
  }
`;

/* ------------------------------------------------------------------ *
 * Glass card: a thick rounded slab. The artwork sits inside the glass (it
 * shifts with parallax), the title floats above it, the room behind is
 * refracted through the rim, and the bars streak across the surface.
 * ------------------------------------------------------------------ */
export const cardVertex = /* glsl */ `
  uniform float uScatter;
  varying vec3 vLocal, vLN, vWorld, vWN, vCamLocal;
  void main() {
    vLocal = position;
    vLN = normal;
    vWN = mat3(modelMatrix) * normal;
    vec4 w = modelMatrix * vec4(position, 1.);
    vWorld = w.xyz;
    vCamLocal = (inverse(modelMatrix) * vec4(cameraPosition, 1.)).xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

export const cardFragment = /* glsl */ `
  ${COMMON}
  ${THEME}
  uniform sampler2D uArt, uFront, uBehind;
  uniform vec2 uRes;
  uniform vec3 uSize, uTint;
  uniform float uActive, uFade, uTime, uScatter, uVel, uHover, uIndex;
  varying vec3 vLocal, vLN, vWorld, vWN, vCamLocal;

  void main() {
    vec3 N = normalize(vWN);
    vec3 V = normalize(cameraPosition - vWorld);
    float NV = clamp(dot(N, V), 0., 1.);
    vec3 LN = normalize(vLN);
    float front = smoothstep(.72, .985, LN.z);

    vec2 uv = vLocal.xy / uSize.xy + .5;
    vec3 Vl = normalize(vCamLocal - vLocal);
    vec2 par = Vl.xy / max(Vl.z, .3);
    vec2 suv = gl_FragCoord.xy / uRes;

    // Refraction of the room behind the slab: gentle through the face,
    // strong through the rounded rim.
    vec2 ofs = LN.xy * mix(.11, .018, front);
    ofs += vec2(sin(uv.y * 9. + uTime * .4), cos(uv.x * 7. - uTime * .3)) * .0024;
    float lod = mix(2.2, 3.6, front);
    #ifdef LITE
      vec3 behind = textureLod(uBehind, suv + ofs, lod).rgb;
    #else
      vec3 behind = vec3(
        textureLod(uBehind, suv + ofs * 1.08, lod).r,
        textureLod(uBehind, suv + ofs, lod).g,
        textureLod(uBehind, suv + ofs * .92, lod).b
      );
    #endif

    // Artwork sits deep in the slab. While the carousel moves it ripples and
    // splits slightly, then settles.
    vec2 auv = uv - par * (.024 / uSize.xy);
    float amp = uScatter * .010 + abs(uVel) * .012;
    auv += vec2(sin(auv.y * 15. + uTime * 1.4 + uIndex), cos(auv.x * 11. - uTime * 1.1)) * amp;
    #ifdef LITE
      vec3 art = texture(uArt, auv).rgb;
    #else
      vec2 ca = (uv - .5) * (.0022 + uScatter * .009 + abs(uVel) * .012);
      vec3 art = vec3(
        texture(uArt, auv + ca).r,
        texture(uArt, auv).g,
        texture(uArt, auv - ca).b
      );
    #endif

    float sd = sdRR((uv - .5) * uSize.xy, uSize.xy * .5 - .011, .02);
    float artMask = smoothstep(.003, -.003, sd) * front;

    vec3 glass = behind * mix(vec3(1.), uTint, .16) * 1.03 + .025;
    float op = mix(.84, .995, uActive) * artMask * (1. - uScatter * .3);
    vec3 col = mix(glass, art, op);

    // Title floats just above the art with its own parallax.
    vec4 ft = texture(uFront, uv + par * (.012 / uSize.xy));
    col = col * (1. - ft.a * front * uActive) + ft.rgb * front * uActive;

    // The bars reflect in the glass and slide across it as the card moves.
    #ifndef LITE
      float gloss = barSpec(vWorld, N, V, .13, -.983) + barSpec(vWorld, N, V, .13, .983);
      col += vec3(.93, .97, 1.) * gloss * mix(.05, .022, front);
    #endif

    // Soft sheen tied to the pointer, plus a fine diagonal lift.
    float sheen = smoothstep(.55, .0, abs(dot(uv - .5, vec2(.86, .5)) - (uHover * .25))) * .035;
    col += sheen * front;

    float fres = pow(1. - NV, 3.2);
    col += vec3(.92, .96, 1.) * fres * .42;

    // Rim: bright, thick edge of the slab.
    float rim = 1. - front;
    vec3 rimCol = mix(behind * 1.04, uTint * 1.2 + .05, .42);
    col = mix(col, rimCol, rim);
    float hair = smoothstep(.0028, .0, abs(sd + .0015)) * front;
    col += hair * mix(.14, .2, uActive);

    col = softClip(col);
    col += (hash12(gl_FragCoord.xy * 1.3 + fract(uTime) * 77.) - .5) * .012;
    gl_FragColor = vec4(col, uFade);
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------------------ *
 * Particles, drawn as points:
 *   kind 0: dust hanging in the room, catching light when it nears a bar
 *   kind 1: dust shed by the card's edge, only while the cards are moving
 * ------------------------------------------------------------------ */
export const particleVertex = /* glsl */ `
  attribute vec4 aRnd;
  attribute float aKind;
  uniform float uTime, uScatter, uVel, uPx, uFocus, uTheme;
  uniform vec3 uCardCenter, uPalA[3], uPalB[3];
  uniform vec2 uCardSize, uMouse;
  uniform float uMix;
  varying vec3 vColor;
  varying float vAlpha, vSoft;
  const float TAU = 6.2831853;

  vec3 flow(vec3 p, float t) {
    return vec3(
      sin(p.y * 2.3 + t * .31 + p.z * 1.7) + sin(p.z * 3.7 - t * .17),
      sin(p.z * 2.1 - t * .23 + p.x * 1.9) + sin(p.x * 4.1 + t * .13),
      sin(p.x * 2.7 + t * .19 + p.y * 1.3) + sin(p.y * 3.3 - t * .29)
    );
  }

  void main() {
    vec3 p;
    float size, alpha;
    vec3 pigment = mix(uPalA[1], uPalB[1], uMix);
    if (aKind < .5) {
      p = vec3((aRnd.x - .5) * 2.7, -1.05 + 2.1 * fract(aRnd.y - uTime * (.002 + .006 * aRnd.w)), .2 + aRnd.z * 1.75);
      p += flow(p * 1.3 + aRnd.w * 6.3, uTime * .6) * .045;
      p.x -= uVel * .05 * aRnd.z;
      float bar = min(abs(p.x + .983), abs(p.x - .983));
      float lit = exp(-bar * bar * 9.);
      // Dust is flat and tumbles, so it only flashes when it turns to face the light.
      float glint = pow(.5 + .5 * sin(uTime * (.5 + aRnd.y) + aRnd.x * 41.), 6.);
      alpha = (.16 + .3 * lit + .4 * glint * lit) * smoothstep(0., .08, abs(p.y) < 1. ? 1. - abs(p.y) : 0.);
      size = mix(.0009, .0026, pow(aRnd.y, 4.));
      vColor = mix(mix(vec3(.5, .52, .55), pigment, .2), vec3(.86, .9, 1.), uTheme);
    } else {
      float a = aRnd.z * TAU;
      vec2 dir = vec2(cos(a), sin(a));
      vec2 hs = uCardSize * .5;
      vec2 rimP = dir / max(abs(dir.x) / hs.x, abs(dir.y) / hs.y);
      float life = fract(aRnd.x + uTime * (.05 + .06 * aRnd.y));
      float dist = pow(life, 1.25) * (.1 + .4 * aRnd.w) * (1. + uScatter);
      p = uCardCenter + vec3(rimP + normalize(dir * vec2(.7, 1.)) * dist, -.03 - .14 * aRnd.y);
      p += flow(p * 2.2, uTime * 1.3) * dist * .2;
      p.x -= uVel * dist * .9;
      alpha = smoothstep(0., .08, life) * smoothstep(1., .35, life) * smoothstep(.02, .45, uScatter) * .7;
      size = mix(.0011, .0034, pow(aRnd.w, 3.));
      vColor = mix(mix(pigment, vec3(.62, .65, .68), .35), vec3(.82, .9, 1.), uTheme * .55);
    }

    vec2 toM = p.xy - uMouse;
    p.xy += normalize(toM + 1e-4) * exp(-dot(toM, toM) * 16.) * .022;

    vec4 mv = viewMatrix * vec4(p, 1.);
    float depth = -mv.z;
    float coc = abs(depth - uFocus);
    float blur = coc * coc * .0014;
    gl_PointSize = clamp((size + blur) * uPx / depth, 1., 22.);
    alpha *= clamp(size * size / ((size + blur) * (size + blur) + 1e-6), .05, 1.);

    vAlpha = alpha;
    vSoft = clamp(blur / (size + blur + 1e-6), .15, .98);
    gl_Position = projectionMatrix * mv;
  }
`;

export const particleFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha, vSoft;
  void main() {
    float r = length(gl_PointCoord - .5) * 2.;
    if (r > 1.) discard;
    float a = smoothstep(1., 1. - vSoft * .85 - .1, r) * vAlpha;
    gl_FragColor = vec4(vColor, 1.);
    #include <colorspace_fragment>
    gl_FragColor = vec4(gl_FragColor.rgb * a, a);
  }
`;
