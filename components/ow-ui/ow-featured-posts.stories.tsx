import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwFeaturedPosts} from './ow-featured-posts';
import type {Post} from '@/lib/mdx';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwFeaturedPosts> = {
    component: OwFeaturedPosts,
    title: 'OW UI/OwFeaturedPosts',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: [
                    'Featured posts section. 7/5 two-column layout: left = main card with image, right = text-only list.',
                    '',
                    '**Props:**',
                    '- `allPosts` — full post list (from `getAllPosts()`)',
                    '- `slugs` — optional manual selection; if omitted, shows latest 5 posts',
                    '- `title` — optional section heading',
                ].join('\n'),
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwFeaturedPosts>;

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockPost = (slug: string, overrides: Partial<Post['frontmatter']> = {}, extra: Partial<Omit<Post, 'frontmatter' | 'slug'>> = {}): Post => ({
    slug,
    readingTime: '5 phút đọc',
    excerpt: '',
    categorySlug: 'huong-dan',
    content: '',
    frontmatter: {
        title: 'Hướng dẫn chọn thẻ tín dụng phù hợp với nhu cầu chi tiêu',
        description: 'Bạn đang phân vân không biết chọn thẻ tín dụng nào? Bài viết này giúp bạn so sánh và lựa chọn dựa trên thói quen chi tiêu thực tế.',
        date: '2024-11-15',
        category: 'Hướng dẫn',
        tags: ['thẻ tín dụng'],
        status: 'published',
        cover_image: undefined,
        ...overrides,
    },
    ...extra,
});

const ALL_POSTS: Post[] = [
    mockPost('review-msb-visa', {
        title: 'Review thẻ MSB Visa Online: Hoàn tiền 5% không giới hạn?',
        description: 'Đánh giá chi tiết ưu nhược điểm của thẻ MSB Visa Online sau 6 tháng sử dụng thực tế.',
        date: '2024-12-01',
        category: 'Review thẻ',
        cover_image: 'https://placehold.co/800x450/EF3C23/white?text=MSB+Visa',
    }, {categorySlug: 'review-the', readingTime: '7 phút đọc'}),

    mockPost('so-sanh-cashback', {
        title: 'So sánh 10 thẻ hoàn tiền tốt nhất tháng 12/2024',
        description: 'Phân tích và xếp hạng theo danh mục: ăn uống, siêu thị, xăng dầu, mua sắm online.',
        date: '2024-12-10',
        category: 'So sánh thẻ',
    }, {categorySlug: 'so-sanh-the', readingTime: '12 phút đọc'}),

    mockPost('huong-dan-chon-the', {}, {}),

    mockPost('meo-toi-uu-diem-thuong', {
        title: 'Mẹo tối ưu điểm thưởng thẻ tín dụng dành cho người mới',
        date: '2024-10-20',
        category: 'Tin tức',
    }, {categorySlug: 'tin-tuc', readingTime: '4 phút đọc'}),

    mockPost('case-study-3-trieu', {
        title: 'Case Study: Tối ưu hoàn tiền 3 triệu/tháng với 2 thẻ',
        date: '2024-09-05',
        category: 'Case Study',
    }, {categorySlug: 'case-study', readingTime: '9 phút đọc'}),
];

// ─── Stories ──────────────────────────────────────────────────────────────────

export const LatestPosts: Story = {
    name: 'Latest posts (no slugs)',
    args: {allPosts: ALL_POSTS},
};

export const WithTitle: Story = {
    args: {allPosts: ALL_POSTS, title: 'Bài viết nổi bật'},
};

export const ManualSlugs: Story = {
    name: 'Manual slugs selection',
    args: {
        allPosts: ALL_POSTS,
        slugs: ['case-study-3-trieu', 'so-sanh-cashback', 'meo-toi-uu-diem-thuong'],
        title: 'Chọn tay',
    },
};

export const SinglePost: Story = {
    name: 'Single post (no sidebar)',
    args: {allPosts: ALL_POSTS, slugs: ['review-msb-visa']},
};

export const FeaturedNoImage: Story = {
    name: 'Featured post without cover image',
    args: {allPosts: ALL_POSTS, slugs: ['huong-dan-chon-the', 'so-sanh-cashback', 'meo-toi-uu-diem-thuong']},
};

export const Empty: Story = {
    args: {allPosts: [], slugs: []},
};

export const AllVariants: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Latest 5 (no slugs, no title)">
                <OwFeaturedPosts allPosts={ALL_POSTS}/>
            </OwStorySection>
            <OwStorySection title="With title">
                <OwFeaturedPosts allPosts={ALL_POSTS} title="Bài viết nổi bật"/>
            </OwStorySection>
            <OwStorySection title="Manual slugs">
                <OwFeaturedPosts
                    allPosts={ALL_POSTS}
                    slugs={['case-study-3-trieu', 'so-sanh-cashback', 'meo-toi-uu-diem-thuong']}
                    title="Chọn tay"
                />
            </OwStorySection>
            <OwStorySection title="Single post (no sidebar)">
                <OwFeaturedPosts allPosts={ALL_POSTS} slugs={['review-msb-visa']}/>
            </OwStorySection>
            <OwStorySection title="Empty (renders nothing)">
                <div className="border border-dashed border-border rounded p-4 text-text-muted text-sm text-center">
                    [empty — OwFeaturedPosts renders null]
                </div>
            </OwStorySection>
        </OwStories>
    ),
};
