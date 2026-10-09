// src/lib/books.ts

// Catégories des étagères « Lu ! », dans l'ordre d'affichage
export const categories = [
  { key: "economie", title: "Économie" },
  { key: "politique", title: "Politique" },
  { key: "sciences-humaines", title: "Sciences humaines" },
  { key: "litteratures", title: "Littératures" },
] as const;

export type Category = (typeof categories)[number]["key"];

export interface Book {
  slug: string;
  title: string;
  author: string;
  category?: Category; // livres lus uniquement
  date: string;
  rating: number;
  coverImage: string;
  spineColor: string;
  textColor: string;
  summary: string;
}

export const books: Book[] = [
  {
    slug: "Le Grand retour de la terre dans les patrimoines",
    title: "Le Grand retour de la terre dans les patrimoines",
    author: "Alain Trannoy - Etienne Wasmer",
    category: "economie",
    date: "July 3, 2022",
    rating: 9,
    coverImage: "https://m.media-amazon.com/images/I/61KxJ2kJp4L._SL1500_.jpg",
    spineColor: "#FFF",
    textColor: "#805B53",
    summary: ""
  },
  {
    slug: "Magellan",
    title: "Magellan",
    author: "Stefan Zweig",
    category: "litteratures",
    date: "January 1, 1938",
    rating: 10,
    coverImage: "https://m.media-amazon.com/images/I/71PFN2L54OL._SL1500_.jpg",
    spineColor: "#CB103B",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Décroissances: Regards croisés sur les urgences du temps",
    title: "Décroissances",
    author: "Quatorze penseurs",
    category: "economie",
    date: "May 16, 2024",
    rating: 8,
    coverImage: "https://m.media-amazon.com/images/I/610e61liI-L._SL1066_.jpg",
    spineColor: "#FFF",
    textColor: "#FBA859",
    summary: ""
  },
  {
    slug: "Atlas de l'anthropocène",
    title: "Atlas de l'anthropocène",
    author: "François Gemenne",
    category: "sciences-humaines",
    date: "September 02, 2021",
    rating: 8,
    coverImage: "https://m.media-amazon.com/images/I/712FqGQWe-L._SL1193_.jpg",
    spineColor: "#046CB5",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "La mer - Une infographie",
    title: "La mer - Une infographie",
    author: "Cyrille P. Coutansais",
    category: "politique",
    date: "September 02, 2021",
    rating: 8,
    coverImage: "https://m.media-amazon.com/images/I/41eCvRauIyL._SY522_.jpg",
    spineColor: "#FFF",
    textColor: "#02243C",
    summary: ""
  },
  {
    slug: "Culture écologique",
    title: "Culture écologique",
    author: "Pierre Charbonnier",
    category: "sciences-humaines",
    date: "September 02, 2021",
    rating: 8,
    coverImage: "https://m.media-amazon.com/images/I/81f6t+bfccL._SL1500_.jpg",
    spineColor: "#FEFCE6",
    textColor: "#2A7CEE",
    summary: `
      • Les cyanobactéries sont des microorganismes qui sont à l’origine de la « grande oxydation » de la Terre, il y a environ 2,5 milliards d’années, qui ont permis le développement de la vie animale et végétale.<br>
      • Échange colombien : intervention écologique aux conséquences néfastes issue de la colonisation des Amériques par l’Europe → un pont biologique et épidémiologique s’est établi entre les deux continents (blé, riz, bovins, cochons, chevaux… vs tabac, quinine, pomme de terre, tomate, maïs, cacao, dinde).<br>
      • Éco-paternalisme (Baptiste Morizot) : le monde vivant est entièrement tributaire du soin apporté par les humains, il serait immature et incomplet sans son intervention et par conséquent les humains sont investis d’une mission de supervision quasi divine à l’égard du monde.<br>
      • Les deux innovations techno-scientifiques qui ont brisé le métabolisme organique des sociétés préindustrielles ont été la machine à vapeur et le procédé Haber-Bosch.<br>
      • Hans Blumenberg (La légitimité des temps modernes, 1966) : le progrès se définit comme l’auto-justification permanente du présent par l’avenir qu’il se donne face au passé, auquel il se compare.<br>
      • Thea RioFrancos – Dans le Sud Global, la tension entre le pétro-nationalisme et le post-extractivisme est un défi constant à cause des limites écologiques et sociales de la croissance et l’impératif de développement.<br>
      • Les trois matrices de la modernité : l’encadrement scientifique de la nature, l’horizon du progrès, et le schème de la conquête.
    `
  },
  {
    slug: "Race et histoire",
    title: "Race et histoire",
    author: "Claude Lévi-Strauss",
    category: "sciences-humaines",
    date: "September 02, 2021",
    rating: 8,
    coverImage: "https://m.media-amazon.com/images/I/91DBHOzcPcL._SL1500_.jpg",
    spineColor: "#FAB56C",
    textColor: "#FFF",
    summary: `
      ◦ Nous avons suggéré que chaque société peut, de son propre point de vue, répartir les cultures en trois catégories: celles qui sont ses contemporaines, mais se trouvent situées en un autre lieu du globe; celles qui se sont manifestées approximativement dans le même espace, mais l’ont précédée dans le temps; celles, enfin, qui ont existé à la fois dans un temps antérieur au sien et dans un espace différent de celui où elle se place.<br>
      ◦ Cela si d’abord de « progrès » (si ce terme convient encore pour désigner une réalité très différente de celle à laquelle on l’avait d’abord appliqué) n’est ni nécéssaire, ni continu ; il procède pas sauts, par bonds, ou, comme diraient les biologistes , par mutations. Ces sauts et ces bonds ne consistent pas à aller toujours plus loin dans la même direction, ils s’accompagnent de changements d’orientation, un peu à la manière du cavalier des échecs qui a toujours à sa disposition plusieurs progression mais jamais dans le même sens.<br>
      ◦ Mais quelle serait notre position, en présence d’une civilisation qui se serait attachée à développer des valeurs propres, dont aucune ne serait susceptible d’intéresser la civilisation de l’observateur ? Celui-ci ne serait-il pas porté à qualifier cette civilisation de stationnaire ? En d'autres termes la distinction entre les deux formes d’histoire dépend-elle de la nature intrinsèque des cultures auxquelles on l’applique, ou ne résulte-t-elle pas de la perspective ethnocentrique dans laquelle nous nous plaçons toujours pour évaluer une culture différente ?<br>
      ◦ Nous considérerions ainsi comme cumulative toute culture qui se développerait dans un sens analogue au nôtre, c’est-à-dire dont le développement serait doté pour nous de signification. Tandis que les autres cultures nous apparaîtraient comme stationnaires, non pas nécessairement parce qu’elles le sont, mais parce que leur ligne de développement ne signifie rien pour nous, n’est pas mesurable dans les termes du système de référence que nous utilisons.
    `
  },
  {
    slug: "La démocratie aux marges",
    title: "La démocratie aux marges",
    author: "David Graeber",
    category: "sciences-humaines",
    date: "September 02, 2021",
    rating: 8,
    coverImage: "https://m.media-amazon.com/images/I/61JY0fSThwL._SL1051_.jpg",
    spineColor: "#FBCF06",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Comment les économistes réchauffent la planète",
    title: "Comment les économistes réchauffent la planète",
    author: "Antonin Pottier",
    category: "economie",
    date: "September 02, 2021",
    rating: 8,
    coverImage: "https://m.media-amazon.com/images/I/81kl+IUD5TL._SL1500_.jpg",
    spineColor: "#FFF",
    textColor: "#622577",
    summary: ""
  },
  {
    slug: "Un nouveau contrat écologique",
    title: "Un nouveau contrat écologique",
    author: "Antonin Pottier - Emmanuel Combet",
    category: "economie",
    date: "September 02, 2021",
    rating: 8,
    coverImage: "https://m.media-amazon.com/images/I/71DQAqREOeL._SL1500_.jpg",
    spineColor: "#507A48",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Concilier économie et écologie : les textes fondateurs du CIRED",
    title: "Concilier économie et écologie",
    author: "Antonin Pottier - Franck Lecocq",
    category: "economie",
    date: "September 02, 2021",
    rating: 8,
    coverImage: "https://m.media-amazon.com/images/I/81oDXjoOnZL._SL1500_.jpg",
    spineColor: "#FFF",
    textColor: "#3D656C",
    summary: ""
  },
  {
    slug: "Le Brésil, terre d'avenir",
    title: "Le Brésil, terre d'avenir",
    author: "Stefan Zweig",
    category: "litteratures",
    date: "January 1, 1941",
    rating: 8,
    coverImage: "https://m.media-amazon.com/images/I/71okS9zXyWL._SL1500_.jpg",
    spineColor: "#95C78A",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Dette : 5 000 ans d'histoire",
    title: "Dette : 5 000 ans d'histoire",
    author: "Stefan Zweig",
    category: "sciences-humaines",
    date: "July 12, 2011",
    rating: 8,
    coverImage: "https://m.media-amazon.com/images/I/41bNKPzXByL.jpg",
    spineColor: "#FAE091",
    textColor: "#D23E3A",
    summary: ""
  },
  {
    slug: "Homo Domesticus",
    title: "Homo Domesticus",
    author: "James C. Scott",
    category: "sciences-humaines",
    date: "January 1, 2017",
    rating: 10,
    coverImage: "https://m.media-amazon.com/images/I/618MClX7uLL._SL1216_.jpg",
    spineColor: "#E6D8BE",
    textColor: "#000002",
    summary: ""
  },
  {
    slug: "Le Mont Analogue",
    title: "Le Mont Analogue",
    author: "René Daumal",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61lT7jd9TEL._SL1500_.jpg",
    spineColor: "#FFF",
    textColor: "#3BA0C8",
    summary: ""
  },
  {
    slug: "Pilules roses",
    title: "Pilules roses",
    author: "Juliette Ferry-Danini",
    category: "sciences-humaines",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61TdG7nu5QL._SL1500_.jpg",
    spineColor: "#E4528A",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Gérer l'inévitable",
    title: "Gérer l'inévitable",
    author: "Clément Jeanneau - Antoine Poincaré",
    category: "politique",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/51olMa5XAoL._SL1500_.jpg",
    spineColor: "#D3E0A8",
    textColor: "#C8102E",
    summary: ""
  },
  {
    slug: "Les cent onze parfums qu'il faut sentir avant de mourir",
    title: "Les cent onze parfums qu'il faut sentir avant de mourir",
    author: "Yohan Cervi - Jeanne Doré - Anne-Sophie Toublanc",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/51dPjzN-MRL._SL1500_.jpg",
    spineColor: "#FFF",
    textColor: "#000",
    summary: ""
  },
  {
    slug: "Réformer (vraiment) les retraites",
    title: "Réformer (vraiment) les retraites",
    author: "Charles Dennery",
    category: "economie",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61lCf4CrlIL._SL1500_.jpg",
    spineColor: "#FFF",
    textColor: "#2A8FD0",
    summary: ""
  },
  {
    slug: "Les Lumières sombres",
    title: "Les Lumières sombres",
    author: "Arnaud Miranda",
    category: "politique",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/71Zo0MwmAAL._SL1500_.jpg",
    spineColor: "#FFF",
    textColor: "#111",
    summary: ""
  },
  {
    slug: "Chasseurs d'États",
    title: "Chasseurs d'États",
    author: "Benjamin Lemoine",
    category: "economie",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61dluFLr37L._SL1500_.jpg",
    spineColor: "#EAE1D1",
    textColor: "#3A2A1A",
    summary: ""
  },
  {
    slug: "Le fil invisible du capital",
    title: "Le fil invisible du capital",
    author: "Ulysse Lojkine",
    category: "economie",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/51kUPAFKb+L._SL1500_.jpg",
    spineColor: "#EAECEB",
    textColor: "#2C7DB5",
    summary: ""
  },
  {
    slug: "Bâtir la civilisation du temps libéré",
    title: "Bâtir la civilisation du temps libéré",
    author: "André Gorz",
    category: "sciences-humaines",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/41IyiBFaTxL._SL1500_.jpg",
    spineColor: "#F6F2E6",
    textColor: "#D6336C",
    summary: ""
  },
  {
    slug: "La liberté d'être libre",
    title: "La liberté d'être libre",
    author: "Hannah Arendt",
    category: "sciences-humaines",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/31q0Ei01hOL._SL1500_.jpg",
    spineColor: "#FFF",
    textColor: "#1F8A8A",
    summary: ""
  },
  {
    slug: "Il n'y a qu'un seul droit de l'homme",
    title: "Il n'y a qu'un seul droit de l'homme",
    author: "Hannah Arendt",
    category: "sciences-humaines",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61qdobQRLFL._SL1500_.jpg",
    spineColor: "#1E2160",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Sortir du travail qui ne paie plus",
    title: "Sortir du travail qui ne paie plus",
    author: "Antoine Foucher",
    category: "economie",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61EwjAQlHxL._SL1500_.jpg",
    spineColor: "#FDF5DE",
    textColor: "#E2231A",
    summary: ""
  },
  {
    slug: "Éloge de la philosophie antique",
    title: "Éloge de la philosophie antique",
    author: "Pierre Hadot",
    category: "sciences-humaines",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/51Xb0MqEvlL._SL1500_.jpg",
    spineColor: "#FFF7DF",
    textColor: "#8A6A3A",
    summary: ""
  },
  {
    slug: "Le temps des salauds",
    title: "Le temps des salauds",
    author: "Hugues Jallon",
    category: "politique",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61k9xydosXL._SL1500_.jpg",
    spineColor: "#C3DABD",
    textColor: "#1F3B57",
    summary: ""
  },
  {
    slug: "Efficiently Inefficient",
    title: "Efficiently Inefficient",
    author: "Lasse Heje Pedersen",
    category: "economie",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/0691166196.01._SCLZZZZZZZ_.jpg",
    spineColor: "#D9342B",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Investing Amid Low Expected Returns",
    title: "Investing Amid Low Expected Returns",
    author: "Antti Ilmanen",
    category: "economie",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/1119860199.01._SCLZZZZZZZ_.jpg",
    spineColor: "#1F3B73",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Les Globalistes",
    title: "Les Globalistes",
    author: "Quinn Slobodian",
    category: "economie",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2021457923.01._SCLZZZZZZZ_.jpg",
    spineColor: "#F4F0EC",
    textColor: "#E0552C",
    summary: ""
  },
  {
    slug: "L'illusion de la finance verte",
    title: "L'illusion de la finance verte",
    author: "Alain Grandjean - Julien Lefournier",
    category: "economie",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2708253735.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#2E7D32",
    summary: ""
  },
  {
    slug: "Pourquoi sommes-nous capitalistes (malgré nous) ?",
    title: "Pourquoi sommes-nous capitalistes (malgré nous) ?",
    author: "Denis Colombi",
    category: "sciences-humaines",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2228929719.01._SCLZZZZZZZ_.jpg",
    spineColor: "#B9BABA",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Où va l'argent des pauvres",
    title: "Où va l'argent des pauvres",
    author: "Denis Colombi",
    category: "sciences-humaines",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2228925411.01._SCLZZZZZZZ_.jpg",
    spineColor: "#BDA86E",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Que fait la police ?",
    title: "Que fait la police ?",
    author: "Mathieu Zagrodzki",
    category: "sciences-humaines",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2815902621.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#C8102E",
    summary: ""
  },
  {
    slug: "L'étrange défaite",
    title: "L'étrange défaite",
    author: "Marc Bloch",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2070325695.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#1F4E9A",
    summary: ""
  },
  {
    slug: "Le Hussard bleu",
    title: "Le Hussard bleu",
    author: "Roger Nimier",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2070247317.01._SCLZZZZZZZ_.jpg",
    spineColor: "#F5EDDB",
    textColor: "#C8102E",
    summary: ""
  },
  {
    slug: "Croire aux fauves",
    title: "Croire aux fauves",
    author: "Nastassja Martin",
    category: "sciences-humaines",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2072849780.01._SCLZZZZZZZ_.jpg",
    spineColor: "#A89B85",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Manières d'être vivant",
    title: "Manières d'être vivant",
    author: "Baptiste Morizot",
    category: "sciences-humaines",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2330129734.01._SCLZZZZZZZ_.jpg",
    spineColor: "#2E5C86",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Technocratisme",
    title: "Technocratisme",
    author: "Alexandre Moatti",
    category: "politique",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2354802730.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#1F3B73",
    summary: ""
  },
  {
    slug: "La bataille de la Sécu",
    title: "La bataille de la Sécu",
    author: "Nicolas Da Silva",
    category: "politique",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2358722413.01._SCLZZZZZZZ_.jpg",
    spineColor: "#C7A868",
    textColor: "#1F2F6B",
    summary: ""
  },
  {
    slug: "L'extrême centre ou le poison français",
    title: "L'extrême centre ou le poison français",
    author: "Pierre Serna",
    category: "politique",
    date: "",
    rating: 0,
    coverImage: "https://covers.openlibrary.org/b/isbn/9791026706755-L.jpg",
    spineColor: "#1E7A8A",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Dans la machine de l'État",
    title: "Dans la machine de l'État",
    author: "Emmanuel Constantin",
    category: "politique",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2073028454.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#2E9E3E",
    summary: ""
  },
  {
    slug: "La poudre aux yeux",
    title: "La poudre aux yeux",
    author: "Justine Reix",
    category: "politique",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2709669293.01._SCLZZZZZZZ_.jpg",
    spineColor: "#1F9AA3",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Le Comte de Monte-Cristo",
    title: "Le Comte de Monte-Cristo",
    author: "Alexandre Dumas",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2070109798.01._SCLZZZZZZZ_.jpg",
    spineColor: "#F4F1EA",
    textColor: "#B22222",
    summary: ""
  },
  {
    slug: "Le Rouge et le Noir",
    title: "Le Rouge et le Noir",
    author: "Stendhal",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2070412393.01._SCLZZZZZZZ_.jpg",
    spineColor: "#C8102E",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Bel-Ami",
    title: "Bel-Ami",
    author: "Guy de Maupassant",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2070410099.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#1A1A1A",
    summary: ""
  },
  {
    slug: "La Parure",
    title: "La Parure",
    author: "Guy de Maupassant",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2253136565.01._SCLZZZZZZZ_.jpg",
    spineColor: "#E8742A",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Les Carnets du sous-sol",
    title: "Les Carnets du sous-sol",
    author: "Fiodor Dostoïevski",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2330212496.01._SCLZZZZZZZ_.jpg",
    spineColor: "#F0E6D6",
    textColor: "#1F3B73",
    summary: ""
  },
  {
    slug: "Le Joueur",
    title: "Le Joueur",
    author: "Fiodor Dostoïevski",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2070368939.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#4A7A3A",
    summary: ""
  },
  {
    slug: "Les Démons",
    title: "Les Démons",
    author: "Fiodor Dostoïevski",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2070394166.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#B22222",
    summary: ""
  },
  {
    slug: "Monsieur Prokhartchine",
    title: "Monsieur Prokhartchine",
    author: "Fiodor Dostoïevski",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2742702172.01._SCLZZZZZZZ_.jpg",
    spineColor: "#3F6B5A",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Les Nuits blanches",
    title: "Les Nuits blanches",
    author: "Fiodor Dostoïevski",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2070373525.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#E0605A",
    summary: ""
  },
  {
    slug: "Le Rêve d'un homme ridicule",
    title: "Le Rêve d'un homme ridicule",
    author: "Fiodor Dostoïevski",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2253098337.01._SCLZZZZZZZ_.jpg",
    spineColor: "#E9E5DC",
    textColor: "#1A1A1A",
    summary: ""
  },
  {
    slug: "Le Joueur d'échecs",
    title: "Le Joueur d'échecs",
    author: "Stefan Zweig",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2253174076.01._SCLZZZZZZZ_.jpg",
    spineColor: "#1E5E62",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "L'Étranger",
    title: "L'Étranger",
    author: "Albert Camus",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2070360024.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#B22222",
    summary: ""
  },
  {
    slug: "Le Petit Prince",
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2070541932.01._SCLZZZZZZZ_.jpg",
    spineColor: "#DCE8F2",
    textColor: "#1F3B73",
    summary: ""
  },
  {
    slug: "Nouvelles histoires extraordinaires",
    title: "Nouvelles histoires extraordinaires",
    author: "Edgar Allan Poe",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2070338975.01._SCLZZZZZZZ_.jpg",
    spineColor: "#C8102E",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "À l'Ouest, rien de nouveau",
    title: "À l'Ouest, rien de nouveau",
    author: "Erich Maria Remarque",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/225300670X.01._SCLZZZZZZZ_.jpg",
    spineColor: "#3C5A6B",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Si c'est un homme",
    title: "Si c'est un homme",
    author: "Primo Levi",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2266022504.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#2E4E7A",
    summary: ""
  },
  {
    slug: "Le Tour du monde en quatre-vingts jours",
    title: "Le Tour du monde en quatre-vingts jours",
    author: "Jules Verne",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/207058299X.01._SCLZZZZZZZ_.jpg",
    spineColor: "#7A2E1F",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "L'Iliade",
    title: "L'Iliade",
    author: "Homère",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/208070060X.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#E07B1F",
    summary: ""
  },
  {
    slug: "L'Odyssée",
    title: "L'Odyssée",
    author: "Homère",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2080700642.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#E07B1F",
    summary: ""
  },
  {
    slug: "La Métamorphose",
    title: "La Métamorphose",
    author: "Franz Kafka",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2290335339.01._SCLZZZZZZZ_.jpg",
    spineColor: "#2F4A4A",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Des souris et des hommes",
    title: "Des souris et des hommes",
    author: "John Steinbeck",
    category: "litteratures",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/2070260674.01._SCLZZZZZZZ_.jpg",
    spineColor: "#FFF",
    textColor: "#B22222",
    summary: ""
  },
  {
    slug: "Attachements",
    title: "Attachements",
    author: "Charles Stépanoff",
    category: "sciences-humaines",
    date: "",
    rating: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/P/234808113X.01._SCLZZZZZZZ_.jpg",
    spineColor: "#F3F1EC",
    textColor: "#8B1E2D",
    summary: ""
  },
];

// Étagère du haut : « Pile à lire »
export const toReadBooks: Book[] = [
  {
    slug: "Mécomptes publics",
    title: "Mécomptes publics",
    author: "François Ecalle",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61zZgmd2uxL._SL1500_.jpg",
    spineColor: "#FFF",
    textColor: "#B5232E",
    summary: ""
  },
  {
    slug: "Abondance et liberté",
    title: "Abondance et liberté",
    author: "Pierre Charbonnier",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61soUlu9tKL._SL1500_.jpg",
    spineColor: "#C9C5BE",
    textColor: "#1F7A4D",
    summary: ""
  },
  {
    slug: "Vers l'écologie de guerre",
    title: "Vers l'écologie de guerre",
    author: "Pierre Charbonnier",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61WfOSkkONL._SL1500_.jpg",
    spineColor: "#A69B8E",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Un empire bon marché",
    title: "Un empire bon marché",
    author: "Denis Cogneau",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/51l1jC1+rML._SL1500_.jpg",
    spineColor: "#F2EEE3",
    textColor: "#1E3A5F",
    summary: ""
  },
  {
    slug: "L'implacable ascension de l'East India Company",
    title: "L'implacable ascension de l'East India Company",
    author: "William Dalrymple",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/81WwaHtSP6L._SL1500_.jpg",
    spineColor: "#F3E9D8",
    textColor: "#B0232A",
    summary: ""
  },
  {
    slug: "Comment saboter un pipeline",
    title: "Comment saboter un pipeline",
    author: "Andreas Malm",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/513Kp6CXCmL._SL1500_.jpg",
    spineColor: "#908A96",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Co-Intelligence",
    title: "Co-Intelligence",
    author: "Ethan Mollick",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/91j2Ga+7Q+L._SL1500_.jpg",
    spineColor: "#222",
    textColor: "#F3E9C6",
    summary: ""
  },
  {
    slug: "Où atterrir ?",
    title: "Où atterrir ?",
    author: "Bruno Latour",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/51EIF0o+cvL._SL1500_.jpg",
    spineColor: "#FFFADD",
    textColor: "#2C7DB5",
    summary: ""
  },
  {
    slug: "Apocalypse Nerds",
    title: "Apocalypse Nerds",
    author: "Nastasia Hadjadji - Olivier Tesquet",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/81gSlH2j7PL._SL1500_.jpg",
    spineColor: "#ECEF00",
    textColor: "#000",
    summary: ""
  },
  {
    slug: "La science de la post-croissance",
    title: "La science de la post-croissance",
    author: "Timothée Parrique",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61RhgnF4t-L._SL1500_.jpg",
    spineColor: "#F9BED7",
    textColor: "#D6246E",
    summary: ""
  },
  {
    slug: "Théorie de l'art moderne",
    title: "Théorie de l'art moderne",
    author: "Paul Klee",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/91pMGrMS-SL._SL1500_.jpg",
    spineColor: "#FFF",
    textColor: "#C8102E",
    summary: ""
  },
  {
    slug: "La crise du monde moderne",
    title: "La crise du monde moderne",
    author: "René Guénon",
    date: "",
    rating: 0,
    coverImage: "https://editions-allia.com/files/book_937_image_cover.jpg",
    spineColor: "#FFF",
    textColor: "#C8102E",
    summary: ""
  },
  {
    slug: "La France contre les robots",
    title: "La France contre les robots",
    author: "Georges Bernanos",
    date: "",
    rating: 0,
    coverImage: "https://www.editions-allia.com/files/book_1099_image_cover.jpg",
    spineColor: "#FFF",
    textColor: "#1C7DC4",
    summary: ""
  },
  {
    slug: "Éloge de Socrate",
    title: "Éloge de Socrate",
    author: "Pierre Hadot",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/71Je9mRTreL._SL1500_.jpg",
    spineColor: "#9C6A63",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "De la droite manière de vivre",
    title: "De la droite manière de vivre",
    author: "Spinoza",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61IRDwkxY5L._SL1500_.jpg",
    spineColor: "#C75950",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Méditation sur la technique",
    title: "Méditation sur la technique",
    author: "José Ortega y Gasset",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/61nAiw9MI2L._SL1500_.jpg",
    spineColor: "#000F1C",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Anthropologie",
    title: "Anthropologie",
    author: "Eric Chauvier",
    date: "",
    rating: 0,
    coverImage: "https://www.editions-allia.com/files/book_398_image_cover.jpg",
    spineColor: "#A48661",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Pour une critique de la violence",
    title: "Pour une critique de la violence",
    author: "Walter Benjamin",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/81WyjXHUqlL._SL1500_.jpg",
    spineColor: "#565143",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "A Fabulous Debt",
    title: "A Fabulous Debt",
    author: "Robin Wigglesworth",
    date: "",
    rating: 0,
    coverImage: "https://m.media-amazon.com/images/I/81RlrxuzcrL._SL1500_.jpg",
    spineColor: "#F5F3EE",
    textColor: "#111",
    summary: ""
  },
];

export function getToReadBooks(): Book[] {
  return toReadBooks;
}

export function getAllBooks(): Book[] {
  return books;
}

// Livres lus regroupés par catégorie, dans l'ordre de `categories`
export function getBooksByCategory(): { key: Category; title: string; books: Book[] }[] {
  return categories.map((c) => ({ key: c.key, title: c.title, books: books.filter((b) => b.category === c.key) }));
}

export function getBook(slug: string): Book | undefined {
  return books.find(book => book.slug === slug);
}
