// Mini-Terre du dossier « maps » dans le menu : contours des continents, rotation lente.
// Même rendu que le globe de /maps/invest (d3-geo, world-atlas 110m), en miniature.
import { geoOrthographic, geoPath } from "https://cdn.jsdelivr.net/npm/d3-geo@3.1.1/+esm";
import { feature } from "https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm";

const LAND_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json";
const SVG_NS = "http://www.w3.org/2000/svg";
const SPEED = 0.25; // degrés par frame

const svgs = document.querySelectorAll("svg[data-mini-globe]");
const topo = await fetch(LAND_URL).then((r) => r.json());
const land = feature(topo, topo.objects.land);

const globes = [...svgs].map((svg) => {
  const projection = geoOrthographic().scale(48).translate([50, 50]).clipAngle(90).rotate([-10, -25]);
  const path = geoPath(projection);
  const landPath = document.createElementNS(SVG_NS, "path");
  landPath.setAttribute("fill", "#efefef");
  landPath.setAttribute("stroke", "#252525");
  landPath.setAttribute("stroke-width", "0.8");
  landPath.setAttribute("stroke-linejoin", "round");
  svg.appendChild(landPath);
  // le dossier reste ouvert tant qu'on survole aussi son menu déroulant : on suit l'élément de liste
  const item = svg.closest("li");
  return { svg, projection, path, landPath, item };
});

function draw(g) {
  g.landPath.setAttribute("d", g.path(land));
}

// Ne tourne que lorsque le dossier est ouvert (survol, focus, ou écran tactile)
const touch = window.matchMedia("(hover: none)").matches;
function tick() {
  for (const g of globes) {
    const open = touch || g.item?.matches(":hover, :focus-within, .open");
    if (open) {
      const [l, p, r] = g.projection.rotate();
      g.projection.rotate([l + SPEED, p, r]);
      draw(g);
    }
  }
  requestAnimationFrame(tick);
}

globes.forEach(draw);
requestAnimationFrame(tick);
