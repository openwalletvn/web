import type {Metadata} from 'next';
import {MDXRemote} from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {getAllChangelogs} from '@/lib/changelog';
import {slugify} from '@/lib/mdx';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {ChangelogToc} from './changelog-toc';
import {mdxComponents} from '@/components/blog/mdx-components';
import {remarkAutoLink} from '@/lib/remark-auto-link';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';

export const metadata: Metadata = {
    title: 'Changelog | OpenWallet',
    description: 'Những cập nhật mới nhất về tính năng, dữ liệu và cải tiến kỹ thuật của OpenWallet.',
    alternates: {canonical: '/changelog'},
    openGraph: {
        title: 'Changelog',
        description: 'Những cập nhật mới nhất về tính năng, dữ liệu và cải tiến kỹ thuật của OpenWallet.',
    },
    twitter: {
        title: 'Changelog',
        description: 'Những cập nhật mới nhất về tính năng, dữ liệu và cải tiến kỹ thuật của OpenWallet.',
    },
};

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'});
}

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
        <div className="px-4 py-12">
            <div className="max-w-container mx-auto">
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
                <Breadcrumbs items={breadcrumbItems}/>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">Changelog</h1>

                <div className="flex gap-10 items-start">
                    {/* ── Main content ── */}
                    <div className="flex-1 min-w-0">
                        {entries.map((entry, i) => {
                            const entryId = slugify(entry.title);
                            return (
                                <div key={entry.date}>
                                    {i > 0 && <div className="border-t border-dashed border-slate-200 my-12"/>}

                                    <div className="flex gap-8 lg:gap-12">
                                        {/* Date column — desktop only */}
                                        <div className="hidden lg:block w-28 shrink-0 pt-1 sticky top-[30px] self-start">
                                            <time
                                                dateTime={entry.date}
                                                className="text-sm font-mono text-slate-400"
                                            >
                                                {formatDate(entry.date)}
                                            </time>
                                        </div>

                                        {/* Content column */}
                                        <div className="flex-1 min-w-0">
                                            {/* Date — mobile only */}
                                            <time
                                                dateTime={entry.date}
                                                className="block lg:hidden text-sm font-mono text-slate-400 mb-2"
                                            >
                                                {formatDate(entry.date)}
                                            </time>

                                            <h2 id={entryId} className="text-xl font-bold text-slate-900 mb-4 group">
                                                <a
                                                    href={`#${entryId}`}
                                                    className="no-underline hover:underline"
                                                >
                                                    {entry.title}
                                                    <span className="opacity-0 group-hover:opacity-100 text-slate-300 ml-2 transition-opacity">#</span>
                                                </a>
                                            </h2>

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
            </div>
        </div>
    );
}
