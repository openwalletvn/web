import type {Metadata} from 'next';
import {ROUTES} from '@/lib/routes';
import {fetchGitHubProject} from '@/lib/github-project';
import {OwRoadmapKanban} from '@/components/owui/ow-roadmap-kanban';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';
import {buildTitle} from '@/lib/page-meta/title';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: buildTitle('Roadmap'),
    description: 'Kế hoạch phát triển của OpenWallet: các tính năng đang được xây dựng và những gì sắp ra mắt.',
    alternates: {canonical: ROUTES.roadmap},
    openGraph: {
        title: 'Roadmap',
        description: 'Kế hoạch phát triển của OpenWallet: các tính năng đang được xây dựng và những gì sắp ra mắt.',
    },
    twitter: {
        title: 'Roadmap',
        description: 'Kế hoạch phát triển của OpenWallet: các tính năng đang được xây dựng và những gì sắp ra mắt.',
    },
};

export default async function RoadmapPage() {
    const board = await fetchGitHubProject('openwalletvn', 1);

    const breadcrumbItems = [
        {label: 'Trang chủ', href: '/'},
        {label: 'Roadmap'},
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            buildBreadcrumbJsonLd(breadcrumbItems),
        ],
    };

    return (
        <MarketingPageShell
            title="Roadmap"
            description="Những tính năng chúng tôi đang xây dựng và kế hoạch sắp tới."
            breadcrumbItems={breadcrumbItems}
            jsonLd={jsonLd}
        >
            <OwRoadmapKanban
                board={board}
                columns={[
                    {name: 'Todo', label: 'In Progress'},
                    {name: 'Planned', label: 'Planned'},
                    {name: 'Future Ideas', label: 'Future Ideas'},
                ]}
                completedCol={{name: 'Done', label: 'Recently Completed'}}
            />
        </MarketingPageShell>
    );
}
