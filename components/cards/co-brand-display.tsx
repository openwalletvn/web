import type { Brand } from '@/lib/api';
import { getBrandImageUrl } from '@/lib/api';

interface Props {
  brand: Brand;
  /** Fallback text shown when brand.name is unavailable */
  fallback?: string;
}

export function CoBrandDisplay({ brand, fallback }: Props) {
  const content = (
    <span className="flex items-center gap-1.5">
      <img
        src={getBrandImageUrl(brand.logo_url)}
        alt={brand.name}
        width={100}
        height={40}
        className="object-contain shrink-0"
      />
      <span>{brand.name || fallback}</span>
      {brand.link && <span className="text-slate-400">↗</span>}
    </span>
  );

  if (brand.link) {
    return (
      <a
        href={brand.link}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-slate-900 hover:text-brand-blue transition-colors"
      >
        {content}
      </a>
    );
  }

  return <span className="font-medium text-slate-900">{content}</span>;
}
