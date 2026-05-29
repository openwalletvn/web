import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';

interface Props {
  tags: Array<{ name: string; slug: string; count: number }>;
  activeSlug?: string;
}

export function TagList({ tags, activeSlug }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className="ow-tag-list flex flex-wrap gap-2">
      {tags.map(({ name, slug, count }) => (
        <Link
          key={slug}
          href={ROUTES.blogTag(slug)}
          className={cn('inline-flex items-center gap-1 px-2.5 py-1 border border-dashed rounded-sm text-sm transition-colors', activeSlug === slug ? 'border-brand-blue text-brand-blue bg-blue-50/60' : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700')}
        >
          <span className="text-slate-400">#</span>
          {name}
          <span className="text-xs text-slate-400 ml-0.5">{count}</span>
        </Link>
      ))}
    </div>
  );
}
