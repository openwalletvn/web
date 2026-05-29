import * as React from 'react';
import { cn } from '@/lib/utils';

type HeadingVariant = '1' | '2' | '3' | '4' | '5' | '6';
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: HeadingLevel;
    variant?: HeadingVariant;
}

const variantClass: Record<HeadingVariant, string> = {
    '1': 'heading-1',
    '2': 'heading-2',
    '3': 'heading-3',
    '4': 'heading-4',
    '5': 'heading-5',
    '6': 'heading-6',
};

export function Heading({ as: Tag = 'h2', variant, className, ...props }: Props) {
    return (
        <Tag
            className={cn('ow-heading', variant ? variantClass[variant] : undefined, className)}
            {...props}
        />
    );
}
