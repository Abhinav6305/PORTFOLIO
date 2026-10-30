"use client"

/* ==================================================================
   ABHINAV RISHI — scroll-driven interstellar film
   A single full-screen fragment shader ray-traces light around a
   black hole: rays bend by the Schwarzschild photon equation, the
   accretion disk is lensed over and under the shadow, Doppler beaming
   makes one side blaze, and the starfield warps behind it.
   Scroll flies the camera through 7 orbits; the last act dives past
   the horizon into an endless tesseract lattice.
   The text layer is driven straight from scroll (not the render loop),
   so copy stays correct even if WebGL is slow or unavailable.
   ================================================================== */

import { useEffect, useRef } from "react"

type Readout = { k: string; v: string; amb?: boolean }
type Act = {
  rail: string
  eyebrow: string
  title: [React.ReactNode, React.ReactNode]
  lede: string
  readout?: { head: string; tag: string; rows: Readout[] }
  link?: { href: string; label: string; external?: boolean }
}

const ACTS: Act[] = [
  {
    rail: "HELLO",
    eyebrow: "AI ENGINEER · FULL-STACK DEVELOPER · UI/UX DESIGNER",
    title: [<>ABHINAV</>, <>RISHI</>],
    lede: "Wandering between code and the cosmos, building intelligent systems that see problems coming before they arrive.",
    link: { href: "#about", label: "EXPLORE MY UNIVERSE ↓" },
  },
]
const NA = ACTS.length

/* two masked lines that wipe in/out with the act's scroll offset (--a) */
function Lines({ t }: { t: [React.ReactNode, React.ReactNode] }) {
  return (
    <>
      <span className="ln">
        <span>{t[0]}</span>
      </span>
      <span className="ln l2">
        <em>{t[1]}</em>
      </span>
    </>
  )
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)
const ss = (t: number) => {
  t = clamp(t, 0, 1)
  return t * t * t * (t * (t * 6 - 15) + 10)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* ---------------- one camera path for the whole page ----------------
   d  = distance from the hole (Schwarzschild radii)   el = elevation above the disk (rad)
   az = azimuth around the hole (rad)                  rl = camera roll (rad)
   fov = vertical lens angle (deg) — long lenses pull the hole right up to the glass
   sx = where the hole sits on screen (desktop, in screen heights), sy = same on phones
   dim = scene brightness behind that part of the page, sc = left-side text scrim
   The first 7 keys are the film acts; the rest follow the page sections.
   The final key dives through the horizon into the tesseract.            */
type Key = { d: number; el: number; az: number; rl: number; fov: number; sx: number; sy: number; dim: number; sc: number; plunge?: boolean }
const FILM_KEYS: Key[] = [
  { d: 10, el: 0.07, az: 0.0, rl: -0.1, fov: 54, sx: 0, sy: 0.16, dim: 1, sc: 1 }, // landing
  { d: 8.5, el: 0.11, az: 0.45, rl: 0.06, fov: 56, sx: 0, sy: 0.16, dim: 0.85, sc: 1 }, // drifting in as the page begins
]
const SECTION_KEYS: Key[] = [
  { d: 9.5, el: 0.2, az: 6.0, rl: -0.12, fov: 58, sx: 0.32, sy: 0.1, dim: 0.62, sc: 0 }, // about
  { d: 12, el: 0.45, az: 6.5, rl: 0.1, fov: 60, sx: -0.3, sy: 0.0, dim: 0.5, sc: 0 }, // skills
  { d: 15, el: 0.7, az: 7.0, rl: 0.08, fov: 62, sx: 0.0, sy: 0.0, dim: 0.42, sc: 0 }, // certifications
  { d: 8, el: 0.08, az: 7.6, rl: -0.2, fov: 58, sx: 0.3, sy: 0.0, dim: 0.5, sc: 0 }, // projects
  { d: 11, el: 0.3, az: 8.1, rl: 0.15, fov: 60, sx: -0.28, sy: 0.0, dim: 0.5, sc: 0 }, // academic background
  { d: 16, el: 1.2, az: 8.6, rl: 0.0, fov: 64, sx: 0.0, sy: 0.0, dim: 0.4, sc: 0 }, // experience
  { d: 6.5, el: 0.12, az: 9.3, rl: 0.24, fov: 60, sx: 0.28, sy: 0.0, dim: 0.5, sc: 0 }, // achievements
  { d: 1.75, el: 0.1, az: 10.0, rl: 0.6, fov: 50, sx: 0.0, sy: 0.0, dim: 0.75, sc: 0, plunge: true }, // contact — through the horizon
]

const VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

/* ---- pass 1: the physical scene, linear HDR (no tone mapping here) ---- */
const FRAG = /* glsl */ `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform vec3  uCamPos;
uniform mat3  uCamRot;
uniform vec2  uShift;
uniform float uFov;
uniform float uFall;
uniform float uSteps;
uniform float uHi;
uniform vec3  uSun;

float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float hash13(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash12(i), hash12(i+vec2(1,0)), u.x), mix(hash12(i+vec2(0,1)), hash12(i+vec2(1,1)), u.x), u.y);
}
// noise wrapped seamlessly around the disk: u in [0,1) is the azimuth, K = cells per orbit
float nS(float x, float u, float K){ return mix(noise(vec2(x, u*K)), noise(vec2(x + 17.3, (u - 1.)*K)), u); }
float fbmS(float x, float u, float K, int oct){
  float a = .5, s = 0.;
  for(int i=0;i<5;i++){ if(i >= oct) break; s += a*nS(x, u, K); x = x*2.03 + 3.1; K *= 2.; a *= .5; }
  return s;
}

/* emission colour of the gas: deep navy -> ocean -> sky blue -> ice-white core */
vec3 heat(float T){
  T = clamp(T, 0., 3.);
  vec3 c0 = vec3(.01, .025, .06), c1 = vec3(.04, .17, .4), c2 = vec3(.3, .62, .95), c3 = vec3(.78, .91, 1.);
  return T < 1. ? mix(c0, c1, T) : T < 2. ? mix(c1, c2, T - 1.) : mix(c2, c3, T - 2.);
}

/* stars with real colour temperatures + a dusty galactic band */
vec3 sky(vec3 d){
  vec3 c = vec3(0.);
  for(int i=0;i<3;i++){
    float fi = float(i);
    vec3 p = d * (90. + fi*140.);
    vec3 id = floor(p);
    float h = hash13(id + fi*17.3);
    float th = .86 + fi*.04;
    if(h > th){
      vec3 o = vec3(hash13(id+1.3), hash13(id+2.7), hash13(id+5.1)) - .5;
      float dd = length(fract(p) - .5 - o*.6);
      float k = hash13(id + 9.1);
      vec3 tint = k < .3 ? vec3(1., .78, .6) : k < .75 ? vec3(1., .96, .92) : vec3(.72, .82, 1.);
      float mag = pow((h - th)/(1. - th), 3.) * (2.6 - fi*.7);
      c += tint * mag * exp(-dd*dd*(220. + 260.*uHi));
    }
  }
  vec3 bn = normalize(vec3(.3, .9, .27));
  float lat = dot(d, bn);
  float band = exp(-lat*lat*14.);
  vec2 bp = vec2(d.x + d.y*.6, d.z - d.y*.4);
  float n = noise(bp*5.) * .6 + noise(bp*13.) * .4;
  float lanes = smoothstep(.45, .75, noise(bp*9. + 4.));
  c += band * (.012 + .05*n*n) * (1. - .7*lanes) * vec3(.85, .8, .95);
  // a nearby sun: tiny white-hot disc, corona and soft glare (bloom does the rest)
  float sd = max(dot(d, uSun), 0.);
  c += vec3(.8, .9, 1.) * (pow(sd, 12000.) * 120. + pow(sd, 900.) * 3. + pow(sd, 60.) * .12 + pow(sd, 8.) * .02);
  return c;
}

/* ray-trace light around a Schwarzschild black hole (Rs = 1) */
vec3 hole(vec3 ro, vec3 rd){
  vec3 hv = cross(ro, rd); float h2 = dot(hv, hv);
  float b = sqrt(h2);
  if(b > 16.5){ // far rays: weak-field bending, straight to the sky
    float ahead = clamp(.5 - .5*dot(normalize(ro), rd), 0., 1.);
    vec3 n = normalize(ro - rd*dot(ro, rd));
    return sky(normalize(rd - n*(2./b)*ahead));
  }
  vec3 p = ro, v = rd;
  vec3 col = vec3(0.); float a = 0.; vec3 glow = vec3(0.);
  float esc = max(length(ro) + 1., 20.);
  bool horizon = false;
  float sf = uHi > .5 ? .075 : .11;
  for(int i=0;i<170;i++){
    if(float(i) >= uSteps) break;
    float r = length(p);
    float dt = clamp(sf*r - .05, .03, 3.2);
    v += -1.5 * h2 * p / (r*r*r*r*r) * dt;
    vec3 pn = p + v*dt;

    // the disk's luminous atmosphere (thin, hot, hugging the plane) + photon-sphere glow
    float rx = length(p.xz);
    float atm = smoothstep(15., 3.4, rx) * smoothstep(2.4, 3.6, rx) * exp(-abs(p.y)*(1.6 + 2.2/rx));
    glow += dt * atm * heat(2.6*pow(3./rx, .9)) * pow(3./rx, 1.2) * .012;
    glow += dt * exp(-abs(r - 1.52)*7.) * vec3(.62, .82, 1.) * .02;

    if(p.y * pn.y < 0.){
      vec3 q = mix(p, pn, p.y/(p.y - pn.y));
      float rq = length(q.xz);
      if(rq > 2.4 && rq < 16.){
        // Keplerian shear: inner gas laps the outer gas
        float ang = atan(q.z, q.x) + uTime * .9 / (rq*sqrt(rq));
        float u = fract(ang / 6.2831853);
        float lr = log(rq);
        float big = fbmS(lr*6., u, 7., 3);                   // clumps and arms
        float fil = fbmS(rq*6.5, u, 64., 4);   // fine orbital filaments (band-limited so they never alias into pixels)
        float dust = smoothstep(.5, .78, fbmS(lr*10., u, 18., 3) + big*.25 - .1) * smoothstep(4., 7.5, rq);
        float tex = clamp(.1 + big*1.1 + (fil - .45)*1.25, 0., 1.6);
        float prof = smoothstep(2.6, 3.2, rq) * (1. - smoothstep(8., 15.5, rq));
        // Novikov–Thorne-like falloff, peaking just outside the inner edge
        float I = prof * pow(3./rq, 2.1) * (.25 + tex) * (1. - .8*dust);
        vec3 vd = vec3(-q.z, 0., q.x) / rq;
        float beta = min(sqrt(.5/rq), .7) * .85;
        float D = sqrt(1. - beta*beta) / (1. - beta*dot(vd, -normalize(v)));
        float grav = sqrt(max(1. - 1./rq, 0.));
        I *= pow(D, 3.) * grav;
        float T = 2.9 * pow(3./rq, .9) * pow(D, .7) * (.8 + .25*tex) * grav * (1. - .55*dust);
        float al = clamp(prof * (.5 + tex) * 1.25, 0., .985);
        col += (1. - a) * heat(T) * I * 3.2;
        a += (1. - a) * al;
      }
    }
    p = pn;
    float rn = length(p);
    if(rn < 1.){ horizon = true; break; }
    if(rn > esc && dot(p, v) > 0.) break;
    if(a > .985) break;
  }
  if(!horizon) col += (1. - a) * sky(normalize(v));
  col += glow * (1. - a*.5);
  return col;
}

/* endless tesseract lattice */
float near05(float v){ return .25 - abs(mod(v, .5) - .25); }
vec3 lattice(vec2 uv){
  float tt = uTime;
  vec3 ro = vec3(1. + sin(tt*.23)*.18, 1.1 + cos(tt*.19)*.14, tt*1.25);
  vec3 rd = normalize(vec3(uv*uFov*2., 1.));
  float c = cos(tt*.05 + .3), s = sin(tt*.05 + .3);
  rd.xy = mat2(c, -s, s, c) * rd.xy;
  float t = .05, g = 0., gr = 0.;
  for(int i=0;i<44;i++){
    vec3 p = ro + rd*t;
    vec3 e = 1. - abs(mod(p, 2.) - 1.);
    float beams = min(min(length(e.yz), length(e.xz)), length(e.xy)) - .014;
    float rails = min(length(vec2(e.x, near05(p.y))), length(vec2(e.y, near05(p.x)))) - .003;
    float fog = exp(-t*.15);
    float st = max(min(beams, rails)*.7, .05);
    g  += st * .05 / (.003 + beams*beams*45.) * fog;
    gr += st * .013 / (.0012 + rails*rails*160.) * fog;
    t += st;
    if(t > 26.) break;
  }
  float core = exp(-length(uv)*5.5);
  return (vec3(g*.14 + gr*.08) * vec3(.92, .95, 1.) + core*.45*vec3(.5, .78, 1.)) * 2.2;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - .5*uRes) / uRes.y;
  vec2 uvh = uv - uShift;
  vec3 rd = normalize(uCamRot * vec3(uvh*uFov*2., 1.));
  vec3 col = vec3(0.);
  float holeMix = 1. - smoothstep(.42, .62, uFall);
  float latMix  = smoothstep(.52, .9, uFall);
  if(holeMix > .001) col += hole(uCamPos, rd) * holeMix;
  if(latMix  > .001) col += lattice(uv) * latMix;
  gl_FragColor = vec4(col, 1.);
}
`

/* ---- pass 2: bloom (bright-pass downsample, then separable gaussian) ---- */
const BRIGHT = /* glsl */ `
precision highp float;
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uTh;
varying vec2 vUv;
void main(){
  vec3 c = .25*(texture2D(tSrc, vUv + uTexel*vec2(-1.,-1.)).rgb + texture2D(tSrc, vUv + uTexel*vec2(1.,-1.)).rgb
              + texture2D(tSrc, vUv + uTexel*vec2(-1.,1.)).rgb + texture2D(tSrc, vUv + uTexel*vec2(1.,1.)).rgb);
  float l = max(c.r, max(c.g, c.b));
  gl_FragColor = vec4(c * max(l - uTh, 0.) / max(l, 1e-4), 1.);
}
`
const BLUR = /* glsl */ `
precision highp float;
uniform sampler2D tSrc; uniform vec2 uDir;
varying vec2 vUv;
void main(){
  vec3 c = texture2D(tSrc, vUv).rgb * .2270270270;
  c += (texture2D(tSrc, vUv + uDir*1.3846153846).rgb + texture2D(tSrc, vUv - uDir*1.3846153846).rgb) * .3162162162;
  c += (texture2D(tSrc, vUv + uDir*3.2307692308).rgb + texture2D(tSrc, vUv - uDir*3.2307692308).rgb) * .0702702703;
  gl_FragColor = vec4(c, 1.);
}
`

/* ---- pass 3: lens + film: CA, bloom, ACES, grade, vignette, scrim, grain ---- */
const COMP = /* glsl */ `
precision highp float;
uniform sampler2D tScene; uniform sampler2D tBloomA; uniform sampler2D tBloomB; uniform vec2 uSceneRes;
uniform vec2 uRes; uniform float uTime; uniform float uIntro; uniform float uDim; uniform float uScrim;
uniform float uMob; uniform float uExposure; uniform float uWarp;
varying vec2 vUv;
// 4-tap B-spline bicubic: smooth upscale of the scene buffer, no visible pixels
vec3 bicubic(sampler2D t, vec2 uv, vec2 res){
  vec2 st = uv*res - .5; vec2 i = floor(st); vec2 f = st - i;
  vec2 f2 = f*f, f3 = f2*f;
  vec2 w0 = (1. - 3.*f + 3.*f2 - f3)/6., w1 = (4. - 6.*f2 + 3.*f3)/6., w2 = (1. + 3.*f + 3.*f2 - 3.*f3)/6., w3 = f3/6.;
  vec2 g0 = w0 + w1, g1 = w2 + w3;
  vec2 h0 = (w1/g0 - 1. + i + .5)/res, h1 = (w3/g1 + 1. + i + .5)/res;
  return g0.y*(g0.x*texture2D(t, vec2(h0.x, h0.y)).rgb + g1.x*texture2D(t, vec2(h1.x, h0.y)).rgb)
       + g1.y*(g0.x*texture2D(t, vec2(h0.x, h1.y)).rgb + g1.x*texture2D(t, vec2(h1.x, h1.y)).rgb);
}
vec3 aces(vec3 x){ return clamp((x*(2.51*x + .03)) / (x*(2.43*x + .59) + .14), 0., 1.); }
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
void main(){
  vec2 dc = vUv - .5;
  float ca = (.0016 + uWarp*.006) * dot(dc, dc) * 4.;
  vec3 c;
  c.r = bicubic(tScene, vUv - dc*ca, uSceneRes).r;
  c.g = bicubic(tScene, vUv, uSceneRes).g;
  c.b = bicubic(tScene, vUv + dc*ca, uSceneRes).b;
  vec3 bloom = texture2D(tBloomA, vUv).rgb * .32 + texture2D(tBloomB, vUv).rgb * .45;
  c += bloom;
  c *= uExposure;
  c = aces(c);
  // cool filmic grade for the dark theme
  float l = dot(c, vec3(.2126, .7152, .0722));
  c = mix(c * vec3(.94, .98, 1.05), c * vec3(.98, 1., 1.03), smoothstep(.2, .8, l));
  c = pow(c, vec3(1. / 2.2));
  vec2 sp = vUv;
  float vig = 1. - smoothstep(.5, 1.2, length((sp - vec2(.55, .5)) * vec2(1.25, 1.)));
  float scrim = uMob > .5 ? mix(.1, 1., smoothstep(.0, .62, sp.y)) : mix(.3, 1., smoothstep(.0, .5, sp.y));
  c *= mix(.25, 1., vig) * mix(1., scrim, uScrim) * uDim * uIntro;
  c += (hash12(gl_FragCoord.xy + fract(uTime*7.)*91.) - .5) * .008;
  gl_FragColor = vec4(max(c, 0.), 1.);
}
`

export default function LandingHero() {
  const filmRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const actRefs = useRef<(HTMLDivElement | null)[]>([])
  const railRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)
  const progRef = useRef<HTMLDivElement>(null)
  const hudDist = useRef<HTMLElement>(null)
  const hudDil = useRef<HTMLElement>(null)
  const hudClock = useRef<HTMLElement>(null)

  /* ---------------- text layer: driven by scroll only ----------------
     rAF-batched, layout read once per resize, styles written only on change */
  useEffect(() => {
    const film = filmRef.current!
    let filmTop = 0,
      filmH = 1,
      vh = window.innerHeight,
      queued = false
    const last: Record<string, string> = {}
    const measure = () => {
      vh = window.innerHeight
      filmTop = film.getBoundingClientRect().top + window.scrollY
      filmH = Math.max(film.offsetHeight - vh, 1)
    }
    const set = (el: HTMLElement, key: string, prop: "opacity" | "transform" | "visibility" | "pointerEvents", v: string) => {
      if (last[key] === v) return
      last[key] = v
      el.style[prop] = v
    }
    let lastAi = -1,
      lastPast: boolean | null = null
    const update = () => {
      queued = false
      const y = window.scrollY - filmTop
      const p = clamp(y / filmH, 0, 1)
      const exit = clamp((y - filmH) / (vh * 0.55), 0, 1)
      // single landing act: it lifts away as you scroll into the page
      const s = NA > 1 ? p * (NA - 1) : p * 0.85
      actRefs.current.forEach((el, q) => {
        if (!el) return
        const op = Math.round(clamp(1 - Math.abs(s - q) * (NA > 1 ? 2.15 : 1.35), 0, 1) * (1 - exit) * 100) / 100
        set(el, `o${q}`, "opacity", String(op))
        set(el, `v${q}`, "visibility", op < 0.01 ? "hidden" : "visible")
        if (op >= 0.01) set(el, `t${q}`, "transform", `translate3d(0,${Math.round((s - q) * -26)}px,0)`)
        set(el, `p${q}`, "pointerEvents", op > 0.6 ? "auto" : "none")
        if (op >= 0.01) {
          const av = (Math.round(clamp(s - q, -1, 1) * 1000) / 1000).toString()
          if (last[`a${q}`] !== av) {
            last[`a${q}`] = av
            el.style.setProperty("--a", av)
          }
        }
      })
      const ai = Math.round(clamp(s, 0, NA - 1))
      const rail = railRef.current
      if (rail) {
        if (ai !== lastAi) Array.from(rail.children).forEach((c, q) => c.classList.toggle("on", q === ai))
        set(rail, "ro", "opacity", String(Math.round((1 - exit) * 100) / 100))
        set(rail, "rv", "visibility", exit > 0.99 ? "hidden" : "visible")
      }
      lastAi = ai
      if (progRef.current) set(progRef.current, "pg", "transform", `scaleY(${(Math.round(p * 1000) / 1000).toString()})`)
      if (hudRef.current) set(hudRef.current, "ho", "opacity", String(Math.round((1 - exit) * 100) / 100))
      if (hintRef.current) set(hintRef.current, "hi", "opacity", String(Math.round(clamp(1 - p * 9, 0, 1) * (1 - exit) * 100) / 100))
      const past = exit > 0.6
      if (past !== lastPast) document.body.classList.toggle("film-past", past)
      lastPast = past
    }
    const onScroll = () => {
      if (!queued) {
        queued = true
        requestAnimationFrame(update)
      }
    }
    const onResize = () => {
      measure()
      onScroll()
    }
    measure()
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  /* ---------------- WebGL: black hole, behind the whole page ---------------- */
  useEffect(() => {
    let disposed = false
    let cleanup = () => {}
    const pre = preRef.current
    const setPct = (v: number, label = "CALIBRATING") => {
      if (pctRef.current) pctRef.current.textContent = `${label} ${Math.round(v * 100)}%`
      if (barRef.current) barRef.current.style.transform = `scaleX(${v})`
    }
    const finishPre = () => pre?.classList.add("gone")
    const bail = () => {
      finishPre()
      document.body.classList.add("no-webgl")
    }
    setPct(0.04)

    ;(async () => {
      const THREE = await import("three")
      if (disposed || !canvasRef.current || !filmRef.current) return
      setPct(0.3, "PLOTTING GEODESICS")

      const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const MOB = window.innerWidth < 820 || window.matchMedia("(pointer: coarse)").matches
      const lowEnd = (navigator.hardwareConcurrency || 8) <= 4
      const DPR = Math.min(window.devicePixelRatio || 1, MOB ? 1.5 : 2)

      /* dynamic resolution: the scene pass scales between these (× CSS pixels).
         While scrolling it stays in the low tiers for fluid motion; at rest it climbs
         to native device resolution (4K on a 4K screen) as long as the GPU keeps up. */
      const TIERS = [0.5, 0.6, 0.75, 0.9, 1, 1.25, 1.5, 2].filter((x) => x <= DPR + 0.001)
      const MOVE_CAP = Math.max(0, TIERS.filter((x) => x <= 1).length - 1)
      let tier = Math.min(lowEnd || MOB ? 2 : MOVE_CAP, TIERS.length - 1)
      // ?quality=max locks the top tier (for 4K stills / screenshots)
      const LOCK_MAX = new URLSearchParams(window.location.search).get("quality") === "max"
      if (LOCK_MAX) tier = TIERS.length - 1

      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "high-performance" })
      } catch {
        bail()
        return
      }
      renderer.setPixelRatio(DPR)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.autoClear = false

      /* ---------- passes ---------- */
      const canFloat = renderer.capabilities.isWebGL2
      const rtOpts = { type: canFloat ? THREE.HalfFloatType : THREE.UnsignedByteType, depthBuffer: false, stencilBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }
      const sceneRT = new THREE.WebGLRenderTarget(4, 4, rtOpts)
      const bA = new THREE.WebGLRenderTarget(4, 4, rtOpts)
      const bB = new THREE.WebGLRenderTarget(4, 4, rtOpts)
      const cA = new THREE.WebGLRenderTarget(4, 4, rtOpts)
      const cB = new THREE.WebGLRenderTarget(4, 4, rtOpts)

      const FOV = Math.tan((50 * Math.PI) / 360)
      const uniforms = {
        uRes: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uCamPos: { value: new THREE.Vector3(0, 4, 30) },
        uCamRot: { value: new THREE.Matrix3() },
        uShift: { value: new THREE.Vector2(0, 0) },
        uFov: { value: FOV },
        uFall: { value: 0 },
        uSteps: { value: 110 },
        uHi: { value: 0 },
        uSun: { value: new THREE.Vector3(0, 0, -1) },
      }
      const sceneMat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, depthTest: false, depthWrite: false })
      const brightMat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: BRIGHT, depthTest: false, depthWrite: false, uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() }, uTh: { value: 1.1 } } })
      const blurMat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: BLUR, depthTest: false, depthWrite: false, uniforms: { tSrc: { value: null }, uDir: { value: new THREE.Vector2() } } })
      const compU = {
        tScene: { value: sceneRT.texture },
        uSceneRes: { value: new THREE.Vector2(1, 1) },
        tBloomA: { value: bA.texture },
        tBloomB: { value: cA.texture },
        uRes: { value: new THREE.Vector2() },
        uTime: { value: 0 },
        uIntro: { value: 0 },
        uDim: { value: 1 },
        uScrim: { value: 1 },
        uMob: { value: MOB ? 1 : 0 },
        uExposure: { value: 1.0 },
        uWarp: { value: 0 },
      }
      const compMat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: COMP, uniforms: compU, depthTest: false, depthWrite: false })
      const quadGeo = new THREE.PlaneGeometry(2, 2)
      const quad = new THREE.Mesh(quadGeo, sceneMat)
      quad.frustumCulled = false
      const scene = new THREE.Scene()
      scene.add(quad)
      const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      type RT = typeof sceneRT
      const pass = (m: InstanceType<typeof THREE.ShaderMaterial>, target: RT | null) => {
        quad.material = m
        renderer.setRenderTarget(target)
        renderer.render(scene, ortho)
      }

      const sizeScene = () => {
        const s = TIERS[tier]
        const w = Math.max(2, Math.round(window.innerWidth * s)),
          h = Math.max(2, Math.round(window.innerHeight * s))
        sceneRT.setSize(w, h)
        uniforms.uRes.value.set(w, h)
        const hi = s >= 0.99
        uniforms.uHi.value = hi ? 1 : 0
        uniforms.uSteps.value = MOB ? (hi ? 96 : 80) : hi ? 140 : 110
        compU.uSceneRes.value.set(w, h)
      }
      const sizeBloom = () => {
        const w = Math.max(8, Math.round(window.innerWidth / 4)),
          h = Math.max(8, Math.round(window.innerHeight / 4))
        bA.setSize(w, h)
        bB.setSize(w, h)
        cA.setSize(Math.max(4, w >> 2), Math.max(4, h >> 2))
        cB.setSize(Math.max(4, w >> 2), Math.max(4, h >> 2))
        compU.uRes.value.set(window.innerWidth, window.innerHeight)
      }
      sizeScene()
      sizeBloom()

      // sun direction: fixed in the sky, top-right of the opening shot
      {
        const k = FILM_KEYS[0]
        const cp = new THREE.Vector3(Math.cos(k.el) * Math.sin(k.az), Math.sin(k.el), Math.cos(k.el) * Math.cos(k.az))
        const fw = cp.clone().multiplyScalar(-1).normalize()
        const rt = new THREE.Vector3().crossVectors(fw, new THREE.Vector3(0, 1, 0)).normalize()
        const upv = new THREE.Vector3().crossVectors(rt, fw)
        uniforms.uSun.value.copy(fw).addScaledVector(rt, 0.62).addScaledVector(upv, 0.2).normalize()
      }

      try {
        renderer.compile(scene, ortho)
      } catch {
        bail()
        return
      }
      if (disposed) return
      setPct(0.85, "LOCKING ORBIT")

      /* ---------- scroll → position along the page-long camera path ---------- */
      const film = filmRef.current!
      const KEYS: Key[] = [...FILM_KEYS]
      let anchors: number[] = []
      let vh = window.innerHeight
      const measure = () => {
        vh = window.innerHeight
        const filmTop = film.getBoundingClientRect().top + window.scrollY
        const filmH = Math.max(film.offsetHeight - vh, 1)
        anchors = FILM_KEYS.map((_, i) => filmTop + (filmH * i) / (FILM_KEYS.length - 1))
        KEYS.length = FILM_KEYS.length
        const secs = Array.from(document.querySelectorAll<HTMLElement>(".ar-main .ar-sec"))
        const maxY = Math.max(document.documentElement.scrollHeight - vh, 0)
        let lastA = anchors[anchors.length - 1]
        const count = Math.min(secs.length, SECTION_KEYS.length)
        secs.slice(0, count).forEach((el, i) => {
          const isLast = i === count - 1
          const k = isLast ? SECTION_KEYS[SECTION_KEYS.length - 1] : SECTION_KEYS[i]
          let y = el.getBoundingClientRect().top + window.scrollY - vh * (isLast ? 0.15 : 0.4)
          y = Math.min(y, maxY - 2)
          if (y <= lastA + 40) y = lastA + 40
          anchors.push(y)
          KEYS.push(k)
          lastA = y
        })
      }
      measure()
      const NF = FILM_KEYS.length

      let gTarget = 0,
        gCur = 0,
        mx = 0,
        my = 0,
        tmx = 0,
        tmy = 0,
        raf = 0,
        hudTick = 0,
        intro = 0,
        lastT = performance.now(),
        lastDraw = 0,
        slow = 0,
        fast = 0,
        visible = true,
        warp = 0,
        stillSince = performance.now()
      const start = lastT
      const camP = new THREE.Vector3(),
        fwd = new THREE.Vector3(),
        right = new THREE.Vector3(),
        up = new THREE.Vector3(),
        r2 = new THREE.Vector3(),
        u2 = new THREE.Vector3(),
        WUP = new THREE.Vector3(0, 1, 0),
        basis = new THREE.Matrix4(),
        tmp = new THREE.Vector3()

      const readScroll = () => {
        const y = window.scrollY
        const n = anchors.length
        if (y <= anchors[0]) gTarget = 0
        else if (y >= anchors[n - 1]) gTarget = n - 1
        else {
          let k = 0
          while (k < n - 2 && y >= anchors[k + 1]) k++
          gTarget = k + (y - anchors[k]) / Math.max(anchors[k + 1] - anchors[k], 1)
        }
      }
      const onScroll = () => {
        readScroll()
        kick()
      }
      const onMouse = (e: PointerEvent) => {
        tmx = (e.clientX / window.innerWidth - 0.5) * 2
        tmy = (e.clientY / window.innerHeight - 0.5) * 2
      }
      let rT = 0
      const onResize = () => {
        clearTimeout(rT)
        rT = window.setTimeout(() => {
          measure()
          renderer.setSize(window.innerWidth, window.innerHeight)
          sizeScene()
          sizeBloom()
          readScroll()
          kick()
        }, 120)
      }
      const ro = new ResizeObserver(() => onResize())
      ro.observe(document.body)
      const onVis = () => {
        visible = document.visibilityState === "visible"
        if (visible) {
          lastT = performance.now()
          kick()
        }
      }
      readScroll()
      gCur = gTarget

      const fmt = (n: number) => String(Math.floor(n)).padStart(2, "0")
      const DT_MOVE = MOB ? 1000 / 31 : 1000 / 46
      const DT_STILL = MOB ? 1000 / 24 : 1000 / 30

      const frame = (now: number) => {
        raf = 0
        if (!visible || disposed) return
        raf = requestAnimationFrame(frame)
        const moving = Math.abs(gTarget - gCur) > 0.004
        if (moving) stillSince = now
        const still = now - stillSince > 260
        const MIN_DT = still ? DT_STILL : DT_MOVE
        if (now - lastDraw < MIN_DT) return
        const dtMs = now - lastT
        lastT = now
        lastDraw = now
        const dt = Math.min(dtMs / 1000, 0.05)
        const time = RM ? 8 : (now - start) / 1000
        gCur += (gTarget - gCur) * (RM ? 1 : 1 - Math.pow(0.93, dt * 60))
        mx += (tmx - mx) * 0.06
        my += (tmy - my) * 0.06
        intro = Math.min(1, (now - start) / 1800)
        const wTarget = RM ? 0 : clamp(Math.abs(gTarget - gCur) * 4.3, 0, 1)
        warp += (wTarget - warp) * (wTarget > warp ? 0.25 : 0.08)

        const n = KEYS.length
        const i0 = Math.min(n - 2, Math.floor(gCur))
        const f = gCur - i0
        const t = i0 < NF - 1 ? ss((f - 0.18) / 0.64) : ss(f)
        const A = KEYS[i0],
          B = KEYS[i0 + 1]
        const lens = Math.tan((lerp(A.fov, B.fov, t) * Math.PI) / 360) * (MOB ? 1.12 : 1)
        const fovT = lens * (1 + 0.08 * warp)
        uniforms.uFov.value = fovT
        const plunging = !!B.plunge
        const fall = plunging ? t : 0
        const td = plunging ? Math.pow(t, 1.7) : t
        const far = MOB ? lerp(A.plunge ? 1 : 1.35, B.plunge ? 1 : 1.35, td) : 1
        const d = Math.exp(lerp(Math.log(A.d), Math.log(B.d), td)) * far
        const el = lerp(A.el, B.el, t) + my * 0.04
        const az = lerp(A.az, B.az, t) + (RM ? 0 : time * 0.0025) + mx * 0.08
        const rl = lerp(A.rl, B.rl, t) + Math.sin(time * 0.3) * 0.01

        camP.set(Math.cos(el) * Math.sin(az) * d, Math.sin(el) * d, Math.cos(el) * Math.cos(az) * d)
        fwd.copy(camP).multiplyScalar(-1).normalize()
        right.crossVectors(fwd, WUP).normalize()
        up.crossVectors(right, fwd)
        const cr = Math.cos(rl),
          sr = Math.sin(rl)
        r2.set(right.x * cr + up.x * sr, right.y * cr + up.y * sr, right.z * cr + up.z * sr)
        u2.set(up.x * cr - right.x * sr, up.y * cr - right.y * sr, up.z * cr - right.z * sr)
        uniforms.uCamRot.value.set(r2.x, u2.x, fwd.x, r2.y, u2.y, fwd.y, r2.z, u2.z, fwd.z)
        uniforms.uCamPos.value.copy(camP)

        const centre = plunging ? 1 - ss((fall - 0.2) / 0.5) : 1
        const sx = lerp(A.sx, B.sx, t) * centre,
          sy = lerp(A.sy, B.sy, t) * centre
        if (MOB) uniforms.uShift.value.set(0, sy)
        else uniforms.uShift.value.set(sx * Math.min(1, window.innerWidth / window.innerHeight / 1.5), sy * 0.45)
        uniforms.uFall.value = fall
        uniforms.uTime.value = time

        /* scene → bloom → composite */
        pass(sceneMat, sceneRT)
        brightMat.uniforms.tSrc.value = sceneRT.texture
        brightMat.uniforms.uTexel.value.set(0.5 / sceneRT.width, 0.5 / sceneRT.height)
        pass(brightMat, bA)
        const blur = (src: typeof bA, dst: typeof bA, dx: number, dy: number) => {
          blurMat.uniforms.tSrc.value = src.texture
          blurMat.uniforms.uDir.value.set(dx / src.width, dy / src.height)
          pass(blurMat, dst)
        }
        blur(bA, bB, 1.4, 0)
        blur(bB, bA, 0, 1.4)
        // wide halo: downsample + blur again
        blur(bA, cB, 1, 0)
        blur(cB, cA, 0, 1)
        blur(cA, cB, 2.4, 0)
        blur(cB, cA, 0, 2.4)
        compU.uTime.value = time
        compU.uIntro.value = ss(intro)
        compU.uDim.value = lerp(A.dim, B.dim, t)
        compU.uScrim.value = lerp(A.sc, B.sc, t)
        compU.uWarp.value = warp
        compU.uExposure.value = 0.95
        pass(compMat, null)

        if (++hudTick % 8 === 0) {
          if (hudDist.current) hudDist.current.textContent = fall > 0.62 ? "—— Rs" : `${d.toFixed(1)} Rs`
          const dil = 1 / Math.sqrt(Math.max(1 - 1 / d, 0.0001))
          if (hudDil.current) hudDil.current.textContent = fall > 0.62 ? "×∞" : `×${dil.toFixed(dil < 10 ? 3 : 1)}`
          const sec = (now - start) / 1000
          if (hudClock.current) hudClock.current.textContent = `${fmt(sec / 3600)}:${fmt((sec / 60) % 60)}:${fmt(sec % 60)}`
        }

        // dynamic resolution
        const cap = still || LOCK_MAX ? TIERS.length - 1 : MOVE_CAP
        if (tier > cap) {
          tier = cap
          sizeScene()
        }
        if (dtMs > MIN_DT * 1.4) slow++
        else slow = Math.max(0, slow - 1)
        if (dtMs < MIN_DT * 1.12) fast++
        else fast = 0
        if (LOCK_MAX) {
          /* fixed */
        } else if (slow > 5 && tier > 0) {
          tier--
          sizeScene()
          slow = 0
          fast = 0
        } else if (fast > (still ? 12 : 90) && tier < cap) {
          tier++
          sizeScene()
          fast = 0
        }
      }
      const kick = () => {
        if (!raf && visible && !disposed) {
          lastT = performance.now()
          raf = requestAnimationFrame(frame)
        }
      }

      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("pointermove", onMouse, { passive: true })
      window.addEventListener("resize", onResize)
      document.addEventListener("visibilitychange", onVis)
      setPct(1, "READY")
      kick()
      setTimeout(finishPre, 300)

      cleanup = () => {
        cancelAnimationFrame(raf)
        clearTimeout(rT)
        ro.disconnect()
        window.removeEventListener("scroll", onScroll)
        window.removeEventListener("pointermove", onMouse)
        window.removeEventListener("resize", onResize)
        document.removeEventListener("visibilitychange", onVis)
        quadGeo.dispose()
        ;[sceneMat, brightMat, blurMat, compMat].forEach((m) => m.dispose())
        ;[sceneRT, bA, bB, cA, cB].forEach((r) => r.dispose())
        renderer.dispose()
      }
    })().catch((e) => {
      console.error(e)
      bail()
    })

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  const skip = () => {
    const film = filmRef.current
    if (!film) return
    const top = film.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + film.offsetHeight, behavior: "smooth" })
  }

  return (
    <>
      <div ref={preRef} className="ar-pre" aria-hidden="true">
        <div className="ar-pre-ring" />
        <div className="ar-pre-name">ABHINAV RISHI</div>
        <div className="ar-pre-bar">
          <div ref={barRef} />
        </div>
        <div ref={pctRef} className="ar-pre-pct">
          CALIBRATING 0%
        </div>
      </div>

      <canvas ref={canvasRef} className="ar-scene" aria-hidden="true" />
      <div className="ar-bars" aria-hidden="true" />

      <div className="ar-prog" aria-hidden="true">
        <div ref={progRef} />
      </div>


      <div ref={hudRef} className="ar-hud" aria-hidden="true">
        <div>
          <span>DIST. TO HORIZON</span>
          <b ref={hudDist}>30.0 Rs</b>
        </div>
        <div>
          <span>TIME DILATION</span>
          <b ref={hudDil}>×1.017</b>
        </div>
        <div>
          <span>MISSION T+</span>
          <b ref={hudClock}>00:00:00</b>
        </div>
      </div>

      <div id="hero" ref={filmRef} className="ar-film">
        {ACTS.map((a, i) => (
          <div
            key={a.rail}
            ref={(el) => {
              actRefs.current[i] = el
            }}
            className={`ar-act ${i === 0 ? "is-first" : ""}`}
          >
            <div className="ar-act-inner">
              <div className="ar-act-l">
                <div className="ar-eyebrow">
                  <s />
                  {a.eyebrow}
                </div>
                {i === 0 ? (
                  <h1 className="ar-mega">
                    <Lines t={a.title} />
                  </h1>
                ) : (
                  <h2 className="ar-big">
                    <Lines t={a.title} />
                  </h2>
                )}
              </div>
              <div className="ar-act-r">
                <p className="ar-lede">{a.lede}</p>
                {i === 0 && (
                  <div className="ar-chips">
                    {["MACHINE LEARNING", "GENERATIVE AI", "FULL-STACK"].map((c, k) => (
                      <span key={c} className="ar-chip" style={{ ["--i" as string]: k }}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                {a.readout && (
                  <div className="ar-card ar-readout">
                    <div className="hd">
                      <span>{a.readout.head}</span>
                      <span>{a.readout.tag}</span>
                    </div>
                    {a.readout.rows.map((r, k) => (
                      <div key={k} className="row" style={{ ["--i" as string]: k }}>
                        <span>{r.k}</span>
                        <b className={r.amb ? "amb" : ""}>{r.v}</b>
                      </div>
                    ))}
                  </div>
                )}
                {a.link && (
                  <a className="ar-btn" href={a.link.href} {...(a.link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {a.link.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={hintRef} className="ar-hint" aria-hidden="true">
        SCROLL TO DESCEND
        <b />
      </div>
      <button type="button" className="ar-skip" onClick={skip}>
        SKIP INTRO ↓
      </button>
    </>
  )
}
