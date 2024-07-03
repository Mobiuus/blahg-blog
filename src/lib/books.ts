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
    summary: ""
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
    summary: ""
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
];

export function getAllBooks(): Book[] {
  return books;
}

export function getBook(slug: string): Book | undefined {
  return books.find(book => book.slug === slug);
}