import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import sharp from 'sharp';

const app = express();
const PORT = 3004;
const CWD = process.cwd();
const POSTS_DIR = path.join(CWD, 'content/posts');
const IMAGES_DIR = path.join(CWD, 'public/images/posts');
const ADMIN_DIR = path.join(CWD, 'admin');
const PUBLIC_DIR = path.join(CWD, 'public');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
}

function readPost(slug: string) {
  const files = getPostFiles();
  const filename = files.find((f) => f.replace(/\.(mdx|md)$/, '') === slug);
  if (!filename) return null;
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
  const { data, content } = matter(raw);
  return { frontmatter: data, content };
}

function getExistingImages(slug: string): string[] {
  const dir = path.join(IMAGES_DIR, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|gif|svg)$/i.test(f));
}

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#{1,6}\s+.+$/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/^\|.+$/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>.*$/gm, '')
    .replace(/^-{3,}$/gm, '')
    .replace(/\n+/g, ' ')
    .trim();
}

interface Block {
  type: 'text' | 'image';
  text?: string;
  key?: string;
  prompt?: string | null;
  exists?: boolean;
  filename?: string | null;
}

function parseBlocks(
  content: string,
  imagePrompts: Record<string, string>,
  existingImages: string[],
): Block[] {
  const blocks: Block[] = [];
  const imageRe = /!\[[^\]]*\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = imageRe.exec(content)) !== null) {
    const before = content.slice(last, m.index).trim();
    if (before) {
      const text = stripMarkdown(before);
      if (text.length > 5) blocks.push({ type: 'text', text: text.slice(0, 160) });
    }
    const key = (m[1].split('/').pop() ?? '').replace(/\.[^.]+$/, '');
    const filename = existingImages.find((f) => f.replace(/\.[^.]+$/, '') === key) ?? null;
    blocks.push({ type: 'image', key, prompt: imagePrompts[key] ?? null, exists: !!filename, filename });
    last = m.index + m[0].length;
  }

  const tail = content.slice(last).trim();
  if (tail) {
    const text = stripMarkdown(tail);
    if (text.length > 5) blocks.push({ type: 'text', text: text.slice(0, 160) });
  }

  // Prepend cover if declared in image_prompts but not referenced in content
  const hasCoverInContent = blocks.some((b) => b.type === 'image' && b.key === 'cover');
  if (imagePrompts['cover'] && !hasCoverInContent) {
    const filename = existingImages.find((f) => f.replace(/\.[^.]+$/, '') === 'cover') ?? null;
    blocks.unshift({ type: 'image', key: 'cover', prompt: imagePrompts['cover'], exists: !!filename, filename });
  }

  return blocks;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use((_req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); next(); });
app.use('/images', express.static(path.join(PUBLIC_DIR, 'images')));
app.use('/static', express.static(ADMIN_DIR));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/blog', (_req, res) => {
  const posts = getPostFiles().map((filename) => {
    const slug = filename.replace(/\.(mdx|md)$/, '');
    const { data } = matter(fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8'));
    return { slug, title: data.title ?? slug };
  });
  res.json(posts);
});

app.get('/api/blog/:slug', (req, res) => {
  const { slug } = req.params;
  const post = readPost(slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const images = getExistingImages(slug);
  const imagePrompts = (post.frontmatter.image_prompts ?? {}) as Record<string, string>;
  res.json({ slug, frontmatter: post.frontmatter, blocks: parseBlocks(post.content, imagePrompts, images) });
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/blog/:slug/upload', upload.single('file'), async (req, res) => {
  const { slug } = req.params;
  const { filename } = req.body as { filename?: string };
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  if (!filename) return res.status(400).json({ error: 'Missing filename' });

  const stem = path.basename(filename).replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
  const outFilename = `${stem}.webp`;

  try {
    // Step 1: resize + convert to webp
    const { data: webpBuffer, info } = await sharp(req.file.buffer)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer({ resolveWithObject: true });

    const { width, height } = info;

    // Step 2: load watermark SVG and pick a random corner
    const wmSvg = fs.readFileSync(path.join(PUBLIC_DIR, 'images/watermark.svg'));
    const wmStr = wmSvg.toString();
    const wmWidth  = parseInt(wmStr.match(/width="(\d+)"/)?.[1]  ?? '120');
    const wmHeight = parseInt(wmStr.match(/height="(\d+)"/)?.[1] ?? '24');
    const margin = 12;
    const corners = [
      { top: margin,                    left: margin },
      { top: margin,                    left: width - wmWidth - margin },
      { top: height - wmHeight - margin, left: margin },
      { top: height - wmHeight - margin, left: width - wmWidth - margin },
    ];
    const corner = corners[Math.floor(Math.random() * corners.length)];

    // Step 3: composite watermark onto webp buffer
    const finalBuffer = await sharp(webpBuffer)
      .composite([{ input: wmSvg, ...corner }])
      .toBuffer();

    // Step 4: save
    const dir = path.join(IMAGES_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, outFilename), finalBuffer);

    res.json({ ok: true, filename: outFilename });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: `sharp failed: ${message}` });
  }
});

app.get('/blog/:slug', (_req, res) => {
  res.sendFile(path.join(ADMIN_DIR, 'blog-post.html'));
});

app.listen(PORT, () => console.log(`Admin server → http://localhost:${PORT}`));
