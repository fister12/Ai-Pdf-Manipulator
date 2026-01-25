"use client";

import { useState, useRef } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/AppSidebar";
import { Topbar } from "@/components/Topbar/Topbar";
import { ChatArea } from "@/components/ChatArea/ChatArea";
import { InputBar } from "@/components/InputBar/InputBar";
import { FloatingButtons } from "@/components/InputBar/FloatingButtons";
import { useChat } from "@/hooks/useChat";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useStudySessions } from "@/hooks/useStudySessions";

// Import existing modes
import Mode1NotesProcessor from "@/components/modes/Mode1NotesProcessor";
import Mode2FlashcardCreator from "@/components/modes/Mode2FlashcardCreator";
import Mode3StudyMode from "@/components/modes/Mode3StudyMode";
import Mode4ExamPrep from "@/components/modes/Mode4ExamPrep";

type ModeType = "chat" | "notes" | "flashcards" | "study" | "exam";

export default function Home() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentMode, setCurrentMode] = useState<ModeType>("chat");

    // Custom hooks for state management
    const { messages, isLoading, sendMessage } = useChat();
    const { files, uploadFiles, removeFile } = useFileUpload();
    const {
        sessions,
        activeSessionId,
        selectedModelId,
        models,
        selectSession,
        deleteSession,
        createNewSession,
        selectModel,
    } = useStudySessions();

    // Send message with selected model
    const onSendMessage = (message: string) => {
        console.log("Sending message:", message, "with model:", selectedModelId);
        sendMessage(message, selectedModelId);
    };

    const onUploadFile = (fileList: FileList) => {
        console.log("Uploading files:", fileList);
        uploadFiles(fileList);
    };

    const onSelectModel = (modelId: string) => {
        console.log("Selected model:", modelId);
        selectModel(modelId);
    };

    const handleSettings = () => {
        console.log("Opening settings...");
    };

    const handleLogout = () => {
        console.log("Logging out...");
    };

    const handleProfile = () => {
        console.log("Opening profile...");
    };

    const handleFloatingUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFloatingModelToggle = () => {
        // Cycle through models
        const currentIndex = models.findIndex((m) => m.id === selectedModelId);
        const nextIndex = (currentIndex + 1) % models.length;
        selectModel(models[nextIndex].id);
    };

    const goToChat = () => setCurrentMode("chat");

    // Render the active mode
    const renderActiveMode = () => {
        switch (currentMode) {
            case "notes":
                return <Mode1NotesProcessor onHome={goToChat} />;
            case "flashcards":
                return <Mode2FlashcardCreator onHome={goToChat} />;
            case "study":
                return <Mode3StudyMode onHome={goToChat} />;
            case "exam":
                return <Mode4ExamPrep onHome={goToChat} />;
            case "chat":
            default:
                return (
                    <>
                        {/* Chat Area - Flexible height */}
                        <ChatArea messages={messages} isLoading={isLoading} />

                        {/* Input Bar - Fixed at bottom */}
                        <InputBar
                            onSendMessage={onSendMessage}
                            onUploadFile={onUploadFile}
                            onSelectModel={onSelectModel}
                            models={models.map((m) => ({
                                id: m.id,
                                name: m.name,
                                icon: m.icon,
                            }))}
                            selectedModelId={selectedModelId}
                            isLoading={isLoading}
                        />

                        {/* Floating buttons for mobile */}
                        <FloatingButtons
                            onUploadFile={handleFloatingUpload}
                            onToggleModel={handleFloatingModelToggle}
                        />
                    </>
                );
        }
    };

    return (
        <SidebarProvider defaultOpen={true}>
            {/* Hidden file input for floating button */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.txt"
                onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            />

            {/* Sidebar */}
            <AppSidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelectSession={selectSession}
                onDeleteSession={deleteSession}
                onNewSession={createNewSession}
                files={files}
                onSelectFile={(id) => console.log("Selected file:", id)}
                onDeleteFile={removeFile}
                models={models}
                selectedModelId={selectedModelId}
                onSelectModel={selectModel}
                currentMode={currentMode}
                onModeChange={setCurrentMode}
            />

            {/* Main Content */}
            <SidebarInset className="flex flex-col min-h-screen overflow-hidden">
                {/* Top Bar */}
                <Topbar
                    userName="John Doe"
                    userEmail="john@example.com"
                    onSettings={handleSettings}
                    onLogout={handleLogout}
                    onProfile={handleProfile}
                />

                {/* Render active mode */}
                {renderActiveMode()}
            </SidebarInset>
        </SidebarProvider>
    );
}
