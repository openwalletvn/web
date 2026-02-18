import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import { createOgImage, OG_SIZE } from '@/lib/og';

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
    return createOgImage({ title: 'Blog', description: 'Open Wallet' });
  }

  return createOgImage({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  });
}
