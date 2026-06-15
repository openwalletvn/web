import { insertUserRow } from '@/lib/neon-db'

export async function POST(request: Request) {
    const body = await request.json() as {
        event_type: string
        user?: { id: string; email: string; name?: string }
    }

    if (body.event_type === 'user.created' && body.user) {
        const { id, email, name } = body.user
        await insertUserRow(id, email, name ?? null)
    }

    return Response.json({ ok: true })
}
