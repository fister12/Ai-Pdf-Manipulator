'use client';

import React, { createContext, useContext } from 'react';
import { useStudySessions, defaultModels } from '@/hooks/useStudySessions';
import type { ChatSession } from "@/components/Sidebar/ChatHistory";
import type { AIModel } from "@/components/Sidebar/ModelSelector";

interface StudySessionContextType {
    sessions: ChatSession[];
    activeSessionId: string | undefined;
    selectedModelId: string;
    models: AIModel[];
    selectSession: (id: string) => void;
    deleteSession: (id: string) => void;
    createNewSession: () => void;
    selectModel: (id: string) => void;
}

const StudySessionContext = createContext<StudySessionContextType | undefined>(undefined);

export function StudySessionProvider({ children }: { children: React.ReactNode }) {
    const studySessions = useStudySessions();

    return (
        <StudySessionContext.Provider value={studySessions}>
            {children}
        </StudySessionContext.Provider>
    );
}

export function useStudySessionContext() {
    const context = useContext(StudySessionContext);
    if (context === undefined) {
        throw new Error('useStudySessionContext must be used within a StudySessionProvider');
    }
    return context;
}
