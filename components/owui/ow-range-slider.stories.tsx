import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {useState} from 'react';
import {OwRangeSlider, type OwRangeSliderProps} from './ow-range-slider';

const meta: Meta<typeof OwRangeSlider> = {
    title: 'OW UI/OwRangeSlider',
    component: OwRangeSlider,
    parameters: {layout: 'padded'},
    tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof OwRangeSlider>;

function Controlled(args: OwRangeSliderProps) {
    const [value, setValue] = useState(args.value ?? 3);
    return (
        <div className="w-80 flex flex-col gap-4">
            <OwRangeSlider {...args} value={value} onChange={setValue}/>
            <p className="text-sm text-text-muted">Value: {value}</p>
        </div>
    );
}

export const Default: Story = {
    render: (args: OwRangeSliderProps) => <Controlled {...args}/>,
    args: {min: 0, max: 7, step: 1, value: 3},
};

export const Disabled: Story = {
    render: (args: OwRangeSliderProps) => <Controlled {...args}/>,
    args: {min: 0, max: 7, step: 1, value: 3, disabled: true},
};
