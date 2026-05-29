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
import openapiTS, { astToString } from 'openapi-typescript'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const apiKey = process.env.OPENWALLET_API_KEY

if (!apiUrl) {
  console.error('Error: NEXT_PUBLIC_API_URL not set in .env.local')
  process.exit(1)
}
if (!apiKey) {
  console.error('Error: OPENWALLET_API_KEY not set in .env.local')
  process.exit(1)
}

async function main() {
  const url = new URL('/openapi.json', apiUrl)
  console.log(`Fetching schema from ${url}...`)

  const ast = await openapiTS(url, {
    fetchOptions: {
      headers: { 'X-OpenWallet-Key': apiKey! },
    },
  })

  const raw = astToString(ast)

  const output = `// AUTO-GENERATED — do not edit manually
// Run: pnpm generate:types
// Source: ${url}

${raw}

// Named type aliases for convenient imports
export type Card = components['schemas']['Card']
export type Bank = components['schemas']['Bank']
export type Network = components['schemas']['Network']
export type Brand = components['schemas']['Brand']
export type Contactless = components['schemas']['Contactless']
export type FeeEntry = components['schemas']['FeeEntry']
export type FeeWaiver = components['schemas']['FeeWaiver']
export type FeeEntryWithWaiver = components['schemas']['FeeEntryWithWaiver']
export type CashbackRule = components['schemas']['CashbackRule']
export type CashbackBenefit = components['schemas']['CashbackBenefit']
export type CashbackCap = components['schemas']['CashbackCap']
export type CashbackCategory = components['schemas']['CashbackCategory']
export type Merchant = components['schemas']['Merchant']
export type Intent = components['schemas']['Intent']
export type IntentGroupNode = components['schemas']['IntentGroupNode']
export type Persona = components['schemas']['Persona']
export type RuleScope = components['schemas']['RuleScope']
`

  const outPath = resolve(process.cwd(), 'lib/api-types.generated.ts')
  writeFileSync(outPath, output, 'utf-8')
  console.log(`Done → ${outPath}`)
}

main().catch((err) => { console.error(err); process.exit(1) })
