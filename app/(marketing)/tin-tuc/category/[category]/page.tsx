import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getAllCategories, getPostsByCategory} from '@/lib/mdx';
import {PostList} from '@/components/blog/post-list';
import {CategoryFilter} from '@/components/blog/category-filter';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

interface Props {
 params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
 const categories = getAllCategories();
 return categories.map(({slug}) => ({category: slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
 const {category: slug} = await params;
 const categories = getAllCategories();
 const cat = categories.find((c) => c.slug === slug);
 const displayName = cat?.name ?? slug;
 const posts = getPostsByCategory(slug);
 const {metadata} = buildCollectionPageMeta({
 title: `${displayName} - Blog | OpenWallet`,
 description: `Bài viết về chủ đề"${displayName}" trên OpenWallet Blog.`,
 url: `/tin-tuc/category/${slug}`,
 items: posts.map((p) => ({name: p.frontmatter.title, url: `/tin-tuc/${p.slug}`})),
 breadcrumbItems: [
 {label: 'Trang chủ', href: '/'},
 {label: 'Tin tức', href: '/tin-tuc'},
 {label: displayName},
 ],
 });
 return metadata;
}

export default async function CategoryPage({params}: Props) {
 const {category: slug} = await params;
 const [t] = await Promise.all([
 getTranslations('BlogPage'),
 ]);

 const categories = getAllCategories();
 const cat = categories.find((c) => c.slug === slug);
 const displayName = cat?.name ?? slug;
 const posts = getPostsByCategory(slug);

 const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
 title: `${displayName} - Blog | OpenWallet`,
 description: `Bài viết về chủ đề"${displayName}" trên OpenWallet Blog.`,
 url: `/tin-tuc/category/${slug}`,
 items: posts.map((p) => ({name: p.frontmatter.title, url: `/tin-tuc/${p.slug}`})),
 breadcrumbItems: [
 {label: 'Trang chủ', href: '/'},
 {label: 'Tin tức', href: '/tin-tuc'},
 {label: displayName},
 ],
 });

 return (
 <div className="px-4 py-12">
 <div className="max-w-container mx-auto">
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
 <Breadcrumbs items={breadcrumbItems}/>

 <h1 className="mb-1">{displayName}</h1>
 <p className="text-slate-500 mb-8">{t('category_count', {count: posts.length})}</p>

 <div className="mb-6">
 <CategoryFilter categories={categories} activeSlug={slug}/>
 </div>

 <PostList posts={posts} emptyMessage={t('category_empty', {name: displayName})}/>
 </div>
 </div>
 );
}
