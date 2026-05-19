import type { Metadata } from 'next';
import { createOgImage } from '@/lib/og';

export function createBlogIndexMetadata(): Metadata {
  return {
    title: 'Blog — Kiến thức tài chính cá nhân | OpenWallet',
    description: 'Hướng dẫn quản lý thẻ ngân hàng, tối ưu điểm thưởng và kiến thức tài chính cá nhân dành cho người Việt.',
    openGraph: { title: 'Tin tức', description: 'Hướng dẫn quản lý thẻ ngân hàng, tối ưu điểm thưởng và kiến thức tài chính cá nhân dành cho người Việt.' },
    twitter: { title: 'Tin tức', description: 'Hướng dẫn quản lý thẻ ngân hàng, tối ưu điểm thưởng và kiến thức tài chính cá nhân dành cho người Việt.' },
  };
}

export function createBlogCategoryMetadata(name: string): Metadata {
  const title = `${name} — Blog | OpenWallet`;
  const description = `Bài viết về chủ đề "${name}" trên OpenWallet Blog.`;
  return {
    title,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export function createBlogTagMetadata(name: string): Metadata {
  const title = `#${name} — Blog | OpenWallet`;
  const description = `Bài viết được gắn thẻ "${name}" trên OpenWallet Blog.`;
  return {
    title,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export async function createBlogIndexOgImage() {
  return createOgImage({ title: 'Tin tức', description: 'Hướng dẫn quản lý thẻ ngân hàng, tối ưu điểm thưởng và kiến thức tài chính cá nhân dành cho người Việt.' });
}

export async function createBlogCategoryOgImage(name: string) {
  return createOgImage({
    title: name,
    description: `Bài viết về chủ đề "${name}" trên OpenWallet Blog.`,
  });
}

export async function createBlogTagOgImage(name: string) {
  return createOgImage({
    title: `#${name}`,
    description: `Bài viết được gắn thẻ "${name}" trên OpenWallet Blog.`,
  });
}
