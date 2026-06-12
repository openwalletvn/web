import {IconExternalLink} from '@tabler/icons-react';

export interface OwSource {
    url: string;
    label?: string;
}

interface Props {
    sources?: OwSource[];
}

function urlFallbackLabel(url: string): string {
    try {
        const u = new URL(url);
        return u.hostname + (u.pathname !== '/' ? u.pathname : '');
    } catch {
        return url;
    }
}

export function OwSourceList({sources}: Props) {
    if (!sources || sources.length === 0) return null;

    return (
        <ol className="flex flex-col gap-3">
            {sources.map((src, i) => (
                <li key={i} className="flex gap-2 text-sm">
                    <span className="text-slate-400 shrink-0 tabular-nums">{i + 1}.</span>
                    <div className="flex flex-col gap-0.5">
                        <div className="flex flex-wrap items-center gap-1">
                            <a
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-link inline-flex items-center gap-1"
                            >
                                {src.label || urlFallbackLabel(src.url)}
                            </a>
                            {src.url.toLowerCase().endsWith('.pdf') && (
                                <span
                                    className="text-xs font-semibold tracking-wide inline-block text-red-500 border border-red-300 rounded px-1 py-0.5 leading-none">PDF</span>
                            )}
                            <IconExternalLink className="w-4 h-4"/>
                        </div>
                        {src.label && (
                            <span
                                className="text-xs text-slate-400 line-clamp-2 break-all">{urlFallbackLabel(src.url)}</span>
                        )}
                    </div>
                </li>
            ))}
        </ol>
    );
}
