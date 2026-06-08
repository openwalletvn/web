import {MarkdownText} from "@/components/assistant-ui/markdown-text";
import {OwLogo} from "@/components/ow-ui/ow-logo";
import {ModelSelector} from "@/components/assistant-ui/model-selector";
import {CHAT_MODELS, getDefaultModel, getVisibleModels} from "@/lib/chat/models";
import {ContextDisplay} from "@/components/assistant-ui/context-display";
import {MovingBorder} from "@/components/phucbm/moving-border";
import {
    Reasoning,
    ReasoningContent,
    ReasoningRoot,
    ReasoningText,
    ReasoningTrigger,
} from "@/components/assistant-ui/reasoning";
import {ToolGroupContent, ToolGroupRoot, ToolGroupTrigger,} from "@/components/assistant-ui/tool-group";
import {ToolFallback} from "@/components/assistant-ui/tool-fallback";
import {TooltipIconButton} from "@/components/assistant-ui/tooltip-icon-button";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useChatContext} from "@/components/chat/chat-provider";
import {
    ActionBarMorePrimitive,
    ActionBarPrimitive,
    AuiIf,
    BranchPickerPrimitive,
    ComposerPrimitive,
    ErrorPrimitive,
    getMcpAppFromToolPart,
    MessagePrimitive,
    ThreadPrimitive,
    useAuiState,
} from "@assistant-ui/react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CopyIcon,
    DownloadIcon,
    MoreHorizontalIcon,
    PencilIcon,
    RefreshCwIcon,
    SquareIcon,
} from "lucide-react";
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

export const Thread: FC = () => {
    const {setThreadRunning, pageContext} = useChatContext();
    const isRunning = useAuiState((s) => s.thread.isRunning);

    useEffect(() => {
        setThreadRunning(isRunning);
    }, [isRunning, setThreadRunning]);

    return (
        <ThreadPrimitive.Root
            className="aui-root aui-thread-root @container flex h-full flex-col bg-background"
            style={{
                ["--thread-max-width" as string]: "44rem",
                ["--composer-radius" as string]: "12px",
                ["--composer-padding" as string]: "10px",
            }}
        >
            <ThreadPrimitive.Viewport
                turnAnchor="top"
                data-slot="aui_thread-viewport"
                className="ow-thread-viewport ow-custom-scrollbar relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth"
            >
                <div
                    className="ow-thread-viewport-inner mx-auto flex w-full h-full max-w-(--thread-max-width) flex-1 flex-col px-3 pt-3">
                    <AuiIf condition={(s) => s.thread.isEmpty}>
                        <ThreadWelcome/>
                    </AuiIf>

                    <div
                        data-slot="aui_message-group"
                        className="mb-10 flex flex-col gap-y-8 empty:hidden"
                    >
                        <ThreadPrimitive.Messages>
                            {() => <ThreadMessage/>}
                        </ThreadPrimitive.Messages>
                    </div>

                    <ThreadPrimitive.ViewportFooter
                        className="aui-thread-viewport-footer sticky bottom-0 mt-auto flex flex-col gap-4 overflow-visible rounded-t-(--composer-radius) bg-background">
                        <ThreadScrollToBottom/>
                        <Composer pageContext={pageContext}/>
                    </ThreadPrimitive.ViewportFooter>
                </div>
            </ThreadPrimitive.Viewport>
        </ThreadPrimitive.Root>
    );
};

const ThreadMessage: FC = () => {
    const role = useAuiState((s) => s.message.role);
    const isEditing = useAuiState((s) => s.message.composer.isEditing);

    if (isEditing) return <EditComposer/>;
    if (role === "user") return <UserMessage/>;
    return <AssistantMessage/>;
};

const ThreadScrollToBottom: FC = () => {
    return (
        <ThreadPrimitive.ScrollToBottom asChild>
            <TooltipIconButton
                tooltip="Scroll to bottom"
                variant="outline"
                className="aui-thread-scroll-to-bottom absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible dark:border-border dark:bg-background dark:hover:bg-accent"
            >
                <ArrowDownIcon/>
            </TooltipIconButton>
        </ThreadPrimitive.ScrollToBottom>
    );
};

const ThreadWelcome: FC = () => {
    return (
        <div className="aui-thread-welcome-root my-auto flex grow flex-col">
            <div className="aui-thread-welcome-center flex w-full grow flex-col items-center justify-center">
                <div className="aui-thread-welcome-message flex size-full flex-col justify-center">
                    <h1 className="aui-thread-welcome-message-inner heading-1 fade-in slide-in-from-bottom-1 animate-in fill-mode-both font-semibold text-2xl duration-200">
                        Chào bạn,
                    </h1>
                    <p className="aui-thread-welcome-message-inner pt-1 fade-in slide-in-from-bottom-1 animate-in fill-mode-both text-muted-foreground text-xl delay-75 duration-200">
                        Owie là trợ lý ảo giải đáp những câu hỏi về thẻ.
                    </p>
                </div>
            </div>
            <ThreadSuggestions/>
        </div>
    );
};

const SUGGESTIONS = [
    {
        title: 'Đi siêu thị 5tr/tháng nên mở thẻ nào?',
        prompt: 'Mỗi tháng đi siêu thị 5 triệu thì nên mở thẻ nào?',
    },
    {
        title: 'Thẻ ghi nợ nào có ưu đãi hoàn tiền?',
        prompt: 'Thẻ ghi nợ nào có ưu đãi hoàn tiền?',
    },
    {
        title: 'Mua vé máy bay, khách sạn thường xuyên thì nên mở thẻ nào?',
        prompt: 'Mua vé máy bay, khách sạn thường xuyên thì nên mở thẻ nào?',
    },
];

const ThreadSuggestions: FC = () => {
    return (
        <div className="aui-thread-welcome-suggestions grid w-full gap-2 pb-3">
            {SUGGESTIONS.map((s) => (
                <div
                    key={s.title}
                    className="aui-thread-welcome-suggestion-display fade-in slide-in-from-bottom-2 @md:nth-[n+3]:block nth-[n+3]:hidden animate-in fill-mode-both duration-200"
                >
                    <ThreadPrimitive.Suggestion prompt={s.prompt} autoSend asChild>
                        <Button
                            variant="ghost"
                            className="aui-thread-welcome-suggestion h-auto w-full @md:flex-col flex-wrap items-start justify-start gap-1 rounded-2xl border bg-background px-3 py-2 text-start text-sm transition-colors hover:bg-muted whitespace-normal"
                        >
                            <span className="aui-thread-welcome-suggestion-text-1 font-medium">{s.title}</span>
                        </Button>
                    </ThreadPrimitive.Suggestion>
                </div>
            ))}
        </div>
    );
};

/**
 * Hook for rotating context-aware placeholders
 */
function useContextPlaceholder(pageContext: PageContext | undefined, isRunning: boolean, hasInputValue: boolean) {
    const [currentPlaceholder, setCurrentPlaceholder] = useState('');
    const placeholdersRef = useRef<string[]>([]);
    const indexRef = useRef(0);
    const hasInputValueRef = useRef(hasInputValue);

    useEffect(() => {
        hasInputValueRef.current = hasInputValue;
    }, [hasInputValue]);

    // Initialize and rotate placeholders
    useEffect(() => {
        const placeholders = getContextPlaceholders(pageContext ?? null);
        placeholdersRef.current = placeholders;

        // Pick random initial index
        indexRef.current = Math.floor(Math.random() * placeholders.length);
        setCurrentPlaceholder(placeholders[indexRef.current]);

        if (isRunning) return;

        // Rotate every 8 seconds
        const interval = setInterval(() => {
            if (hasInputValueRef.current) return; // Stop rotation if input has value
            indexRef.current = (indexRef.current + 1) % placeholders.length;
            setCurrentPlaceholder(placeholders[indexRef.current]);
        }, 8000);

        return () => clearInterval(interval);
    }, [pageContext, isRunning]);

    return currentPlaceholder;
}

const Composer: FC<{ pageContext?: PageContext }> = ({pageContext}) => {
    const health = useApiReady();
    const defaultModelId = getDefaultModel().id;
    const [selectedModelId, setSelectedModelId] = useState(() => {
        if (typeof window === 'undefined') return defaultModelId;
        return localStorage.getItem('ow-chat-model') ?? defaultModelId;
    });
    const contextWindow = CHAT_MODELS.find((m) => m.id === selectedModelId)?.contextWindow ?? 128_000;
    const isRunning = useAuiState((s) => s.thread.isRunning);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [hasInputValue, setHasInputValue] = useState(false);

    useEffect(() => {
        localStorage.setItem('ow-chat-model', selectedModelId);
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

const ComposerAction: FC<{
    health: HealthState;
    selectedModelId: string;
    onModelChange: (id: string) => void;
    contextWindow: number
}> = ({health, selectedModelId, onModelChange, contextWindow}) => {
    const notReady = health !== null && !health.ready;
    const unavailableLabel = health && !health.mcp ? "MCP unavailable" : "API unavailable";
    const visibleModels = getVisibleModels().map((m) => ({id: m.id, name: m.label}));
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
                        <TooltipIconButton
                            tooltip={notReady ? unavailableLabel : "Send message"}
                            side="bottom"
                            type="button"
                            variant="default"
                            size="icon"
                            className="aui-composer-send size-8 rounded-full"
                            aria-label="Send message"
                            disabled={notReady}
                        >
                            <ArrowUpIcon className="aui-composer-send-icon size-4"/>
                        </TooltipIconButton>
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

const MessageError: FC = () => {
    return (
        <MessagePrimitive.Error>
            <ErrorPrimitive.Root
                className="aui-message-error-root mt-2 rounded-2xl border border-destructive bg-destructive/10 p-3 text-destructive text-sm dark:bg-destructive/5 dark:text-red-200">
                <ErrorPrimitive.Message className="aui-message-error-message line-clamp-2"/>
            </ErrorPrimitive.Root>
        </MessagePrimitive.Error>
    );
};

const TypingBubble: FC = () => {
    const isRunning = useAuiState((s) => s.message.status?.type === "running");
    const hasText = useAuiState((s) => s.message.parts.some((p) => p.type === "text" && "text" in p && !!(p as {text: string}).text));
    if (!isRunning || hasText) return null;
    return (
        <div className="flex items-center gap-2 px-2 py-1">
            <OwLogo variant="full" color="red" href={null} className="h-5 w-auto animate-bounce"/>
            <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]"/>
            <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]"/>
            <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]"/>
        </div>
    );
};

const AssistantMessage: FC = () => {
    // reserves space for action bar and compensates with `-mb` for consistent msg spacing
    // keeps hovered action bar from shifting layout (autohide doesn't support absolute positioning well)
    // for pt-[n] use -mb-[n + 6] & min-h-[n + 6] to preserve compensation
    const ACTION_BAR_PT = "pt-1.5";
    const ACTION_BAR_HEIGHT = `-mb-7.5 min-h-7.5 ${ACTION_BAR_PT}`;

    return (
        <MessagePrimitive.Root
            data-slot="aui_assistant-message-root"
            data-role="assistant"
            className="fade-in slide-in-from-bottom-1 relative animate-in duration-150 [contain-intrinsic-size:auto_300px] [content-visibility:auto]"
        >
            <TypingBubble/>
            <div
                data-slot="aui_assistant-message-content"
                className="wrap-break-word px-2 text-foreground leading-relaxed space-y-4"
            >
                <MessagePrimitive.GroupedParts
                    groupBy={(part) => {
                        if (part.type === "reasoning")
                            return ["group-chainOfThought", "group-reasoning"];
                        if (part.type === "tool-call") {
                            if (getMcpAppFromToolPart(part)) return null;
                            return ["group-chainOfThought", "group-tool"];
                        }
                        return null;
                    }}
                >
                    {({part, children}) => {
                        switch (part.type) {
                            case "group-chainOfThought":
                                return <div data-slot="aui_chain-of-thought" className="space-y-4">{children}</div>;
                            case "group-reasoning": {
                                const running = part.status.type === "running";
                                return (
                                    <ReasoningRoot defaultOpen={running} variant="muted">
                                        <ReasoningTrigger active={running}/>
                                        <ReasoningContent aria-busy={running}>
                                            <ReasoningText>{children}</ReasoningText>
                                        </ReasoningContent>
                                    </ReasoningRoot>
                                );
                            }
                            case "group-tool":
                                return (
                                    <ToolGroupRoot>
                                        <ToolGroupTrigger
                                            count={part.indices.length}
                                            active={part.status.type === "running"}
                                        />
                                        <ToolGroupContent>{children}</ToolGroupContent>
                                    </ToolGroupRoot>
                                );
                            case "text":
                                return <MarkdownText/>;
                            case "reasoning":
                                return <Reasoning {...part} />;
                            case "tool-call":
                                return part.toolUI ?? <ToolFallback {...part} />;
                            default:
                                return null;
                        }
                    }}
                </MessagePrimitive.GroupedParts>
                <MessageError/>
            </div>

            <div
                data-slot="aui_assistant-message-footer"
                className={cn("ms-2 flex items-center", ACTION_BAR_HEIGHT)}
            >
                <BranchPicker/>
                <AssistantActionBar/>
            </div>
        </MessagePrimitive.Root>
    );
};

const AssistantActionBar: FC = () => {
    return (
        <ActionBarPrimitive.Root
            hideWhenRunning
            autohide="not-last"
            className="aui-assistant-action-bar-root col-start-3 row-start-2 -ms-1 flex gap-1 text-muted-foreground"
        >
            <ActionBarPrimitive.Copy asChild>
                <TooltipIconButton tooltip="Copy">
                    <AuiIf condition={(s) => s.message.isCopied}>
                        <CheckIcon/>
                    </AuiIf>
                    <AuiIf condition={(s) => !s.message.isCopied}>
                        <CopyIcon/>
                    </AuiIf>
                </TooltipIconButton>
            </ActionBarPrimitive.Copy>
            <ActionBarPrimitive.Reload asChild>
                <TooltipIconButton tooltip="Refresh">
                    <RefreshCwIcon/>
                </TooltipIconButton>
            </ActionBarPrimitive.Reload>
            <ActionBarMorePrimitive.Root>
                <ActionBarMorePrimitive.Trigger asChild>
                    <TooltipIconButton
                        tooltip="More"
                        className="data-[state=open]:bg-accent"
                    >
                        <MoreHorizontalIcon/>
                    </TooltipIconButton>
                </ActionBarMorePrimitive.Trigger>
                <ActionBarMorePrimitive.Content
                    side="bottom"
                    align="start"
                    className="aui-action-bar-more-content z-50 min-w-32 overflow-hidden rounded-2xl border bg-popover p-1 text-popover-foreground shadow-md"
                >
                    <ActionBarPrimitive.ExportMarkdown asChild>
                        <ActionBarMorePrimitive.Item
                            className="aui-action-bar-more-item flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <DownloadIcon className="size-4"/>
                            Export as Markdown
                        </ActionBarMorePrimitive.Item>
                    </ActionBarPrimitive.ExportMarkdown>
                </ActionBarMorePrimitive.Content>
            </ActionBarMorePrimitive.Root>
        </ActionBarPrimitive.Root>
    );
};

const UserMessage: FC = () => {
    return (
        <MessagePrimitive.Root
            data-slot="aui_user-message-root"
            className="fade-in slide-in-from-bottom-1 grid animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 duration-150 [contain-intrinsic-size:auto_60px] [content-visibility:auto] [&:where(>*)]:col-start-2"
            data-role="user"
        >
            <div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
                <div
                    className="aui-user-message-content wrap-break-word peer rounded-2xl bg-muted px-4 py-2.5 text-foreground empty:hidden">
                    <MessagePrimitive.Parts/>
                </div>
                <div
                    className="aui-user-action-bar-wrapper absolute start-0 top-1/2 -translate-x-full -translate-y-1/2 pe-2 peer-empty:hidden rtl:translate-x-full">
                    <UserActionBar/>
                </div>
            </div>

            <BranchPicker
                data-slot="aui_user-branch-picker"
                className="col-span-full col-start-1 row-start-3 -me-1 justify-end"
            />
        </MessagePrimitive.Root>
    );
};

const UserActionBar: FC = () => {
    return (
        <ActionBarPrimitive.Root
            hideWhenRunning
            autohide="not-last"
            className="aui-user-action-bar-root flex flex-col items-end"
        >
            <ActionBarPrimitive.Edit asChild>
                <TooltipIconButton tooltip="Edit" className="aui-user-action-edit p-4">
                    <PencilIcon/>
                </TooltipIconButton>
            </ActionBarPrimitive.Edit>
        </ActionBarPrimitive.Root>
    );
};

const EditComposer: FC = () => {
    return (
        <MessagePrimitive.Root
            data-slot="aui_edit-composer-wrapper"
            className="flex flex-col px-2"
        >
            <ComposerPrimitive.Root
                className="aui-edit-composer-root ms-auto flex w-full max-w-[85%] flex-col rounded-2xl bg-muted">
                <ComposerPrimitive.Input
                    className="aui-edit-composer-input min-h-14 w-full resize-none bg-transparent p-4 text-foreground text-sm outline-none"
                    autoFocus
                />
                <div className="aui-edit-composer-footer mx-3 mb-3 flex items-center gap-2 self-end">
                    <ComposerPrimitive.Cancel asChild>
                        <Button variant="ghost" size="sm">
                            Cancel
                        </Button>
                    </ComposerPrimitive.Cancel>
                    <ComposerPrimitive.Send asChild>
                        <Button size="sm">Update</Button>
                    </ComposerPrimitive.Send>
                </div>
            </ComposerPrimitive.Root>
        </MessagePrimitive.Root>
    );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
                                                                className,
                                                                ...rest
                                                            }) => {
    return (
        <BranchPickerPrimitive.Root
            hideWhenSingleBranch
            className={cn(
                "aui-branch-picker-root -ms-2 me-2 inline-flex items-center text-muted-foreground text-xs",
                className,
            )}
            {...rest}
        >
            <BranchPickerPrimitive.Previous asChild>
                <TooltipIconButton tooltip="Previous">
                    <ChevronLeftIcon/>
                </TooltipIconButton>
            </BranchPickerPrimitive.Previous>
            <span className="aui-branch-picker-state font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
            <BranchPickerPrimitive.Next asChild>
                <TooltipIconButton tooltip="Next">
                    <ChevronRightIcon/>
                </TooltipIconButton>
            </BranchPickerPrimitive.Next>
        </BranchPickerPrimitive.Root>
    );
};
