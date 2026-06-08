import fs from 'fs'
import path from 'path'
import { MetadataRoute } from 'next'
import { getComparePairs } from '@/lib/api'
import { apiFetch } from '@/lib/api'
// lib/compare-mdx + content/so-sanh/ MDX files - unused, remove when cleaning up
import { getTool } from '@/lib/tools'
import { getAllPosts } from '@/lib/mdx'

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
  let bankData: { id: string }[] = []
  try {
    const banksRes = await apiFetch('/api/v1/banks')
    bankData = ((await banksRes.json()) as { data: { id: string }[] }).data ?? []
  } catch (e) {
    console.error('[sitemap] Failed to fetch banks:', e)
  }
  const bankPages = [
    { url: `${BASE_URL}/ngan-hang`, changeFrequency: 'weekly' as const, priority: 0.9 },
    ...bankData.map((b) => ({
      url: `${BASE_URL}/ngan-hang/${b.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  ]

  // 3. Cards - dynamic from API
  let cardData: { id: string }[] = []
  try {
    const cardsRes = await apiFetch('/api/v1/cards')
    cardData = ((await cardsRes.json()) as { data: { id: string }[] }).data ?? []
  } catch (e) {
    console.error('[sitemap] Failed to fetch cards:', e)
  }
  const cardPages = [
    { url: `${BASE_URL}/the`, changeFrequency: 'weekly' as const, priority: 0.9 },
    ...cardData.map((c) => ({
      url: `${BASE_URL}/the/${c.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  ]

  // 4. Blog posts - published only (getAllPosts filters drafts)
  const postPages = getAllPosts().map((p) => ({
    url: `${BASE_URL}/tin-tuc/${p.slug}`,
    lastModified: new Date(p.frontmatter.updated ?? p.frontmatter.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // 5. Changelog
  const changelogPage = {
    url: `${BASE_URL}/changelog`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }

  // 5. Compare pairs
  const apiPairs = await getComparePairs().catch(() => [])
  const allPairs = apiPairs.map((p) => p.compare_path)
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
    ...postPages,
    changelogPage,
    ...comparePages,
  ]
}
