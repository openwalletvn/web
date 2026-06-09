import fs from 'fs';
import path from 'path';
import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import { createOgImage, OG_SIZE } from '@/lib/og';
import { SITE_NAME } from '@/lib/page-meta/title';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return createOgImage({ title: 'Blog', description: SITE_NAME });
  }

  if (post.frontmatter.cover_image) {
    const filePath = path.join(process.cwd(), 'public', post.frontmatter.cover_image);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
      return new Response(fs.readFileSync(filePath), {
        headers: { 'Content-Type': mime },
      });
    }
  }

  return createOgImage({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  });
}
