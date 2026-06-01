#!/usr/bin/env tsx
/**
 * Check if lib/api-types.generated.ts is in sync with the live API schema.
 * Exit 0 = in sync. Exit 1 = stale or error.
 *
 * Usage: pnpm check:types
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { checkTypeSync } from './lib/types-utils'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const apiKey = process.env.OPENWALLET_API_KEY

if (!apiUrl) { console.error('Error: NEXT_PUBLIC_API_URL not set in .env.local'); process.exit(1) }
if (!apiKey) { console.error('Error: OPENWALLET_API_KEY not set in .env.local'); process.exit(1) }

void (async () => {
    const result = await checkTypeSync(apiUrl, apiKey)

    if (result === 'synced') {
        console.log('✓ API types in sync')
        process.exit(0)
    } else if (result === 'stale') {
        console.error('✗ API types are stale — run: pnpm generate:types')
        process.exit(1)
    } else {
        console.error('✗ Could not reach API to check types')
        process.exit(1)
    }
})()
