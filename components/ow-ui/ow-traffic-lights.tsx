import * as React from 'react';
import {cn} from '@/lib/utils';
import {OwTooltip} from '@/components/ow-ui/ow-tooltip';

export type TrafficLightButton = {
    id: string;
    color: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    label?: string;
};

const DEFAULT_BUTTONS: TrafficLightButton[] = [
    {id: 'close', color: '#ff5f57', label: 'Close'},
    {id: 'minimize', color: '#febc2e', label: 'Minimize'},
    {id: 'maximize', color: '#28c840', label: 'Maximize'},
];

export type OwTrafficLightsProps = {
    buttons?: TrafficLightButton[];
    buttonClass?: string;
    className?: string;
};

export function OwTrafficLights({
                                    buttons = DEFAULT_BUTTONS,
                                    buttonClass,
                                    className,
                                }: OwTrafficLightsProps) {
    return (
        <div className={cn('ow-traffic-lights group flex items-center gap-2', className)}>
            {buttons.map((btn) => (
                <OwTooltip key={btn.id} tooltip={btn.label ?? btn.id}>
                    <button
                        onClick={btn.onClick}
                        disabled={btn.disabled}
                        aria-label={btn.label ?? btn.id}
                        className={cn(
                            'relative flex items-center justify-center rounded-full size-4 p-1',
                            'transition-all hover:scale-125 duration-200',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            'disabled:opacity-30 disabled:pointer-events-none',
                            'before:content-[""] before:absolute before:-inset-1 before:rounded-full',
                            btn.onClick ? 'cursor-pointer' : 'cursor-default',
                            buttonClass,
                        )}
                        style={{backgroundColor: btn.color}}
                    >
                        {btn.icon && (
                            <span
                                className="absolute inset-0 flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
                                style={{color: 'rgba(0,0,0,0.5)'}}
                            >
                                {btn.icon}
                            </span>
                        )}
                    </button>
                </OwTooltip>
            ))}
        </div>
    );
}
