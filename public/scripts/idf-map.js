// Carte de l'Île-de-France de la page /maps/ratp : réseau ferré (OpenStreetMap), tronçons déjà parcourus
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

// ── Projection : Mercator. Les tronçons sont d'abord résolus en coordonnées brutes,
// puis la carte est cadrée sur le disque qui les englobe (voir « Cadrage » plus bas) ──
const RAD = Math.PI / 180;
const merc = (lon, lat) => [lon * RAD, Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2))];
const rawProject = ([lon, lat]) => {
  const [x, y] = merc(lon, lat);
  return [x, -y]; // y vers le bas, comme en SVG
};
let project = rawProject;

const f1 = (v) => v.toFixed(1);
const linePath = (pts, closed = false) =>
  pts.length ? "M" + pts.map((p) => f1(p[0]) + "," + f1(p[1])).join("L") + (closed ? "Z" : "") : "";
const dotsPath = (pts) => pts.map((p) => `M${f1(p[0])},${f1(p[1])}h0.01`).join("");

let stationXY = data.stations.map(([, lon, lat]) => project([lon, lat]));

// ── Tronçons parcourus ──
const stationNorm = data.stations.map(([name]) => norm(name));
// Recherche parmi les seules stations de la ligne : nom exact, puis nom qui commence par la saisie
// (« La Défense » → « La Défense - Grande Arche »), puis nom qui la contient (« Saint-Michel Notre-Dame »)
function matchStation(name, lineIds) {
  const n = norm(name);
  const tests = [
    (key) => key === n,
    (key) => key.startsWith(n + " "),
    (key) => key.includes(n) || (key.length > 4 && n.includes(key)),
  ];
  for (const test of tests) {
    const ids = new Set([...lineIds].filter((id) => test(stationNorm[id])));
    if (ids.size) return ids;
  }
  return new Set();
}
function resolve(trip) {
  const line = data.lines.find((l) => l.k.toLowerCase() === trip.line.toLowerCase());
  if (!line) return null;
  const lineIds = new Set(line.v.flatMap((v) => v.s));
  const from = matchStation(trip.from, lineIds);
  const to = matchStation(trip.to, lineIds);
  let best = null;
  for (const v of line.v) {
    const i = v.s.findIndex((id) => from.has(id));
    const j = v.s.findIndex((id) => to.has(id));
    if (i < 0 || j < 0 || i === j) continue;
    const a = Math.min(i, j), b = Math.max(i, j);
    // à plusieurs variantes possibles, on garde la plus omnibus (le plus d'arrêts entre les deux)
    if (!best || b - a > best.b - best.a) best = { v, a, b };
  }
  if (!best) return shortestPath(line, from, to);
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
// Aucune desserte directe (correspondance entre branches, ex. Paris-Nord → Auvers-sur-Oise) :
// plus court chemin sur le graphe des arrêts consécutifs de toutes les variantes de la ligne
function shortestPath(line, from, to) {
  const edges = new Map(); // id -> [{ to, len, coords }]
  const addEdge = (s, t, coords) => {
    let len = 0;
    for (let i = 1; i < coords.length; i++) len += Math.hypot(coords[i][0] - coords[i - 1][0], coords[i][1] - coords[i - 1][1]);
    if (!edges.has(s)) edges.set(s, []);
    edges.get(s).push({ to: t, len, coords });
  };
  for (const v of line.v) {
    for (let i = 0; i < v.s.length - 1; i++) {
      let coords;
      if (v.a) {
        const ca = Math.min(v.a[i], v.a[i + 1]), cb = Math.max(v.a[i], v.a[i + 1]);
        coords = v.c.slice(ca, cb + 1).map(project);
        if (v.a[i] > v.a[i + 1]) coords.reverse();
      } else {
        coords = [stationXY[v.s[i]], stationXY[v.s[i + 1]]];
      }
      addEdge(v.s[i], v.s[i + 1], coords);
      addEdge(v.s[i + 1], v.s[i], coords.slice().reverse());
    }
  }
  const dist = new Map([...from].map((id) => [id, 0]));
  const prev = new Map();
  const queue = new Set(from);
  while (queue.size) {
    let u = null;
    for (const id of queue) if (u === null || dist.get(id) < dist.get(u)) u = id;
    queue.delete(u);
    if (to.has(u)) {
      const stops = [u];
      const parts = [];
      while (prev.has(stops[0])) {
        const { from: p, coords } = prev.get(stops[0]);
        parts.unshift(coords);
        stops.unshift(p);
      }
      return { line, stops, coords: parts.flat() };
    }
    for (const e of edges.get(u) || []) {
      const d = dist.get(u) + e.len;
      if (!dist.has(e.to) || d < dist.get(e.to)) {
        dist.set(e.to, d);
        prev.set(e.to, { from: u, coords: e.coords });
        queue.add(e.to);
      }
    }
  }
  return null;
}

const legs = [];
for (const trip of trips) {
  const leg = resolve(trip);
  if (leg) legs.push(leg);
  else console.warn("Map : tronçon introuvable", trip);
}

// ── Cadrage : la carte se limite au disque qui englobe tout ce qui a été parcouru, plus une marge.
// Il s'agrandit tout seul quand de nouveaux tronçons sont ajoutés. ──
const DISC_MARGIN = 0.12; // marge relative au rayon
const DISC_MIN_KM = 3; // marge minimale
const kmPerUnit = 6371 * Math.cos(48.85 * RAD); // unités Mercator brutes → km, à la latitude de Paris
let extent = legs.flatMap((l) => l.coords);
if (!extent.length) {
  extent = data.departements.flatMap((d) => d.rings.flat()).map(rawProject);
}
const xs = extent.map((p) => p[0]), ys = extent.map((p) => p[1]);
const center = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
const radius = Math.max(...extent.map((p) => Math.hypot(p[0] - center[0], p[1] - center[1])))
  * (1 + DISC_MARGIN) + DISC_MIN_KM / kmPerUnit;
const availH = H - 2 * PAD - DEPTH - 12;
const scale = Math.min(W - 2 * PAD, availH) / (2 * radius);
const disc = { x: W / 2, y: PAD + availH / 2, r: radius * scale };
const fit = ([x, y]) => [disc.x + (x - center[0]) * scale, disc.y + (y - center[1]) * scale];
project = (p) => fit(rawProject(p));
stationXY = stationXY.map(fit);
for (const leg of legs) leg.coords = leg.coords.map(fit);

const discPath = `M${f1(disc.x - disc.r)},${f1(disc.y)}a${f1(disc.r)},${f1(disc.r)} 0 1,0 ${f1(2 * disc.r)},0a${f1(disc.r)},${f1(disc.r)} 0 1,0 ${f1(-2 * disc.r)},0Z`;
const silhouette = data.departements.flatMap((d) => d.rings).map((r) => linePath(r.map(project), true)).join("");
const visitedStops = [...new Set(legs.flatMap((l) => l.stops))].map((id) => stationXY[id]);

// ── Sol : ombre, socle, face supérieure, quadrillage, départements, rivières, réseau grisé ──
// Le plateau a la forme de l'Île-de-France découpée par le disque de cadrage
const defs = el("defs", {}, ground);
el("path", { id: "idf-sil", d: silhouette }, defs);
el("path", { id: "idf-disc-shape", d: discPath }, defs);
el("path", { d: silhouette }, el("clipPath", { id: "idf-clip" }, defs));
el("path", { d: discPath }, el("clipPath", { id: "idf-disc" }, defs));
el("feGaussianBlur", { stdDeviation: 10 }, el("filter", { id: "idf-blur", x: "-20%", y: "-20%", width: "140%", height: "140%" }, defs));
ground.setAttribute("viewBox", `0 0 ${W} ${H}`);

// Forme du plateau décalée de dy : remplissage, ou contour (moitié extérieure d'un trait épais,
// la face du dessus recouvrant l'autre moitié)
function slab(cls, dy, parent = ground) {
  const g = el("g", { transform: `translate(0 ${dy})` }, parent);
  if (cls === "i-edge") {
    el("use", { href: "#idf-sil", class: cls, "clip-path": "url(#idf-disc)" }, g);
    el("use", { href: "#idf-disc-shape", class: cls, "clip-path": "url(#idf-clip)" }, g);
  } else {
    el("use", { href: "#idf-sil", class: cls, "clip-path": "url(#idf-disc)" }, g);
  }
  return g;
}
slab("i-shadow", DEPTH + 10).setAttribute("filter", "url(#idf-blur)");
slab("i-edge", DEPTH);
for (let i = DEPTH; i >= 1; i--) slab("i-side", i);
slab("i-edge", 0);
slab("i-top", 0);

const top = el("g", { "clip-path": "url(#idf-clip)" }, el("g", { "clip-path": "url(#idf-disc)" }, ground));
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
const routeDefs = el("defs", {}, routes);
el("path", { d: silhouette }, el("clipPath", { id: "idf-clip-routes" }, routeDefs));
el("path", { d: discPath }, el("clipPath", { id: "idf-disc-routes" }, routeDefs));
const routeLayer = el("g", { "clip-path": "url(#idf-clip-routes)" },
  el("g", { "clip-path": "url(#idf-disc-routes)" }, routes));
const casings = legs.map((l) => el("path", { class: "i-trip-casing", d: linePath(l.coords) }, routeLayer));
const tripPaths = legs.map((l) => el("path", { class: "i-trip", d: linePath(l.coords), stroke: l.line.c }, routeLayer));
const stopRings = el("path", { class: "i-stop-ring", d: dotsPath(visitedStops) }, routeLayer);
const stopDots = el("path", { class: "i-stop-dot", d: dotsPath(visitedStops) }, routeLayer);

// ── Vue : le zoom redessine la carte (viewBox + brouillard) au lieu d'agrandir une image ──
let zoom = 1;
let cx = W / 2; // centre de la vue, en unités du plateau
let cy = H / 2;
let dirty = true;
const cosTilt = Math.cos(TILT * RAD);
stage.style.transform = `translateY(-4%) rotateX(${TILT}deg)`;
board.style.transform = `scale(${BASE_SCALE})`;

function viewBox() {
  const vw = W / zoom, vh = H / zoom;
  return [cx - vw / 2, cy - vh / 2, vw, vh];
}
function applyView() {
  cx = Math.max(0, Math.min(W, cx));
  cy = Math.max(0, Math.min(H, cy));
  dirty = true;
}
function renderSvg() {
  const vb = viewBox().map((v) => v.toFixed(2)).join(" ");
  ground.setAttribute("viewBox", vb);
  routes.setAttribute("viewBox", vb);
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

// ── Brouillard de guerre ──
const fctx = fogCanvas.getContext("2d");
const mask = document.createElement("canvas");
const mctx = mask.getContext("2d");
const silPath = new Path2D(silhouette);
const discPath2D = new Path2D(discPath);
const legsPath = new Path2D(legs.map((l) => linePath(l.coords)).join(""));
const stopsPath = new Path2D(dotsPath(visitedStops));

// Résolution du canvas calée sur sa taille affichée (× densité d'écran)
function resizeFog() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.round(board.clientWidth * BASE_SCALE * dpr);
  if (!w || w === fogCanvas.width) return;
  fogCanvas.width = mask.width = w;
  fogCanvas.height = mask.height = Math.round((w * H) / W);
  dirty = true;
}
new ResizeObserver(resizeFog).observe(board);
resizeFog();

const unitPx = () => (fogCanvas.width / W) * zoom; // px de canvas par unité de plateau

// Masque : opaque sur toute la région, troué (bords doux) autour des tronçons et stations visités.
// En zoomant, la zone dégagée se resserre autour des tracés.
function drawMask(progress) {
  const [vx, vy] = viewBox();
  const s = unitPx();
  mctx.setTransform(1, 0, 0, 1, 0, 0);
  mctx.globalCompositeOperation = "source-over";
  mctx.globalAlpha = 1;
  mctx.clearRect(0, 0, mask.width, mask.height);
  mctx.setTransform(s, 0, 0, s, -vx * s, -vy * s);
  mctx.fillStyle = "#fff";
  mctx.save();
  mctx.clip(discPath2D);
  mctx.fill(silPath);
  mctx.restore();
  if (progress <= 0 || !legs.length) return;
  mctx.globalCompositeOperation = "destination-out";
  mctx.lineCap = "round";
  mctx.lineJoin = "round";
  // Passes concentriques de plus en plus larges : bord dégradé sans dépendre de ctx.filter (Safari)
  mctx.globalAlpha = 0.2;
  const tighten = Math.pow(zoom, -0.5);
  const steps = 14;
  for (let i = 0; i < steps; i++) {
    const spread = (0.6 + i * 0.1) * progress * tighten;
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
      { pattern: tile(noiseA, NOISE_SIZE, dark ? [0, 0, 0] : [150, 150, 150], (n) => 0.55 * smooth(0.35, 1, n)), scale: 2.1, vx: 0.0035, vy: 0.001 },
      // volutes claires, plus rapides, en sens inverse
      { pattern: tile(noiseB, NOISE_SIZE, dark ? [95, 95, 95] : [250, 250, 250], (n) => 0.75 * smooth(0.45, 0.9, n)), scale: 1.1, vx: -0.0075, vy: 0.0027 },
    ],
  };
}

// Les nuages sont accrochés à la carte quand on se déplace ; ils grossissent moins vite que le zoom
function drawFog(t) {
  const [vx, vy] = viewBox();
  const s = unitPx();
  const res = fogCanvas.width / 1000;
  fctx.setTransform(1, 0, 0, 1, 0, 0);
  fctx.globalCompositeOperation = "source-over";
  fctx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
  fctx.fillStyle = fog.base;
  fctx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
  for (const l of fog.layers) {
    const m = new DOMMatrix()
      .translateSelf(-vx * s + t * l.vx * res, -vy * s + t * l.vy * res)
      .scaleSelf(l.scale * res * Math.sqrt(zoom));
    l.pattern.setTransform(m);
    fctx.fillStyle = l.pattern;
    fctx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
  }
  fctx.globalCompositeOperation = "destination-in";
  fctx.drawImage(mask, 0, 0);
}

// ── Zoom ──
let zoomAnim = null;
let zoomTarget = 1; // les clics rapprochés se cumulent même pendant l'animation
function setZoom(target, animate = true) {
  target = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, target));
  zoomTarget = target;
  if (zoomAnim) cancelAnimationFrame(zoomAnim);
  zoomAnim = null;
  const z0 = zoom;
  if (!animate || reduceMotion) {
    zoom = target;
    applyView();
    return;
  }
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / 350);
    const e = 1 - Math.pow(1 - t, 3);
    zoom = z0 * Math.pow(target / z0, e);
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
  drag = p ? { x: p.x, y: p.y, cx, cy } : null;
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
    // px d'écran → unités du plateau ; le plateau incliné écrase les déplacements verticaux
    const unitsPerPx = W / (wrap.getBoundingClientRect().width * BASE_SCALE * zoom);
    cx = drag.cx - (e.clientX - drag.x) * unitsPerPx;
    cy = drag.cy - ((e.clientY - drag.y) / cosTilt) * unitsPerPx;
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

// ── Boucle de rendu : redessin immédiat quand la vue change, dérive du brouillard ~30 i/s ──
let visible = true;
let introStart = null;
let lastFog = 0;
new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(wrap);

function frame(now) {
  if (introStart === null) introStart = now;
  const intro = reduceMotion ? 1 : Math.min(1, (now - introStart) / INTRO_MS);
  const introRunning = intro < 1 || dirty === "intro";
  if (dirty || (visible && (introRunning || (!reduceMotion && now - lastFog > 33)))) {
    if (dirty || introRunning) {
      renderSvg();
      drawMask(1 - Math.pow(1 - intro, 3));
    }
    drawFog(reduceMotion ? 0 : now);
    lastFog = now;
    dirty = intro < 1 ? "intro" : false;
  }
  requestAnimationFrame(frame);
}

buildFog();
requestAnimationFrame(frame);
darkQuery.addEventListener("change", () => {
  buildFog();
  dirty = true;
});

