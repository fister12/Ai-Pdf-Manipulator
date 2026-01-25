"use client";

import { Bot, Sparkles, Database, Check } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

export interface AIModel {
    id: string;
    name: string;
    description: string;
    icon: "gpt" | "claude" | "rag" | "gemini";
}

interface ModelSelectorProps {
    models: AIModel[];
    selectedModelId: string;
    onSelectModel: (id: string) => void;
}

const modelIcons = {
    gpt: Sparkles,
    claude: Bot,
    rag: Database,
    gemini: Sparkles,
};

const modelColors = {
    gpt: "text-emerald-500",
    claude: "text-orange-500",
    rag: "text-purple-500",
    gemini: "text-blue-500",
};

export function ModelSelector({
    models,
    selectedModelId,
    onSelectModel,
}: ModelSelectorProps) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Bot className="mr-2 h-4 w-4" />
                AI Model
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {models.map((model) => {
                        const IconComponent = modelIcons[model.icon];
                        const iconColor = modelColors[model.icon];
                        const isSelected = model.id === selectedModelId;

                        return (
                            <SidebarMenuItem key={model.id}>
                                <SidebarMenuButton
                                    isActive={isSelected}
                                    onClick={() => onSelectModel(model.id)}
                                    tooltip={model.description}
                                    className="group/item relative"
                                >
                                    <IconComponent className={`h-4 w-4 shrink-0 ${iconColor}`} />
                                    <div className="flex flex-1 flex-col overflow-hidden">
                                        <span className="truncate font-medium">{model.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {model.description}
                                        </span>
                                    </div>
                                    {isSelected && (
                                        <Check className="ml-auto h-4 w-4 shrink-0 text-primary" />
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
