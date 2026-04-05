import type { MarkdownInstance } from "astro";

export const NOTE_SORT_VALUES = [
  "newest",
  "last-edited",
  "alphabetical",
] as const;

export type NoteSort = (typeof NOTE_SORT_VALUES)[number];

export interface NoteFrontmatter {
  slug?: string;
  title?: string;
  description?: string;
  thema?: string;
  created?: string;
  edited?: string;
  added?: string;
  updated?: string;
  tags?: string[];
}

export interface Note {
  slug: string;
  title: string;
  description?: string;
  thema: string;
  created: string;
  edited?: string;
  tags: string[];
}

export interface CategoryInfo {
  name: string;
  slug: string;
  count: number;
}

export type NoteMarkdown = MarkdownInstance<NoteFrontmatter>;

const parseTime = (value?: string) => {
  if (!value) return Number.NEGATIVE_INFINITY;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
};

const fallbackSlugFromFile = (filePath?: string) => {
  if (!filePath) return "untitled-note";
  const fileName = filePath.split(/[\\/]/).pop() || "untitled-note";
  return fileName.replace(/\.[^.]+$/, "");
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const normalizeNote = (note: NoteMarkdown): Note => {
  const fm = note.frontmatter || {};
  const fallbackSlug = fallbackSlugFromFile(note.file);
  const slug = fm.slug?.trim() || fallbackSlug;
  const title = fm.title?.trim() || slug;
  const thema = fm.thema?.trim() || "General";
  const created = fm.created || fm.added || "1970-01-01";
  const edited = fm.edited || fm.updated;
  const tags = Array.isArray(fm.tags) ? fm.tags : [];

  return {
    slug,
    title,
    description: fm.description,
    thema,
    created,
    edited,
    tags,
  };
};

export const sortNotes = (notes: Note[], sort: NoteSort) => {
  const cloned = [...notes];
  if (sort === "alphabetical") {
    return cloned.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sort === "last-edited") {
    return cloned.sort(
      (a, b) =>
        parseTime(b.edited || b.created) - parseTime(a.edited || a.created),
    );
  }
  return cloned.sort((a, b) => parseTime(b.created) - parseTime(a.created));
};

export const getCategories = (notes: Note[]): CategoryInfo[] => {
  const counts = new Map<string, number>();
  for (const note of notes) {
    counts.set(note.thema, (counts.get(note.thema) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count, slug: slugify(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export const findCategoryNameBySlug = (
  categories: CategoryInfo[],
  categorySlug: string,
) => categories.find((category) => category.slug === categorySlug)?.name;

export const formatDisplayDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();
  return `${day}/${month}/${year}`;
};
