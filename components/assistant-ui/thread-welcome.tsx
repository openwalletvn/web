import {Button} from "@/components/ui/button";
import {ThreadPrimitive} from "@assistant-ui/react";
import {type FC} from "react";

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

export const ThreadWelcome: FC = () => {
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
