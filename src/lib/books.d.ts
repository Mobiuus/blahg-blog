// src/lib/books.d.ts
declare module 'books' {
    export interface Book {
      slug: string;
      title: string;
      spineColor: string;
      textColor: string;
      coverImage: string;
    }
  
    export const books: Book[];
  }
  