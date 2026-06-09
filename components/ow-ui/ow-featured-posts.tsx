import Link from 'next/link';
import type {Post} from '@/lib/mdx';
import {resolvePosts} from '@/lib/posts-utils';
import {ROUTES} from '@/lib/routes';
import {OwPostCategoryDate} from './ow-post-category-date';
import {OwButton} from "@/components/ow-ui/ow-button";

function FeaturedGridItem({post}: { post: Post }) {
  return (
    <div
      className="group sm:space-y-8 space-y-4">
      {/*image*/}
      <Link href={ROUTES.blogPost(post.slug)} className="block w-full overflow-hidden ow-rounded-small border border-gray-100 bg-bg-muted">
        {post.frontmatter.cover_image && (
          <img
            src={post.frontmatter.cover_image}
            alt={post.frontmatter.title}
            className="size-full sm:aspect-366/475 aspect-video object-cover object-left group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </Link>

      {/*info*/}
      <div className="flex flex-col sm:gap-2 gap-1">
        <OwPostCategoryDate
          category={post.frontmatter.category}
          categorySlug={post.categorySlug}
          date={post.frontmatter.date}
        />
        <Link href={ROUTES.blogPost(post.slug)}>
          <h3
            className="heading-5 text-text-primary hover:text-text-accent transition-colors line-clamp-2">
            {post.frontmatter.title}
          </h3>
        </Link>
      </div>

    </div>
  );
}

function FeaturedMainCard({post}: {post: Post}) {
  return (
    <div
      className="group flex flex-col gap-3 h-full ow-rounded-small border border-border bg-white hover:border-border-dark hover:shadow-sm transition-all overflow-hidden">
      {post.frontmatter.cover_image ? (
        <Link href={ROUTES.blogPost(post.slug)} className="block aspect-[16/9] overflow-hidden bg-bg-muted">
          <img
            src={post.frontmatter.cover_image}
            alt={post.frontmatter.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      ) : (
        <Link href={ROUTES.blogPost(post.slug)} className="block aspect-[16/9] bg-bg-warm"/>
      )}
      <div className="flex flex-col gap-2 px-4 pb-4">
        <OwPostCategoryDate
          category={post.frontmatter.category}
          categorySlug={post.categorySlug}
          date={post.frontmatter.date}
          readingTime={post.readingTime}
        />
        <Link href={ROUTES.blogPost(post.slug)}>
          <h3
            className="text-body font-semibold text-text-primary hover:text-text-accent transition-colors line-clamp-3">
            {post.frontmatter.title}
          </h3>
        </Link>
        <p className="text-body-sm text-text-muted line-clamp-2">
          {post.frontmatter.description}
        </p>
      </div>
    </div>
  );
}

function FeaturedSideItem({post}: {post: Post}) {
  return (
    <div className="flex flex-col gap-1 pb-4 border-b border-border last:border-0 last:pb-0">
      <OwPostCategoryDate
        category={post.frontmatter.category}
        categorySlug={post.categorySlug}
        date={post.frontmatter.date}
      />
      <Link
        href={ROUTES.blogPost(post.slug)}
        className="text-body font-medium text-text-primary hover:text-text-accent transition-colors line-clamp-2"
      >
        {post.frontmatter.title}
      </Link>
      <p className="text-body-sm text-text-muted line-clamp-2">
        {post.frontmatter.description}
      </p>
    </div>
  );
}

export function OwFeaturedPosts({allPosts, slugs, title, variant = 'default'}: {
  allPosts: Post[];
  slugs?: string[];
  title?: string;
  variant?: 'default' | 'grid';
}) {
  const posts = resolvePosts(allPosts, slugs);
  if (posts.length === 0) return null;

  if (variant === 'grid') {
    const gridPosts = posts.slice(0, 3);
    return (
      <section className="ow-featured-posts flex flex-col sm:gap-8 gap-6">

        <div className="flex justify-between items-center gap-4">
          <div>
            {title && <h2 className="text-ui text-text-primary">{title}</h2>}
          </div>
          <div>
            <OwButton asChild>
              <Link href="/tin-tuc">Xem tất cả bài viết</Link>
            </OwButton>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-8">
          {gridPosts.map((post) => (
            <FeaturedGridItem key={post.slug} post={post}/>
          ))}
        </div>

      </section>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <section className="ow-featured-posts flex flex-col gap-4">
      {title && <h2 className="text-ui text-text-primary">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 md:gap-x-6 gap-y-6">
        {/* Left: featured post */}
        <div className="md:col-span-7">
          <FeaturedMainCard post={featured}/>
        </div>

        {/* Right: sidebar list */}
        {rest.length > 0 && (
          <div className="md:col-span-5 flex flex-col gap-4 justify-start">
            {rest.map((post) => (
              <FeaturedSideItem key={post.slug} post={post}/>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
