import type { MetadataRoute } from 'next';
import { getBanks, getCards, getBrands, getNetworks } from '@/lib/api';
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/mdx';

export const dynamic = 'force-static';

const BASE_URL = 'https://openwallet.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [banks, cards, brands, networks] = await Promise.all([getBanks(), getCards(), getBrands().catch(() => []), getNetworks().catch(() => [])]);

  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                              changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/banks`,                   changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/cards`,                   changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/cards/credit`,            changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/debit`,             changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/2in1`,              changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/co-branded`,        changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/networks`,          changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/docs`,                    changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/blog`,                    changeFrequency: 'weekly',  priority: 0.8 },
  ];

  const bankRoutes: MetadataRoute.Sitemap = banks.map((bank) => ({
    url: `${BASE_URL}/banks/${bank.id}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const cardRoutes: MetadataRoute.Sitemap = cards.map((card) => ({
    url: `${BASE_URL}/cards/${card.id}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${BASE_URL}/cards/co-branded/${brand.id}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const networkRoutes: MetadataRoute.Sitemap = networks.map((network) => ({
    url: `${BASE_URL}/cards/networks/${network.id}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map(({ slug }) => ({
    url: `${BASE_URL}/blog/category/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map(({ slug }) => ({
    url: `${BASE_URL}/blog/tag/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...bankRoutes, ...cardRoutes, ...brandRoutes, ...networkRoutes, ...postRoutes, ...categoryRoutes, ...tagRoutes];
}
