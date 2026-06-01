export const dynamic = 'force-static';

import { NextResponse } from 'next/server';
import { getCards, getBanks, getCardImageUrl, getBankImageUrl } from '@/lib/api';
import { getAllPosts } from '@/lib/mdx';
import type { SearchCard, SearchBank, SearchPost, SearchIndex } from '@/lib/search-types';

export async function GET(): Promise<NextResponse<SearchIndex>> {
  const [cards, banks] = await Promise.all([getCards(), getBanks()]);

  const bankNameMap = new Map<string, string>(banks.map((b) => [b.id, b.name]));

  const searchCards: SearchCard[] = cards.map((card) => ({
    id: card.id,
    name: card.name,
    bank_id: card.bank_id,
    bank_name: bankNameMap.get(card.bank_id) ?? '',
    card_type: card.card_type,
    card_network: card.card_network,
    image_url: getCardImageUrl(card),
    is_vertical: card.image?.orientation === 'vertical',
    url: `/the/${card.id}`,
  }));

  const searchBanks: SearchBank[] = banks.map((bank) => ({
    id: bank.id,
    name: bank.name,
    full_name: bank.full_name,
    logo_url: getBankImageUrl(bank.logo_url),
    url: `/ngan-hang/${bank.id}`,
  }));

  const posts = getAllPosts();
  const searchPosts: SearchPost[] = posts.map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description || post.excerpt,
    category: post.frontmatter.category,
    url: `/tin-tuc/${post.slug}`,
  }));

  return NextResponse.json({ cards: searchCards, banks: searchBanks, posts: searchPosts });
}
