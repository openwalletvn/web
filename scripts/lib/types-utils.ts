import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import openapiTS, { astToString } from 'openapi-typescript'

const ALIASES = `
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
export type Merchant = components['schemas']['Merchant']
export type Intent = components['schemas']['Intent']
export type IntentGroupNode = components['schemas']['IntentGroupNode']
export type Persona = components['schemas']['Persona']
export type RuleScope = components['schemas']['RuleScope']
export type SpendTier = components['schemas']['SpendTier']
`

export async function generateTypesOutput(schema: unknown, sourceUrl: URL): Promise<string> {
    const ast = await openapiTS(schema as Parameters<typeof openapiTS>[0])
    const raw = astToString(ast)
    return `// AUTO-GENERATED — do not edit manually\n// Run: pnpm generate:types\n// Source: ${sourceUrl}\n\n${raw}\n${ALIASES}`
}

export type TypeSyncResult = 'synced' | 'updated' | 'stale' | 'error'

const OUT_PATH = resolve(process.cwd(), 'lib/api-types.generated.ts')

// Strip auto-gen header (first 3 lines) — source URL differs between local/prod
const strip = (s: string) => s.split('\n').slice(3).join('\n')

export async function checkTypeSync(apiUrl: string, apiKey: string, autoFix = false): Promise<TypeSyncResult> {
    try {
        const url = new URL('/openapi.json', apiUrl)
        const res = await fetch(url, { headers: { 'X-OpenWallet-Key': apiKey } })
        if (!res.ok) return 'error'
        const schema = await res.json()
        const generated = await generateTypesOutput(schema, url)

        const current = readFileSync(OUT_PATH, 'utf-8')
        if (strip(generated) === strip(current)) return 'synced'

        if (autoFix) {
            writeFileSync(OUT_PATH, generated, 'utf-8')
            return 'updated'
        }

        return 'stale'
    } catch {
        return 'error'
    }
}
