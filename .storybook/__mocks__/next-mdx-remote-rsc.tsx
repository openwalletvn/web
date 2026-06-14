import React from 'react';

// Storybook mock for next-mdx-remote/rsc — renders source as plain text
export function MDXRemote({source}: {source: string}) {
    return <pre className="text-sm text-slate-600 whitespace-pre-wrap">{source}</pre>;
}
