// Génère public/data/idf-network.json : réseau ferré d'Île-de-France (métro, RER, Transilien,
// tram, Orlyval/CDGVAL, câble, funiculaire) + contours des départements et grands cours d'eau.
// Sources : OpenStreetMap (Overpass) et france-geojson. À relancer à la main quand le réseau évolue :
//   node scripts/build-idf-network.mjs            (télécharge puis génère)
//   node scripts/build-idf-network.mjs --cache=DIR (réutilise / stocke les téléchargements dans DIR)
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const OVERPASS = "https://overpass-api.de/api/interpreter";
const DEPTS_URL =
  "https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/departements-version-simplifiee.geojson";
const IDF_DEPTS = ["75", "77", "78", "91", "92", "93", "94", "95"];
const OUT = "public/data/idf-network.json";

const cacheArg = process.argv.find((a) => a.startsWith("--cache="));
const CACHE = cacheArg ? cacheArg.slice(8) : null;

const ROUTES_QUERY = `
[out:json][timeout:600];
area["ISO3166-2"="FR-IDF"]["admin_level"="4"]->.a;
(
  relation[type=route][route~"^(subway|tram|light_rail|monorail|funicular|aerialway)$"](area.a);
  relation[type=route][route=train][network~"RER|Transilien"](area.a);
)->.r;
.r out body;
way(r.r)->.w;
.w out geom;
node(r.r)->.n;
.n out body;
`;

const RIVERS_QUERY = `
[out:json][timeout:300][bbox:48.1,1.4,49.25,3.6];
way[waterway=river][name~"^(La Seine|La Marne|L'Oise)$"];
out geom;
`;

async function cached(name, fetcher) {
  if (CACHE) {
    const file = join(CACHE, name);
    if (existsSync(file)) return JSON.parse(await readFile(file, "utf8"));
    const data = await fetcher();
    await mkdir(CACHE, { recursive: true });
    await writeFile(file, JSON.stringify(data));
    return data;
  }
  return fetcher();
}

async function overpass(query) {
  const res = await fetch(OVERPASS, {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "valentin.vc map builder" },
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Lignes retenues : identifiant, mode, couleur officielle IDFM ──
const COLORS = {
  // Métro
  "M1": "#FFCD00", "M2": "#003CA6", "M3": "#837902", "M3bis": "#6EC4E8", "M4": "#CF009E",
  "M5": "#FF7E2E", "M6": "#6ECA97", "M7": "#FA9ABA", "M7bis": "#6ECA97", "M8": "#E19BDF",
  "M9": "#B6BD00", "M10": "#C9910D", "M11": "#704B1C", "M12": "#007852", "M13": "#6EC4E8",
  "M14": "#62259D", "M15": "#B90845", "M16": "#F3A4BA", "M17": "#D5C900", "M18": "#00A88F",
  // RER
  "RA": "#E3051C", "RB": "#5291CE", "RC": "#FFCE00", "RD": "#00814F", "RE": "#C04191",
  // Transilien
  "TH": "#8D5E2A", "TJ": "#D5C900", "TK": "#9F9825", "TL": "#CEADD2", "TN": "#00A88F",
  "TP": "#F28E42", "TR": "#F3A4BA", "TU": "#B90845", "TV": "#9F9825",
  // Tram
  "T1": "#003CA6", "T2": "#CF009E", "T3a": "#FF7E2E", "T3b": "#00814F", "T4": "#E19BDF",
  "T5": "#683C88", "T6": "#E3051C", "T7": "#704B1C", "T8": "#837902", "T9": "#5291CE",
  "T10": "#6EC4E8", "T11": "#FF7E2E", "T12": "#A50034", "T13": "#8D5E2A", "T14": "#00A88F",
  // Autres
  "ORLYVAL": "#6E6E6E", "CDGVAL": "#6E6E6E", "C1": "#6EC4E8", "FUN": "#6E6E6E",
};

function lineKey(tags) {
  const ref = (tags.ref || "").trim();
  const name = `${tags.name || ""} ${tags.network || ""}`;
  switch (tags.route) {
    case "subway":
      if (/orlyval/i.test(name)) return "ORLYVAL";
      if (/cdg ?val/i.test(name)) return "CDGVAL";
      return /^\d+(bis)?$/i.test(ref) ? "M" + ref.toLowerCase().replace("bis", "bis") : null;
    case "train":
      if (/RER/i.test(tags.network || "") && /^[A-E]$/.test(ref)) return "R" + ref;
      if (/Transilien/i.test(tags.network || "") && /^[HJKLNPRUV]$/.test(ref)) return "T" + ref;
      return null;
    case "tram":
    case "light_rail": {
      if (/orlyval/i.test(name)) return "ORLYVAL";
      if (/cdg ?val/i.test(name)) return "CDGVAL";
      const m = ref.match(/^T(\d+)\s*([ab])?/i);
      return m ? "T" + m[1] + (m[2] ? m[2].toLowerCase() : "") : null;
    }
    case "monorail":
      if (/orlyval/i.test(name)) return "ORLYVAL";
      if (/cdg ?val/i.test(name)) return "CDGVAL";
      return null;
    case "aerialway":
      return /C1|C[âa]ble/i.test(ref + name) ? "C1" : null;
    case "funicular":
      return /montmartre/i.test(name) ? "FUN" : null;
  }
  return null;
}

const MODE = (key) =>
  key.startsWith("M") ? "metro" : key.startsWith("R") ? "rer"
  : /^T[A-Z]$/.test(key) ? "train" : key.startsWith("T") ? "tram" : "other";

const LABEL = (key) =>
  key === "ORLYVAL" ? "Orlyval" : key === "CDGVAL" ? "CDGVAL" : key === "FUN" ? "Funiculaire"
  : key.startsWith("M") ? key.slice(1) : key.startsWith("R") ? key.slice(1)
  : /^T[A-Z]$/.test(key) ? key.slice(1) : key;

// ── Géométrie ──
const round = (v) => Math.round(v * 1e5) / 1e5;
const same = (a, b) => a[0] === b[0] && a[1] === b[1];
const dist2 = (a, b) => {
  const kx = Math.cos((48.8 * Math.PI) / 180);
  const dx = (a[0] - b[0]) * kx, dy = a[1] - b[1];
  return dx * dx + dy * dy;
};

// Enchaîne les ways d'une relation en polylignes continues (retourne les morceaux connexes)
function chainWays(ways) {
  const chains = [];
  let cur = null;
  let single = false; // la chaîne courante ne contient qu'un way : son sens peut encore être inversé
  for (const w of ways) {
    const pts = w.geometry.map((p) => [round(p.lon), round(p.lat)]);
    if (!cur) { cur = pts; single = true; continue; }
    if (single && !same(cur[cur.length - 1], pts[0]) && !same(cur[cur.length - 1], pts[pts.length - 1])
        && (same(cur[0], pts[0]) || same(cur[0], pts[pts.length - 1]))) {
      cur = cur.slice().reverse();
    }
    const end = cur[cur.length - 1];
    if (same(end, pts[0])) { cur = cur.concat(pts.slice(1)); single = false; }
    else if (same(end, pts[pts.length - 1])) { cur = cur.concat(pts.slice().reverse().slice(1)); single = false; }
    else { chains.push(cur); cur = pts; single = true; }
  }
  if (cur) chains.push(cur);
  return chains;
}

// Douglas-Peucker en conservant des indices imposés (arrêts)
function simplify(pts, keep, eps) {
  const n = pts.length;
  const mark = new Uint8Array(n);
  mark[0] = mark[n - 1] = 1;
  for (const k of keep) mark[k] = 1;
  const kx = Math.cos((48.8 * Math.PI) / 180);
  const stack = [];
  const fixed = [...mark.keys()].filter((i) => mark[i]);
  for (let i = 0; i < fixed.length - 1; i++) stack.push([fixed[i], fixed[i + 1]]);
  while (stack.length) {
    const [a, b] = stack.pop();
    if (b - a < 2) continue;
    const ax = pts[a][0] * kx, ay = pts[a][1], bx = pts[b][0] * kx, by = pts[b][1];
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy || 1e-12;
    let best = -1, bestD = eps * eps;
    for (let i = a + 1; i < b; i++) {
      const px = pts[i][0] * kx, py = pts[i][1];
      const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
      const ex = ax + t * dx - px, ey = ay + t * dy - py;
      const d = ex * ex + ey * ey;
      if (d > bestD) { bestD = d; best = i; }
    }
    if (best >= 0) { mark[best] = 1; stack.push([a, best], [best, b]); }
  }
  const map = new Int32Array(n).fill(-1);
  const out = [];
  for (let i = 0; i < n; i++) if (mark[i]) { map[i] = out.length; out.push(pts[i]); }
  return { pts: out, map };
}

function nearestIndex(poly, p) {
  let best = 0, bestD = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const d = dist2(poly[i], p);
    if (d < bestD) { bestD = d; best = i; }
  }
  return { i: best, d: Math.sqrt(bestD) };
}

// Normalisation des noms d'arrêts (doit rester identique côté client)
const norm = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[''`\-–—/().,]/g, " ").replace(/\bst\b/g, "saint").replace(/\bste\b/g, "sainte")
    .replace(/\s+/g, " ").trim();

function cleanStopName(name, key) {
  // Retire les suffixes de ligne/quai fréquents dans OSM (« Châtelet (ligne 14) », « Gare de Lyon - Quai 1 »)
  return name
    .replace(/\s*[\(\[][^)\]]*[\)\]]\s*$/g, "")
    .replace(/\s*[-–]\s*(quai|voie|platform)\b.*$/i, "")
    .replace(/^(M[ée]tro|RER|Tram(way)?|Gare de|Gare)\s+(?=\S)/i, (m) => (/^gare de/i.test(m) ? m : ""))
    .trim();
}

async function main() {
  console.log("Téléchargement des lignes (Overpass)…");
  const raw = await cached("idf-routes.json", () => overpass(ROUTES_QUERY));
  console.log("Téléchargement des cours d'eau…");
  const rawRivers = await cached("idf-rivers.json", () => overpass(RIVERS_QUERY));
  console.log("Téléchargement des départements…");
  const depts = await cached("departements.json", () => fetch(DEPTS_URL).then((r) => r.json()));

  const rels = raw.elements.filter((e) => e.type === "relation");
  const ways = new Map(raw.elements.filter((e) => e.type === "way").map((e) => [e.id, e]));
  const nodes = new Map(raw.elements.filter((e) => e.type === "node").map((e) => [e.id, e]));

  // Stations fusionnées par (nom normalisé, proximité ~400 m)
  const stations = []; // { name, n, lon, lat, lines:Set }
  function stationFor(name, lon, lat, key) {
    const n = norm(name);
    let best = null, bestD = Infinity;
    for (const s of stations) {
      if (s.n !== n) continue;
      const d = Math.sqrt(dist2([s.lon, s.lat], [lon, lat]));
      if (d < bestD) { bestD = d; best = s; }
    }
    if (best && bestD < 0.004) { best.lines.add(key); return best; }
    const s = { name, n, lon: round(lon), lat: round(lat), lines: new Set([key]) };
    stations.push(s);
    return s;
  }

  const lines = new Map(); // key -> { key, label, mode, color, variants: [] }
  const skipped = new Set();
  for (const rel of rels) {
    const t = rel.tags || {};
    if (t.disused || t["state"] === "proposed" || t["construction"]) continue;
    const key = lineKey(t);
    if (!key || !COLORS[key]) { skipped.add(`${t.route}|${t.network}|${t.ref}|${t.name}`); continue; }

    const trackWays = rel.members
      .filter((m) => m.type === "way" && (m.role === "" || m.role === "forward" || m.role === "backward"))
      .map((m) => ways.get(m.ref))
      .filter((w) => w && w.geometry && !(w.tags && (w.tags.public_transport === "platform" || w.tags.railway === "platform")));
    if (!trackWays.length) continue;
    const chains = chainWays(trackWays);
    // morceau principal = le plus long
    const main = chains.reduce((a, b) => (b.length > a.length ? b : a));

    let stopMembers = rel.members.filter((m) => /^stop/.test(m.role));
    if (!stopMembers.length) stopMembers = rel.members.filter((m) => /^platform/.test(m.role));
    const stops = [];
    for (const m of stopMembers) {
      let name, lon, lat, el;
      if (m.type === "node") {
        el = nodes.get(m.ref);
        if (!el) continue;
        lon = el.lon; lat = el.lat;
      } else if (m.type === "way") {
        el = ways.get(m.ref);
        if (!el || !el.geometry) continue;
        lon = el.geometry.reduce((s, p) => s + p.lon, 0) / el.geometry.length;
        lat = el.geometry.reduce((s, p) => s + p.lat, 0) / el.geometry.length;
      } else continue;
      name = el.tags && (el.tags.name || el.tags["name:fr"]);
      if (!name) continue;
      name = cleanStopName(name, key);
      if (!name) continue;
      const st = stationFor(name, lon, lat, key);
      if (stops.length && stops[stops.length - 1].st === st) continue;
      stops.push({ st, lon, lat });
    }
    if (stops.length < 2) continue;

    // Position de chaque arrêt sur la polyligne principale (indices croissants attendus)
    let poly = main;
    let idx = stops.map((s) => nearestIndex(poly, [s.lon, s.lat]));
    if (idx.length > 1 && idx[0].i > idx[idx.length - 1].i) {
      poly = poly.slice().reverse();
      idx = stops.map((s) => nearestIndex(poly, [s.lon, s.lat]));
    }
    // arrêts trop loin du tracé (> ~1 km) : variante mal formée, on garde quand même les arrêts
    const onTrack = idx.every((x) => x.d < 0.012);
    const keep = idx.map((x) => x.i);
    const simp = simplify(poly, keep, 0.00003);

    if (!lines.has(key)) {
      lines.set(key, { key, label: LABEL(key), mode: MODE(key), color: COLORS[key], variants: [] });
    }
    lines.get(key).variants.push({
      stops: stops.map((s) => s.st),
      at: onTrack ? keep.map((i) => simp.map[i]) : null,
      coords: simp.pts,
    });
  }

  // Dédoublonnage des variantes identiques (même suite d'arrêts, dans un sens ou l'autre)
  const stationIndex = new Map(stations.map((s, i) => [s, i]));
  const outLines = [];
  for (const line of lines.values()) {
    const seen = new Set();
    const variants = [];
    for (const v of line.variants.sort((a, b) => b.stops.length - a.stops.length)) {
      const ids = v.stops.map((s) => stationIndex.get(s));
      const sig = ids.join(",");
      const rev = ids.slice().reverse().join(",");
      if (seen.has(sig) || seen.has(rev)) continue;
      // variante entièrement contenue dans une autre déjà gardée (même ordre) : inutile
      const contained = variants.some((o) => o.s.join(",").includes(sig) || o.s.join(",").includes(rev));
      if (contained) continue;
      seen.add(sig);
      variants.push({ s: ids, a: v.at, c: v.coords });
    }
    outLines.push({ k: line.key, l: line.label, m: line.mode, c: line.color, v: variants });
  }
  outLines.sort((a, b) => Object.keys(COLORS).indexOf(a.k) - Object.keys(COLORS).indexOf(b.k));

  // Départements d'IDF
  const deptFeatures = depts.features
    .filter((f) => IDF_DEPTS.includes(f.properties.code))
    .map((f) => ({
      code: f.properties.code,
      rings: (f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates)
        .flat()
        .map((ring) => ring.map(([x, y]) => [round(x), round(y)])),
    }));

  // Rivières (ways simplifiées)
  const rivers = rawRivers.elements
    .filter((e) => e.type === "way" && e.geometry)
    .map((w) => {
      const pts = w.geometry.map((p) => [round(p.lon), round(p.lat)]);
      return simplify(pts, [], 0.0002).pts;
    });

  const out = {
    generated: new Date().toISOString().slice(0, 10),
    stations: stations.map((s) => [s.name, s.lon, s.lat]),
    lines: outLines,
    departements: deptFeatures,
    rivers,
  };
  await mkdir("public/data", { recursive: true });
  await writeFile(OUT, JSON.stringify(out));
  const size = (JSON.stringify(out).length / 1024).toFixed(0);
  console.log(`OK : ${outLines.length} lignes, ${stations.length} stations, ${size} Ko → ${OUT}`);
  for (const l of outLines) console.log(`  ${l.k.padEnd(8)} ${l.v.length} variantes, ${Math.max(...l.v.map((v) => v.s.length))} arrêts max${l.v.some((v) => !v.a) ? " (tracé approx.)" : ""}`);
  console.log("Relations ignorées :", [...skipped].slice(0, 40).join("\n  "));
}

main().catch((e) => { console.error(e); process.exit(1); });
