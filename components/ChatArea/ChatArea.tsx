"use client";

import { useRef, useEffect } from "react";
import { MessageSquare, Sparkles, BookOpen, Brain } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble, type Message } from "./MessageBubble";
import { useChatContext } from "@/lib/context/ChatContext";

interface ChatAreaProps {
    userAvatar?: string;
}

export function ChatArea({ userAvatar }: ChatAreaProps) {
    const { messages, isLoading } = useChatContext();
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const isEmpty = messages.length === 0;

    return (
        <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
            <ScrollArea ref={scrollRef} className="flex-1">
                {isEmpty ? (
                    // Empty state - Welcome screen
                    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-12">
                        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
                            <Sparkles className="h-10 w-10" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold tracking-tight">
                            Welcome to AI Study Helper
                        </h2>
                        <p className="mb-8 max-w-md text-center text-muted-foreground">
                            Your intelligent companion for learning. Ask questions, upload documents,
                            and get instant help with your studies.
                        </p>

                        {/* Quick action suggestions */}
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <QuickAction
                                icon={<MessageSquare className="h-5 w-5" />}
                                title="Ask a question"
                                description="Get instant answers"
                            />
                            <QuickAction
                                icon={<BookOpen className="h-5 w-5" />}
                                title="Upload documents"
                                description="Learn from PDFs"
                            />
                            <QuickAction
                                icon={<Brain className="h-5 w-5" />}
                                title="Generate summaries"
                                description="Condense information"
                            />
                        </div>
                    </div>
                ) : (
                    // Messages list
                    <div className="divide-y divide-border/40">
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                userAvatar={userAvatar}
                            />
                        ))}
                        {/* Loading indicator for new message */}
                        {isLoading && (
                            <MessageBubble
                                message={{
                                    id: "loading",
                                    role: "assistant",
                                    content: "",
                                    timestamp: "Now",
                                    isLoading: true,
                                }}
                            />
                        )}
                        <div ref={bottomRef} />
                    </div>
                )}
            </ScrollArea>

        </div>
    );
}

// Quick action card component
function QuickAction({
    icon,
    title,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="group flex cursor-pointer items-center gap-3 py-2 opacity-70 transition-opacity hover:opacity-100">
            <div className="flex text-primary">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-medium">{title}</h3>
            </div>
        </div>
    );
}
