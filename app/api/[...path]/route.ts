// Local dev proxy — forwards /api/* to the real API with the key injected server-side.
// This file is removed before Cloudflare builds (see prebuild in package.json).
// In production, functions/api/[[path]].ts (Cloudflare Pages Function) handles this.

import { type NextRequest, NextResponse } from 'next/server';

const UPSTREAM = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';
const API_KEY = process.env.OPENWALLET_API_KEY ?? '';

async function proxy(req: NextRequest, path: string[]): Promise<NextResponse> {
    const upstreamUrl = `${UPSTREAM}/api/${path.join('/')}${req.nextUrl.search}`;
    const res = await fetch(upstreamUrl, {
        method: req.method,
        headers: { 'X-OpenWallet-Key': API_KEY },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
        // @ts-expect-error — node fetch duplex
        duplex: req.method !== 'GET' && req.method !== 'HEAD' ? 'half' : undefined,
    });
    const body = await res.arrayBuffer();
    return new NextResponse(body, {
        status: res.status,
        headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
    });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, (await params).path);
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, (await params).path);
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, (await params).path);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, (await params).path);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, (await params).path);
}
