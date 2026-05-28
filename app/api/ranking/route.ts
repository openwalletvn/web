import { type NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const res = await apiFetch('/api/v1/cards/rank', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return NextResponse.json(data);
}
