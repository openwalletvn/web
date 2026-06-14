import React from 'react';

// Storybook mock for next-mdx-remote/rsc (RSC-only, can't run in Vite/client)
// Renders markdown source as styled plain text for visual preview
export function MDXRemote({source}: {source: string}) {
    return (
        <div className="text-sm text-slate-600 whitespace-pre-wrap font-mono bg-slate-50 rounded p-3 border border-slate-200">
            {source}
        </div>
    );
}
