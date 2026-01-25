"use client";

import { FileText, Image, File, Trash2, Download } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuAction,
} from "@/components/ui/sidebar";

export interface UploadedFile {
    id: string;
    name: string;
    type: "pdf" | "image" | "document" | "other";
    size: string;
    uploadedAt: string;
}

interface FilesListProps {
    files: UploadedFile[];
    onSelectFile: (id: string) => void;
    onDeleteFile?: (id: string) => void;
}

const fileIcons = {
    pdf: FileText,
    image: Image,
    document: FileText,
    other: File,
};

const fileColors = {
    pdf: "text-red-500",
    image: "text-green-500",
    document: "text-blue-500",
    other: "text-gray-500",
};

export function FilesList({ files, onSelectFile, onDeleteFile }: FilesListProps) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Download className="mr-2 h-4 w-4" />
                Uploaded Files
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {files.length === 0 ? (
                        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                            No files uploaded
                        </div>
                    ) : (
                        files.map((file) => {
                            const IconComponent = fileIcons[file.type];
                            const iconColor = fileColors[file.type];

                            return (
                                <SidebarMenuItem key={file.id}>
                                    <SidebarMenuButton
                                        onClick={() => onSelectFile(file.id)}
                                        tooltip={file.name}
                                        className="group/item"
                                    >
                                        <IconComponent className={`h-4 w-4 shrink-0 ${iconColor}`} />
                                        <div className="flex flex-1 flex-col overflow-hidden">
                                            <span className="truncate font-medium">{file.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {file.size}
                                            </span>
                                        </div>
                                    </SidebarMenuButton>
                                    {onDeleteFile && (
                                        <SidebarMenuAction
                                            showOnHover
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteFile(file.id);
                                            }}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </SidebarMenuAction>
                                    )}
                                </SidebarMenuItem>
                            );
                        })
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
