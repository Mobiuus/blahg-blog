// Catalogue des placements présentés sur /epargne.
// Les couleurs reprennent la palette des fiches /notes.
import { colors } from "@/components/notes/utils/colors";

export type PlacementKind = "enveloppe" | "classe";

export interface Placement {
  slug: string;
  title: string;
  kind: PlacementKind;
  /** produits ou supports regroupés sous cette entrée */
  includes: string[];
  /** une phrase factuelle et simple */
  summary: string;
  color: string;
  /** fiche rédigée ou non */
  ready: boolean;
}

export const KIND_LABEL: Record<PlacementKind, string> = {
  enveloppe: "Enveloppe fiscale",
  classe: "Classe d'actifs",
};

export const placements: Placement[] = [
  {
    slug: "livrets-reglementes",
    title: "Livrets réglementés",
    kind: "enveloppe",
    includes: ["Livret A", "LDDS", "LEP"],
    summary:
      "Épargne sans risque, disponible à tout moment, défiscalisée. Le taux et les plafonds sont fixés par l'État.",
    color: colors[2],
    ready: true,
  },
  {
    slug: "assurance-vie",
    title: "Assurance-vie",
    kind: "enveloppe",
    includes: ["Fonds en euros", "Unités de compte"],
    summary:
      "Contrat qui loge des supports variés ; fiscalité allégée après 8 ans et cadre successoral avantageux.",
    color: colors[0],
    ready: false,
  },
  {
    slug: "pea",
    title: "PEA & PEA-PME",
    kind: "enveloppe",
    includes: ["Actions européennes", "Fonds éligibles"],
    summary:
      "Compte pour détenir des actions européennes ; plus-values exonérées d'impôt après 5 ans (hors prélèvements sociaux).",
    color: colors[4],
    ready: false,
  },
  {
    slug: "per",
    title: "Plan d'épargne retraite",
    kind: "enveloppe",
    includes: ["PER individuel", "PER collectif"],
    summary:
      "Épargne bloquée jusqu'à la retraite (sauf cas de déblocage) ; versements déductibles du revenu imposable.",
    color: colors[6],
    ready: false,
  },
  {
    slug: "epargne-salariale",
    title: "Épargne salariale",
    kind: "enveloppe",
    includes: ["PEE", "PER collectif", "Intéressement", "Participation"],
    summary:
      "Épargne alimentée par l'intéressement, la participation et l'abondement de l'employeur.",
    color: colors[9],
    ready: true,
  },
  {
    slug: "cto",
    title: "Compte-titres ordinaire",
    kind: "enveloppe",
    includes: ["Actions", "Obligations", "Fonds"],
    summary:
      "Aucun plafond ni restriction géographique, mais aucun avantage fiscal : gains soumis au prélèvement forfaitaire.",
    color: colors[5],
    ready: false,
  },
  {
    slug: "crowdfunding",
    title: "Financement participatif",
    kind: "classe",
    includes: ["Prêt", "Obligations", "Actions"],
    summary:
      "Prêter ou investir directement dans un projet via une plateforme agréée ; risque de perte en capital.",
    color: colors[1],
    ready: false,
  },
  {
    slug: "immobilier",
    title: "Immobilier papier",
    kind: "classe",
    includes: ["SCPI", "OPCI", "SCI"],
    summary:
      "Parts de sociétés qui possèdent et louent des immeubles ; revenus réguliers, capital non garanti.",
    color: colors[7],
    ready: false,
  },
  {
    slug: "capital-investissement",
    title: "Capital-investissement",
    kind: "classe",
    includes: ["FCPR", "FCPI", "FIP"],
    summary:
      "Fonds qui entrent au capital d'entreprises non cotées ; argent bloqué 5 à 10 ans, risque élevé.",
    color: colors[3],
    ready: false,
  },
  {
    slug: "comptes-bancaires",
    title: "Comptes & livrets bancaires",
    kind: "classe",
    includes: ["Compte courant", "Livrets fiscalisés", "Comptes à terme"],
    summary:
      "L'argent laissé en banque sert à ses crédits et investissements : le choix de la banque compte.",
    color: colors[8],
    ready: false,
  },
];
