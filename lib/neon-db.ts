import 'server-only'
import { neon, Pool } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export interface UserDbRow {
    id: string
    email: string | null
    display_name: string | null
    tier: string
    signup_number: number
    bonus_credits: number
    trace_id: string
    preferences: Record<string, unknown>
    deleted_at: string | null
    created_at: string
    updated_at: string
}

export interface TierRow {
    id: string
    label: string
    can_use_paid_model: boolean
    description: string | null
}

export async function insertUserRow(id: string, email: string, name: string | null) {
    await sql`
        INSERT INTO users (id, email, display_name)
        VALUES (${id}, ${email}, ${name})
        ON CONFLICT (id) DO NOTHING
    `
}

export async function getUserFromDb(id: string): Promise<UserDbRow | null> {
    const rows = await sql`
        SELECT id, email, display_name, tier, signup_number,
               bonus_credits::float AS bonus_credits,
               trace_id::text AS trace_id,
               preferences, deleted_at, created_at, updated_at
        FROM users
        WHERE id = ${id}
    `
    return (rows[0] as UserDbRow) ?? null
}

export async function getTier(tierId: string): Promise<TierRow | null> {
    const rows = await sql`
        SELECT id, label, can_use_paid_model, description
        FROM tiers
        WHERE id = ${tierId}
    `
    return (rows[0] as TierRow) ?? null
}

export async function withUserContext<T>(userId: string, fn: (client: Pool) => Promise<T>): Promise<T> {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        await client.query('SET LOCAL app.current_user_id = $1', [userId])
        const result = await fn(pool)
        await client.query('COMMIT')
        return result
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
        await pool.end()
    }
}
