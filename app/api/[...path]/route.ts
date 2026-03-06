import { type NextRequest, NextResponse } from 'next/server';

const UPSTREAM = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.openwallet.vn';
const API_KEY = process.env.OPENWALLET_API_KEY ?? '';

async function proxy(req: NextRequest, path: string[]): Promise<NextResponse> {
    const upstreamUrl = `${UPSTREAM}/api/${path.join('/')}${req.nextUrl.search}`;
    const res = await fetch(upstreamUrl, {
        method: req.method,
        headers: { 'X-OpenWallet-Key': API_KEY },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
        // @ts-expect-error — Next.js node fetch supports duplex
        duplex: req.method !== 'GET' && req.method !== 'HEAD' ? 'half' : undefined,
    });

    const body = await res.arrayBuffer();
    return new NextResponse(body, {
        status: res.status,
        headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
    });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxy(req, path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxy(req, path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxy(req, path);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxy(req, path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxy(req, path);
}
