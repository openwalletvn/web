import {ComponentType, SVGProps} from 'react';
import {cn} from '@/lib/utils';

interface OwBadgeNumberIconProps {
    iconPosition?: 'left' | 'right';
    color?: 'primary' | 'black';
    size?: 'default' | 'sm';
    number: number | string;
    icon: ComponentType<SVGProps<SVGSVGElement> & {className?: string}>;
    text: string;
    className?: string;
}

export function OwBadgeNumberIcon({
    iconPosition = 'left',
    color = 'primary',
    size = 'default',
    number,
    icon: Icon,
    text,
    className,
}: OwBadgeNumberIconProps) {
    const sm = size === 'sm';

    const iconEl = (
        <div className={cn(
            'aspect-square flex justify-center items-center bg-white rounded-full shrink-0',
            sm ? 'w-8' : 'w-14',
        )}>
            <Icon className={sm ? 'w-4 h-4' : 'w-6 h-6'}/>
        </div>
    );

    const textEl = (
        <div className={cn('flex flex-col text-white', iconPosition === 'left' ? 'pr-4' : 'pl-4')}>
            <span className={cn('leading-none font-display', sm ? 'text-[22px]' : 'text-[40px]')}>{number}</span>
            <span className={cn('capitalize', sm ? 'text-[10px]' : 'text-[12px]')}>{text}</span>
        </div>
    );

    return (
        <div className={cn(
            'ow-badge-number-icon inline-flex items-center gap-2 rounded-full',
            sm ? 'p-1.5' : 'p-2',
            color === 'primary' ? 'bg-primary' : 'bg-black',
            className,
        )}>
            {iconPosition === 'left' ? <>{iconEl}{textEl}</> : <>{textEl}{iconEl}</>}
        </div>
    );
}
