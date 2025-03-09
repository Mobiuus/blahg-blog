// src/lib/books.ts

export interface Book {
  slug: string;
  title: string;
  author: string;
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
    author: "Stefan Sweig",
    date: "January 1, 1938",
    rating: 10,
    coverImage: "https://m.media-amazon.com/images/I/71PFN2L54OL._SL1500_.jpg",
    spineColor: "CB103B",
    textColor: "#FFF",
    summary: ""
  },
  {
    slug: "Décroissances: Regards croisés sur les urgences du temps",
    title: "Décroissances",
    author: "Quatorze penseurs",
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
    author: "Stefan Sweig",
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
    author: "Stefan Sweig",
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
    date: "January 1, 2017",
    rating: 10,
    coverImage: "https://m.media-amazon.com/images/I/618MClX7uLL._SL1216_.jpg",
    spineColor: "#E6D8BE",
    textColor: "#000002",
    summary: ""
  }, 
  {
    slug: "Less is More",
    title: "Less is More",
    author: "Jason Hickel",
    date: "August 13, 2020",
    rating: 5,
    coverImage: "https://m.media-amazon.com/images/I/71j0zYJm3cL._SL1500_.jpg",
    spineColor: "#5FB133",
    textColor: "#000002",
    summary: ""
  },    
];

export function getAllBooks(): Book[] {
  return books;
}

export function getBook(slug: string): Book | undefined {
  return books.find(book => book.slug === slug);
}
