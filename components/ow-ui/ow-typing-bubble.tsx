import {OwLogo} from "@/components/ow-ui/ow-logo";
import {useAuiState} from "@assistant-ui/react";
import type {FC} from "react";

export const OwTypingBubble: FC = () => {
    const isRunning = useAuiState((s) => s.message.status?.type === "running");
    const hasText = useAuiState((s) => s.message.parts.some((p) => p.type === "text" && "text" in p && !!(p as {text: string}).text));
    if (!isRunning || hasText) return null;
    return (
        <div className="ow-typing-bubble flex items-center gap-2 px-2 py-1">
            <OwLogo variant="full" color="red" href={null} className="h-5 w-auto animate-bounce"/>
            <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]"/>
            <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]"/>
            <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]"/>
        </div>
    );
};
