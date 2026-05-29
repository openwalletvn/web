import * as React from 'react';
import { cn } from '@/lib/utils';

type HeadingVariant = 'hero' | 'section' | 'display-md' | 'card-heading' | 'ui';
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: HeadingLevel;
    variant?: HeadingVariant;
}

const variantClass: Record<HeadingVariant, string> = {
    'hero':         'text-hero',
    'section':      'text-section',
    'display-md':   'text-display-md',
    'card-heading': 'text-card-heading',
    'ui':           'text-ui',
};

export function Heading({ as: Tag = 'h2', variant, className, ...props }: Props) {
    return (
        <Tag
            className={cn('ow-heading', variant ? variantClass[variant] : undefined, className)}
            {...props}
        />
    );
}
