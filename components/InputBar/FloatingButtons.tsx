"use client";

import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingButtonsProps {
    onUploadFile: () => void;
    onToggleModel: () => void;
    className?: string;
}

export function FloatingButtons({
    onUploadFile,
    onToggleModel,
    className,
}: FloatingButtonsProps) {
    return (
        <div
            className={cn(
                "fixed bottom-24 right-4 z-50 flex flex-col gap-3 md:hidden",
                className
            )}
        >
            {/* Model toggle button */}
            <Button
                size="icon"
                variant="secondary"
                className="h-12 w-12 rounded-full shadow-lg transition-transform hover:scale-110"
                onClick={onToggleModel}
            >
                <Sparkles className="h-5 w-5" />
                <span className="sr-only">Switch AI Model</span>
            </Button>

            {/* Upload button */}
            <Button
                size="icon"
                className="h-14 w-14 rounded-full bg-primary shadow-lg transition-transform hover:scale-110"
                onClick={onUploadFile}
            >
                <Plus className="h-6 w-6" />
                <span className="sr-only">Upload File</span>
            </Button>
        </div>
    );
}
