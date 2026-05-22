import fs from 'fs'
import path from 'path'
import { MetadataRoute } from 'next'
import { getComparePairs } from '@/lib/api'
import { apiFetch } from '@/lib/api'
import { getCompareMdxPairs } from '@/lib/compare-mdx'
import { getTool } from '@/lib/tools'

export const dynamic = 'force-static'

const BASE_URL = 'https://openwallet.vn'
const cardBattleHref = getTool('Card Battle').href

// Folders handled separately or not pages
const EXCLUDED_DIRS = ['ngan-hang', 'the', 'tin-tuc', 'docs', cardBattleHref.slice(1)]

function getStaticPages(): string[] {
  const dir = path.join(process.cwd(), 'app/(marketing)')
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d =>
      d.isDirectory() &&
      !d.name.startsWith('_') &&
      !d.name.startsWith('[') &&
      !d.name.startsWith('(') &&
      !EXCLUDED_DIRS.includes(d.name) &&
      fs.existsSync(path.join(dir, d.name, 'page.tsx'))
    )
    .map(d => d.name === 'page.tsx' ? '/' : `/${d.name}`)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static pages (marketing + SEO) from filesystem
  const staticPages = getStaticPages().map(url => ({
    url: `${BASE_URL}${url}`,
    changeFrequency: 'monthly' as const,
    priority: url === '/' ? 1 : 0.8,
  }))

  // 2. Banks - dynamic from API
  const banksRes = await apiFetch('/api/v1/banks')
  const banks = await banksRes.json()
  const bankPages = [
    { url: `${BASE_URL}/ngan-hang`, changeFrequency: 'weekly' as const, priority: 0.9 },
    ...banks.data.map((b: { id: string }) => ({
      url: `${BASE_URL}/ngan-hang/${b.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  ]

  // 3. Cards - dynamic from API
  const cardsRes = await apiFetch('/api/v1/cards')
  const cards = await cardsRes.json()
  const cardPages = [
    { url: `${BASE_URL}/the`, changeFrequency: 'weekly' as const, priority: 0.9 },
    ...cards.data.map((c: { id: string }) => ({
      url: `${BASE_URL}/the/${c.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  ]

  // 4. Changelog
  const changelogPage = {
    url: `${BASE_URL}/changelog`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }

  // 5. Compare pairs
  const [apiPairs, mdxPairs] = await Promise.all([
    getComparePairs().catch(() => []),
    Promise.resolve(getCompareMdxPairs()),
  ])
  const allPairs = [...new Set([...apiPairs.map((p) => p.compare_path), ...mdxPairs.map((p) => `/${p}`)])]
  const comparePages = [
    { url: `${BASE_URL}${cardBattleHref}`, changeFrequency: 'monthly' as const, priority: 0.8 },
    ...allPairs.map((pair) => ({
      url: `${BASE_URL}${cardBattleHref}${pair}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]

  return [
    ...staticPages,
    ...bankPages,
    ...cardPages,
    changelogPage,
    ...comparePages,
  ]
}
