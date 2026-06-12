import {Composer} from "@/components/assistant-ui/composer";
import {AssistantMessage, EditComposer, UserMessage} from "@/components/assistant-ui/message";
import {ThreadWelcome} from "@/components/assistant-ui/thread-welcome";
import {OwTooltipIconButton} from "@/components/owui/ow-tooltip-icon-button";
import {useChatContext} from "@/components/chat/chat-provider";
import {AuiIf, MessagePrimitive, ThreadPrimitive, useAuiState} from "@assistant-ui/react";
import {ArrowDownIcon} from "lucide-react";
import {type FC, useEffect} from "react";

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
            <OwTooltipIconButton
                tooltip="Scroll to bottom"
                variant="outline"
                className="aui-thread-scroll-to-bottom absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible dark:border-border dark:bg-background dark:hover:bg-accent"
            >
                <ArrowDownIcon/>
            </OwTooltipIconButton>
        </ThreadPrimitive.ScrollToBottom>
    );
};
