'use client';

import {Slider} from 'radix-ui';
import {cn} from '@/lib/utils';
import {OwLogo} from '@/components/ow-ui/ow-logo';

export interface OwRangeSliderProps {
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    className?: string;
}

export function OwRangeSlider({min = 0, max = 100, step = 1, value, onChange, disabled, className}: OwRangeSliderProps) {
    return (
        <Slider.Root
            className={cn('ow-range-slider relative flex items-center w-full h-5 select-none touch-none', className)}
            min={min}
            max={max}
            step={step}
            value={[value]}
            onValueChange={([v]) => onChange(v)}
            disabled={disabled}
        >
            <Slider.Track className="relative grow h-[6px] rounded-full bg-border">
                <Slider.Range className="absolute h-full rounded-full bg-primary"/>
            </Slider.Track>
            <Slider.Thumb
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary shadow-sm outline-none cursor-grab active:cursor-grabbing hover:bg-primary/90 hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all duration-150"
                aria-label="Chi tiêu hàng tháng"
            >
                <OwLogo variant="icon" href={null} className="w-5 h-5 [&_img]:brightness-0 [&_img]:invert"/>
            </Slider.Thumb>
        </Slider.Root>
    );
}
