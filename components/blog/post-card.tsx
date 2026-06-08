import Link from 'next/link';
import type { Post } from '@/lib/mdx';
import { fmtIsoDateLong } from '@/lib/utils';

interface Props {
  post: Post;
}

export function PostCard({ post }: Props) {
  const { frontmatter, slug, excerpt, readingTime, categorySlug } = post;

  return (
    <Link
      href={`/tin-tuc/${slug}`}
      className="ow-post-card flex flex-col border border-dashed border-border rounded hover:border-border-mid hover:bg-bg-light/60 transition-colors overflow-hidden"
    >
      {frontmatter.cover_image && (
        <div className="aspect-[2/1] overflow-hidden bg-bg-muted">
          <img
            src={frontmatter.cover_image}
            alt={frontmatter.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium px-2 py-0.5 border border-dashed border-brand-blue text-brand-blue rounded">
          {frontmatter.category}
        </span>
        <span className="text-body-sm text-text-subtle">{readingTime}</span>
      </div>

      <h2 className="heading-6 line-clamp-2">
        {frontmatter.title}
      </h2>

      <p className="text-body-sm text-text-muted line-clamp-3">{excerpt}</p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-dashed border-border">
        {frontmatter.updated && frontmatter.updated !== frontmatter.date ? (
          <span className="flex items-baseline gap-1">
            <span className="text-body-sm text-text-subtle">Cập nhật</span>
            <time className="text-body-sm text-text-subtle" dateTime={frontmatter.updated}>
              {fmtIsoDateLong(frontmatter.updated)}
            </time>
          </span>
        ) : (
          <time className="text-body-sm text-text-subtle" dateTime={frontmatter.date}>
            {fmtIsoDateLong(frontmatter.date)}
          </time>
        )}

      </div>
      </div>
    </Link>
  );
}
