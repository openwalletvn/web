import * as React from 'react';
import { cn } from '@/lib/utils';

type TextVariant = 'body-lg' | 'body-md' | 'body' | 'body-sm' | 'label';

interface Props extends React.HTMLAttributes<HTMLElement> {
    variant?: TextVariant;
    as?: 'p' | 'span' | 'div' | 'li';
}

const variantClass: Record<TextVariant, string> = {
    'body-lg': 'text-body-lg',
    'body-md': 'text-body-md',
    'body':    'text-body',
    'body-sm': 'text-body-sm',
    'label':   'text-label',
};

export function Text({ variant = 'body', as: Tag = 'p', className, ...props }: Props) {
    const Component = Tag as 'p';
    return (
        <Component
            className={cn('ow-text', variantClass[variant], className)}
            {...props}
        />
    );
}
