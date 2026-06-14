import React from 'react';

// Storybook mock — renders markdown source as plain text (no Node deps)
export function MDXRemote({source}: {source: string}) {
    return <pre className="text-sm text-slate-600 whitespace-pre-wrap">{source}</pre>;
}
