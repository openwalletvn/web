import type { MetadataRoute } from 'next';
import { getBanks, getCards } from '@/lib/api';

export const runtime = 'edge';

const BASE_URL = 'https://openwallet.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [banks, cards] = await Promise.all([getBanks(), getCards()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                              changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/banks`,                   changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/cards`,                   changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/cards/credit`,            changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/debit`,             changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/2in1`,              changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/co-branded`,        changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/visa`,              changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/mastercard`,        changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/jcb`,               changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/napas`,             changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/amex`,              changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/cards/unionpay`,          changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/docs`,                    changeFrequency: 'monthly', priority: 0.5 },
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
