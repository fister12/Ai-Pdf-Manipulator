"use client";

import { Bot } from "lucide-react";

export function LoadingIndicator() {
    return (
        <div className="flex items-center gap-3 px-4 py-4 bg-muted/30">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
                <Bot className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                </div>
                <span className="text-sm text-muted-foreground">AI is thinking...</span>
            </div>
        </div>
    );
}
