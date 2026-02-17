import type { MetadataRoute } from 'next';
import { getBanks, getCards } from '@/lib/api';

export const runtime = 'edge';

const BASE_URL = 'https://openwallet.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [banks, cards] = await Promise.all([getBanks(), getCards()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/banks`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/cards`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/docs`, changeFrequency: 'monthly', priority: 0.5 },
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

  return [...staticRoutes, ...bankRoutes, ...cardRoutes];
}
