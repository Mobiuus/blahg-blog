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
    slug: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel",
    date: "July 3, 2022",
    rating: 9,
    coverImage: "https://img.wook.pt/images/zero-to-one-blake-masters/MXwyMjE1NzUyM3wxODAzNjM1OXwxNTcxMDIyMTAyMDAw/500x",
    spineColor: "#5e7fa6",
    textColor: "#fff",
    summary: "The bible of starting a massive technology company. Anyone interested in startups needs to read this. The first principles on (1) what to work on (2) how to work on it to create massive value and (3) how to capture part of the value to build a valuable company."
  },
  {
    slug: "antifragile",
    title: "Antifragile",
    author: "Nassim Taleb",
    date: "May 16, 2024",
    rating: 8,
    coverImage: "https://m.media-amazon.com/images/I/61cmwTmON3L._AC_UF1000,1000_QL80_.jpg",
    spineColor: "#D35D2D",
    textColor: "#FFF",
    summary: "In a world full of randomness and disorder, building things that benefit from volatility is the only way to ensure robustness. Taleb calls these things that gain from disorder antifragile."
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
    summary: "In a world full of randomness and disorder, building things that benefit from volatility is the only way to ensure robustness. Taleb calls these things that gain from disorder antifragile."
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
    summary: "In a world full of randomness and disorder, building things that benefit from volatility is the only way to ensure robustness. Taleb calls these things that gain from disorder antifragile."
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
    summary: "In a world full of randomness and disorder, building things that benefit from volatility is the only way to ensure robustness. Taleb calls these things that gain from disorder antifragile."
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
    summary: "In a world full of randomness and disorder, building things that benefit from volatility is the only way to ensure robustness. Taleb calls these things that gain from disorder antifragile."
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
    summary: "In a world full of randomness and disorder, building things that benefit from volatility is the only way to ensure robustness. Taleb calls these things that gain from disorder antifragile."
  }
];

export function getAllBooks(): Book[] {
  return books;
}

export function getBook(slug: string): Book | undefined {
  return books.find(book => book.slug === slug);
}