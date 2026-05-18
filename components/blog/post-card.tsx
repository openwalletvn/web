import Link from 'next/link';
import type { Post } from '@/lib/mdx';
import { AiBadge } from './ai-badge';

interface Props {
  post: Post;
}

export function PostCard({ post }: Props) {
  const { frontmatter, slug, excerpt, readingTime, categorySlug, tagSlugs } = post;

  return (
    <Link
      href={`/tin-tuc/${slug}`}
      className="ow-post-card flex flex-col border border-dashed border-slate-200 rounded-sm hover:border-slate-400 hover:bg-slate-50/60 transition-colors overflow-hidden"
    >
      {frontmatter.cover_image && (
        <div className="aspect-[2/1] overflow-hidden bg-slate-100">
          <img
            src={frontmatter.cover_image}
            alt={frontmatter.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium px-2 py-0.5 border border-dashed border-brand-blue text-brand-blue rounded-sm">
          {frontmatter.category}
        </span>
        <span className="text-xs text-slate-400">{readingTime}</span>
        {frontmatter.ai_generated && <AiBadge size="sm" />}
      </div>

      <h2 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
        {frontmatter.title}
      </h2>

      <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">{excerpt}</p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-dashed border-slate-100">
        {frontmatter.updated && frontmatter.updated !== frontmatter.date ? (
          <span className="flex items-baseline gap-1">
            <span className="text-xs text-slate-400">Cập nhật</span>
            <time className="text-xs text-slate-400" dateTime={frontmatter.updated}>
              {new Date(frontmatter.updated).toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </span>
        ) : (
          <time className="text-xs text-slate-400" dateTime={frontmatter.date}>
            {new Date(frontmatter.date).toLocaleDateString('vi-VN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        )}

        {frontmatter.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-end">
            {frontmatter.tags.slice(0, 2).map((tag, i) => (
              <span
                key={tagSlugs[i]}
                className="text-xs px-1.5 py-0.5 border border-dashed border-slate-200 text-slate-400 rounded-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      </div>
    </Link>
  );
}
