"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GraduationCap, Plus, FileText, Layers, Brain, Target, MessageSquare, Sliders, Turtle, Clock, Rabbit, Zap } from "lucide-react";
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
import { useStudySessionContext } from "@/lib/context/StudySessionContext";
import { useFileContext } from "@/lib/context/FileContext";
import { cn } from "@/lib/utils";

interface StudyMode {
    id: string;
    href: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const studyModes: StudyMode[] = [
    {
        id: "chat",
        href: "/",
        name: "AI Chat",
        description: "Ask anything",
        icon: <MessageSquare className="h-4 w-4" />,
        color: "text-blue-500",
    },
    {
        id: "notes",
        href: "/notes",
        name: "Notes Processor",
        description: "Digitize handwritten notes",
        icon: <FileText className="h-4 w-4" />,
        color: "text-emerald-500",
    },
    {
        id: "flashcards",
        href: "/flashcards",
        name: "Flashcard Creator",
        description: "Generate flashcards",
        icon: <Layers className="h-4 w-4" />,
        color: "text-purple-500",
    },
    {
        id: "study",
        href: "/study",
        name: "Study Mode",
        description: "Interactive learning",
        icon: <Brain className="h-4 w-4" />,
        color: "text-green-500",
    },
    {
        id: "exam",
        href: "/exam",
        name: "Exam Prep",
        description: "Smart prioritization",
        icon: <Target className="h-4 w-4" />,
        color: "text-orange-500",
    },
];

interface AppSidebarProps {}

export function AppSidebar(props: AppSidebarProps) {
    const pathname = usePathname();
    const { 
        sessions, 
        activeSessionId, 
        selectSession: onSelectSession, 
        deleteSession: onDeleteSession, 
        createNewSession: onNewSession, 
        models, 
        selectedModelId, 
        selectModel: onSelectModel,
        streamingSpeed,
        selectStreamingSpeed
    } = useStudySessionContext();

    const { files, removeFile: onDeleteFile } = useFileContext();
    const onSelectFile = (id: string) => console.log("Selected file:", id);

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
                                        asChild
                                        isActive={pathname === mode.href}
                                        tooltip={mode.description}
                                        className="group/item"
                                    >
                                        <Link href={mode.href}>
                                            <span className={mode.color}>{mode.icon}</span>
                                            <div className="flex flex-1 flex-col overflow-hidden">
                                                <span className="truncate font-medium">{mode.name}</span>
                                                <span className="truncate text-xs text-muted-foreground">
                                                    {mode.description}
                                                </span>
                                            </div>
                                        </Link>
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

                {/* Model Selector & Streaming Settings - only show in chat mode */}
                {pathname === "/" && (
                    <>
                        <ModelSelector
                            models={models}
                            selectedModelId={selectedModelId}
                            onSelectModel={onSelectModel}
                        />
                        <SidebarSeparator />
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Sliders className="h-4 w-4 text-primary" />
                                Streaming Speed
                            </SidebarGroupLabel>
                            <SidebarGroupContent className="px-2 py-1.5">
                                <div className="grid grid-cols-4 gap-1 rounded-xl bg-muted/60 p-1 border border-border/10">
                                    {(['slow', 'medium', 'fast', 'instant'] as const).map((speed) => {
                                        const isActive = streamingSpeed === speed;
                                        const speedLabels = {
                                            slow: "Slow",
                                            medium: "Med",
                                            fast: "Fast",
                                            instant: "Inst"
                                        };
                                        const speedIcons = {
                                            slow: <Turtle className="h-3.5 w-3.5" />,
                                            medium: <Clock className="h-3.5 w-3.5" />,
                                            fast: <Rabbit className="h-3.5 w-3.5" />,
                                            instant: <Zap className="h-3.5 w-3.5" />
                                        };
                                        return (
                                            <button
                                                key={speed}
                                                onClick={() => selectStreamingSpeed(speed)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center gap-1 rounded-lg py-1.5 text-[10px] font-medium transition-all border border-transparent cursor-pointer",
                                                    isActive 
                                                        ? "bg-background text-primary shadow-sm border-border/20" 
                                                        : "text-muted-foreground hover:bg-background/40 hover:text-foreground"
                                                )}
                                                title={`${speedLabels[speed]} Speed`}
                                            >
                                                {speedIcons[speed]}
                                                <span>{speedLabels[speed]}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </>
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
