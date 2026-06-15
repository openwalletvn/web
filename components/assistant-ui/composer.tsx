import {ModelSelector} from "@/components/assistant-ui/model-selector";
import {CHAT_MODELS, getDefaultModel, getVisibleModels} from "@/lib/chat/models";
import {useUserStore} from "@/lib/stores/user-store";
import {getChatPrefs, setChatPref} from "@/lib/chat/chat-prefs";
import {ContextDisplay} from "@/components/assistant-ui/context-display";
import {MovingBorder} from "@/components/phucbm/moving-border";
import {OwTooltipIconButton} from "@/components/owui/ow-tooltip-icon-button";
import {Button} from "@/components/ui/button";
import {AuiIf, ComposerPrimitive, useAuiState} from "@assistant-ui/react";
import {ArrowUpIcon, SquareIcon} from "lucide-react";
import {type FC, useEffect, useRef, useState} from "react";
import {getContextPlaceholders, type PageContext} from "@/lib/chat/page-context";

type HealthState = { ready: boolean; mcp: boolean; api: boolean; model?: string } | null;

function useApiReady(): HealthState {
    const [health, setHealth] = useState<HealthState>(null);
    useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch('/api/health');
                const data = await res.json() as { ready: boolean; mcp: boolean; api: boolean };
                setHealth(data);
            } catch {
                setHealth({ready: false, mcp: false, api: false});
            }
        };
        check();
        const id = setInterval(check, 30_000);
        return () => clearInterval(id);
    }, []);
    return health;
}

function useContextPlaceholder(pageContext: PageContext | undefined, isRunning: boolean, hasInputValue: boolean) {
    const [currentPlaceholder, setCurrentPlaceholder] = useState('');
    const placeholdersRef = useRef<string[]>([]);
    const indexRef = useRef(0);
    const hasInputValueRef = useRef(hasInputValue);

    useEffect(() => {
        hasInputValueRef.current = hasInputValue;
    }, [hasInputValue]);

    useEffect(() => {
        const placeholders = getContextPlaceholders(pageContext ?? null);
        placeholdersRef.current = placeholders;

        indexRef.current = Math.floor(Math.random() * placeholders.length);
        setCurrentPlaceholder(placeholders[indexRef.current]);

        if (isRunning) return;

        const interval = setInterval(() => {
            if (hasInputValueRef.current) return;
            indexRef.current = (indexRef.current + 1) % placeholders.length;
            setCurrentPlaceholder(placeholders[indexRef.current]);
        }, 8000);

        return () => clearInterval(interval);
    }, [pageContext, isRunning]);

    return currentPlaceholder;
}

const ComposerAction: FC<{
    health: HealthState;
    selectedModelId: string;
    onModelChange: (id: string) => void;
    contextWindow: number;
}> = ({health, selectedModelId, onModelChange, contextWindow}) => {
    const notReady = health !== null && !health.ready;
    const unavailableLabel = health && !health.mcp ? "MCP unavailable" : "API unavailable";
    const canUsePaidModel = useUserStore((s) => s.canUsePaidModel);
    const isOutOfCredits = useUserStore((s) => s.isOutOfCredits);
    const paidModelDisabled = !canUsePaidModel || isOutOfCredits;
    const visibleModels = getVisibleModels().map((m) => ({
        id: m.id,
        name: m.label,
        disabled: m.paid ? paidModelDisabled : false,
        description: m.paid && paidModelDisabled ? 'Hết credit' : undefined,
    }));
    const defaultModelId = getDefaultModel().id;
    return (
        <div className="ow-composer-action-wrapper relative flex justify-between items-center gap-1">
            <div
                className="flex justify-between items-center gap-1 is-thread-running:pointer-events-none is-thread-running:opacity-60">
                <div className="ow-model-selector">
                    <ModelSelector
                        models={visibleModels}
                        value={selectedModelId}
                        onValueChange={onModelChange}
                        defaultValue={defaultModelId}
                        size="sm"
                        variant="ghost"
                    />
                </div>
                <ContextDisplay.Ring modelContextWindow={contextWindow}/>
            </div>
            <div className="ow-send-message-wrapper ml-auto flex items-center gap-2">
                {notReady && (
                    <span className="text-xs text-destructive">{unavailableLabel}</span>
                )}
                <AuiIf condition={(s) => !s.thread.isRunning}>
                    <ComposerPrimitive.Send asChild disabled={notReady}>
                        <OwTooltipIconButton
                            tooltip={notReady ? unavailableLabel : "Send message"}
                            type="button"
                            variant="default"
                            size="icon"
                            className="aui-composer-send size-8 rounded-full"
                            aria-label="Send message"
                            disabled={notReady}
                        >
                            <ArrowUpIcon className="aui-composer-send-icon size-4"/>
                        </OwTooltipIconButton>
                    </ComposerPrimitive.Send>
                </AuiIf>
                <AuiIf condition={(s) => s.thread.isRunning}>
                    <ComposerPrimitive.Cancel asChild>
                        <Button
                            type="button"
                            variant="default"
                            size="icon"
                            className="aui-composer-cancel size-8 rounded-full"
                            aria-label="Stop generating"
                        >
                            <SquareIcon className="aui-composer-cancel-icon size-3 fill-current"/>
                        </Button>
                    </ComposerPrimitive.Cancel>
                </AuiIf>
            </div>
        </div>
    );
};

export const Composer: FC<{ pageContext?: PageContext }> = ({pageContext}) => {
    const health = useApiReady();
    const defaultModelId = getDefaultModel().id;
    const [selectedModelId, setSelectedModelId] = useState(() => {
        if (typeof window === 'undefined') return defaultModelId;
        return getChatPrefs().modelId ?? defaultModelId;
    });
    const canUsePaidModel = useUserStore((s) => s.canUsePaidModel);
    const isOutOfCredits = useUserStore((s) => s.isOutOfCredits);
    const contextWindow = CHAT_MODELS.find((m) => m.id === selectedModelId)?.contextWindow ?? 128_000;
    const isRunning = useAuiState((s) => s.thread.isRunning);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [hasInputValue, setHasInputValue] = useState(false);

    // If selected paid model becomes unavailable, fall back to default
    useEffect(() => {
        const model = CHAT_MODELS.find((m) => m.id === selectedModelId);
        if (model?.paid && (!canUsePaidModel || isOutOfCredits)) {
            setSelectedModelId(defaultModelId);
        }
    }, [canUsePaidModel, isOutOfCredits, selectedModelId, defaultModelId]);

    useEffect(() => {
        setChatPref('modelId', selectedModelId);
    }, [selectedModelId]);

    const currentPlaceholder = useContextPlaceholder(pageContext, isRunning, hasInputValue);

    const composerShell = (
        <div
            data-slot="aui_composer-shell"
            className="ow-composer-root flex w-full flex-col gap-2 rounded-(--composer-radius) border bg-background p-(--composer-padding) transition-shadow focus-within:border-ring/75 focus-within:ring-2 focus-within:ring-ring/20"
        >
            <ComposerPrimitive.Input
                ref={inputRef}
                placeholder={currentPlaceholder}
                className="aui-composer-input ow-message-input disabled:cursor-not-allowed disabled:opacity-50 max-h-32 min-h-10 w-full resize-none bg-transparent px-1.75 py-1 text-body outline-none placeholder:text-muted-foreground/80 text-black"
                rows={1}
                autoFocus
                aria-label="Message input"
                disabled={isRunning}
                onChange={(e) => setHasInputValue(e.target.value.trim() !== '')}
            />
            <ComposerAction health={health} selectedModelId={selectedModelId} onModelChange={setSelectedModelId}
                            contextWindow={contextWindow}/>
        </div>
    );

    return (
        <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col mb-3">
            {isRunning ? (
                <MovingBorder
                    borderWidth={1}
                    gradientWidth={400}
                    radius={12}
                    duration={2}
                    colors={["#ef3c23", "#4486ff", "#ef3c23"]}
                    innerBg="bg-transparent"
                >
                    {composerShell}
                </MovingBorder>
            ) : (
                composerShell
            )}
            {health?.model && (
                <p className="aui-composer-model mt-1.5 text-center text-xs text-muted-foreground/50">
                    {health.model}
                </p>
            )}
        </ComposerPrimitive.Root>
    );
};
