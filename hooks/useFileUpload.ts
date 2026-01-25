"use client";

import { useState, useCallback } from "react";
import type { UploadedFile } from "@/components/Sidebar/FilesList";

interface UseFileUploadReturn {
    files: UploadedFile[];
    uploadFiles: (fileList: FileList) => void;
    removeFile: (id: string) => void;
    clearFiles: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
    const [files, setFiles] = useState<UploadedFile[]>([]);

    const getFileType = (file: File): UploadedFile["type"] => {
        const mimeType = file.type.toLowerCase();
        if (mimeType.includes("pdf")) return "pdf";
        if (mimeType.includes("image")) return "image";
        if (
            mimeType.includes("document") ||
            mimeType.includes("word") ||
            mimeType.includes("text")
        )
            return "document";
        return "other";
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const uploadFiles = useCallback((fileList: FileList) => {
        const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
            id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: file.name,
            type: getFileType(file),
            size: formatFileSize(file.size),
            uploadedAt: new Date().toLocaleDateString(),
        }));

        setFiles((prev) => [...prev, ...newFiles]);

        // Here you would typically upload the files to a server
        console.log("Files uploaded:", newFiles);
    }, []);

    const removeFile = useCallback((id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    }, []);

    const clearFiles = useCallback(() => {
        setFiles([]);
    }, []);

    return {
        files,
        uploadFiles,
        removeFile,
        clearFiles,
    };
}
