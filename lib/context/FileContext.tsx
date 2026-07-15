'use client';

import React, { createContext, useContext } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { UploadedFile } from "@/components/Sidebar/FilesList";

interface FileContextType {
    files: UploadedFile[];
    uploadFiles: (fileList: FileList) => void;
    removeFile: (id: string) => void;
    clearFiles: () => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
    const fileUpload = useFileUpload();

    return (
        <FileContext.Provider value={fileUpload}>
            {children}
        </FileContext.Provider>
    );
}

export function useFileContext() {
    const context = useContext(FileContext);
    if (context === undefined) {
        throw new Error('useFileContext must be used within a FileProvider');
    }
    return context;
}
