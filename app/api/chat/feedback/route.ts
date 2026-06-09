import { postFeedbackScore } from '@/lib/langfuse';

export async function POST(req: Request) {
    const body = await req.json() as { traceId?: string; value?: number; comment?: string };

    if (!body.traceId || typeof body.value !== 'number') {
        return new Response(JSON.stringify({ error: 'traceId and value required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const value = body.value === 1 ? 1 : 0;

    await postFeedbackScore(body.traceId, value, body.comment);

    return new Response(null, { status: 204 });
}
