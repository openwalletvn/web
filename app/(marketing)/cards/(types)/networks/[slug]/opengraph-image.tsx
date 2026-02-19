import { createOgImage, OG_SIZE } from '@/lib/og';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${apiUrl}/api/v1/networks`);
    const json = await res.json();
    if (!json.success) return [];
    return json.data.map((network: { id: string }) => ({ slug: network.id }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const res = await fetch(`${apiUrl}/api/v1/networks/${slug}`);
    const json = await res.json();
    if (!json.success) throw new Error('not found');
    const network = json.data;

    const logoUrl = network.logo_url ? `${apiUrl}${network.logo_url}` : null;
    const isWebp = logoUrl?.match(/\.webp(\?|$)/i);
    let logoOk = false;
    if (logoUrl && !isWebp) {
      try {
        const probe = await fetch(logoUrl, { method: 'HEAD' });
        logoOk = probe.ok && (probe.headers.get('content-type') ?? '').includes('image');
      } catch {
        logoOk = false;
      }
    }

    return createOgImage({
      title: network.name,
      description: `Card network · Open Wallet`,
      rightSlot: logoOk && logoUrl ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '200px',
            height: '200px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt=""
            width={152}
            height={152}
            style={{ objectFit: 'contain' }}
          />
        </div>
      ) : undefined,
    });
  } catch {
    return createOgImage({ title: slug, description: 'Open Wallet · Networks' });
  }
}
