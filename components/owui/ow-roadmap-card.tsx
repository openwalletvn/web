import {IconCircleCheckFilled} from '@tabler/icons-react';
import type {GithubProjectItem} from '@/lib/github-project';
import {OwBadge} from './ow-badge';

function formatShippedDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'});
}

function hexToRgb(hex: string): string {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}

export function OwRoadmapCard({item}: {item: GithubProjectItem}) {
    const Wrapper = item.url ? 'a' : 'div';
    const wrapperProps = item.url
        ? {href: item.url, target: '_blank', rel: 'noopener noreferrer'}
        : {};

    return (
        <Wrapper
            {...wrapperProps}
            className="block bg-white border border-border rounded-lg p-4 hover:border-border-mid transition-colors group no-underline"
        >
            <p className="text-sm font-medium text-text-primary leading-snug group-hover:text-text-accent transition-colors">
                {item.title}
            </p>

            {(item.shippedDate || item.labels.length > 0) && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.shippedDate && (
                        <OwBadge small colorHex="#2da44e">
                            <IconCircleCheckFilled size={12}/> {formatShippedDate(item.shippedDate)}
                        </OwBadge>
                    )}
                    {item.labels.map((label) => {
                        const hex = label.color.startsWith('#') ? label.color : `#${label.color}`;
                        return (
                            <span
                                key={label.name}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: `rgba(${hexToRgb(hex)}, 0.12)`,
                                    color: hex,
                                }}
                            >
                                {label.name}
                            </span>
                        );
                    })}
                </div>
            )}
        </Wrapper>
    );
}
