import {OwLogo} from "@/components/ow-ui/ow-logo";
import type {FC} from "react";

export const OwTypingBubble: FC<{ visible?: boolean }> = ({visible = true}) => {
    if (!visible) return null;
    return (
        <div className="ow-typing-bubble flex items-center gap-2 py-2">
            <style>{`
                @keyframes bounce-flip {
                    0% { transform: translateY(0) rotateZ(0deg); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    50% { transform: translateY(-25%) rotateZ(180deg); animation-timing-function: cubic-bezier(0,0,0.2,1); }
                    100% { transform: translateY(0) rotateZ(360deg); }
                }
                .ow-bounce-flip { animation: bounce-flip 1s infinite; }
            `}</style>
            <OwLogo variant="full" color="red" href={null} className="h-5 w-auto ow-bounce-flip"/>
        </div>
    );
};
