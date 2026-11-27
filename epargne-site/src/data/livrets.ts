import { colors } from "./colors";

export const C_LIVRET_A = colors[1]; // rouge
export const C_LDDS = colors[0]; // sarcelle

/* ── 1. Caractéristiques ─────────────────────────────────────── */
export interface Row {
  label: string;
  a: string;
  ldds: string;
  same?: boolean;
  note?: string;
}

export const rows: Row[] = [
  {
    label: "Taux",
    a: "1,7 % net",
    ldds: "1,7 % net",
    same: true,
    note: "Depuis le 1er août 2026 et jusqu'au 31 janvier 2027. Fixé par l'État et révisé chaque 1er février et 1er août.",
  },
  {
    label: "Plafond des versements",
    a: "22 950 € (76 500 € pour une association)",
    ldds: "12 000 €",
    note: "Les intérêts capitalisés peuvent faire dépasser ce plafond.",
  },
  {
    label: "Qui peut l'ouvrir",
    a: "Tout le monde, y compris les mineurs",
    ldds: "Les majeurs domiciliés fiscalement en France",
  },
  {
    label: "Combien par personne",
    a: "Un seul",
    ldds: "Un seul (deux au maximum par foyer fiscal)",
  },
  {
    label: "Dépôt à l'ouverture",
    a: "10 € minimum (1,50 € à La Banque Postale)",
    ldds: "15 € minimum",
  },
  {
    label: "Fiscalité",
    a: "Intérêts exonérés d'impôt sur le revenu et de prélèvements sociaux",
    ldds: "Intérêts exonérés d'impôt sur le revenu et de prélèvements sociaux",
    same: true,
  },
  {
    label: "Disponibilité",
    a: "Retraits possibles à tout moment, sans frais",
    ldds: "Retraits possibles à tout moment, sans frais",
    same: true,
  },
  {
    label: "Calcul des intérêts",
    a: "Par quinzaine, versés le 31 décembre",
    ldds: "Par quinzaine, versés le 31 décembre",
    same: true,
    note: "Un dépôt rapporte à partir du 1er ou du 16 du mois qui suit ; un retrait cesse de rapporter dès le début de la quinzaine où il a lieu.",
  },
  {
    label: "Sécurité",
    a: "Capital garanti",
    ldds: "Capital garanti",
    same: true,
  },
  {
    label: "Où va l'argent",
    a: "59,5 % à la Caisse des Dépôts ; le reste finance des PME",
    ldds: "59,5 % à la Caisse des Dépôts ; le reste finance des PME, la transition énergétique et l'ESS",
  },
  {
    label: "Volet solidaire",
    a: "—",
    ldds: "Une fois par an, la banque propose de donner une partie de son épargne à une structure de l'économie sociale et solidaire",
  },
];

/* ── 2. Circuit de l'argent ──────────────────────────────────── */
export interface FlowNode {
  id: string;
  title: string;
  amount?: string;
  body: string;
  color: string;
  link?: { href: string; label: string };
}

export const flow: Record<string, FlowNode> = {
  vous: {
    id: "vous",
    title: "Vous",
    amount: "100 €",
    color: colors[5],
    body: "Vous déposez sur votre Livret A ou votre LDDS, dans n'importe quelle banque. Le taux est le même partout : c'est l'État qui le fixe, pas la banque.",
  },
  banque: {
    id: "banque",
    title: "Votre banque",
    color: colors[9],
    body: "La banque collecte les dépôts et en transfère une partie à la Caisse des Dépôts, qui lui verse une commission pour ce service.",
  },
  fonds: {
    id: "fonds",
    title: "Fonds d'épargne",
    amount: "≈ 60 €",
    color: colors[2],
    body: "59,5 % des dépôts du Livret A et du LDDS sont centralisés au Fonds d'épargne de la Caisse des Dépôts, avec une partie du LEP : 406,5 Md€ fin 2025. Son rôle : transformer une épargne disponible à tout moment en prêts de très long terme. À ce stade, Livret A et LDDS sont mélangés.",
  },
  reste: {
    id: "reste",
    title: "Reste à la banque",
    amount: "≈ 40 €",
    color: colors[4],
    body: "Les 40,5 % restants restent au bilan de votre banque. La loi l'oblige à les employer au financement des PME et des travaux d'économies d'énergie dans les bâtiments anciens ; pour le LDDS, aussi la transition énergétique et l'économie sociale et solidaire.",
  },
  prets: {
    id: "prets",
    title: "Prêts de long terme",
    color: colors[0],
    body: "Prêts jusqu'à 80 ans, accordés par la Banque des Territoires. Fin 2025, ils représentent 244,9 Md€, soit 54 % du bilan du Fonds d'épargne (la limite est de 66 %). Priorité fixée par la loi : le logement social, qui pèse à lui seul 45 % du bilan. Viennent ensuite la politique de la ville, les investissements des collectivités (hôpitaux, écoles, eau) et de grandes infrastructures (réseau électrique, nucléaire).",
    link: { href: "#projets", label: "Voir des exemples" },
  },
  portefeuille: {
    id: "portefeuille",
    title: "Placements financiers",
    color: colors[3],
    body: "Le reste, 197 Md€ fin 2025, est placé en actifs financiers pour garantir la liquidité, c'est-à-dire pouvoir rembourser les épargnants à tout moment, et payer leurs intérêts. Ce sont surtout des obligations (environ 173 Md€), et 23,3 Md€ d'actions et de fonds, principalement de grandes entreprises françaises et européennes. Les entreprises du pétrole et du gaz y pèsent 2,65 %.",
    link: { href: "#limites", label: "En savoir plus" },
  },
  pme: {
    id: "pme",
    title: "PME, rénovation, ESS",
    color: colors[6],
    body: "Crédits accordés par votre banque à des petites et moyennes entreprises, pour des travaux d'économies d'énergie et, pour le LDDS, à des acteurs de la transition énergétique et de l'économie sociale et solidaire.",
  },
};

/* ── 3. Projets financés ─────────────────────────────────────── */
export type Theme = "sante" | "logement" | "education" | "energie" | "eau";

export const THEMES: Record<Theme, { label: string; color: string }> = {
  sante: { label: "Santé", color: colors[5] },
  logement: { label: "Logement", color: colors[9] },
  education: { label: "Éducation", color: colors[6] },
  energie: { label: "Énergie", color: colors[1] },
  eau: { label: "Eau", color: colors[8] },
};

export interface Project {
  id: string;
  theme: Theme;
  title: string;
  place: string;
  pitch: string;
  loan: string;
  /** montants en M€ pour la barre de part financée */
  loanM?: number;
  totalM?: number;
  totalLabel?: string;
  year?: string;
  details?: string[];
}

export const projects: Project[] = [
  {
    id: "caen",
    theme: "sante",
    title: "Réhabilitation du CHU de Caen",
    place: "Caen · Normandie",
    pitch: "Un bâtiment de médecine et de chirurgie moderne et des plateaux médico-techniques performants, reconstruits sur l'empreinte du site actuel de la Côte de Nacre.",
    loan: "105 M€",
    loanM: 105,
    totalM: 483,
    totalLabel: "483 M€",
  },
  {
    id: "tours",
    theme: "sante",
    title: "Nouvel hôpital de Tours",
    place: "Tours · Indre-et-Loire (37)",
    pitch: "Un hôpital moderne, conçu pour être durable et économe en énergie.",
    loan: "119 M€",
  },
  {
    id: "neulliac",
    theme: "sante",
    title: "Maison de santé pluridisciplinaire",
    place: "Neulliac · Morbihan (56)",
    pitch: "Une nouvelle structure pour améliorer l'accès aux soins dans les territoires ruraux.",
    loan: "1,5 M€",
  },
  {
    id: "doulchard",
    theme: "logement",
    title: "Logements intergénérationnels",
    place: "Saint-Doulchard · Cher (18)",
    pitch: "Une offre locative pour les seniors, 23 logements individuels et 16 collectifs, pour que seniors et familles vivent côte à côte.",
    loan: "5,4 M€",
    loanM: 5.4,
    totalM: 6.4,
    totalLabel: "6,4 M€",
  },
  {
    id: "graulhet",
    theme: "education",
    title: "Rénovation du collège Pasteur",
    place: "Graulhet · Tarn (81)",
    pitch: "Rénovation énergétique et extension d'un collège de 1973 devenu très énergivore, menée sans interrompre les cours.",
    loan: "10 M€ sur 30 ans",
    loanM: 10,
    totalM: 20,
    totalLabel: "20 M€",
    year: "2023 → 2027",
    details: [
      "Économie d'énergie visée : −61 % (label BBC Effinergie Rénovation)",
      "9 550 m² rénovés et étendus · 1 037 élèves",
      "Isolation par l'extérieur, menuiseries, désamiantage, panneaux photovoltaïques",
      "Matériaux locaux : brique en terre crue de Graulhet, bois du Massif central",
      "Prêt Transformation écologique du programme Edurenov ; le reste vient de subventions (Fonds vert, FEDER) et du Département",
    ],
  },
  {
    id: "rte",
    theme: "energie",
    title: "Réseau de transport d'électricité (RTE)",
    place: "France entière",
    pitch: "Développer et moderniser le réseau haute tension pour raccorder la production bas-carbone, accompagner l'électrification et adapter le réseau au changement climatique.",
    loan: "5 Md€ d'ici 2029",
    year: "1re tranche : 1 Md€ sur 40 ans (déc. 2025)",
    details: [
      "Plus de 106 000 km de lignes haute et très haute tension",
      "Objectif : plus de 50 % d'électricité dans le mix énergétique d'ici 2050",
      "Infrastructures conçues pour durer plus de 80 ans",
    ],
  },
  {
    id: "epr2",
    theme: "energie",
    title: "Nouveau nucléaire : 6 réacteurs EPR2",
    place: "Penly (76) et autres sites",
    pitch: "Prêt bonifié et garanti par l'État pour participer, aux côtés d'EDF, à la construction de 6 réacteurs EPR2.",
    loan: "4 à 5 Md€ par an",
    year: "Pendant une douzaine d'années · annoncé en mars 2026",
    details: [
      "Calendrier des versements à définir avec EDF",
      "Sous réserve de l'accord de la Commission européenne et de la garantie de l'État, à voter en loi de finances",
      "Selon la Caisse des Dépôts, ces prêts ne réduiront pas ceux destinés au logement social",
    ],
  },
  {
    id: "smiage",
    theme: "eau",
    title: "Prévention des inondations dans la Vésubie",
    place: "Saint-Martin-Vésubie · Alpes-Maritimes (06)",
    pitch: "Aménagement de la confluence de la Loubonnière et protection de la route RM2565, par le syndicat SMIAGE.",
    loan: "10 M€",
    year: "2026",
  },
  {
    id: "argeles",
    theme: "eau",
    title: "Réutilisation des eaux usées traitées",
    place: "Argelès-sur-Mer · Pyrénées-Orientales (66)",
    pitch: "La station d'épuration valorisera près de 1,3 million de m³ d'eaux usées traitées par an pour l'agriculture locale, dans un département exposé aux sécheresses.",
    loan: "2,5 M€ sur 40 ans",
  },
  {
    id: "fouras",
    theme: "eau",
    title: "Nouvelle usine d'assainissement",
    place: "Fouras · Charente-Maritime (17)",
    pitch: "Construction d'une usine de traitement des eaux usées par le syndicat Eau17.",
    loan: "8 M€",
    year: "2026",
  },
  {
    id: "pyreneau",
    theme: "eau",
    title: "Interconnexion des réseaux d'eau potable",
    place: "Arthez-d'Asson → Baudreix · Pyrénées-Atlantiques (64)",
    pitch: "Une liaison entre réseaux pour sécuriser l'approvisionnement en eau potable, portée par le syndicat Pyren'Eau.",
    loan: "1,8 M€",
    year: "2025",
  },
  {
    id: "bagnole",
    theme: "eau",
    title: "Protection d'un captage d'eau potable",
    place: "Bagnoles de l'Orne Normandie · Orne (61)",
    pitch: "Achat de terres agricoles autour du captage de Saint-Ursin pour protéger la ressource, et renouvellement des réseaux.",
    loan: "1 M€",
    year: "2024",
  },
];
