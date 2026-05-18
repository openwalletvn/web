import {ComponentType, SVGProps} from 'react';
import {cn} from '@/lib/utils';

interface BadgeNumberIconProps {
    iconPosition?: 'left' | 'right';
    color?: 'primary' | 'black';
    number: number | string;
    icon: ComponentType<SVGProps<SVGSVGElement> & {className?: string}>;
    text: string;
    className?: string;
}

export function BadgeNumberIcon({
    iconPosition = 'left',
    color = 'primary',
    number,
    icon: Icon,
    text,
    className,
}: BadgeNumberIconProps) {
    const iconEl = (
        <div className="w-14 aspect-square flex justify-center items-center bg-white rounded-full shrink-0">
            <Icon className="w-8 h-8"/>
        </div>
    );

    const textEl = (
        <div className={cn('flex flex-col text-white', iconPosition === 'left' ? 'pr-4' : 'pl-4')}>
            <span className="text-[40px] leading-none font-display">{number}</span>
            <span className="text-[12px] capitalize">{text}</span>
        </div>
    );

    return (
        <div className={cn(
            'badge-number-icon flex items-center gap-2 rounded-full p-2',
            color === 'primary' ? 'bg-primary' : 'bg-black',
            className,
        )}>
            {iconPosition === 'left' ? <>{iconEl}{textEl}</> : <>{textEl}{iconEl}</>}
        </div>
    );
}
