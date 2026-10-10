// Carte des vignobles de Bourgogne de la page /maps/wines : communes viticoles teintées par
// sous-région, appellations goûtées en couleur pleine, une épingle par bouteille.
// Données : /data/burgundy-wines.json (généré par scripts/build-burgundy-wines.mjs).
const DATA_URL = "/data/burgundy-wines.json";
const SVG_NS = "http://www.w3.org/2000/svg";
const W = 1000; // largeur du repère (viewBox) ; la hauteur suit les proportions de la région
const PAD = 14;
const DEPTH = 12; // épaisseur du socle
const MIN_ZOOM = 1;
const MAX_ZOOM = 12;
const PIN_R = 12;

const { regions, bottles } = JSON.parse(document.getElementById("wine-data").textContent);
const wrap = document.getElementById("wine-wrap");
const svg = document.getElementById("wine-map");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function el(tag, attrs = {}, parent) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

// Noms comparés sans accents, ligatures, tirets ni majuscules
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").toLowerCase()
  .replace(/['’\-]/g, " ").replace(/\s+/g, " ").trim();

const data = await fetch(DATA_URL).then((r) => r.json());
const regionByKey = Object.fromEntries(regions.map((r) => [r.key, r]));

// ── Projection : Mercator, cadrée sur les trois départements ──
const RAD = Math.PI / 180;
const merc = ([lon, lat]) => [lon * RAD, -Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2))];
const allPts = data.departements.flatMap((d) => d.rings.flat()).map(merc);
const minX = Math.min(...allPts.map((p) => p[0])), maxX = Math.max(...allPts.map((p) => p[0]));
const minY = Math.min(...allPts.map((p) => p[1])), maxY = Math.max(...allPts.map((p) => p[1]));
const scale = (W - 2 * PAD) / (maxX - minX);
const H = Math.ceil((maxY - minY) * scale + 2 * PAD + DEPTH + 8);
const project = (p) => {
  const [x, y] = merc(p);
  return [PAD + (x - minX) * scale, PAD + (y - minY) * scale];
};

const f1 = (v) => v.toFixed(1);
const ringPath = (ring) => "M" + ring.map((p) => project(p).map(f1).join(",")).join("L") + "Z";
const ringsPath = (rings) => rings.map(ringPath).join("");

// Centre de gravité de la plus grande surface d'une commune (en unités du plateau)
function centroid(rings) {
  let best = null;
  for (const ring of rings) {
    const pts = ring.map(project);
    let a = 0, cx = 0, cy = 0;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const cross = pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
      a += cross;
      cx += (pts[j][0] + pts[i][0]) * cross;
      cy += (pts[j][1] + pts[i][1]) * cross;
    }
    if (!best || Math.abs(a) > Math.abs(best.a)) best = { a, x: cx / (3 * a), y: cy / (3 * a) };
  }
  return [best.x, best.y];
}
const mean = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];

const communes = data.communes.map((c) => ({ ...c, key: norm(c.n), center: centroid(c.rings) }));
const communeByKey = new Map(communes.map((c) => [c.key, c]));

// ── Bouteilles : communes de l'appellation et emplacement de l'épingle ──
const tasted = new Set();
const pins = bottles.map((b, i) => {
  const own = b.communes.map((n) => communeByKey.get(norm(n))).filter(Boolean);
  b.communes.filter((n) => !communeByKey.has(norm(n))).forEach((n) => console.warn("Wines : commune introuvable", n));
  own.forEach((c) => tasted.add(c.key));
  const pinCommune = b.pin && communeByKey.get(norm(b.pin));
  const at = pinCommune ? pinCommune.center : own.length ? mean(own.map((c) => c.center)) : null;
  if (!at) console.warn("Wines : pas d'emplacement pour", b.name);
  return { i, bottle: b, at, communes: own.length ? own : pinCommune ? [pinCommune] : [] };
});

// ── Plateau : ombre, socle, face supérieure (silhouette des trois départements) ──
svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
const silhouette = data.departements.map((d) => ringsPath(d.rings)).join("");
const defs = el("defs", {}, svg);
el("path", { id: "w-sil", d: silhouette }, defs);
el("feGaussianBlur", { stdDeviation: 9 }, el("filter", { id: "w-blur", x: "-20%", y: "-20%", width: "140%", height: "140%" }, defs));
const slab = (cls, dy) => el("use", { href: "#w-sil", class: cls, transform: `translate(0 ${dy})` }, svg);
slab("w-shadow", DEPTH + 8).setAttribute("filter", "url(#w-blur)");
slab("w-edge", DEPTH);
for (let i = DEPTH; i >= 1; i--) slab("w-side", i);
slab("w-edge", 0);
slab("w-top", 0);

// Communes viticoles teintées par sous-région ; celles des bouteilles goûtées en couleur pleine
const communeLayer = el("g", {}, svg);
const communeNodes = new Map();
for (const c of communes) {
  const node = el("path", {
    class: "w-commune" + (tasted.has(c.key) ? " tasted" : ""),
    d: ringsPath(c.rings),
    fill: regionByKey[c.r].color,
  }, communeLayer);
  el("title", {}, node).textContent = `${c.n} · ${regionByKey[c.r].label}`;
  communeNodes.set(c.key, node);
}
el("path", { class: "w-depts", d: silhouette, "vector-effect": "non-scaling-stroke" }, svg);

// Étiquettes : départements (discrètes) et sous-régions, placées du côté libre de la Côte
const labels = [];
const DEPT_LABEL_AT = { "89": [3.55, 47.95], "21": [4.6, 47.55], "71": [4.25, 46.62] };
for (const d of data.departements) {
  const at = DEPT_LABEL_AT[d.code];
  if (!at) continue;
  const [x, y] = project(at);
  const t = el("text", { class: "w-dept-label", x: 0, y: 0, "text-anchor": "middle" }, svg);
  t.textContent = d.name;
  labels.push({ node: t, x, y });
}
const LABEL_SIDE = { chablis: 1, auxerrois: -1, nuits: 1, "hautes-cotes": -1, beaune: 1, chalonnaise: 1, maconnais: -1 };
const labelLayer = el("g", {}, svg);
for (const r of regions) {
  const own = communes.filter((c) => c.r === r.key);
  if (!own.length) continue;
  const side = LABEL_SIDE[r.key] ?? 1;
  const xs = own.flatMap((c) => c.rings.flat().map((p) => project(p)[0]));
  const [, y] = mean(own.map((c) => c.center));
  const x = side > 0 ? Math.max(...xs) + 8 : Math.min(...xs) - 8;
  const t = el("text", { class: "w-region-label", "text-anchor": side > 0 ? "start" : "end" }, labelLayer);
  t.textContent = r.label;
  labels.push({ node: t, x, y });
}

// Épingles numérotées, couleur du vin
const WINE_FILL = { rouge: "#7b1e32", blanc: "#ecd98a" };
const pinLayer = el("g", {}, svg);
for (const p of pins) {
  if (!p.at) continue;
  const g = el("g", { class: "w-pin", tabindex: "0", role: "button", "aria-label": p.bottle.name }, pinLayer);
  el("circle", { r: PIN_R, fill: WINE_FILL[p.bottle.wine] ?? "#c9c9c9" }, g);
  const t = el("text", { fill: p.bottle.wine === "rouge" ? "#fff" : "#000" }, g);
  t.textContent = p.i + 1;
  g.addEventListener("click", () => select(p.i, { scroll: true }));
  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(p.i, { scroll: true });
    }
  });
  p.node = g;
}

// ── Vue : le zoom change le viewBox ; épingles et étiquettes gardent une taille lisible ──
let zoom = 1;
let cx = W / 2;
let cy = H / 2;
function render() {
  const vw = W / zoom, vh = H / zoom;
  cx = Math.max(vw / 2, Math.min(W - vw / 2, cx));
  cy = Math.max(vh / 2, Math.min(H - vh / 2, cy));
  svg.setAttribute("viewBox", [cx - vw / 2, cy - vh / 2, vw, vh].map((v) => v.toFixed(2)).join(" "));
  const k = Math.pow(zoom, -0.85);
  for (const p of pins) if (p.node) p.node.setAttribute("transform", `translate(${f1(p.at[0])} ${f1(p.at[1])}) scale(${k.toFixed(3)})`);
  for (const l of labels) l.node.setAttribute("transform", `translate(${f1(l.x)} ${f1(l.y)}) scale(${k.toFixed(3)})`);
}

let anim = null;
let zoomTarget = 1;
function animateTo(target, x = cx, y = cy) {
  target = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, target));
  zoomTarget = target;
  if (anim) cancelAnimationFrame(anim);
  anim = null;
  if (reduceMotion) {
    zoom = target; cx = x; cy = y;
    render();
    return;
  }
  const z0 = zoom, x0 = cx, y0 = cy;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / 450);
    const e = 1 - Math.pow(1 - t, 3);
    zoom = z0 * Math.pow(target / z0, e);
    cx = x0 + (x - x0) * e;
    cy = y0 + (y - y0) * e;
    render();
    anim = t < 1 ? requestAnimationFrame(step) : null;
  };
  anim = requestAnimationFrame(step);
}
document.getElementById("wine-zoom-in").addEventListener("click", () => animateTo(zoomTarget * 1.6));
document.getElementById("wine-zoom-out").addEventListener("click", () => animateTo(zoomTarget / 1.6));
wrap.addEventListener("dblclick", (e) => {
  if (!e.target.closest(".wine-zoom, .w-pin")) animateTo(zoomTarget * 1.6);
});
// Pincement du pavé tactile (ctrl + molette) : la molette seule fait défiler la page
wrap.addEventListener("wheel", (e) => {
  if (!e.ctrlKey) return;
  e.preventDefault();
  zoom = zoomTarget = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * Math.exp(-e.deltaY * 0.01)));
  render();
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
  if (e.target.closest(".wine-zoom, .w-pin")) return;
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
    zoom = zoomTarget = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (pinch.zoom * spread()) / pinch.d));
    render();
  } else if (drag) {
    const unitsPerPx = W / (svg.getBoundingClientRect().width * zoom);
    cx = drag.cx - (e.clientX - drag.x) * unitsPerPx;
    cy = drag.cy - (e.clientY - drag.y) * unitsPerPx;
    render();
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

// ── Sélection d'une bouteille (épingle ou carte de la cave) : zoom sur son appellation ──
const cards = [...document.querySelectorAll("#cellar .bottle")];
let selected = null;
function select(i, { scroll = false } = {}) {
  const p = pins[i];
  const again = selected === i;
  selected = again ? null : i;
  cards.forEach((c, j) => c.classList.toggle("selected", j === selected));
  pins.forEach((q) => q.node?.classList.toggle("selected", q.i === selected));
  communeNodes.forEach((n) => n.classList.remove("focus"));
  if (again || !p.at) {
    animateTo(1, W / 2, H / 2);
    return;
  }
  for (const c of p.communes) communeNodes.get(c.key)?.classList.add("focus");
  // Cadre englobant les communes de l'appellation (au moins ~12 km de côté)
  const pts = p.communes.flatMap((c) => c.rings.flat().map(project));
  pts.push(p.at);
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const bw = Math.max(Math.max(...xs) - Math.min(...xs), 45);
  const bh = Math.max(Math.max(...ys) - Math.min(...ys), 45);
  const target = Math.min(W / (bw * 1.6), H / (bh * 1.6), 6);
  animateTo(target, (Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2);
  if (scroll) cards[i]?.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
}
cards.forEach((c, i) => c.addEventListener("click", () => {
  select(i);
  wrap.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
}));

render();
