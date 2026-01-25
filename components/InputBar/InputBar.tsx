"use client";

import { useState, useRef, useCallback, KeyboardEvent } from "react";
import {
    Send,
    Paperclip,
    ChevronUp,
    Sparkles,
    Bot,
    Database,
    X,
    ImageIcon,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface AIModel {
    id: string;
    name: string;
    icon: "gpt" | "claude" | "rag" | "gemini";
}

interface InputBarProps {
    onSendMessage: (message: string) => void;
    onUploadFile: (files: FileList) => void;
    onSelectModel: (modelId: string) => void;
    models: AIModel[];
    selectedModelId: string;
    isLoading?: boolean;
    disabled?: boolean;
}

const modelIcons = {
    gpt: Sparkles,
    claude: Bot,
    rag: Database,
    gemini: Sparkles,
};

export function InputBar({
    onSendMessage,
    onUploadFile,
    onSelectModel,
    models,
    selectedModelId,
    isLoading = false,
    disabled = false,
}: InputBarProps) {
    const [message, setMessage] = useState("");
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedModel = models.find((m) => m.id === selectedModelId);
    const SelectedModelIcon = selectedModel
        ? modelIcons[selectedModel.icon]
        : Sparkles;

    const handleSend = useCallback(() => {
        if (message.trim() && !isLoading && !disabled) {
            onSendMessage(message.trim());
            setMessage("");
            setAttachedFiles([]);
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    }, [message, isLoading, disabled, onSendMessage]);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onUploadFile(files);
            setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeFile = (index: number) => {
        setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Auto-resize textarea
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    };

    return (
        <div className="sticky bottom-0 z-30 border-t border-border/40 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            {/* Attached files preview */}
            {attachedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {attachedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/50 px-3 py-1.5 text-sm"
                        >
                            {file.type.startsWith("image/") ? (
                                <ImageIcon className="h-4 w-4 text-green-500" />
                            ) : (
                                <FileText className="h-4 w-4 text-blue-500" />
                            )}
                            <span className="max-w-[150px] truncate">{file.name}</span>
                            <button
                                onClick={() => removeFile(index)}
                                className="ml-1 rounded-full p-0.5 hover:bg-muted"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="mx-auto max-w-4xl">
                <div className="relative flex items-end gap-2 rounded-2xl border border-border/50 bg-muted/30 p-2 shadow-sm transition-all focus-within:border-primary/50 focus-within:shadow-md">
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.txt"
                        onChange={handleFileChange}
                    />

                    {/* Upload button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 rounded-xl"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                    >
                        <Paperclip className="h-5 w-5" />
                        <span className="sr-only">Upload file</span>
                    </Button>

                    {/* Textarea */}
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything about your studies..."
                        className="min-h-[40px] max-h-[200px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        rows={1}
                        disabled={disabled || isLoading}
                    />

                    {/* Model selector */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 shrink-0 gap-1.5 rounded-xl px-2"
                                disabled={disabled}
                            >
                                <SelectedModelIcon className="h-4 w-4" />
                                <span className="hidden text-xs sm:inline">
                                    {selectedModel?.name}
                                </span>
                                <ChevronUp className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {models.map((model) => {
                                const ModelIcon = modelIcons[model.icon];
                                return (
                                    <DropdownMenuItem
                                        key={model.id}
                                        onClick={() => onSelectModel(model.id)}
                                        className={cn(
                                            "cursor-pointer gap-2",
                                            model.id === selectedModelId && "bg-accent"
                                        )}
                                    >
                                        <ModelIcon className="h-4 w-4" />
                                        <span>{model.name}</span>
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Send button */}
                    <Button
                        size="icon"
                        className={cn(
                            "h-9 w-9 shrink-0 rounded-xl transition-all",
                            message.trim()
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "bg-muted text-muted-foreground"
                        )}
                        onClick={handleSend}
                        disabled={!message.trim() || isLoading || disabled}
                    >
                        <Send className={cn("h-4 w-4", isLoading && "animate-pulse")} />
                        <span className="sr-only">Send message</span>
                    </Button>
                </div>

                {/* Helper text */}
                <p className="mt-2 text-center text-xs text-muted-foreground">
                    Press <kbd className="rounded bg-muted px-1 py-0.5 font-mono">Enter</kbd> to send,{" "}
                    <kbd className="rounded bg-muted px-1 py-0.5 font-mono">Shift + Enter</kbd> for new line
                </p>
            </div>
        </div>
    );
}
