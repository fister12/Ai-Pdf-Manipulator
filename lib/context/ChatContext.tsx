'use client';

import React, { createContext, useContext } from 'react';
import { useChat, Message } from '@/hooks/useChat';

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (content: string, modelId?: string) => Promise<void>;
    clearMessages: () => void;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const chat = useChat();

    return (
        <ChatContext.Provider value={chat}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
}
