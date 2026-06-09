import type {Post} from '@/lib/mdx';

export function resolvePosts(allPosts: Post[], slugs?: string[], limit = 5): Post[] {
    if (slugs && slugs.length > 0) {
        return slugs
            .map((slug) => allPosts.find((p) => p.slug === slug))
            .filter((p): p is Post => !!p);
    }
    return allPosts.slice(0, limit);
}
