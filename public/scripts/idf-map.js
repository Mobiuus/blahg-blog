// Carte de l'Île-de-France de la page /map : réseau ferré (OpenStreetMap), tronçons déjà parcourus
// et brouillard de guerre sur tout le reste. Sol et tracés en SVG, brouillard en canvas,
// le tout posé sur un plateau incliné en CSS 3D. Données : /data/idf-network.json
// (généré par scripts/build-idf-network.mjs).
const DATA_URL = "/data/idf-network.json";
const SVG_NS = "http://www.w3.org/2000/svg";
const W = 1000; // repère du plateau (viewBox)
const H = 820;
const PAD = 18;
const DEPTH = 16; // épaisseur du socle
const TILT = 34; // inclinaison du plateau (degrés)
const BASE_SCALE = 0.95; // marge pour que le bord proche (agrandi par la perspective) reste visible
const MIN_ZOOM = 1;
const MAX_ZOOM = 10;
const FOG_SCALE = 1.5; // résolution du brouillard (px de canvas par unité de plateau)
const CORRIDOR = 9; // demi-largeur de la zone dégagée le long d'un tronçon
const STOP_RADIUS = 13; // rayon dégagé autour d'une station visitée
const INTRO_MS = 1800;

const { trips } = JSON.parse(document.getElementById("map-data").textContent);
const wrap = document.getElementById("idf-wrap");
const stage = document.getElementById("idf-stage");
const board = document.getElementById("idf-board");
const ground = document.getElementById("idf-ground");
const routes = document.getElementById("idf-routes");
const fogCanvas = document.getElementById("idf-fog");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function el(tag, attrs = {}, parent) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

// Même normalisation que le script de build
const norm = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[''`\-–—/().,]/g, " ").replace(/\bst\b/g, "saint").replace(/\bste\b/g, "sainte")
    .replace(/\s+/g, " ").trim();

const data = await fetch(DATA_URL).then((r) => r.json());

// ── Projection : Mercator ajusté au contour de l'Île-de-France ──
const RAD = Math.PI / 180;
const merc = (lon, lat) => [lon * RAD, Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2))];
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
for (const d of data.departements) {
  for (const ring of d.rings) {
    for (const [lon, lat] of ring) {
      const [x, y] = merc(lon, lat);
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  }
}
const availH = H - 2 * PAD - DEPTH - 12;
const scale = Math.min((W - 2 * PAD) / (maxX - minX), availH / (maxY - minY));
const offX = (W - (maxX - minX) * scale) / 2;
const offY = PAD + (availH - (maxY - minY) * scale) / 2;
const project = ([lon, lat]) => {
  const [x, y] = merc(lon, lat);
  return [offX + (x - minX) * scale, offY + (maxY - y) * scale];
};

const f1 = (v) => v.toFixed(1);
const linePath = (pts, closed = false) =>
  pts.length ? "M" + pts.map((p) => f1(p[0]) + "," + f1(p[1])).join("L") + (closed ? "Z" : "") : "";
const dotsPath = (pts) => pts.map((p) => `M${f1(p[0])},${f1(p[1])}h0.01`).join("");

const silhouette = data.departements.flatMap((d) => d.rings).map((r) => linePath(r.map(project), true)).join("");
const stationXY = data.stations.map(([, lon, lat]) => project([lon, lat]));

// ── Tronçons parcourus ──
const idsByName = new Map();
data.stations.forEach(([name], i) => {
  const n = norm(name);
  if (!idsByName.has(n)) idsByName.set(n, new Set());
  idsByName.get(n).add(i);
});
function matchStation(name) {
  const n = norm(name);
  if (idsByName.has(n)) return idsByName.get(n);
  const ids = new Set();
  for (const [key, set] of idsByName) if (key.includes(n) || (key.length > 4 && n.includes(key))) set.forEach((i) => ids.add(i));
  return ids;
}
function resolve(trip) {
  const line = data.lines.find((l) => l.k.toLowerCase() === trip.line.toLowerCase());
  if (!line) return null;
  const from = matchStation(trip.from);
  const to = matchStation(trip.to);
  let best = null;
  for (const v of line.v) {
    const i = v.s.findIndex((id) => from.has(id));
    const j = v.s.findIndex((id) => to.has(id));
    if (i < 0 || j < 0 || i === j) continue;
    const a = Math.min(i, j), b = Math.max(i, j);
    // à plusieurs variantes possibles, on garde la plus omnibus (le plus d'arrêts entre les deux)
    if (!best || b - a > best.b - best.a) best = { v, a, b };
  }
  if (!best) return null;
  const { v, a, b } = best;
  const stops = v.s.slice(a, b + 1);
  let coords;
  if (v.a) {
    const ca = Math.min(v.a[a], v.a[b]), cb = Math.max(v.a[a], v.a[b]);
    coords = v.c.slice(ca, cb + 1).map(project);
  } else {
    coords = stops.map((id) => stationXY[id]);
  }
  return { line, stops, coords };
}
const legs = [];
for (const trip of trips) {
  const leg = resolve(trip);
  if (leg) legs.push(leg);
  else console.warn("Map : tronçon introuvable", trip);
}
const visitedStops = [...new Set(legs.flatMap((l) => l.stops))].map((id) => stationXY[id]);

// ── Sol : ombre, socle, face supérieure, quadrillage, départements, rivières, réseau grisé ──
const defs = el("defs", {}, ground);
el("path", { id: "idf-sil", d: silhouette }, defs);
el("path", { d: silhouette }, el("clipPath", { id: "idf-clip" }, defs));
el("feGaussianBlur", { stdDeviation: 10 }, el("filter", { id: "idf-blur", x: "-20%", y: "-20%", width: "140%", height: "140%" }, defs));
ground.setAttribute("viewBox", `0 0 ${W} ${H}`);

el("use", { href: "#idf-sil", class: "i-shadow", filter: "url(#idf-blur)", transform: `translate(0 ${DEPTH + 10})` }, ground);
el("use", { href: "#idf-sil", class: "i-edge", y: DEPTH }, ground);
for (let i = DEPTH; i >= 1; i--) el("use", { href: "#idf-sil", class: "i-side", y: i }, ground);
el("use", { href: "#idf-sil", class: "i-edge" }, ground);
el("use", { href: "#idf-sil", class: "i-top" }, ground);

const top = el("g", { "clip-path": "url(#idf-clip)" }, ground);
const grid = [];
for (let lon = 1.4; lon <= 3.61; lon += 0.1) grid.push(linePath([project([lon, 48]), project([lon, 49.4])]));
for (let lat = 48.1; lat <= 49.31; lat += 0.1) grid.push(linePath([project([1.3, lat]), project([3.7, lat])]));
el("path", { class: "i-grid", d: grid.join("") }, top);
el("path", {
  class: "i-depts",
  d: data.departements.flatMap((d) => d.rings).map((r) => linePath(r.map(project), true)).join(""),
}, top);
el("path", { class: "i-river", d: data.rivers.map((r) => linePath(r.map(project))).join("") }, top);
const net = el("path", {
  class: "i-net",
  d: data.lines.flatMap((l) => l.v.map((v) => linePath(v.c.map(project)))).join(""),
}, top);
const netStops = el("path", { class: "i-net-stops", d: dotsPath(stationXY) }, top);

// ── Tracés parcourus, au-dessus du brouillard ──
routes.setAttribute("viewBox", `0 0 ${W} ${H}`);
el("path", { d: silhouette }, el("clipPath", { id: "idf-clip-routes" }, el("defs", {}, routes)));
const routeLayer = el("g", { "clip-path": "url(#idf-clip-routes)" }, routes);
const casings = legs.map((l) => el("path", { class: "i-trip-casing", d: linePath(l.coords) }, routeLayer));
const tripPaths = legs.map((l) => el("path", { class: "i-trip", d: linePath(l.coords), stroke: l.line.c }, routeLayer));
const stopRings = el("path", { class: "i-stop-ring", d: dotsPath(visitedStops) }, routeLayer);
const stopDots = el("path", { class: "i-stop-dot", d: dotsPath(visitedStops) }, routeLayer);

// ── Brouillard de guerre ──
fogCanvas.width = Math.round(W * FOG_SCALE);
fogCanvas.height = Math.round(H * FOG_SCALE);
const fctx = fogCanvas.getContext("2d");
const mask = document.createElement("canvas");
mask.width = fogCanvas.width;
mask.height = fogCanvas.height;
const mctx = mask.getContext("2d");
const silPath = new Path2D(silhouette);
const legsPath = new Path2D(legs.map((l) => linePath(l.coords)).join(""));
const stopsPath = new Path2D(dotsPath(visitedStops));

// Masque : opaque sur toute la région, troué (bords doux) autour des tronçons et stations visités
function drawMask(progress) {
  mctx.setTransform(FOG_SCALE, 0, 0, FOG_SCALE, 0, 0);
  mctx.globalCompositeOperation = "source-over";
  mctx.globalAlpha = 1;
  mctx.clearRect(0, 0, W, H);
  mctx.fillStyle = "#fff";
  mctx.fill(silPath);
  if (progress <= 0 || !legs.length) return;
  mctx.globalCompositeOperation = "destination-out";
  mctx.lineCap = "round";
  mctx.lineJoin = "round";
  // Passes concentriques de plus en plus larges : bord dégradé sans dépendre de ctx.filter (Safari)
  mctx.globalAlpha = 0.2;
  const steps = 14;
  for (let i = 0; i < steps; i++) {
    const spread = (0.6 + i * 0.1) * progress;
    mctx.lineWidth = 2 * CORRIDOR * spread;
    mctx.stroke(legsPath);
    mctx.lineWidth = 2 * STOP_RADIUS * spread;
    mctx.stroke(stopsPath);
  }
}

// Texture de nuages : bruit de valeur fractal, raccordable en mosaïque
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function fbm(size, cells, octaves, seed) {
  const rand = mulberry32(seed);
  const out = new Float32Array(size * size);
  let amp = 1;
  for (let o = 0; o < octaves; o++, cells *= 2, amp *= 0.5) {
    const lattice = Float32Array.from({ length: cells * cells }, rand);
    for (let y = 0; y < size; y++) {
      const gy = (y / size) * cells, y0 = Math.floor(gy), ty = gy - y0, sy = ty * ty * (3 - 2 * ty);
      const r0 = y0 * cells, r1 = ((y0 + 1) % cells) * cells;
      for (let x = 0; x < size; x++) {
        const gx = (x / size) * cells, x0 = Math.floor(gx), tx = gx - x0, sx = tx * tx * (3 - 2 * tx);
        const x1 = (x0 + 1) % cells;
        const top = lattice[r0 + x0] + (lattice[r0 + x1] - lattice[r0 + x0]) * sx;
        const bot = lattice[r1 + x0] + (lattice[r1 + x1] - lattice[r1 + x0]) * sx;
        out[y * size + x] += (top + (bot - top) * sy) * amp;
      }
    }
  }
  let lo = Infinity, hi = -Infinity;
  for (const v of out) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
  for (let i = 0; i < out.length; i++) out[i] = (out[i] - lo) / (hi - lo);
  return out;
}
function tile(noise, size, [r, g, b], alphaOf) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < noise.length; i++) {
    img.data[i * 4] = r; img.data[i * 4 + 1] = g; img.data[i * 4 + 2] = b;
    img.data[i * 4 + 3] = Math.round(255 * alphaOf(noise[i]));
  }
  ctx.putImageData(img, 0, 0);
  return fctx.createPattern(c, "repeat");
}
const smooth = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

const NOISE_SIZE = 256;
const noiseA = fbm(NOISE_SIZE, 4, 5, 7);
const noiseB = fbm(NOISE_SIZE, 6, 4, 42);
let fog = null;
function buildFog() {
  const dark = darkQuery.matches;
  fog = {
    base: dark ? "rgba(16, 16, 16, 0.74)" : "rgba(196, 196, 196, 0.74)",
    layers: [
      // grandes nappes sombres, lentes
      { pattern: tile(noiseA, NOISE_SIZE, dark ? [0, 0, 0] : [150, 150, 150], (n) => 0.55 * smooth(0.35, 1, n)), scale: 3.2, vx: 0.005, vy: 0.0015 },
      // volutes claires, plus rapides, en sens inverse
      { pattern: tile(noiseB, NOISE_SIZE, dark ? [95, 95, 95] : [250, 250, 250], (n) => 0.75 * smooth(0.45, 0.9, n)), scale: 1.7, vx: -0.011, vy: 0.004 },
    ],
  };
}

function drawFog(t) {
  fctx.setTransform(1, 0, 0, 1, 0, 0);
  fctx.globalCompositeOperation = "source-over";
  fctx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
  fctx.fillStyle = fog.base;
  fctx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
  for (const l of fog.layers) {
    l.pattern.setTransform(new DOMMatrix().translateSelf(t * l.vx, t * l.vy).scaleSelf(l.scale));
    fctx.fillStyle = l.pattern;
    fctx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
  }
  fctx.globalCompositeOperation = "destination-in";
  fctx.drawImage(mask, 0, 0);
}

// ── Vue : inclinaison, déplacement et zoom ──
let zoom = 1;
let panX = 0;
let panY = 0;
const cosTilt = Math.cos(TILT * RAD);
stage.style.transform = `translateY(-4%) rotateX(${TILT}deg)`;

function clampPan() {
  const rect = wrap.getBoundingClientRect();
  const limX = (rect.width * BASE_SCALE * zoom) / 2;
  const limY = (rect.width * (H / W) * BASE_SCALE * zoom) / 2;
  panX = Math.max(-limX, Math.min(limX, panX));
  panY = Math.max(-limY, Math.min(limY, panY));
}
function applyView() {
  clampPan();
  board.style.transform = `translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px) scale(${(BASE_SCALE * zoom).toFixed(4)})`;
  // Les traits s'épaississent moins vite que le zoom
  const k = Math.pow(zoom, -0.6);
  net.style.strokeWidth = 0.9 * k;
  netStops.style.strokeWidth = 2.4 * k;
  const kt = Math.pow(zoom, -0.55);
  casings.forEach((p) => (p.style.strokeWidth = 5.2 * kt));
  tripPaths.forEach((p) => (p.style.strokeWidth = 3.4 * kt));
  stopRings.style.strokeWidth = 5.6 * kt;
  stopDots.style.strokeWidth = 3.4 * kt;
}

let zoomAnim = null;
let zoomTarget = 1; // les clics rapprochés se cumulent même pendant l'animation
function setZoom(target, animate = true) {
  target = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, target));
  zoomTarget = target;
  if (zoomAnim) cancelAnimationFrame(zoomAnim);
  zoomAnim = null;
  // On zoome autour du centre de l'écran : le décalage suit le facteur de zoom
  const z0 = zoom, x0 = panX, y0 = panY;
  if (!animate || reduceMotion) {
    zoom = target; panX = (x0 * target) / z0; panY = (y0 * target) / z0;
    applyView();
    return;
  }
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / 350);
    const e = 1 - Math.pow(1 - t, 3);
    zoom = z0 + (target - z0) * e;
    panX = (x0 * zoom) / z0;
    panY = (y0 * zoom) / z0;
    applyView();
    zoomAnim = t < 1 ? requestAnimationFrame(step) : null;
  };
  zoomAnim = requestAnimationFrame(step);
}
document.getElementById("idf-zoom-in").addEventListener("click", () => setZoom(zoomTarget * 1.6));
document.getElementById("idf-zoom-out").addEventListener("click", () => setZoom(zoomTarget / 1.6));
wrap.addEventListener("dblclick", (e) => {
  if (!e.target.closest(".idf-zoom")) setZoom(zoomTarget * 1.6);
});
// Pincement du pavé tactile (ctrl + molette) : la molette seule fait défiler la page
wrap.addEventListener("wheel", (e) => {
  if (!e.ctrlKey) return;
  e.preventDefault();
  setZoom(zoom * Math.exp(-e.deltaY * 0.01), false);
}, { passive: false });

// Glisser pour se déplacer, pincer pour zoomer
const pointers = new Map();
let drag = null;
let pinch = null;
const spread = () => {
  const [a, b] = [...pointers.values()];
  return Math.hypot(a.x - b.x, a.y - b.y);
};
function startDrag() {
  const [p] = [...pointers.values()];
  drag = p ? { x: p.x, y: p.y, panX, panY } : null;
}
wrap.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".idf-zoom")) return;
  wrap.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  wrap.classList.add("dragging");
  if (pointers.size === 2) {
    pinch = { d: spread(), zoom };
    drag = null;
  } else if (pointers.size === 1) startDrag();
});
wrap.addEventListener("pointermove", (e) => {
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && pointers.size >= 2) {
    setZoom((pinch.zoom * spread()) / pinch.d, false);
  } else if (drag) {
    panX = drag.panX + (e.clientX - drag.x);
    panY = drag.panY + (e.clientY - drag.y) / cosTilt; // le plateau incliné écrase les déplacements verticaux
    applyView();
  }
});
function endPointer(e) {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) pinch = null;
  if (pointers.size === 1) startDrag();
  if (pointers.size === 0) {
    drag = null;
    wrap.classList.remove("dragging");
  }
}
wrap.addEventListener("pointerup", endPointer);
wrap.addEventListener("pointercancel", endPointer);

// ── Animation : le brouillard dérive et s'ouvre à l'arrivée sur la page ──
let visible = true;
let introStart = null;
let lastFrame = 0;
new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(wrap);

function frame(now) {
  if (visible && now - lastFrame > 33) {
    lastFrame = now;
    if (introStart === null) introStart = now;
    const p = Math.min(1, (now - introStart) / INTRO_MS);
    if (p < 1 || !introDone) {
      drawMask(1 - Math.pow(1 - p, 3));
      introDone = p >= 1;
    }
    drawFog(now);
  }
  requestAnimationFrame(frame);
}
let introDone = false;

buildFog();
applyView();
if (reduceMotion) {
  drawMask(1);
  drawFog(0);
} else {
  drawMask(0);
  drawFog(0);
  requestAnimationFrame(frame);
}
darkQuery.addEventListener("change", () => {
  buildFog();
  if (reduceMotion) drawFog(0);
});
