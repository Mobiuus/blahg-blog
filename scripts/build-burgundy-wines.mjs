// Génère public/data/burgundy-wines.json : contours des départements viticoles de Bourgogne
// (Yonne, Côte-d'Or, Saône-et-Loire) et des communes viticoles, rangées par sous-région.
// Sources : france-geojson (départements) et geo.api.gouv.fr (communes). À relancer à la main :
//   node scripts/build-burgundy-wines.mjs            (télécharge puis génère)
//   node scripts/build-burgundy-wines.mjs --cache=DIR (réutilise / stocke les téléchargements dans DIR)
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const DEPTS_URL =
  "https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/departements-version-simplifiee.geojson";
const COMMUNES_URL = (dep) =>
  `https://geo.api.gouv.fr/departements/${dep}/communes?format=geojson&geometry=contour&fields=code,nom`;
const DEPTS = ["21", "71", "89"];
const OUT = "public/data/burgundy-wines.json";

const cacheArg = process.argv.find((a) => a.startsWith("--cache="));
const CACHE = cacheArg ? cacheArg.slice(8) : null;

// ── Sous-régions viticoles et leurs principales communes (département, nom officiel) ──
const REGIONS = [
  { key: "chablis", label: "Chablis", communes: ["89", [
    "Chablis", "Fleys", "La Chapelle-Vaupelteigne", "Maligny", "Ligny-le-Châtel", "Beine",
    "Préhy", "Courgis", "Chichée", "Fontenay-près-Chablis", "Villy", "Lignorelles", "Poilly-sur-Serein",
    "Chemilly-sur-Serein", "Collan", "Viviers", "Béru",
  ]] },
  { key: "auxerrois", label: "Grand Auxerrois", communes: ["89", [
    "Irancy", "Saint-Bris-le-Vineux", "Chitry", "Coulanges-la-Vineuse", "Auxerre", "Vincelottes",
    "Escolives-Sainte-Camille", "Jussy", "Val-de-Mercy", "Vézelay", "Saint-Père", "Tonnerre",
    "Épineuil", "Dannemoine", "Joigny",
  ]] },
  { key: "nuits", label: "Côte de Nuits", communes: ["21", [
    "Chenôve", "Marsannay-la-Côte", "Couchey", "Fixin", "Brochon", "Gevrey-Chambertin",
    "Morey-Saint-Denis", "Chambolle-Musigny", "Vougeot", "Flagey-Echézeaux", "Vosne-Romanée",
    "Nuits-Saint-Georges", "Premeaux-Prissey", "Comblanchien", "Corgoloin",
  ]] },
  { key: "hautes-cotes", label: "Hautes-Côtes", communes: ["21", [
    // Hautes-Côtes de Nuits
    "Arcenant", "Chevannes", "Curtil-Vergy", "L'Étang-Vergy", "Magny-lès-Villers",
    "Marey-lès-Fussey", "Meuilley", "Messanges", "Villars-Fontaine", "Villers-la-Faye", "Reulle-Vergy",
    "Bévy", "Chaux", "Segrois", "Fussey", "Détain-et-Bruant", "Ternant",
    // Hautes-Côtes de Beaune
    "Nantoux", "Meloisey", "Mavilly-Mandelot", "Bouze-lès-Beaune", "Échevronne", "Nolay", "La Rochepot",
    "Baubigny", "Cormot-Vauchignon", "Val-Mont", "Vic-des-Prés", "Aubigny-la-Ronce",
    "Molinot", "Santosse",
  ]] },
  { key: "beaune", label: "Côte de Beaune", communes: ["21", [
    "Ladoix-Serrigny", "Aloxe-Corton", "Pernand-Vergelesses", "Savigny-lès-Beaune", "Chorey-lès-Beaune",
    "Beaune", "Pommard", "Volnay", "Monthelie", "Auxey-Duresses", "Saint-Romain", "Meursault", "Puligny-Montrachet",
    "Chassagne-Montrachet", "Saint-Aubin", "Santenay",
  ]] },
  { key: "maranges", label: "Côte de Beaune", communes: ["71", [
    "Cheilly-lès-Maranges", "Dezize-lès-Maranges", "Sampigny-lès-Maranges", "Remigny",
  ]] },
  { key: "chalonnaise", label: "Côte Chalonnaise", communes: ["71", [
    "Bouzeron", "Rully", "Chassey-le-Camp", "Mercurey", "Saint-Martin-sous-Montaigu",
    "Givry", "Jambles", "Dracy-le-Fort", "Saint-Désert", "Montagny-lès-Buxy", "Buxy",
    "Jully-lès-Buxy", "Saint-Vallerin", "Couches",
  ]] },
  { key: "maconnais", label: "Mâconnais", communes: ["71", [
    "Mâcon", "Viré", "Clessé", "Montbellet", "Laizé", "Lugny", "Azé", "Chardonnay", "Uchizy", "Péronne",
    "Saint-Gengoux-de-Scissé", "Cruzille", "Pierreclos", "Bussières", "Vergisson", "Solutré-Pouilly",
    "Fuissé", "Chaintré", "Vinzelles", "Davayé", "Prissé", "Chasselas", "Leynes", "Saint-Vérand",
    "Chânes", "La Roche-Vineuse", "Igé", "Verzé", "Charnay-lès-Mâcon", "Sologny", "Milly-Lamartine",
    "Hurigny", "Sancé", "Senozan", "Crêches-sur-Saône",
  ]] },
];

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

const getJson = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": "valentin.vc wine map builder" } });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
};

// ── Géométrie ──
const round = (v) => Math.round(v * 1e4) / 1e4;
const KX = Math.cos((47 * Math.PI) / 180);

// Douglas-Peucker sur un anneau fermé
function simplify(pts, eps) {
  const n = pts.length;
  if (n < 5) return pts;
  const mark = new Uint8Array(n);
  mark[0] = mark[n - 1] = 1;
  const stack = [[0, n - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    if (b - a < 2) continue;
    const ax = pts[a][0] * KX, ay = pts[a][1], bx = pts[b][0] * KX, by = pts[b][1];
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy || 1e-12;
    let best = -1, bestD = eps * eps;
    for (let i = a + 1; i < b; i++) {
      const px = pts[i][0] * KX, py = pts[i][1];
      const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
      const ex = ax + t * dx - px, ey = ay + t * dy - py;
      const d = ex * ex + ey * ey;
      if (d > bestD) { bestD = d; best = i; }
    }
    if (best >= 0) { mark[best] = 1; stack.push([a, best], [best, b]); }
  }
  return pts.filter((_, i) => mark[i]);
}

const ringsOf = (geom) => (geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates)
  .map((poly) => poly[0]); // anneaux extérieurs seulement

const cleanRing = (ring, eps) => simplify(ring.map(([x, y]) => [round(x), round(y)]), eps);

// Les noms sont comparés sans accents ni ligatures (« Concœur » = « Concoeur »)
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").toLowerCase()
  .replace(/['’\-]/g, " ").replace(/\s+/g, " ").trim();

async function main() {
  console.log("Téléchargement des départements…");
  const depts = await cached("departements.json", () => getJson(DEPTS_URL));
  const communesByDept = {};
  for (const dep of DEPTS) {
    console.log(`Téléchargement des communes (${dep})…`);
    communesByDept[dep] = await cached(`communes-${dep}.json`, () => getJson(COMMUNES_URL(dep)));
  }

  const departements = depts.features
    .filter((f) => DEPTS.includes(f.properties.code))
    .map((f) => ({
      code: f.properties.code,
      name: f.properties.nom,
      rings: ringsOf(f.geometry).map((r) => cleanRing(r, 0.002)),
    }));

  const communes = [];
  const missing = [];
  for (const region of REGIONS) {
    const [dep, names] = region.communes;
    const index = new Map(communesByDept[dep].features.map((f) => [norm(f.properties.nom), f]));
    for (const name of names) {
      const f = index.get(norm(name));
      if (!f) { missing.push(`${dep} ${name}`); continue; }
      communes.push({
        n: f.properties.nom,
        c: f.properties.code,
        r: region.key === "maranges" ? "beaune" : region.key,
        rings: ringsOf(f.geometry).map((r) => cleanRing(r, 0.0006)),
      });
    }
  }

  const out = { generated: new Date().toISOString().slice(0, 10), departements, communes };
  await mkdir("public/data", { recursive: true });
  await writeFile(OUT, JSON.stringify(out));
  const size = (JSON.stringify(out).length / 1024).toFixed(0);
  console.log(`OK : ${communes.length} communes, ${size} Ko → ${OUT}`);
  if (missing.length) console.log("Communes introuvables :\n  " + missing.join("\n  "));
}

main().catch((e) => { console.error(e); process.exit(1); });
