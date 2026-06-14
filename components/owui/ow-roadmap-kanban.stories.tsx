import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import type {GithubProjectBoard} from '@/lib/github-project';
import {OwRoadmapKanban} from './ow-roadmap-kanban';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwRoadmapKanban> = {
    component: OwRoadmapKanban,
    title: 'Roadmap UI/OwRoadmapKanban',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: [
                    'Kanban board for displaying a GitHub Projects roadmap. Read-only, no actions.',
                    '',
                    '**`columns`** — ordered list of `{ name, label }` mapping GitHub column names to display labels.',
                    '',
                    '```tsx',
                    'const board = await fetchGitHubProject("openwalletvn", 1)',
                    '<OwRoadmapKanban',
                    '  board={board}',
                    '  columns={[',
                    '    { name: "In Progress", label: "In Progress" },',
                    '    { name: "Todo", label: "Planned" },',
                    '    { name: "Future Ideas", label: "Future Ideas" },',
                    '  ]}',
                    '/>',
                    '```',
                ].join('\n'),
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwRoadmapKanban>;

const MOCK_BOARD: GithubProjectBoard = {
    id: 'PVT_mock',
    title: 'openwallet/roadmap',
    url: 'https://github.com/orgs/openwalletvn/projects/1',
    columns: [
        {
            id: 'c1',
            name: 'In Progress',
            color: '#bf8700',
            items: [
                {id: '1', title: 'Roadmap công khai tại /roadmap', body: '', url: 'https://github.com/openwalletvn/web/issues/3', state: 'OPEN', labels: [{name: 'feature', color: '#0075ca'}], isDraft: false, shippedDate: null},
            ],
        },
        {
            id: 'c2',
            name: 'Todo',
            color: '#2da44e',
            items: [
                {id: '2', title: 'So sánh thẻ theo điểm thưởng', body: '', url: 'https://github.com/openwalletvn/web/issues/1', state: 'OPEN', labels: [{name: 'feature', color: '#0075ca'}], isDraft: false, shippedDate: null},
                {id: '3', title: 'Trang tổng hợp ưu đãi ngân hàng', body: '', url: null, state: null, labels: [], isDraft: true, shippedDate: null},
            ],
        },
        {
            id: 'c3',
            name: 'Future Ideas',
            color: '#0969da',
            items: [
                {id: '4', title: 'App mobile OpenWallet', body: '', url: null, state: null, labels: [], isDraft: true, shippedDate: null},
            ],
        },
    ],
};

const COLUMNS = [
    {name: 'In Progress', label: 'In Progress'},
    {name: 'Todo', label: 'Planned'},
    {name: 'Future Ideas', label: 'Future Ideas'},
];

const EMPTY_BOARD: GithubProjectBoard = {
    ...MOCK_BOARD,
    columns: MOCK_BOARD.columns.map((c) => ({...c, items: []})),
};

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="With items">
                <OwRoadmapKanban board={MOCK_BOARD} columns={COLUMNS}/>
            </OwStorySection>
        </OwStories>
    ),
};

export const WithItems: Story = {
    args: {board: MOCK_BOARD, columns: COLUMNS},
};

export const EmptyBoard: Story = {
    args: {board: EMPTY_BOARD, columns: COLUMNS},
};
