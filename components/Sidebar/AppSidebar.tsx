"use client";

import { GraduationCap, Plus, FileText, Layers, Brain, Target, MessageSquare } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarSeparator,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ChatHistory, type ChatSession } from "./ChatHistory";
import { FilesList, type UploadedFile } from "./FilesList";
import { ModelSelector, type AIModel } from "./ModelSelector";

type ModeType = "chat" | "notes" | "flashcards" | "study" | "exam";

interface StudyMode {
    id: ModeType;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const studyModes: StudyMode[] = [
    {
        id: "chat",
        name: "AI Chat",
        description: "Ask anything",
        icon: <MessageSquare className="h-4 w-4" />,
        color: "text-blue-500",
    },
    {
        id: "notes",
        name: "Notes Processor",
        description: "Digitize handwritten notes",
        icon: <FileText className="h-4 w-4" />,
        color: "text-emerald-500",
    },
    {
        id: "flashcards",
        name: "Flashcard Creator",
        description: "Generate flashcards",
        icon: <Layers className="h-4 w-4" />,
        color: "text-purple-500",
    },
    {
        id: "study",
        name: "Study Mode",
        description: "Interactive learning",
        icon: <Brain className="h-4 w-4" />,
        color: "text-green-500",
    },
    {
        id: "exam",
        name: "Exam Prep",
        description: "Smart prioritization",
        icon: <Target className="h-4 w-4" />,
        color: "text-orange-500",
    },
];

interface AppSidebarProps {
    sessions: ChatSession[];
    activeSessionId?: string;
    onSelectSession: (id: string) => void;
    onDeleteSession?: (id: string) => void;
    onNewSession: () => void;
    files: UploadedFile[];
    onSelectFile: (id: string) => void;
    onDeleteFile?: (id: string) => void;
    models: AIModel[];
    selectedModelId: string;
    onSelectModel: (id: string) => void;
    currentMode: ModeType;
    onModeChange: (mode: ModeType) => void;
}

export function AppSidebar({
    sessions,
    activeSessionId,
    onSelectSession,
    onDeleteSession,
    onNewSession,
    files,
    onSelectFile,
    onDeleteFile,
    models,
    selectedModelId,
    onSelectModel,
    currentMode,
    onModeChange,
}: AppSidebarProps) {
    return (
        <Sidebar variant="sidebar" collapsible="offcanvas" className="border-r border-sidebar-border">
            <SidebarHeader className="border-b border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="w-full">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                                <GraduationCap className="size-5" />
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-semibold">AI Study Helper</span>
                                <span className="text-xs text-muted-foreground">Learn smarter</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="scrollbar-thin">
                {/* Study Modes Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Study Modes
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {studyModes.map((mode) => (
                                <SidebarMenuItem key={mode.id}>
                                    <SidebarMenuButton
                                        isActive={currentMode === mode.id}
                                        onClick={() => onModeChange(mode.id)}
                                        tooltip={mode.description}
                                        className="group/item"
                                    >
                                        <span className={mode.color}>{mode.icon}</span>
                                        <div className="flex flex-1 flex-col overflow-hidden">
                                            <span className="truncate font-medium">{mode.name}</span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {mode.description}
                                            </span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                {/* New Session Button */}
                <div className="p-2">
                    <Button
                        onClick={onNewSession}
                        variant="outline"
                        className="w-full justify-start gap-2 border-dashed"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="group-data-[collapsible=icon]:hidden">New Session</span>
                    </Button>
                </div>

                <SidebarSeparator />

                {/* Chat History */}
                <ChatHistory
                    sessions={sessions}
                    activeSessionId={activeSessionId}
                    onSelectSession={onSelectSession}
                    onDeleteSession={onDeleteSession}
                />

                <SidebarSeparator />

                {/* Uploaded Files */}
                <FilesList
                    files={files}
                    onSelectFile={onSelectFile}
                    onDeleteFile={onDeleteFile}
                />

                <SidebarSeparator />

                {/* Model Selector - only show in chat mode */}
                {currentMode === "chat" && (
                    <ModelSelector
                        models={models}
                        selectedModelId={selectedModelId}
                        onSelectModel={onSelectModel}
                    />
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <div className="p-2 text-center text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                    Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">⌘B</kbd> to toggle
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
