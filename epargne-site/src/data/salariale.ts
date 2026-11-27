import { colors } from "./colors";

export const C_PEE = colors[0]; // sarcelle
export const C_PER = colors[3]; // rouge

/* ── 1. Les sources d'argent ─────────────────────────────────── */
export type PlanKey = "pee" | "per";

export interface Source {
  id: string;
  title: string;
  who: string;
  color: string;
  hand: string;
  body: string;
  plans: PlanKey[];
  note?: string;
}

export const sources: Source[] = [
  {
    id: "interessement",
    title: "Intéressement",
    who: "versé par l'entreprise",
    color: colors[1],
    hand: "Une prime sur objectifs collectifs",
    body: "Prime liée à des objectifs collectifs (chiffre d'affaires, qualité, sécurité, réduction des déchets…) fixés par un accord. Si les objectifs sont atteints, la prime est versée à l'ensemble des salariés. Elle est facultative pour l'entreprise.",
    plans: ["pee", "per"],
    note: "Placée sur un plan, elle échappe à l'impôt sur le revenu. Si vous ne choisissez rien, elle va sur le PEE.",
  },
  {
    id: "participation",
    title: "Participation",
    who: "versée par l'entreprise",
    color: colors[2],
    hand: "Une part des bénéfices",
    body: "Quand l'entreprise réalise un bénéfice, une partie est redistribuée aux salariés selon une formule légale ou négociée. Elle est obligatoire dans les entreprises d'au moins 50 salariés.",
    plans: ["pee", "per"],
    note: "Placée sur un plan, elle échappe à l'impôt sur le revenu. Si vous ne choisissez rien, une moitié va sur le PER collectif (s'il existe), l'autre selon l'accord.",
  },
  {
    id: "versements",
    title: "Versements volontaires",
    who: "versés par vous",
    color: colors[4],
    hand: "Votre propre épargne",
    body: "Les sommes que vous choisissez de verser librement sur votre PEE ou votre PER collectif, depuis votre compte bancaire.",
    plans: ["pee", "per"],
    note: "Sur le PER collectif, ces versements peuvent être déduits de votre revenu imposable, dans certaines limites.",
  },
  {
    id: "abondement",
    title: "Abondement",
    who: "versé par l'entreprise",
    color: colors[7],
    hand: "Un coup de pouce de l'employeur",
    body: "Somme que l'entreprise ajoute pour compléter ce que vous versez sur le plan (versements volontaires, intéressement, participation selon l'accord). Par exemple : 1 € versé = 1 € ajouté, dans la limite d'un plafond.",
    plans: ["pee", "per"],
    note: "Plafond annuel : 8 % du plafond de la Sécurité sociale sur le PEE, 16 % sur le PER collectif.",
  },
  {
    id: "cet",
    title: "Compte épargne temps",
    who: "vos jours non pris",
    color: colors[3],
    hand: "Des congés transformés en épargne",
    body: "Le compte épargne temps (CET) permet d'accumuler des droits à partir de jours de congé, de RTT ou de primes non utilisés. Ces droits peuvent être transformés en argent et placés sur un plan d'épargne salariale.",
    plans: ["pee", "per"],
    note: "Pour la retraite : jusqu'à 10 jours par an peuvent être versés sur le PER collectif sans impôt sur le revenu.",
  },
  {
    id: "transfert",
    title: "Transfert d'autres PER",
    who: "votre épargne retraite",
    color: colors[5],
    hand: "Regrouper son épargne retraite",
    body: "L'argent d'un autre plan d'épargne retraite (ancien employeur, PER individuel…) peut être transféré sur le PER collectif.",
    plans: ["per"],
  },
];

/* ── 2. PEE vs PER collectif ────────────────────────────────── */
export interface Row {
  label: string;
  pee: string;
  per: string;
  same?: boolean;
}

export const rows: Row[] = [
  { label: "Objectif", pee: "Projets à moyen terme", per: "Préparer la retraite" },
  { label: "Durée de blocage", pee: "5 ans", per: "Jusqu'à la retraite" },
  {
    label: "Sortie anticipée",
    pee: "Nombreux cas : achat de la résidence principale, mariage ou PACS, naissance d'un 3e enfant, fin du contrat de travail, rénovation énergétique, achat d'un véhicule propre…",
    per: "Peu de cas : achat de la résidence principale et « accidents de la vie » (invalidité, décès du conjoint, surendettement…)",
  },
  { label: "À la sortie", pee: "Un capital", per: "Un capital, une rente, ou les deux" },
  {
    label: "Versements volontaires",
    pee: "Pas d'avantage fiscal à l'entrée",
    per: "Déductibles du revenu imposable (dans certaines limites)",
  },
  { label: "Abondement maximum", pee: "8 % du plafond de la Sécurité sociale par an", per: "16 % du plafond de la Sécurité sociale par an" },
  {
    label: "Si vous ne choisissez pas de fonds",
    pee: "Le fonds prévu par le règlement du plan",
    per: "« Gestion pilotée » : l'épargne passe progressivement vers des fonds moins risqués à l'approche de la retraite",
  },
  {
    label: "Fonds durables obligatoires",
    pee: "Au moins un fonds solidaire et au moins un fonds labellisé",
    per: "Au moins un fonds solidaire et au moins un fonds labellisé",
    same: true,
  },
];

/* ── 3. Labels ───────────────────────────────────────────────── */
export interface Label {
  name: string;
  color: string;
  what: string;
  fossil: "oui" | "partiel" | "non";
  fossilText: string;
}

export const labels: Label[] = [
  {
    name: "Greenfin",
    color: colors[2],
    what: "Finance la transition écologique (énergies renouvelables, efficacité énergétique…). Label public créé par le ministère de la Transition écologique.",
    fossil: "oui",
    fossilText: "Exclut toute la chaîne des énergies fossiles. Le plus exigeant sur le climat.",
  },
  {
    name: "ISR",
    color: colors[0],
    what: "Investissement socialement responsable : le fonds tient compte de critères environnementaux, sociaux et de gouvernance (ESG). Label public, réformé en 2024.",
    fossil: "partiel",
    fossilText: "Exclut le charbon et les entreprises qui lancent de nouveaux projets de pétrole ou de gaz.",
  },
  {
    name: "Finansol",
    color: colors[1],
    what: "Distingue les placements solidaires : logement très social, insertion par l'emploi, agriculture biologique, entrepreneuriat dans les pays en développement…",
    fossil: "non",
    fossilText: "Label social et solidaire : il ne porte pas sur le climat.",
  },
  {
    name: "CIES",
    color: colors[3],
    what: "Label créé par plusieurs syndicats (Comité intersyndical de l'épargne salariale) pour les gammes de fonds d'épargne salariale : critères ESG, frais, gouvernance paritaire.",
    fossil: "partiel",
    fossilText: "Exigences ESG générales, sans exclusion systématique des énergies fossiles.",
  },
];
