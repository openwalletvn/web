import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import type {GithubProjectItem} from '@/lib/github-project';
import {OwRoadmapChangelog} from './ow-roadmap-changelog';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwRoadmapChangelog> = {
    component: OwRoadmapChangelog,
    title: 'Roadmap UI/OwRoadmapChangelog',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: [
                    'Timeline layout for shipped items from GitHub Projects Done column.',
                    '',
                    'Renders each item with: sticky date column (desktop), title, and MDX body.',
                    'Items without `shippedDate` are filtered out.',
                    '',
                    '> **Note:** MDX body is mocked in Storybook (plain text preview). Live site uses `MDXRemote` from `next-mdx-remote/rsc`.',
                    '',
                    '```tsx',
                    '<OwRoadmapChangelog items={doneItems} />',
                    '```',
                ].join('\n'),
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwRoadmapChangelog>;

const MOCK_ITEMS: GithubProjectItem[] = [
    {
        id: '1',
        title: 'Trang /roadmap công khai từ GitHub Projects',
        body: `- Roadmap công khai tại \`/roadmap\`, lấy dữ liệu trực tiếp từ GitHub Projects
- ISR revalidate mỗi 60 phút, không cần deploy lại khi cập nhật roadmap
- Hiển thị kanban (Todo, In Progress, Future Ideas) và timeline "Recently Shipped"
- Trường Shipped date trên GitHub Projects điều khiển thứ tự timeline`,
        url: null,
        state: null,
        labels: [],
        isDraft: true,
        shippedDate: '2026-06-14',
    },
    {
        id: '2',
        title: 'Merge changelog vào trang /roadmap',
        body: `- \`/changelog\` redirect 301 về \`/roadmap\`
- GitHub Projects là SSOT cho cả roadmap lẫn changelog
- Body của draft issue = nội dung changelog (tiếng Việt, tối đa 4 bullet)
- Xóa \`content/changelog.mdx\`, \`lib/changelog.ts\`, toàn bộ route \`/changelog\``,
        url: null,
        state: null,
        labels: [],
        isDraft: true,
        shippedDate: '2026-06-13',
    },
    {
        id: '3',
        title: 'Trang so sánh thẻ tín dụng Card Battle',
        body: `- Cho phép so sánh 2 thẻ trực tiếp, hiển thị điểm mạnh/yếu từng thẻ
- URL dạng \`/card-battle?compare=X,Y\` hỗ trợ chia sẻ`,
        url: 'https://github.com/openwalletvn/web/issues/5',
        state: 'CLOSED',
        labels: [{name: 'feature', color: '#0075ca'}],
        isDraft: false,
        shippedDate: '2026-05-20',
    },
    {
        id: '4',
        title: 'Tích hợp OpenWallet MCP Server',
        body: `- MCP server cung cấp dữ liệu thẻ cho AI assistants (Claude, Cursor, v.v.)
- Hỗ trợ 10 tools: tìm thẻ, so sánh, tính cashback, lọc theo tiêu chí`,
        url: null,
        state: null,
        labels: [],
        isDraft: true,
        shippedDate: '2026-04-10',
    },
];

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="With body">
                <OwRoadmapChangelog items={MOCK_ITEMS}/>
            </OwStorySection>
            <OwStorySection title="No body">
                <OwRoadmapChangelog items={MOCK_ITEMS.map((item) => ({...item, body: ''}))}/>
            </OwStorySection>
        </OwStories>
    ),
};

export const Default: Story = {
    args: {items: MOCK_ITEMS},
};

export const SingleItem: Story = {
    args: {items: [MOCK_ITEMS[0]]},
};

export const Empty: Story = {
    args: {items: []},
};

export const NoShippedDate: Story = {
    name: 'Filters items without shippedDate',
    args: {
        items: MOCK_ITEMS.map((item) => ({...item, shippedDate: null})),
    },
};
