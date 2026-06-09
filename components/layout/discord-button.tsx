import {IconBrandDiscord} from '@tabler/icons-react';
import {OwButtonHeader} from '@/components/ow-ui/ow-button-header';

interface DiscordButtonProps {
    iconOnly?: boolean;
}

export function DiscordButton({iconOnly}: DiscordButtonProps) {
    if (iconOnly) {
        return (
            <a
                href="https://discord.gg/bsnHax5BYZ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="p-2 text-slate-600 hover:text-slate-900"
            >
                <IconBrandDiscord className="w-5 h-5" aria-hidden="true"/>
            </a>
        );
    }

    return (
        <OwButtonHeader
            href="https://discord.gg/bsnHax5BYZ"
            target="_blank"
            rel="noopener noreferrer"
            icon={<IconBrandDiscord className="size-6 shrink-0"/>}
        >
            Discord
        </OwButtonHeader>
    );
}
