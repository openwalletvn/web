import {MarkdownText} from "@/components/assistant-ui/markdown-text";
import {OwTypingBubble} from "@/components/owai/ow-typing-bubble";
import {
    Reasoning,
    ReasoningContent,
    ReasoningRoot,
    ReasoningText,
    ReasoningTrigger,
} from "@/components/assistant-ui/reasoning";
import {ToolGroupContent, ToolGroupRoot, ToolGroupTrigger} from "@/components/assistant-ui/tool-group";
import {ToolFallback} from "@/components/assistant-ui/tool-fallback";
import {OwTooltipIconButton} from "@/components/owui/ow-tooltip-icon-button";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {
    ActionBarMorePrimitive,
    ActionBarPrimitive,
    AuiIf,
    BranchPickerPrimitive,
    ComposerPrimitive,
    ErrorPrimitive,
    getMcpAppFromToolPart,
    MessagePrimitive,
    useAuiState,
} from "@assistant-ui/react";
import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CopyIcon,
    DownloadIcon,
    MoreHorizontalIcon,
    PencilIcon,
    RefreshCwIcon,
    ThumbsDownIcon,
    ThumbsUpIcon,
} from "lucide-react";
import {type FC} from "react";

export const MessageError: FC = () => {
    return (
        <MessagePrimitive.Error>
            <ErrorPrimitive.Root
                className="aui-message-error-root mt-2 rounded-2xl border border-destructive bg-destructive/10 p-3 text-destructive text-sm dark:bg-destructive/5 dark:text-red-200">
                <ErrorPrimitive.Message className="aui-message-error-message line-clamp-2"/>
            </ErrorPrimitive.Root>
        </MessagePrimitive.Error>
    );
};

export const AssistantMessage: FC = () => {
    const ACTION_BAR_PT = "pt-1.5";
    const ACTION_BAR_HEIGHT = `min-h-7.5 ${ACTION_BAR_PT}`;
    const isRunning = useAuiState((s) => s.message.status?.type === "running");
    const hasText = useAuiState((s) => s.message.parts.some((p) => p.type === "text" && "text" in p && !!(p as {text: string}).text));

    return (
        <MessagePrimitive.Root
            data-slot="aui_assistant-message-root"
            data-role="assistant"
            className="fade-in slide-in-from-bottom-1 group relative animate-in duration-150 [contain-intrinsic-size:auto_300px] [content-visibility:auto]"
        >
            <OwTypingBubble visible={isRunning && !hasText}/>
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
            autohideFloat="always"
            className="aui-assistant-action-bar-root col-start-3 row-start-2 -ms-1 flex gap-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        >
            <ActionBarPrimitive.Copy asChild>
                <OwTooltipIconButton tooltip="Copy">
                    <AuiIf condition={(s) => s.message.isCopied}>
                        <CheckIcon/>
                    </AuiIf>
                    <AuiIf condition={(s) => !s.message.isCopied}>
                        <CopyIcon/>
                    </AuiIf>
                </OwTooltipIconButton>
            </ActionBarPrimitive.Copy>
            <ActionBarPrimitive.Reload asChild>
                <OwTooltipIconButton tooltip="Refresh">
                    <RefreshCwIcon/>
                </OwTooltipIconButton>
            </ActionBarPrimitive.Reload>
            <ActionBarMorePrimitive.Root>
                <ActionBarMorePrimitive.Trigger asChild>
                    <OwTooltipIconButton
                        tooltip="More"
                        className="data-[state=open]:bg-accent"
                    >
                        <MoreHorizontalIcon/>
                    </OwTooltipIconButton>
                </ActionBarMorePrimitive.Trigger>
                <ActionBarMorePrimitive.Content
                    side="bottom"
                    align="start"
                    className="aui-action-bar-more-content z-50 min-w-32 overflow-hidden rounded-2xl border bg-popover p-1 text-popover-foreground shadow-md"
                >
                    <ActionBarMorePrimitive.Item asChild>
                        <ActionBarPrimitive.FeedbackPositive
                            className="aui-action-bar-more-item flex w-full cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <ThumbsUpIcon className="size-4"/>
                            Helpful
                        </ActionBarPrimitive.FeedbackPositive>
                    </ActionBarMorePrimitive.Item>
                    <ActionBarMorePrimitive.Item asChild>
                        <ActionBarPrimitive.FeedbackNegative
                            className="aui-action-bar-more-item flex w-full cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <ThumbsDownIcon className="size-4"/>
                            Not helpful
                        </ActionBarPrimitive.FeedbackNegative>
                    </ActionBarMorePrimitive.Item>
                    <ActionBarMorePrimitive.Separator/>
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

export const UserMessage: FC = () => {
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
                <OwTooltipIconButton tooltip="Edit" className="aui-user-action-edit p-4">
                    <PencilIcon/>
                </OwTooltipIconButton>
            </ActionBarPrimitive.Edit>
        </ActionBarPrimitive.Root>
    );
};

export const EditComposer: FC = () => {
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

export const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({className, ...rest}) => {
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
                <OwTooltipIconButton tooltip="Previous">
                    <ChevronLeftIcon/>
                </OwTooltipIconButton>
            </BranchPickerPrimitive.Previous>
            <span className="aui-branch-picker-state font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
            <BranchPickerPrimitive.Next asChild>
                <OwTooltipIconButton tooltip="Next">
                    <ChevronRightIcon/>
                </OwTooltipIconButton>
            </BranchPickerPrimitive.Next>
        </BranchPickerPrimitive.Root>
    );
};
