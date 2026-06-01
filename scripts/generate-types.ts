#!/usr/bin/env tsx
/**
 * Generate TypeScript types from the OpenWallet API OpenAPI spec.
 * Requires NEXT_PUBLIC_API_URL and OPENWALLET_API_KEY in .env.local
 *
 * Usage: pnpm generate:types
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { writeFileSync } from 'fs'
import { generateTypesOutput } from './lib/types-utils'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const apiKey = process.env.OPENWALLET_API_KEY

if (!apiUrl) { console.error('Error: NEXT_PUBLIC_API_URL not set in .env.local'); process.exit(1) }
if (!apiKey) { console.error('Error: OPENWALLET_API_KEY not set in .env.local'); process.exit(1) }

async function main() {
    const url = new URL('/openapi.json', apiUrl)
    console.log(`Fetching schema from ${url}...`)

    const res = await fetch(url, { headers: { 'X-OpenWallet-Key': apiKey! } })
    if (!res.ok) throw new Error(`Failed to fetch schema: ${res.status} ${res.statusText}`)
    const schema = await res.json()

    const output = await generateTypesOutput(schema, url)
    const outPath = resolve(process.cwd(), 'lib/api-types.generated.ts')
    writeFileSync(outPath, output, 'utf-8')
    console.log(`Done → ${outPath}`)
}

main().catch((err) => { console.error(err); process.exit(1) })
