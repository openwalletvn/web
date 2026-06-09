import {OwLogo} from "@/components/ow-ui/ow-logo";
import type {FC} from "react";

export const OwTypingBubble: FC<{ visible?: boolean }> = ({visible = true}) => {
    if (!visible) return null;
    return (
        <div className="ow-typing-bubble flex items-center gap-2 py-2">
            <style>{`
                @keyframes box-flip {
                    0%   { transform: translateY(0)    rotateZ(0deg);   }
                    10%  { transform: translateY(0)    rotateZ(0deg);   animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    32%  { transform: translateY(-40%) rotateZ(90deg);  animation-timing-function: cubic-bezier(0,0,0.2,1); }
                    55%  { transform: translateY(0)    rotateZ(180deg); }
                    65%  { transform: translateY(0)    rotateZ(180deg); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    87%  { transform: translateY(-40%) rotateZ(270deg); animation-timing-function: cubic-bezier(0,0,0.2,1); }
                    100% { transform: translateY(0)    rotateZ(360deg); }
                }
                .ow-box-flip { animation: box-flip 2s infinite; }
            `}</style>
            <OwLogo variant="full" color="red" href={null} className="h-5 w-5 ow-box-flip"/>
        </div>
    );
};
