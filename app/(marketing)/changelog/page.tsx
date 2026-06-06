import type {Metadata} from 'next';
import {MDXRemote} from 'next-mdx-remote/rsc';
import {ROUTES} from '@/lib/routes';
import remarkGfm from 'remark-gfm';
import {getAllChangelogs} from '@/lib/changelog';
import {slugify} from '@/lib/mdx';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {ChangelogToc} from './changelog-toc';
import {mdxComponents} from '@/components/blog/mdx-components';
import {remarkAutoLink} from '@/lib/remark-auto-link';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';
import {buildTitle} from '@/lib/page-meta/title';
import {fmtIsoDate} from '@/lib/utils';

export const metadata: Metadata = {
    title: buildTitle('Changelog'),
    description: 'Những cập nhật mới nhất về tính năng, dữ liệu và cải tiến kỹ thuật của OpenWallet.',
    alternates: {canonical: ROUTES.changelog},
    openGraph: {
        title: 'Changelog',
        description: 'Những cập nhật mới nhất về tính năng, dữ liệu và cải tiến kỹ thuật của OpenWallet.',
    },
    twitter: {
        title: 'Changelog',
        description: 'Những cập nhật mới nhất về tính năng, dữ liệu và cải tiến kỹ thuật của OpenWallet.',
    },
};


export default function ChangelogPage() {
    const entries = getAllChangelogs();

    const breadcrumbItems = [
        {label: 'Trang chủ', href: '/'},
        {label: 'Changelog'},
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            buildBreadcrumbJsonLd(breadcrumbItems),
        ],
    };

    const tocItems = entries.map((entry) => ({
        id: slugify(entry.title),
        title: entry.title,
        date: entry.date,
    }));

    return (
        <MarketingPageShell title="Changelog" breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <div className="flex md:gap-10 gap-6 items-start mt-8">
                {/* ── Main content ── */}
                <div className="flex-1 min-w-0">
                    {entries.map((entry, i) => {
                        const entryId = slugify(entry.title);
                        return (
                            <div key={entry.date}>
                                {i > 0 && <div className="border-t border-dashed border-slate-200 md:my-12 my-6"/>}

                                <div className="flex gap-8 lg:gap-12">
                                    {/* Date column - desktop only */}
                                    <div className="hidden lg:block w-28 shrink-0 pt-1 sticky top-[30px] self-start">
                                        <time
                                            dateTime={entry.date}
                                            className="text-sm font-mono text-slate-400"
                                        >
                                            {fmtIsoDate(entry.date)}
                                        </time>
                                    </div>

                                    {/* Content column */}
                                    <div className="flex-1 min-w-0">
                                        {/* Date - mobile only */}
                                        <time
                                            dateTime={entry.date}
                                            className="block lg:hidden text-sm font-mono text-slate-400 mb-2"
                                        >
                                            {fmtIsoDate(entry.date)}
                                        </time>

                                        <h4 id={entryId} className="mb-4 group">
                                            <a
                                                href={`#${entryId}`}
                                                className="no-underline hover:underline"
                                            >
                                                {entry.title}
                                                <span className="opacity-0 group-hover:opacity-100 text-slate-300 ml-2 transition-opacity">#</span>
                                            </a>
                                        </h4>

                                        <article
                                            className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-code:text-brand-red prose-code:before:content-none prose-code:after:content-none prose-li:text-slate-700 prose-hr:border-dashed prose-hr:border-slate-200 prose-table:text-sm prose-th:text-slate-700 prose-th:bg-slate-50 prose-td:text-slate-600">
                                            <MDXRemote
                                                source={entry.content}
                                                components={mdxComponents}
                                                options={{mdxOptions: {remarkPlugins: [remarkGfm, remarkAutoLink]}}}
                                            />
                                        </article>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Sidebar ── */}
                <aside className="w-72 shrink-0 hidden lg:flex flex-col sticky top-[30px] self-start">
                    <ChangelogToc items={tocItems}/>
                </aside>
            </div>
        </MarketingPageShell>
    );
}
