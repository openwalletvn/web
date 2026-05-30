import {ReactNode} from 'react';

interface OwStorySectionProps {
    title?: string;
    children: ReactNode;
}

export function OwStorySection({title, children}: OwStorySectionProps) {
    return (
        <div className="ow-story-section space-y-2">
            {title && <div className="font-display text-muted-foreground">{title}</div>}
            {children}
        </div>
    );
}

interface OwStoriesProps {
    children: ReactNode;
}

export function OwStories({children}: OwStoriesProps) {
    return (
        <div className="ow-stories space-y-6">
            {children}
        </div>
    );
}
