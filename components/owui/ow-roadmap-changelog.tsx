import {MDXRemote} from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {mdxComponents} from '@/components/blog/mdx-components';
import {remarkAutoLink} from '@/lib/remark-auto-link';
import {fmtIsoDate} from '@/lib/utils';
import type {GithubProjectItem} from '@/lib/github-project';

const PROSE_CLS = 'prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-code:text-brand-red prose-code:before:content-none prose-code:after:content-none prose-li:text-slate-700 prose-hr:border-dashed prose-hr:border-slate-200 prose-table:text-sm prose-th:text-slate-700 prose-th:bg-slate-50 prose-td:text-slate-600';

export function OwRoadmapChangelog({items}: {items: GithubProjectItem[]}) {
    const entries = items.filter((item) => item.shippedDate);

    return (
        <div>
            {entries.map((item, i) => (
                <div key={item.id}>
                    {i > 0 && <div className="border-t border-dashed border-slate-200 md:my-12 my-6"/>}

                    <div className="flex gap-8 lg:gap-12">
                        {/* Date column - desktop */}
                        <div className="hidden lg:block w-28 shrink-0 pt-1 sticky top-[30px] self-start">
                            <time dateTime={item.shippedDate!} className="text-sm font-mono text-slate-400">
                                {fmtIsoDate(item.shippedDate!)}
                            </time>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {/* Date - mobile */}
                            <time dateTime={item.shippedDate!} className="block lg:hidden text-sm font-mono text-slate-400 mb-2">
                                {fmtIsoDate(item.shippedDate!)}
                            </time>

                            <h4 className="mb-4">{item.title}</h4>

                            {item.body && (
                                <article className={PROSE_CLS}>
                                    <MDXRemote
                                        source={item.body}
                                        components={mdxComponents}
                                        options={{mdxOptions: {remarkPlugins: [remarkGfm, remarkAutoLink]}}}
                                    />
                                </article>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
