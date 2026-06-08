import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwPostList} from './ow-post-list';
import type {Post} from '@/lib/mdx';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwPostList> = {
    component: OwPostList,
    title: 'OW UI/OwPostList',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Table-layout post list with columns: Date, Category, Title. Responsive: category column hidden on mobile. Use for the full post archive.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwPostList>;

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockPost = (overrides: Partial<Post> = {}): Post => ({
    slug: 'huong-dan-chon-the-tin-dung',
    readingTime: '5 phút đọc',
    excerpt: '',
    categorySlug: 'huong-dan',
    tagSlugs: ['the-tin-dung'],
    content: '',
    frontmatter: {
        title: 'Hướng dẫn chọn thẻ tín dụng phù hợp với nhu cầu chi tiêu',
        description: '',
        date: '2024-11-15',
        category: 'Hướng dẫn',
        tags: ['thẻ tín dụng'],
        status: 'published',
        cover_image: undefined,
    },
    ...overrides,
});

const POSTS: Post[] = [
    mockPost({
        slug: 'review-the-msb-visa-online',
        frontmatter: {
            title: 'Review thẻ MSB Visa Online: Hoàn tiền 5% không giới hạn?',
            description: '',
            date: '2024-12-01',
            category: 'Review thẻ',
            tags: [],
            status: 'published',
        },
        categorySlug: 'review-the',
        tagSlugs: [],
        readingTime: '7 phút đọc',
        excerpt: '',
        content: '',
    }),
    mockPost({
        slug: 'so-sanh-the-cashback',
        frontmatter: {
            title: 'So sánh 10 thẻ hoàn tiền tốt nhất tháng 12/2024',
            description: '',
            date: '2024-12-10',
            category: 'So sánh thẻ',
            tags: [],
            status: 'published',
        },
        categorySlug: 'so-sanh-the',
        tagSlugs: [],
        readingTime: '12 phút đọc',
        excerpt: '',
        content: '',
    }),
    mockPost(),
    mockPost({
        slug: 'meo-toi-uu-diem-thuong',
        frontmatter: {
            title: 'Mẹo tối ưu điểm thưởng thẻ tín dụng dành cho người mới',
            description: '',
            date: '2024-10-20',
            category: 'Tin tức',
            tags: [],
            status: 'published',
        },
        categorySlug: 'tin-tuc',
        tagSlugs: [],
        readingTime: '4 phút đọc',
        excerpt: '',
        content: '',
    }),
    mockPost({
        slug: 'case-study-chi-tieu-hang-thang',
        frontmatter: {
            title: 'Case Study: Tối ưu hoàn tiền 3 triệu/tháng với 2 thẻ',
            description: '',
            date: '2024-09-05',
            category: 'Case Study',
            tags: [],
            status: 'published',
        },
        categorySlug: 'case-study',
        tagSlugs: [],
        readingTime: '9 phút đọc',
        excerpt: '',
        content: '',
    }),
];

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
    args: {posts: POSTS},
};

export const CustomTitle: Story = {
    args: {posts: POSTS, title: 'Tất cả bài viết (12)'},
};

export const SinglePost: Story = {
    args: {posts: [POSTS[0]]},
};

export const Empty: Story = {
    args: {posts: []},
};

export const AllVariants: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Full list">
                <OwPostList posts={POSTS}/>
            </OwStorySection>
            <OwStorySection title="Empty state">
                <OwPostList posts={[]}/>
            </OwStorySection>
            <OwStorySection title="Custom title">
                <OwPostList posts={POSTS} title="Tất cả bài viết (5)"/>
            </OwStorySection>
        </OwStories>
    ),
};
