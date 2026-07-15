'use client';

import React from 'react';
import { ChatProvider } from './ChatContext';
import { StudySessionProvider } from './StudySessionContext';
import { FileProvider } from './FileContext';

export function GlobalProviders({ children }: { children: React.ReactNode }) {
    return (
        <StudySessionProvider>
            <ChatProvider>
                <FileProvider>
                    {children}
                </FileProvider>
            </ChatProvider>
        </StudySessionProvider>
    );
}
