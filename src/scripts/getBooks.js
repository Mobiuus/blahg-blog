import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

async function getBooks() {
  const files = fs.readdirSync(path.join('src', 'components', 'content'));

  const books = files.map(filename => {
    const slug = filename.replace('.mdx', '');
    const markdownWithMeta = fs.readFileSync(path.join('src', 'components', 'content', filename), 'utf-8');
    const { data: frontmatter } = matter(markdownWithMeta);

    return {
      slug,
      title: frontmatter.title,
      spineColor: frontmatter.spineColor,
      textColor: frontmatter.textColor,
      coverImage: frontmatter.coverImage,
      author: frontmatter.author,
      date: frontmatter.date,
      rating: frontmatter.rating,
      summary: frontmatter.summary,
    };
  });

  return books;
}

export default getBooks;
