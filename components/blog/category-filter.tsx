import Link from 'next/link';

interface Props {
  categories: Array<{ name: string; slug: string; count: number }>;
  activeSlug?: string;
}

export function CategoryFilter({ categories, activeSlug }: Props) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed rounded-sm text-sm transition-colors ${
          !activeSlug
            ? 'border-brand-blue text-brand-blue bg-blue-50/60'
            : 'border-slate-300 text-slate-600 hover:border-slate-500 hover:text-slate-900'
        }`}
      >
        Tất cả
      </Link>
      {categories.map(({ name, slug, count }) => (
        <Link
          key={slug}
          href={`/blog/category/${slug}`}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed rounded-sm text-sm transition-colors ${
            activeSlug === slug
              ? 'border-brand-blue text-brand-blue bg-blue-50/60'
              : 'border-slate-300 text-slate-600 hover:border-slate-500 hover:text-slate-900'
          }`}
        >
          {name}
          <span className="text-xs text-slate-400">{count}</span>
        </Link>
      ))}
    </div>
  );
}
