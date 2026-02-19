import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createOgImage } from '@/lib/og';

export async function createBlogIndexMetadata(): Promise<Metadata> {
  const t = await getTranslations('BlogPage');
  return {
    title: t('meta_title'),
    description: t('meta_description'),
    openGraph: { title: t('title'), description: t('meta_description') },
    twitter: { title: t('title'), description: t('meta_description') },
  };
}

export async function createBlogCategoryMetadata(name: string): Promise<Metadata> {
  const t = await getTranslations('BlogPage');
  const title = t('category_meta_title', { name });
  const description = t('category_meta_description', { name });
  return {
    title,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export async function createBlogTagMetadata(name: string): Promise<Metadata> {
  const t = await getTranslations('BlogPage');
  const title = t('tag_meta_title', { name });
  const description = t('tag_meta_description', { name });
  return {
    title,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export async function createBlogIndexOgImage() {
  const t = await getTranslations('BlogPage');
  return createOgImage({ title: t('title'), description: t('meta_description') });
}

export async function createBlogCategoryOgImage(name: string) {
  const t = await getTranslations('BlogPage');
  return createOgImage({
    title: name,
    description: t('category_meta_description', { name }),
  });
}

export async function createBlogTagOgImage(name: string) {
  const t = await getTranslations('BlogPage');
  return createOgImage({
    title: `#${name}`,
    description: t('tag_meta_description', { name }),
  });
}
