import type {Metadata} from 'next';
import {ROUTES} from '@/lib/routes';
import {fetchGitHubProject} from '@/lib/github-project';
import {OwRoadmapKanban} from '@/components/owui/ow-roadmap-kanban';
import {OwRoadmapChangelog} from '@/components/owui/ow-roadmap-changelog';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';
import {buildTitle} from '@/lib/page-meta/title';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: buildTitle('Roadmap'),
    description: 'Kế hoạch phát triển và những tính năng đã ra mắt của OpenWallet.',
    alternates: {canonical: ROUTES.roadmap},
    openGraph: {
        title: 'Roadmap',
        description: 'Kế hoạch phát triển và những tính năng đã ra mắt của OpenWallet.',
    },
    twitter: {
        title: 'Roadmap',
        description: 'Kế hoạch phát triển và những tính năng đã ra mắt của OpenWallet.',
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

    const doneCol = board.columns.find((c) => c.name === 'Done');
    const doneItems = [...(doneCol?.items ?? [])].sort((a, b) => {
        if (!a.shippedDate && !b.shippedDate) return 0;
        if (!a.shippedDate) return 1;
        if (!b.shippedDate) return -1;
        return b.shippedDate.localeCompare(a.shippedDate);
    });

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
            />

            {doneItems.length > 0 && (
                <div className="mt-16">
                    <h2 className="mb-8">Recently Shipped</h2>
                    <OwRoadmapChangelog items={doneItems}/>
                </div>
            )}
        </MarketingPageShell>
    );
}
