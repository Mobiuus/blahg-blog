// Globe 3D stylisé de la page /invest : contours des continents + épingles par projet.
// Rendu SVG avec d3-geo (projection orthographique), données terrestres world-atlas 110m.
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from "https://cdn.jsdelivr.net/npm/d3-geo@3.1.1/+esm";
import { feature } from "https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm";

const LAND_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json";
const SVG_NS = "http://www.w3.org/2000/svg";
const SIZE = 600; // taille du viewBox
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const AUTO_SPEED = 0.06; // degrés par frame
const IDLE_DELAY = 4000; // reprise de la rotation auto après inactivité (ms)
// Forme d'épingle (pointe en 0,0, tête ronde centrée en 0,-17)
const PIN_PATH = "M0,0 C-2,-6 -10,-10 -10,-17 A10,10 0 1 1 10,-17 C10,-10 2,-6 0,0 Z";

const { types, projects } = JSON.parse(document.getElementById("invest-data").textContent);
const typeByKey = Object.fromEntries(types.map((t) => [t.key, t]));

const svg = document.getElementById("globe");
const card = document.getElementById("pin-card");

svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);

const baseScale = SIZE / 2 - 8;
const projection = geoOrthographic()
  .scale(baseScale)
  .translate([SIZE / 2, SIZE / 2])
  .clipAngle(90)
  .rotate([-10, -30]); // centré sur l'Europe au départ
const path = geoPath(projection);

function el(tag, attrs = {}, parent = svg) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  parent.appendChild(node);
  return node;
}

const ocean = el("path", { class: "g-ocean" });
const grat = el("path", { class: "g-grat" });
const land = el("path", { class: "g-land" });
const outline = el("path", { class: "g-outline" });
const pinLayer = el("g", { class: "g-pins" });

const graticule = geoGraticule10();
const sphere = { type: "Sphere" };
let landGeo = null;

let zoom = 1;
let selectedId = null;
let lastInteraction = 0;
let animation = null;

// ── Épingles ──
const pins = projects.map((p) => {
  const t = typeByKey[p.type];
  const g = el("g", { class: "g-pin", tabindex: "0", role: "button", "aria-label": p.name }, pinLayer);
  el("path", { d: PIN_PATH, fill: t.color }, g);
  const label = el("text", { x: 0, y: -17 }, g);
  label.textContent = t.emoji;
  const title = el("title", {}, g);
  title.textContent = p.name;
  g.addEventListener("click", (e) => {
    e.stopPropagation();
    select(p.id);
  });
  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(p.id);
    }
  });
  g.addEventListener("pointerdown", (e) => e.stopPropagation());
  return { p, g, lonlat: [p.coords[1], p.coords[0]] };
});

function render() {
  projection.scale(baseScale * zoom);
  ocean.setAttribute("d", path(sphere));
  grat.setAttribute("d", path(graticule));
  if (landGeo) land.setAttribute("d", path(landGeo));
  outline.setAttribute("d", path(sphere));

  const [lambda, phi] = projection.rotate();
  const center = [-lambda, -phi];
  const visible = [];
  for (const pin of pins) {
    const shown = geoDistance(pin.lonlat, center) < Math.PI / 2 - 0.02;
    if (!shown) {
      pin.g.style.display = "none";
      continue;
    }
    const [x, y] = projection(pin.lonlat);
    pin.g.style.display = "";
    pin.g.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)})`);
    pin.g.classList.toggle("selected", pin.p.id === selectedId);
    visible.push({ pin, y });
  }
  // Les épingles les plus basses passent devant ; l'épingle sélectionnée tout devant
  visible.sort((a, b) => a.y - b.y);
  for (const { pin } of visible) if (pin.p.id !== selectedId) pinLayer.appendChild(pin.g);
  const sel = pins.find((pin) => pin.p.id === selectedId);
  if (sel) pinLayer.appendChild(sel.g);
}

// ── Rotation auto ──
function tick(now) {
  if (!animation && !dragging && !selectedId && now - lastInteraction > IDLE_DELAY) {
    const [lambda, phi, gamma] = projection.rotate();
    projection.rotate([lambda + AUTO_SPEED, phi, gamma]);
    render();
  }
  requestAnimationFrame(tick);
}

// ── Glisser pour tourner ──
let dragging = false;
let dragStart = null;
svg.addEventListener("pointerdown", (e) => {
  dragging = true;
  stopAnimation();
  svg.setPointerCapture(e.pointerId);
  dragStart = { x: e.clientX, y: e.clientY, rotate: projection.rotate() };
});
svg.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const rect = svg.getBoundingClientRect();
  const k = (180 / Math.PI) / (projection.scale() * (rect.width / SIZE));
  const dx = (e.clientX - dragStart.x) * k;
  const dy = (e.clientY - dragStart.y) * k;
  const [lambda, phi, gamma] = dragStart.rotate;
  projection.rotate([lambda + dx, Math.max(-85, Math.min(85, phi - dy)), gamma]);
  lastInteraction = performance.now();
  render();
});
function endDrag() {
  dragging = false;
  lastInteraction = performance.now();
}
svg.addEventListener("pointerup", endDrag);
svg.addEventListener("pointercancel", endDrag);

// ── Zoom ──
function setZoom(z) {
  zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
  lastInteraction = performance.now();
  render();
}
document.getElementById("zoom-in").addEventListener("click", () => setZoom(zoom * 1.5));
document.getElementById("zoom-out").addEventListener("click", () => setZoom(zoom / 1.5));
svg.addEventListener("dblclick", () => setZoom(zoom * 1.5));

// ── Animation vers un point ──
function stopAnimation() {
  if (animation) cancelAnimationFrame(animation);
  animation = null;
}
function flyTo([lon, lat], targetZoom) {
  stopAnimation();
  const [l0, p0, g0] = projection.rotate();
  let l1 = -lon;
  // chemin le plus court en longitude
  while (l1 - l0 > 180) l1 -= 360;
  while (l1 - l0 < -180) l1 += 360;
  const p1 = -lat;
  const z0 = zoom;
  const start = performance.now();
  const duration = 900;
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    projection.rotate([l0 + (l1 - l0) * e, p0 + (p1 - p0) * e, g0]);
    zoom = z0 + (targetZoom - z0) * e;
    render();
    animation = t < 1 ? requestAnimationFrame(step) : null;
  };
  animation = requestAnimationFrame(step);
}

// ── Sélection d'un projet ──
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function showCard(p) {
  const t = typeByKey[p.type];
  const lines = [
    `<strong>Lieu</strong> : ${escapeHtml(p.location)} (${escapeHtml(p.country)})`,
    `<strong>Type</strong> : ${t.emoji} ${escapeHtml(t.label)}`,
    p.capacity && `<strong>Capacité</strong> : ${escapeHtml(p.capacity)}`,
    p.rate !== null && `<strong>Taux</strong> : ${escapeHtml(p.rateLabel)}`,
    p.months && `<strong>Durée</strong> : ${p.months} mois · ${escapeHtml(p.frequency.toLowerCase())} · ${escapeHtml(p.repayment.toLowerCase())}`,
    p.date && `<strong>Date</strong> : ${escapeHtml(p.date)}`,
  ].filter(Boolean);
  card.innerHTML = `
    <button type="button" class="pc-close" aria-label="Fermer">×</button>
    <h3>${escapeHtml(p.name)}</h3>
    <div class="pc-sub">${escapeHtml([p.company, p.platform].filter(Boolean).join(" · "))}</div>
    ${lines.map((l) => `<p>${l}</p>`).join("")}
  `;
  card.hidden = false;
  card.querySelector(".pc-close").addEventListener("click", deselect);
}

function select(id) {
  const pin = pins.find((x) => x.p.id === id);
  if (!pin) return;
  selectedId = id;
  showCard(pin.p);
  flyTo(pin.lonlat, zoom);
}

function deselect() {
  selectedId = null;
  card.hidden = true;
  lastInteraction = performance.now();
  render();
}

// Clic dans le vide : on ferme la fiche (mais pas après un glisser)
svg.addEventListener("click", (e) => {
  if (dragStart && Math.hypot(e.clientX - dragStart.x, e.clientY - dragStart.y) > 4) return;
  if (selectedId) deselect();
});

render();
requestAnimationFrame(tick);

fetch(LAND_URL)
  .then((r) => r.json())
  .then((topo) => {
    landGeo = feature(topo, topo.objects.land);
    render();
  })
  .catch((err) => console.error("Globe : impossible de charger les continents", err));
