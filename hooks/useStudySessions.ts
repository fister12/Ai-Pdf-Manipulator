"use client";

import { useState, useCallback } from "react";
import type { ChatSession } from "@/components/Sidebar/ChatHistory";
import type { AIModel } from "@/components/Sidebar/ModelSelector";

// Default AI models - Gemini only
export const defaultModels: AIModel[] = [
    {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        description: "Fast and efficient",
        icon: "gemini",
    },
    {
        id: "gemini-2.0-flash-lite",
        name: "Gemini 2.0 Flash Lite",
        description: "Lightweight, faster responses",
        icon: "gemini",
    },
    {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        description: "Latest and most capable",
        icon: "gemini",
    },
    {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        description: "Most powerful reasoning",
        icon: "gemini",
    },
];

// Default sessions for demo
const defaultSessions: ChatSession[] = [
    {
        id: "1",
        title: "Machine Learning Basics",
        timestamp: "Today, 2:30 PM",
        preview: "What is supervised learning?",
    },
    {
        id: "2",
        title: "Python Data Structures",
        timestamp: "Yesterday",
        preview: "Explain list comprehensions",
    },
    {
        id: "3",
        title: "Calculus Integration",
        timestamp: "2 days ago",
        preview: "How to solve integrals",
    },
];

interface UseStudySessionsReturn {
    sessions: ChatSession[];
    activeSessionId: string | undefined;
    selectedModelId: string;
    models: AIModel[];
    selectSession: (id: string) => void;
    deleteSession: (id: string) => void;
    createNewSession: () => void;
    selectModel: (id: string) => void;
}

export function useStudySessions(): UseStudySessionsReturn {
    const [sessions, setSessions] = useState<ChatSession[]>(defaultSessions);
    const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
    const [selectedModelId, setSelectedModelId] = useState("gemini-2.5-flash");

    const selectSession = useCallback((id: string) => {
        setActiveSessionId(id);
        console.log("Selected session:", id);
    }, []);

    const deleteSession = useCallback((id: string) => {
        setSessions((prev) => prev.filter((s) => s.id !== id));
        if (activeSessionId === id) {
            setActiveSessionId(undefined);
        }
        console.log("Deleted session:", id);
    }, [activeSessionId]);

    const createNewSession = useCallback(() => {
        const newSession: ChatSession = {
            id: `session-${Date.now()}`,
            title: "New Study Session",
            timestamp: "Just now",
        };
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        console.log("Created new session:", newSession.id);
    }, []);

    const selectModel = useCallback((id: string) => {
        setSelectedModelId(id);
        console.log("Selected model:", id);
    }, []);

    return {
        sessions,
        activeSessionId,
        selectedModelId,
        models: defaultModels,
        selectSession,
        deleteSession,
        createNewSession,
        selectModel,
    };
}
