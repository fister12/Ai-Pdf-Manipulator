"use client";

import { Bot, User, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStudySessionContext } from "@/lib/context/StudySessionContext";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    isLoading?: boolean;
}

interface MessageBubbleProps {
    message: Message;
    userAvatar?: string;
}

export function MessageBubble({ message, userAvatar }: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);
    const { streamingSpeed } = useStudySessionContext();
    const isAssistant = message.role === "assistant";

    // Determine if this message was recently created (within last 5 seconds)
    const isNew = (() => {
        if (!isAssistant || message.id === "loading") return false;
        const match = message.id.match(/^assistant-(\d+)$/);
        if (!match) return false;
        const timestamp = parseInt(match[1], 10);
        return Date.now() - timestamp < 5000;
    })();

    const [displayedContent, setDisplayedContent] = useState(
        isAssistant && isNew ? "" : message.content
    );

    useEffect(() => {
        if (isAssistant && isNew && displayedContent.length < message.content.length) {
            const delay = streamingSpeed === 'slow' ? 50 
                          : streamingSpeed === 'medium' ? 20 
                          : streamingSpeed === 'fast' ? 5 
                          : 0; // 'instant'

            if (delay === 0) {
                setDisplayedContent(message.content);
                return;
            }

            const interval = setInterval(() => {
                setDisplayedContent((prev) => {
                    const charsToAdd = streamingSpeed === 'fast' ? 3 : 1;
                    const nextLength = prev.length + charsToAdd;
                    
                    // Request auto-scroll during typing
                    window.dispatchEvent(new CustomEvent('assistant-typing'));

                    if (nextLength >= message.content.length) {
                        clearInterval(interval);
                        return message.content;
                    }
                    return message.content.slice(0, nextLength);
                });
            }, delay);

            return () => clearInterval(interval);
        } else {
            setDisplayedContent(message.content);
        }
    }, [message.content, isAssistant, isNew, streamingSpeed]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={cn(
                "group relative flex gap-3 px-4 py-4 transition-colors bg-transparent"
            )}
        >
            {/* Avatar */}
            <div className="flex-shrink-0">
                {isAssistant ? (
                    <div className="flex h-8 w-8 items-center justify-center text-primary">
                        <Bot className="h-5 w-5" />
                    </div>
                ) : (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={userAvatar} />
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2 overflow-hidden">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                        {isAssistant ? "AI Assistant" : "You"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {message.timestamp}
                    </span>
                </div>

                {/* Message content */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                            </div>
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                    ) : (
                        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {displayedContent}
                        </div>
                    )}
                </div>
            </div>

            {/* Copy button */}
            {!message.isLoading && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                </Button>
            )}
        </div>
    );
}
