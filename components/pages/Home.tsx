"use client";

import { useStudySessionContext } from "@/lib/context/StudySessionContext";
import { useFileContext } from "@/lib/context/FileContext";
import { useRef } from "react";
import { ChatArea } from "@/components/ChatArea/ChatArea";
import { InputBar } from "@/components/InputBar/InputBar";
import { FloatingButtons } from "@/components/InputBar/FloatingButtons";

export default function Home() {
    const { models, selectedModelId, selectModel } = useStudySessionContext();
    const { uploadFiles } = useFileContext();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFloatingUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFloatingModelToggle = () => {
        const currentIndex = models.findIndex((m) => m.id === selectedModelId);
        const nextIndex = (currentIndex + 1) % models.length;
        selectModel(models[nextIndex].id);
    };

    return (
        <>
            {/* Hidden file input for floating button */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.txt"
                onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            />
            {/* Chat Area - Flexible height */}
            <ChatArea />

            {/* Input Bar - Fixed at bottom */}
            <InputBar />

            {/* Floating buttons for mobile */}
            <FloatingButtons
                onUploadFile={handleFloatingUpload}
                onToggleModel={handleFloatingModelToggle}
            />
        </>
    );
}
