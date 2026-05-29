import * as React from 'react';
import { cn } from '@/lib/utils';

type Direction = 'row' | 'col';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type Gap = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

interface Props extends React.ComponentProps<'div'> {
    direction?: Direction;
    align?: Align;
    justify?: Justify;
    gap?: Gap;
    wrap?: boolean;
    as?: React.ElementType;
}

const gapClass: Record<Gap, string> = {
    1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4',
    5: 'gap-5', 6: 'gap-6', 8: 'gap-8', 10: 'gap-10', 12: 'gap-12',
};

export function Stack({
    direction = 'col',
    align,
    justify,
    gap = 4,
    wrap = false,
    as: Tag = 'div',
    className,
    ...props
}: Props) {
    return (
        <Tag
            className={cn(
                'ow-stack flex',
                direction === 'row' ? 'flex-row' : 'flex-col',
                align && `items-${align}`,
                justify && `justify-${justify}`,
                gapClass[gap],
                wrap && 'flex-wrap',
                className,
            )}
            {...props}
        />
    );
}
