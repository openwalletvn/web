import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export interface TocHeading {
  level: number; // 2 | 3 | 4
  text: string;
  id: string;
}

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  author?: string;
  category: string;
  tags: string[];
  card_slugs?: string[];
  cover_image?: string;
  ai_generated?: boolean;
  status: 'published' | 'draft';
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
  excerpt: string;
  categorySlug: string;
  tagSlugs: string[];
}

// ─── Vietnamese slugifier ───────────────────────────────────────────────────

const VN_MAP: [RegExp, string][] = [
  [/[àáảãạăắặằẵẳâấầẩẫậ]/g, 'a'],
  [/[èéẻẽẹêếềểễệ]/g, 'e'],
  [/[ìíỉĩị]/g, 'i'],
  [/[òóỏõọôốồổỗộơớờởỡợ]/g, 'o'],
  [/[ùúủũụưứừửữự]/g, 'u'],
  [/[ỳýỷỹỵ]/g, 'y'],
  [/đ/g, 'd'],
];

export function slugify(text: string): string {
  let s = text.toLowerCase();
  for (const [re, repl] of VN_MAP) s = s.replace(re, repl);
  return s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ─── TOC extraction ──────────────────────────────────────────────────────────

export function extractHeadings(content: string): TocHeading[] {
  return content
    .split('\n')
    .filter((line) => /^#{2,4}\s/.test(line))
    .map((line) => {
      const match = line.match(/^(#{2,4})\s+(.+)$/);
      if (!match) return null;
      const level = match[1].length;
      const text = match[2]
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .trim();
      return { level, text, id: slugify(text) };
    })
    .filter((h): h is TocHeading => h !== null);
}

// ─── File helpers ────────────────────────────────────────────────────────────

function getExcerpt(content: string, maxLength = 160): string {
  const plain = content
    .replace(/^#+\s.+$/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  return plain.length > maxLength ? plain.slice(0, maxLength).trimEnd() + '…' : plain;
}

function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
}

function parsePost(filename: string): Post {
  const slug = filename.replace(/\.(mdx|md)$/, '');
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  const frontmatter = data as PostFrontmatter;

  return {
    slug,
    frontmatter,
    content,
    readingTime: `${Math.ceil(stats.minutes)} phút đọc`,
    excerpt: frontmatter.description || getExcerpt(content),
    categorySlug: slugify(frontmatter.category),
    tagSlugs: frontmatter.tags.map(slugify),
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function getAllPosts(): Post[] {
  return getPostFiles()
    .map(parsePost)
    .filter((p) => p.frontmatter.status === 'published')
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const files = getPostFiles();
  const filename = files.find((f) => f.replace(/\.(mdx|md)$/, '') === slug);
  if (!filename) return null;
  return parsePost(filename);
}

/** Match by slugified category */
export function getPostsByCategory(categorySlug: string): Post[] {
  return getAllPosts().filter((p) => p.categorySlug === categorySlug);
}

/** Match by slugified tag */
export function getPostsByTag(tagSlug: string): Post[] {
  return getAllPosts().filter((p) => p.tagSlugs.includes(tagSlug));
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      if (p.categorySlug === post.categorySlug) score += 2;
      const sharedTags = p.tagSlugs.filter((t) => post.tagSlugs.includes(t));
      score += sharedTags.length;
      return { post: p, score };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((p) => p.post);
}

export function getPostsByCardSlug(cardSlug: string): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.card_slugs?.includes(cardSlug));
}

export function getAllCategories(): Array<{ name: string; slug: string; count: number }> {
  const posts = getAllPosts();
  const map = new Map<string, { name: string; count: number }>();
  posts.forEach((p) => {
    const existing = map.get(p.categorySlug);
    map.set(p.categorySlug, {
      name: p.frontmatter.category,
      count: (existing?.count ?? 0) + 1,
    });
  });
  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ name, slug, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(): Array<{ name: string; slug: string; count: number }> {
  const posts = getAllPosts();
  // Maintain slug → display-name mapping
  const nameMap = new Map<string, string>();
  const countMap = new Map<string, number>();
  posts.forEach((p) => {
    p.frontmatter.tags.forEach((tag, i) => {
      const slug = p.tagSlugs[i];
      if (!nameMap.has(slug)) nameMap.set(slug, tag);
      countMap.set(slug, (countMap.get(slug) ?? 0) + 1);
    });
  });
  return Array.from(countMap.entries())
    .map(([slug, count]) => ({ name: nameMap.get(slug)!, slug, count }))
    .sort((a, b) => b.count - a.count);
}
