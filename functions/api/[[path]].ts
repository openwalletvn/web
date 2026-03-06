interface Env {
    OPENWALLET_API_KEY: string;
    NEXT_PUBLIC_API_URL?: string;
}

// @ts-ignore
export const onRequest: PagesFunction<Env> = async (context: any) => {
    const upstream = context.env.NEXT_PUBLIC_API_URL ?? 'https://api.openwallet.vn';
    const url = new URL(context.request.url);
    const upstreamUrl = `${upstream}${url.pathname}${url.search}`;

    const req = new Request(upstreamUrl, {
        method: context.request.method,
        headers: {
            'X-OpenWallet-Key': context.env.OPENWALLET_API_KEY,
            'Content-Type': context.request.headers.get('Content-Type') ?? 'application/json',
        },
        body: ['GET', 'HEAD'].includes(context.request.method) ? undefined : context.request.body,
    });

    return fetch(req);
};
